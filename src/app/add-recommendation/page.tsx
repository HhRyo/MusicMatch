'use client';

import React, { useEffect, useState } from 'react';
import AddRecommendationForm from './AddRecommendationForm';
import RecommendationCard from './RecommendationCard';
import LoggedInHeader from './LoggedInHeader';
import styles from './AddRecommendationPage.module.css';
import { useSession } from "next-auth/react";


interface Artist {
  _id: string;
  imageUrl: string;
  artist: string;
  genre: string;
  vibes: string;
  popularity: string;
}


const AddRecommendationPage: React.FC = () => {
  const [addedArtists, setAddedArtists] = useState<Artist[]>([]);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await fetch('/api/artist');
        if (response.ok) {
          const artists = await response.json();
          setAddedArtists(artists);
        } else {
          console.error('Failed to fetch artists');
        }
      } catch (error) {
        console.error('Error fetching artists:', error);
      }
    };

    fetchArtists();
  }, []);

  const handleDeleteArtist = async (id: string) => {
    try {
      const response = await fetch(`/api/artist/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(errorDetails.message || 'Failed to delete artist');
      }

      alert('Artist deleted successfully');
      window.location.reload();
    } catch (error: any) {
      console.error('Error deleting artist:', error.message);
      alert(error.message || 'Something went wrong while deleting the artist');
    }
  };

  return (
    <>
      <LoggedInHeader />
      <div className={styles['page-container']}>
        <div className={styles['form-container']}>
          <AddRecommendationForm />
        </div>
        <div className={styles['scrollable-menus']}>
          <h3 className={styles['section-title']}>Added Artists</h3>
          <div className={styles['scrollable-section']}>
            <div className={styles['scrollable-content']}>
              {addedArtists.map((artist) => (
                <RecommendationCard
                  key={artist._id}
                  _id={artist._id}
                  imageUrl={artist.imageUrl}
                  artist={artist.artist}
                  genre={artist.genre}
                  vibes={artist.vibes}
                  popularity={artist.popularity}
                  onDelete={handleDeleteArtist}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddRecommendationPage;
