'use client';

import React, { useState } from 'react';
import styles from './AddRecommendationForm.module.css';

const AddRecommendationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    vibes: '',
    genre: '',
    artist: '',
    imageUrl: '',
    popularity: '1', 
  });
  const [isLoading, setIsLoading] = useState(false); // To handle form state
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
  
    if (!formData.vibes || !formData.genre || !formData.artist || !formData.popularity || !formData.imageUrl) {
      setErrorMessage("Please fill in all required fields.");
      setIsLoading(false);
      return;
    }
  
    try {
      const response = await fetch(`/api/artist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(errorDetails.message || "Failed to add artist recommendation.");
      }
  
      const data = await response.json();
      console.log("Recommendation added successfully:", data);
      setSuccessMessage("Recommendation added successfully!");
  
      setFormData({ vibes: "", genre: "", artist: "", imageUrl: "", popularity: "1" });

      window.location.reload();

    } catch (error: any) {
      console.error("Error adding recommendation:", error.message);
      setErrorMessage(error.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles['form-card']}>
      <h2 className={styles['form-title']}>Find your Music Match</h2>
      {successMessage && <p className={styles['success-message']}>{successMessage}</p>}
      {errorMessage && <p className={styles['error-message']}>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="vibes">Vibes</label>
        <select
          id="vibes"
          name="vibes"
          value={formData.vibes}
          onChange={handleChange}
          required
        >
          <option value="">Select a vibe...</option>
          <option value="Happy">Happy</option>
          <option value="Sad">Sad</option>
          <option value="Chill">Chill</option>
          <option value="Loud">Loud</option>
          <option value="Trippy">Trippy</option>
          <option value="Energetic">Energetic</option>
          <option value="Smooth">Smooth</option>
          <option value="Experimental">Experimental</option>
          <option value="Dark">Dark</option>
          <option value="Sharp">Sharp</option>
          <option value="Elegant">Elegant</option>
          <option value="Meaningful">Meaningful</option>
        </select>

        <label htmlFor="genre">Genre</label>
        <select
          id="genre"
          name="genre"
          value={formData.genre}
          onChange={handleChange}
          required
        >
          <option value="">Select a genre...</option>
          <option value="Pop">Pop</option>
          <option value="Rock">Rock</option>
          <option value="R&B">R&B</option>
          <option value="Psychedelic Rock">Psychedelic Rock</option>
          <option value="Hip Hop">Hip Hop</option>
          <option value="EDM">EDM</option>
          <option value="Soul">Soul</option>
          <option value="Country">Country</option>
          <option value="Alternative">Alternative</option>
          <option value="Funk">Funk</option>
          <option value="Metal">Metal</option>
          <option value="Disco">Disco</option>
          <option value="Indie">Indie</option>
          <option value="Rap">Rap</option>
          <option value="International">International</option>
          <option value="Misc.">Misc.</option>
        </select>

        <label htmlFor="artist">Artist</label>
        <input
          type="text"
          id="artist"
          name="artist"
          value={formData.artist}
          onChange={handleChange}
          required
        />

        <label htmlFor="popularity">Popularity (1-10)</label>
        <input
          type="number"
          id="popularity"
          name="popularity"
          value={formData.popularity}
          onChange={handleChange}
          min="1"
          max="10"
          required
        />

        <label htmlFor="imageUrl">Image</label>
        <input
          type="text"
          id="imageUrl"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          required
        />

        <button type="submit" className={styles['submit-button']} disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default AddRecommendationForm;
