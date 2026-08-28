from pydantic import BaseModel, Field
from typing import Optional

class PredictionRequest(BaseModel):
    location: str = Field(..., description="Location of the property")
    carpet_area_sqft: float = Field(..., description="Carpet area in square feet")
    floor_num: int = Field(..., description="Floor number (0=Ground, -1=Basement)")
    bathroom: int = Field(..., description="Number of bathrooms")
    balcony: int = Field(..., description="Number of balconies")
    furnishing: str = Field(..., description="Furnished, Semi-Furnished, or Unfurnished")
    transaction: str = Field(..., description="New Property or Resale")
    ownership: str = Field(..., description="Ownership type")
    facing: str = Field(..., description="Property facing direction")

class PredictionResponse(BaseModel):
    predicted_price: float
    currency: str = "INR"