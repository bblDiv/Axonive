import numpy as np
from app.models.schemas import SimulationResponse, SimulationMetrics, MeshData
from app.services.segmentation_engine import generate_mock_brain_mesh, STRUCTURE_NAMES


def perform_tumor_removal_simulation(
    case_id: str,
    x: float,
    y: float,
    z: float,
    radius: float,
    stiffness: float,
    skull_opening_size: float
):
    """
    Simulate the biomechanical effects of tumor removal
    Uses a simplified distance-based deformation model
    """
    # Get original mesh
    original_mesh = generate_mock_brain_mesh()

    vertices = np.array(original_mesh.vertices)
    labels = np.array(original_mesh.labels)
    faces = original_mesh.faces
    colors = np.array(original_mesh.colors)

    tumor_center = np.array([x, y, z])

    # Simulation parameters
    # The max displacement depends on the tumor size (radius) and tissue stiffness
    max_displacement = (radius * 0.25) / (max(0.1, stiffness) / 3.0)
    decay_factor = 2.5      # How quickly displacement decreases with distance

    # Calculate displacement for each vertex
    displacements = []
    stress_values = []
    deformed_vertices = vertices.copy()
    new_labels = labels.copy()

    for i, vertex in enumerate(vertices):
        # Calculate distance from tumor center
        distance = np.linalg.norm(vertex - tumor_center)

        # If it is inside the tumor (within radius), it gets resected!
        if distance < radius:
            displacements.append(0.0)
            stress_values.append(0.0)
            new_labels[i] = 3  # Resected / Tumor label
            continue

        # Calculate displacement using exponential decay
        # The deformation acts towards the tumor cavity (collapsing inward)
        displacement_magnitude = max_displacement * np.exp(-(distance - radius) / decay_factor)
        displacement_magnitude = np.clip(displacement_magnitude, 0, max_displacement)

        direction = (tumor_center - vertex)
        if np.linalg.norm(direction) > 0:
            direction = direction / np.linalg.norm(direction)
        else:
            direction = np.zeros(3)

        displacement_vector = direction * displacement_magnitude
        deformed_vertices[i] = vertex + displacement_vector

        # Calculate stress
        stress = displacement_magnitude * stiffness * 2.0
        stress_values.append(float(stress))
        displacements.append(float(displacement_magnitude))

    # Update colors for tumor region (make it dark/removed)
    new_colors = colors.copy()
    for i, label in enumerate(new_labels):
        if label == 3:  # Resected
            new_colors[i] = [0.15, 0.15, 0.15]  # Dark grey/black

    # Calculate metrics
    max_disp = float(np.max(displacements)) if displacements else 0.0
    avg_stress = float(np.mean([s for s in stress_values if s > 0.1])) if stress_values else 0.0

    # Find vulnerable regions (high stress areas)
    vulnerable_labels = set()
    for i, stress in enumerate(stress_values):
        if stress > 1.2:  # High stress threshold
            lbl = new_labels[i]
            if lbl not in [3, 9]:  # Skip tumor/resected and white matter
                vulnerable_labels.add(int(lbl))

    vulnerable_regions = [STRUCTURE_NAMES[l] for l in vulnerable_labels if l in STRUCTURE_NAMES]
    if not vulnerable_regions:
        vulnerable_regions = ["Frontal Lobe"]

    # Calculate affected volume (approximate)
    affected_count = sum(1 for d in displacements if d > 0.05)
    affected_volume = affected_count * 0.5

    metrics = SimulationMetrics(
        max_displacement_mm=max_disp * 10,  # Convert to mm
        avg_stress_kpa=avg_stress,
        affected_volume_cm3=affected_volume,
        vulnerable_regions=vulnerable_regions
    )

    deformed_mesh = MeshData(
        vertices=deformed_vertices.tolist(),
        faces=faces,
        labels=new_labels.tolist(),
        colors=new_colors.tolist()
    )

    return SimulationResponse(
        deformed_mesh=deformed_mesh,
        metrics=metrics,
        heatmap_data=stress_values,
        case_id=case_id
    )
