from fastapi import APIRouter, HTTPException
from app.models.schemas import SegmentationResponse, MeshData
from app.services.segmentation_engine import process_dicom_to_mesh, STRUCTURE_NAMES
from pydantic import BaseModel

router = APIRouter()


class SegmentRequest(BaseModel):
    case_id: str


@router.post("/segment", response_model=SegmentationResponse)
async def segment_brain(request: SegmentRequest):
    """
    Perform AI-powered segmentation of brain structures
    Processes uploaded DICOM slices or single volume files
    Uses marching cubes algorithm to generate 3D mesh from medical imaging data
    """
    case_id = request.case_id

    # Process DICOM files and generate 3D mesh
    # If case has DICOM files, performs actual 3D reconstruction from 2D slices
    # Falls back to mock data if no DICOM files are found
    mesh_data = process_dicom_to_mesh(case_id)

    label_names = {str(k): v for k, v in STRUCTURE_NAMES.items()}

    return SegmentationResponse(
        mesh_data=mesh_data,
        label_names=label_names,
        case_id=case_id
    )
