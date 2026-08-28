import joblib
import json
import pandas as pd
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
MODEL_PATH = BASE_DIR / "models" / "house_price.pkl"
LOCATIONS_PATH = BASE_DIR / "models" / "locations.json"

class ModelLoader:
    def __init__(self):
        self.model = None
        self.locations = []
        self.load_model()
        self.load_locations()
    
    def load_model(self):
        """Load the trained model from file"""
        if self.model is None:
            try:
                self.model = joblib.load(MODEL_PATH)
                print(f"Model loaded from {MODEL_PATH}")
            except FileNotFoundError:
                print(f"Model not found at {MODEL_PATH}")
                raise
    
    def load_locations(self):
        """Load the location list for validation"""
        try:
            with open(LOCATIONS_PATH, 'r') as f:
                self.locations = json.load(f)
            print(f"Locations loaded: {len(self.locations)} locations")
        except FileNotFoundError:
            print(f"Locations file not found at {LOCATIONS_PATH}")

            self.locations = ["Other"]
    
    def predict(self, features: dict):
        """Make a prediction using the loaded model"""
        if self.model is None:
            raise ValueError("Model not loaded")
        
        df = pd.DataFrame([[
            features['carpet_area_sqft'],
            features['floor_num'],
            features['bathroom'],
            features['balcony'],
            features['car_parking'],
            features['location'],
            features['furnishing'],
            features['transaction'],
            features['ownership'],
            features['facing']
        ]], columns=[
            'carpet_area_clean', 'floor_num', 'Bathroom', 'Balcony', 'Car Parking',
            'location_grouped', 'Furnishing', 'Transaction', 'Ownership', 'facing'
        ])
        
        prediction = self.model.predict(df)[0]
        return round(prediction, 2)

model_loader = ModelLoader()