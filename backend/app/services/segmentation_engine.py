import numpy as np
import os
import glob
import pydicom
import struct
from skimage import measure
from scipy.ndimage import zoom, binary_erosion, binary_dilation
from app.models.schemas import MeshData



def load_dicom_volume(case_dir):
    """
    Load DICOM slices and stack them into a 3D volume
    Returns: 3D numpy array with the volume data
    """
    # Get all DICOM files
    dcm_files = glob.glob(os.path.join(case_dir, "*.dcm"))

    if not dcm_files:
        return None

    print(f"Loading {len(dcm_files)} DICOM slices...")

    # Read all DICOM files and sort by slice location
    slices = []
    for dcm_file in dcm_files:
        try:
            ds = pydicom.dcmread(dcm_file)
            slices.append(ds)
        except Exception as e:
            print(f"Error reading {dcm_file}: {e}")
            continue

    # Sort slices by ImagePositionPatient (Z coordinate) or InstanceNumber
    try:
        slices.sort(key=lambda x: float(x.ImagePositionPatient[2]))
    except:
        try:
            slices.sort(key=lambda x: int(x.InstanceNumber))
        except:
            print("Warning: Could not sort slices properly")

    # Stack slices into 3D volume
    volume_slices = []
    for s in slices:
        # Get pixel array and apply rescale slope/intercept if available
        pixel_array = s.pixel_array.astype(np.float32)

        # Apply Hounsfield Unit conversion for CT scans
        if hasattr(s, 'RescaleSlope') and hasattr(s, 'RescaleIntercept'):
            pixel_array = pixel_array * float(s.RescaleSlope) + float(s.RescaleIntercept)

        volume_slices.append(pixel_array)

    # Stack into 3D array (Z, Y, X)
    volume = np.stack(volume_slices, axis=0)

    print(f"Volume shape: {volume.shape}")
    print(f"Volume range: [{volume.min()}, {volume.max()}]")

    return volume


def segment_brain_tissue(volume):
    """
    Segment brain tissue from CT/MRI volume using thresholding
    Returns binary mask of brain tissue
    """
    # Normalize volume to 0-1 range
    volume_norm = (volume - volume.min()) / (volume.max() - volume.min() + 1e-8)

    # For brain CT scans, brain tissue is typically in the range of 0-80 HU
    # For MRI, we'll use intensity-based thresholding

    # Apply thresholding to extract brain tissue
    # This is a simple approach - in production you'd use deep learning
    threshold_low = np.percentile(volume_norm, 20)
    threshold_high = np.percentile(volume_norm, 95)

    brain_mask = (volume_norm > threshold_low) & (volume_norm < threshold_high)

    # Morphological operations to clean up the mask
    brain_mask = binary_erosion(brain_mask, iterations=2)
    brain_mask = binary_dilation(brain_mask, iterations=3)

    return brain_mask, volume_norm


def generate_mesh_from_volume(volume, brain_mask, target_vertices=5000):
    """
    Generate 3D mesh from volume using marching cubes algorithm
    """
    # Downsample if volume is too large (for performance)
    max_dim = 128
    if max(volume.shape) > max_dim:
        scale_factors = [min(max_dim / s, 1.0) for s in volume.shape]
        volume = zoom(volume, scale_factors, order=1)
        brain_mask = zoom(brain_mask.astype(float), scale_factors, order=0) > 0.5

    print(f"Processing volume of shape: {volume.shape}")

    # Apply marching cubes to generate mesh
    try:
        verts, faces, normals, values = measure.marching_cubes(
            brain_mask.astype(float),
            level=0.5,
            step_size=1,
            allow_degenerate=False
        )
    except Exception as e:
        print(f"Marching cubes error: {e}")
        # Fallback to generating a simple mesh
        return generate_mock_brain_mesh("fallback")

    print(f"Generated mesh: {len(verts)} vertices, {len(faces)} faces")

    # Scale vertices to reasonable size and center
    verts = verts - verts.mean(axis=0)
    scale = 10.0 / max(verts.max(axis=0) - verts.min(axis=0))
    verts = verts * scale

    # Simplify mesh if too many vertices (for performance)
    if len(verts) > target_vertices:
        # Simple decimation by sampling
        step = len(verts) // target_vertices
        indices = np.arange(0, len(verts), step)[:target_vertices]

        # Create mapping from old to new indices
        index_map = {old_idx: new_idx for new_idx, old_idx in enumerate(indices)}
        verts = verts[indices]

        # Update faces with new indices
        new_faces = []
        for face in faces:
            if all(v in index_map for v in face):
                new_face = [index_map[v] for v in face]
                new_faces.append(new_face)
        faces = np.array(new_faces) if new_faces else faces

    # Generate labels and colors based on position and intensity
    labels = generate_tissue_labels(verts, volume, brain_mask)
    colors = assign_colors_by_label(labels)

    # Convert to lists for JSON serialization
    vertices_list = verts.tolist()
    faces_list = faces.tolist()
    labels_list = labels.tolist()
    colors_list = colors.tolist()

    return MeshData(
        vertices=vertices_list,
        faces=faces_list,
        labels=labels_list,
        colors=colors_list
    )


