from fastapi import APIRouter, HTTPException
from app.schemas import PredictionRequest, PredictionResponse
from app.services.model_loader import model_loader

router = APIRouter()

@router.post("/predict", response_model=PredictionResponse)
async def predict_price(request: PredictionRequest):
    try:

        features = {
            'carpet_area_sqft': request.carpet_area_sqft,
            'floor_num': request.floor_num,
            'bathroom': request.bathroom,
            'balcony': request.balcony,
            'car_parking': 0,  # Default value 
            'location': request.location,
            'furnishing': request.furnishing,
            'transaction': request.transaction,
            'ownership': request.ownership,
            'facing': request.facing
        }
        
        predicted_price = model_loader.predict(features)
        
        return PredictionResponse(predicted_price=predicted_price)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/locations")
async def get_locations():
    """Return list of available locations"""
    return {"locations": model_loader.locations}