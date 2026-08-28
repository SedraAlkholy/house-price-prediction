import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    location: '',
    carpet_area_sqft: '',
    floor_num: '',
    bathroom: '',
    balcony: '',
    furnishing: 'Furnished',
    transaction: 'Resale',
    ownership: 'Freehold',
    facing: 'North'
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locations, setLocations] = useState([]);

  // Fetch locations when the component loads
  useEffect(() => {
    fetch('http://localhost:8000/locations')
      .then(res => res.json())
      .then(data => setLocations(data.locations))
      .catch(err => console.error('Error fetching locations:', err));
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          carpet_area_sqft: parseFloat(formData.carpet_area_sqft),
          floor_num: parseInt(formData.floor_num),
          bathroom: parseInt(formData.bathroom),
          balcony: parseInt(formData.balcony)
        }),
      });

      if (!response.ok) {
        throw new Error('Prediction failed');
      }

      const data = await response.json();
      setPrediction(data);
    } catch (err) {
      setError('Failed to get prediction. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1> House Price Predictor</h1>
      <p className="subtitle">Enter property details to get an estimated price</p>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-row">
          <div className="form-group">
            <label>Location *</label>
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            >
              <option value="">Select Location</option>
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Carpet Area (sq ft) *</label>
            <input
              type="number"
              name="carpet_area_sqft"
              value={formData.carpet_area_sqft}
              onChange={handleChange}
              placeholder="e.g., 1200"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Floor Number *</label>
            <input
              type="number"
              name="floor_num"
              value={formData.floor_num}
              onChange={handleChange}
              placeholder="0 for Ground, -1 for Basement"
              required
            />
          </div>

          <div className="form-group">
            <label>Bathrooms *</label>
            <input
              type="number"
              name="bathroom"
              value={formData.bathroom}
              onChange={handleChange}
              placeholder="e.g., 2"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Balconies *</label>
            <input
              type="number"
              name="balcony"
              value={formData.balcony}
              onChange={handleChange}
              placeholder="e.g., 1"
              required
            />
          </div>

          <div className="form-group">
            <label>Furnishing *</label>
            <select
              name="furnishing"
              value={formData.furnishing}
              onChange={handleChange}
              required
            >
              <option value="Furnished">Furnished</option>
              <option value="Semi-Furnished">Semi-Furnished</option>
              <option value="Unfurnished">Unfurnished</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Transaction *</label>
            <select
              name="transaction"
              value={formData.transaction}
              onChange={handleChange}
              required
            >
              <option value="New Property">New Property</option>
              <option value="Resale">Resale</option>
            </select>
          </div>

          <div className="form-group">
            <label>Ownership *</label>
            <select
              name="ownership"
              value={formData.ownership}
              onChange={handleChange}
              required
            >
              <option value="Freehold">Freehold</option>
              <option value="Leasehold">Leasehold</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Facing *</label>
            <select
              name="facing"
              value={formData.facing}
              onChange={handleChange}
              required
            >
              <option value="North">North</option>
              <option value="South">South</option>
              <option value="East">East</option>
              <option value="West">West</option>
              <option value="North-East">North-East</option>
              <option value="North-West">North-West</option>
              <option value="South-East">South-East</option>
              <option value="South-West">South-West</option>
            </select>
          </div>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Predicting...' : 'Predict Price'}
        </button>
      </form>

      {error && (
        <div className="error">
           {error}
        </div>
      )}

      {prediction && (
        <div className="result">
          <h2> Estimated Price</h2>
          <div className="price">
            ₹ {prediction.predicted_price.toLocaleString()}
          </div>
          <p className="currency">{prediction.currency}</p>
        </div>
      )}
    </div>
  );
}

export default App;