import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_predict_valid():

    payload = {
        "location": "Other",
        "carpet_area_sqft": 1200,
        "floor_num": 3,
        "bathroom": 2,
        "balcony": 1,
        "furnishing": "Furnished",
        "transaction": "Resale",
        "ownership": "Freehold",
        "facing": "North"
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 200
    assert "predicted_price" in response.json()

def test_predict_invalid():

    payload = {
        "location": "Other",
        "carpet_area_sqft": 1200
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 422  