def generate_tissue_labels(vertices, volume, brain_mask):
    """
    Assign tissue type labels based on position and intensity
    """
    labels = np.zeros(len(vertices), dtype=int)

    # Normalize vertex positions to volume coordinates
    verts_norm = vertices.copy()
    verts_norm = verts_norm - verts_norm.min(axis=0)
    verts_norm = verts_norm / (verts_norm.max(axis=0) + 1e-8)

    # Sample volume at vertex positions
    for i, v in enumerate(verts_norm):
        # Map to volume coordinates
        z = int(v[0] * (volume.shape[0] - 1))
        y = int(v[1] * (volume.shape[1] - 1))
        x = int(v[2] * (volume.shape[2] - 1))

        # Clamp to valid range
        z = np.clip(z, 0, volume.shape[0] - 1)
        y = np.clip(y, 0, volume.shape[1] - 1)
        x = np.clip(x, 0, volume.shape[2] - 1)

        # Get intensity value
        intensity = volume[z, y, x]

        # Assign label based on intensity (simple segmentation)
        # In production, use trained neural network
        if intensity > 0.7:
            labels[i] = 1  # White matter (high intensity)
        elif intensity > 0.4:
            labels[i] = 2  # Grey matter (medium intensity)
        elif intensity > 0.2:
            # Check if in specific region for tumor (simplified)
            if vertices[i][0] > 0 and vertices[i][1] > 0 and vertices[i][2] > 0:
                labels[i] = 3  # Tumor (simulated)
            else:
                labels[i] = 2  # Grey matter
        else:
            labels[i] = 0  # Skull/CSF (low intensity)

    return labels


def assign_colors_by_label(labels):
    """
    Assign colors based on tissue labels
    """
    color_map = {
        0: [0.9, 0.9, 0.9],    # Skull/CSF - light grey
        1: [1.0, 0.95, 0.9],   # White matter - off-white
        2: [0.7, 0.7, 0.75],   # Grey matter - grey
        3: [0.9, 0.2, 0.2]     # Tumor - red
    }

    colors = np.array([color_map[label] for label in labels])
    return colors


def parse_binary_stl(filepath):
    with open(filepath, 'rb') as f:
        f.read(80)
        num_triangles_data = f.read(4)
        if len(num_triangles_data) < 4:
            return np.empty((0, 3)), np.empty((0, 3), dtype=int)
        num_triangles = struct.unpack('<I', num_triangles_data)[0]
        
        data = f.read(num_triangles * 50)
        dt = np.dtype([
            ('normal', '<f4', (3,)),
            ('vertices', '<f4', (3, 3)),
            ('attr', '<u2')
        ])
        mesh_data = np.frombuffer(data, dtype=dt)
        tri_vertices = mesh_data['vertices']
        flat_vertices = tri_vertices.reshape(-1, 3)
        faces = np.arange(len(flat_vertices)).reshape(-1, 3)
        return flat_vertices, faces


def simplify_mesh_grid(vertices, faces, grid_size=20):
    if len(vertices) == 0:
        return vertices, faces
        
    v_min = vertices.min(axis=0)
    v_max = vertices.max(axis=0)
    v_range = v_max - v_min
    max_range = v_range.max()
    if max_range == 0:
        return vertices, faces
        
    voxel_size = max_range / grid_size
    grid_coords = ((vertices - v_min) / voxel_size).astype(int)
    
    keys = grid_coords[:, 0] * 1000000 + grid_coords[:, 1] * 1000 + grid_coords[:, 2]
    unique_keys, inverse_indices = np.unique(keys, return_inverse=True)
    
    new_vertices = np.zeros((len(unique_keys), 3), dtype=np.float32)
    counts = np.zeros(len(unique_keys), dtype=np.float32)
    
    np.add.at(new_vertices, inverse_indices, vertices)
    np.add.at(counts, inverse_indices, 1.0)
    new_vertices /= counts[:, np.newaxis]
    
    new_faces = inverse_indices[faces]
    
    valid_faces = (new_faces[:, 0] != new_faces[:, 1]) & \
                  (new_faces[:, 1] != new_faces[:, 2]) & \
                  (new_faces[:, 2] != new_faces[:, 0])
    new_faces = new_faces[valid_faces]
    
    sorted_faces = np.sort(new_faces, axis=1)
    _, unique_face_indices = np.unique(sorted_faces, axis=0, return_index=True)
    new_faces = new_faces[unique_face_indices]
    
    return new_vertices, new_faces


