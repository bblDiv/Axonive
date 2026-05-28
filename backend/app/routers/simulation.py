from fastapi import APIRouter, HTTPException
from app.models.schemas import SimulationRequest, SimulationResponse
from app.services.fea_simulator import perform_tumor_removal_simulation

router = APIRouter()


@router.post("/simulate", response_model=SimulationResponse)
async def simulate_surgery(request: SimulationRequest):
    """
    Perform finite element analysis simulation of tumor removal
    """
    try:
        result = perform_tumor_removal_simulation(
            case_id=request.case_id,
            x=request.x,
            y=request.y,
            z=request.z,
            radius=request.radius,
            stiffness=request.stiffness,
            skull_opening_size=request.skull_opening_size
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Simulation error: {str(e)}")
