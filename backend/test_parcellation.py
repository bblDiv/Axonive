import os
import numpy as np
from app.services.segmentation_engine import parse_binary_stl, simplify_mesh_grid, map_coordinate_to_label

meshes_dir = r"c:\Users\dabdi\.gemini\antigravity\scratch\axonive\3d_meshes"
files = [
    ("Frontal_Lobe.stl", 1, 18),
    ("Parietal_Lobe.stl", 2, 15),
    ("Occipital_Lobe.stl", 4, 16),
    ("Cerebellum_6.stl", 5, 16),
    ("Brain_Stem_5.stl", 6, 16),
    ("Left_Thalamus_10.stl", 7, 14),
    ("Deep_Gray_Matter_4.stl", 8, 14),
    ("White_Matter_3.stl", 9, 12),
    ("Temporal_Lobe.stl", 11, 18),
]

all_vertices = []
all_base_labels = []

for filename, base_label, grid_size in files:
    path = os.path.join(meshes_dir, filename)
    verts, faces = parse_binary_stl(path)
    simple_verts, _ = simplify_mesh_grid(verts, faces, grid_size=grid_size)
    all_vertices.append(simple_verts)
    all_base_labels.append(np.full(len(simple_verts), base_label, dtype=int))

combined_vertices = np.concatenate(all_vertices, axis=0)
combined_base_labels = np.concatenate(all_base_labels, axis=0)

centroid = combined_vertices.mean(axis=0)
combined_vertices -= centroid
max_range = (combined_vertices.max(axis=0) - combined_vertices.min(axis=0)).max()
if max_range > 0:
    combined_vertices *= (10.0 / max_range)

offset = 0
for filename, base_label, _ in files:
    count = len(all_vertices[files.index((filename, base_label, _))])
    group_verts = combined_vertices[offset:offset+count]
    
    group_labels = []
    for v in group_verts:
        group_labels.append(map_coordinate_to_label(base_label, v[0], v[1], v[2]))
        
    unique_lbls, counts = np.unique(group_labels, return_counts=True)
    print(f"\n{filename} (base_label={base_label}):")
    print(f"  Coords bounding box: X=[{group_verts[:,0].min():.2f}, {group_verts[:,0].max():.2f}], Y=[{group_verts[:,1].min():.2f}, {group_verts[:,1].max():.2f}], Z=[{group_verts[:,2].min():.2f}, {group_verts[:,2].max():.2f}]")
    print(f"  Unique mapped labels: {dict(zip(unique_lbls, counts))}")
    
    offset += count