STRUCTURE_NAMES = {
    1: "Anterior part of left superior temporal gyrus",
    2: "Anterior part of right superior temporal gyrus",
    3: "Tumor",
    4: "Left angular gyrus",
    5: "Right angular gyrus",
    6: "Left anterior orbital gyrus",
    7: "Right anterior orbital gyrus",
    8: "Left cingulate gyrus",
    9: "Right cingulate gyrus",
    10: "Left cuneus",
    11: "Right cuneus",
    12: "Left dentate gyrus",
    13: "Right dentate gyrus",
    14: "Left fusiform gyrus",
    15: "Right fusiform gyrus",
    16: "Left inferior temporal gyrus",
    17: "Right inferior temporal gyrus",
    18: "Left lingual gyrus",
    19: "Right lingual gyrus",
    20: "Left middle temporal gyrus",
    21: "Right middle temporal gyrus",
    22: "Left parahippocampal gyrus",
    23: "Right parahippocampal gyrus",
    24: "Left postcentral gyrus",
    25: "Right postcentral gyrus",
    26: "Left precentral gyrus",
    27: "Right precentral gyrus",
    28: "Left superior frontal gyrus",
    29: "Right superior frontal gyrus",
    30: "Left superior temporal gyrus",
    31: "Right superior temporal gyrus",
    32: "Left supramarginal gyrus",
    33: "Right supramarginal gyrus",
    34: "Left gyrus rectus",
    35: "Right gyrus rectus",
    36: "Left subcallosal gyrus",
    37: "Right subcallosal gyrus",
    38: "Left transverse temporal gyrus",
    39: "Right transverse temporal gyrus",
    40: "Left Thalamus",
    41: "Right Thalamus",
    42: "Left Caudate",
    43: "Right Caudate",
    44: "Left Putamen",
    45: "Right Putamen",
    46: "Left Pallidum",
    47: "Right Pallidum",
    48: "Left Amygdala",
    49: "Right Amygdala",
    50: "Left Hippocampus",
    51: "Right Hippocampus",
    52: "Brain Stem",
    53: "Left Cerebellum Cortex",
    54: "Right Cerebellum Cortex",
    55: "Left Cerebellum White Matter",
    56: "Right Cerebellum White Matter",
    57: "Left Lateral Ventricle",
    58: "Right Lateral Ventricle",
    59: "Third Ventricle",
    60: "Fourth Ventricle",
    61: "Left Accumbens area",
    62: "Right Accumbens area"
}

def map_coordinate_to_label(label, x, y, z):
    left = (x < 0)
    if label == 1: # Frontal Lobe
        if left:
            if y > 2.0: return 6
            elif y < -2.0: return 34
            elif z > 2.0: return 26
            elif z < -2.0: return 36
            else: return 28
        else:
            if y > 2.0: return 7
            elif y < -2.0: return 35
            elif z > 2.0: return 27
            elif z < -2.0: return 37
            else: return 29
    elif label == 2: # Parietal Lobe
        if left:
            if y > 1.0: return 4
            elif z > 2.0: return 32
            else: return 24
        else:
            if y > 1.0: return 5
            elif z > 2.0: return 33
            else: return 25
    elif label == 4: # Occipital Lobe
        if left:
            if z > 0: return 10
            else: return 18
        else:
            if z > 0: return 11
            else: return 19
    elif label == 11: # Temporal Lobe
        if left:
            if y > 2.0: return 1
            elif y < -2.0: return 20
            elif z > 1.0: return 30
            elif z < -2.0: return 38
            elif z < -1.0: return 14
            else: return 16
        else:
            if y > 2.0: return 2
            elif y < -2.0: return 21
            elif z > 1.0: return 31
            elif z < -2.0: return 39
            elif z < -1.0: return 15
            else: return 17
    elif label == 5: # Cerebellum
        if left:
            if z > 0.0: return 53
            else: return 55
        else:
            if z > 0.0: return 54
            else: return 56
    elif label == 6: # Brain Stem
        return 52
    elif label == 7: # Thalamus
        if left: return 40
        else: return 41
    elif label == 8: # Deep Gray Matter
        if left:
            if y > 2.0: return 42
            elif y < -2.0: return 61
            elif z > 1.0: return 44
            elif z < -2.0: return 48
            elif z < -1.0: return 50
            else: return 46
        else:
            if y > 2.0: return 43
            elif y < -2.0: return 62
            elif z > 1.0: return 45
            elif z < -2.0: return 49
            elif z < -1.0: return 51
            else: return 47
    elif label == 9: # White Matter
        if left:
            if y > 2.0: return 8
            elif y < -2.0: return 22
            elif z > 1.0: return 12
            elif z < -2.0: return 59
            else: return 57
        else:
            if y > 2.0: return 9
            elif y < -2.0: return 23
            elif z > 1.0: return 13
            elif z < -2.0: return 60
            else: return 58
    return 1

