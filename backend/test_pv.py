import os
import struct
import numpy as np
import time

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

meshes_dir = r"c:\Users\dabdi\.gemini\antigravity\scratch\axonive\3d_meshes"
files = [
    ("Frontal_Lobe.stl", 1, [1.0, 0.4, 0.5], 18),          # Frontal Lobe
    ("Parietal_Lobe.stl", 2, [0.6, 0.4, 0.9], 15),         # Parietal Lobe
    ("Occipital_Lobe.stl", 4, [0.95, 0.6, 0.25], 16),      # Occipital Lobe
    ("Cerebellum_6.stl", 5, [0.2, 0.7, 0.8], 16),          # Cerebellum
    ("Brain_Stem_5.stl", 6, [0.9, 0.45, 0.35], 16),        # Brain Stem
    ("Left_Thalamus_10.stl", 7, [0.9, 0.75, 0.2], 14),     # Thalamus
    ("Deep_Gray_Matter_4.stl", 8, [0.85, 0.3, 0.7], 14),   # Deep Gray Matter
    ("White_Matter_3.stl", 9, [0.98, 0.95, 0.9], 12),      # White Matter
    ("Temporal_Lobe.stl", 11, [0.2, 0.8, 0.5], 18),        # Temporal Lobe
]

start_time = time.time()
all_vertices = []
all_faces = []
all_labels = []
all_colors = []
vertex_offset = 0

print("Processing meshes...")

raw_tumor_center = np.array([124.0, 78.0, 54.0])
raw_tumor_radius = 16.0

for filename, label, base_color, grid_size in files:
    path = os.path.join(meshes_dir, filename)
    if not os.path.exists(path):
        print(f"Skipping missing file: {filename}")
        continue
        
    t0 = time.time()
    verts, faces = parse_binary_stl(path)
    simple_verts, simple_faces = simplify_mesh_grid(verts, faces, grid_size=grid_size)
    
    labels = np.full(len(simple_verts), label, dtype=int)
    colors = np.full((len(simple_verts), 3), base_color, dtype=np.float32)
    
    if label == 1:
        dists = np.linalg.norm(simple_verts - raw_tumor_center, axis=1)
        tumor_mask = dists < raw_tumor_radius
        labels[tumor_mask] = 3
        colors[tumor_mask] = [0.95, 0.15, 0.15]
        print(f"  Embedded tumor: {np.sum(tumor_mask)} vertices labeled as tumor")
        
    print(f"Processed {filename:25s} in {time.time()-t0:.3f}s -> {len(simple_verts)} vertices, {len(simple_faces)} faces")
    
    all_vertices.append(simple_verts)
    all_faces.append(simple_faces + vertex_offset)
    all_labels.append(labels)
    all_colors.append(colors)
    
    vertex_offset += len(simple_verts)

combined_vertices = np.concatenate(all_vertices, axis=0)
combined_faces = np.concatenate(all_faces, axis=0)
combined_labels = np.concatenate(all_labels, axis=0)
combined_colors = np.concatenate(all_colors, axis=0)

centroid = combined_vertices.mean(axis=0)
combined_vertices -= centroid
max_range = (combined_vertices.max(axis=0) - combined_vertices.min(axis=0)).max()
combined_vertices *= (10.0 / max_range)

print(f"\nCompleted in {time.time()-start_time:.3f}s")
print(f"Total combined vertices: {len(combined_vertices)}")
print(f"Total combined faces: {len(combined_faces)}")
print(f"Tumor vertices count: {np.sum(combined_labels == 3)}")