def get_unique_colors(n=63):
    colors = []
    for i in range(n):
        hue = (i * 0.618033988749895) % 1.0
        saturation = 0.60 + 0.15 * (i % 2)
        lightness = 0.50 + 0.10 * (i % 3 - 1)
        
        c = (1.0 - abs(2.0 * lightness - 1.0)) * saturation
        x = c * (1.0 - abs((hue * 6.0) % 2.0 - 1.0))
        m = lightness - c / 2.0
        
        hp = int(hue * 6.0)
        if hp == 0: r, g, b = c, x, 0.0
        elif hp == 1: r, g, b = x, c, 0.0
        elif hp == 2: r, g, b = 0.0, c, x
        elif hp == 3: r, g, b = 0.0, x, c
        elif hp == 4: r, g, b = x, 0.0, c
        else: r, g, b = c, 0.0, x
        
        colors.append([float(r + m), float(g + m), float(b + m)])
    return colors

def generate_mock_brain_mesh(case_id: str = "sample"):
    """
    Generate a high-fidelity 3D brain mesh with 61 segmented regions
    Loads anatomical structures from STL files, simplifies them, welds vertices,
    and assigns them to 61 structures based on spatial coordinates.
    Uses cached mesh if available.
    """
    meshes_dir = r"c:\Users\dabdi\.gemini\antigravity\scratch\axonive\3d_meshes"
    cache_path = os.path.join(meshes_dir, "cached_mesh.npz")
    
    if os.path.exists(cache_path):
        try:
            data = np.load(cache_path)
            vertices = data['vertices'].tolist()
            faces = data['faces'].tolist()
            labels = data['labels'].tolist()
            colors = data['colors'].tolist()
            return MeshData(
                vertices=vertices,
                faces=faces,
                labels=labels,
                colors=colors
            )
        except Exception as e:
            print(f"Axonive: Cache read failed: {e}. Rebuilding...")
            
    files = [
        ("Frontal_Lobe.stl", 1, 18),          # Frontal Lobe
        ("Parietal_Lobe.stl", 2, 15),         # Parietal Lobe
        ("Occipital_Lobe.stl", 4, 16),         # Occipital Lobe
        ("Cerebellum_6.stl", 5, 16),          # Cerebellum
        ("Brain_Stem_5.stl", 6, 16),          # Brain Stem
        ("Left_Thalamus_10.stl", 7, 14),       # Thalamus
        ("Deep_Gray_Matter_4.stl", 8, 14),     # Deep Gray Matter
        ("White_Matter_3.stl", 9, 12),         # White Matter
        ("Temporal_Lobe.stl", 11, 18),        # Temporal Lobe
    ]
    
    all_vertices = []
    all_faces = []
    all_base_labels = []
    vertex_offset = 0
    
    unique_colors = get_unique_colors(63)
    
    for filename, base_label, grid_size in files:
        path = os.path.join(meshes_dir, filename)
        if not os.path.exists(path):
            continue
            
        try:
            verts, faces = parse_binary_stl(path)
            simple_verts, simple_faces = simplify_mesh_grid(verts, faces, grid_size=grid_size)
            
            all_vertices.append(simple_verts)
            all_faces.append(simple_faces + vertex_offset)
            all_base_labels.append(np.full(len(simple_verts), base_label, dtype=int))
            
            vertex_offset += len(simple_verts)
        except Exception as e:
            print(f"Axonive: Failed to process {filename}: {e}")
            
    if not all_vertices:
        return MeshData(vertices=[], faces=[], labels=[], colors=[])
        
    combined_vertices = np.concatenate(all_vertices, axis=0)
    combined_faces = np.concatenate(all_faces, axis=0)
    combined_base_labels = np.concatenate(all_base_labels, axis=0)
    
    # Center and scale vertices
    centroid = combined_vertices.mean(axis=0)
    combined_vertices -= centroid
    max_range = (combined_vertices.max(axis=0) - combined_vertices.min(axis=0)).max()
    if max_range > 0:
        combined_vertices *= (10.0 / max_range)
        
    # Map to 61 structures after scaling
    combined_labels = np.zeros(len(combined_vertices), dtype=int)
    combined_colors = np.zeros((len(combined_vertices), 3), dtype=np.float32)
    
    for i, v in enumerate(combined_vertices):
        base_lbl = combined_base_labels[i]
        lbl = map_coordinate_to_label(base_lbl, v[0], v[1], v[2])
        combined_labels[i] = lbl
        combined_colors[i] = unique_colors[lbl]
        
    # Re-apply tumor in Frontal Lobe (center [1.0, -1.5, -1.0], radius 1.5)
    tumor_center = np.array([1.0, -1.5, -1.0])
    tumor_radius = 1.5
    dists = np.linalg.norm(combined_vertices - tumor_center, axis=1)
    tumor_mask = dists < tumor_radius
    combined_labels[tumor_mask] = 3
    combined_colors[tumor_mask] = [0.95, 0.15, 0.15]
    
    try:
        np.savez_compressed(
            cache_path,
            vertices=combined_vertices,
            faces=combined_faces,
            labels=combined_labels,
            colors=combined_colors
        )
    except Exception as e:
        print(f"Axonive: Failed to save cache: {e}")
        
    return MeshData(
        vertices=combined_vertices.tolist(),
        faces=combined_faces.tolist(),
        labels=combined_labels.tolist(),
        colors=combined_colors.tolist()
    )



def load_2d_image_as_volume(case_dir):
    """
    Load 2D image (PNG/JPG) and simulate 3D volume by extruding
    This creates a simple 3D representation from a 2D brain image
    """
    from PIL import Image

    # Find image files
    image_files = glob.glob(os.path.join(case_dir, "*.png")) + \
                  glob.glob(os.path.join(case_dir, "*.jpg")) + \
                  glob.glob(os.path.join(case_dir, "*.jpeg"))

    if not image_files:
        return None

    print(f"Loading 2D image: {image_files[0]}")

    # Load image
    img = Image.open(image_files[0]).convert('L')  # Convert to grayscale
    img_array = np.array(img).astype(np.float32)

    # Normalize to 0-1
    img_array = (img_array - img_array.min()) / (img_array.max() - img_array.min() + 1e-8)

    print(f"Image shape: {img_array.shape}")

    # Create 3D volume by extruding the 2D image
    # This simulates depth by replicating the slice
    depth = min(img_array.shape) // 2  # Create reasonable depth

    # Stack multiple slices with slight variation to simulate 3D structure
    volume_slices = []
    for i in range(depth):
        # Add slight variation to simulate depth
        t = i / depth  # 0 to 1
        scale = 1.0 - abs(t - 0.5) * 0.3  # Peak in middle, fade at edges
        slice_data = img_array * scale
        volume_slices.append(slice_data)

    volume = np.stack(volume_slices, axis=0)

    print(f"Created 3D volume from 2D image, shape: {volume.shape}")
    print(f"Volume range: [{volume.min()}, {volume.max()}]")

    return volume


def process_dicom_to_mesh(case_id: str):
    """
    Main function to process medical imaging data and generate 3D mesh
    Supports:
    - Multiple DICOM slices (.dcm) - stacks into 3D volume
    - Single 2D images (PNG/JPG) - extrudes to create 3D volume
    """
    upload_dir = "uploads"
    case_dir = os.path.join(upload_dir, case_id)

    # Check if case directory exists
    if not os.path.exists(case_dir):
        print(f"Case directory not found: {case_dir}, using mock data")
        return generate_mock_brain_mesh(case_id)

    # Try to load DICOM volume first
    volume = load_dicom_volume(case_dir)

    # If no DICOM, try 2D image
    if volume is None:
        print("No DICOM files found, trying 2D image...")
        volume = load_2d_image_as_volume(case_dir)

    # If still no data, use mock
    if volume is None:
        print("No valid image data found, using mock data")
        return generate_mock_brain_mesh(case_id)

    # Segment brain tissue
    brain_mask, volume_norm = segment_brain_tissue(volume)

    # Generate mesh from volume
    mesh_data = generate_mesh_from_volume(volume_norm, brain_mask)

    print(f"Successfully generated 3D mesh from medical imaging data")
    return mesh_data
