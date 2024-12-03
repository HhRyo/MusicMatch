'use client';

import React, { useEffect, useState } from 'react';
import AddRecommendationForm from '../add-recommendation/AddRecommendationForm';
import RecommendationCard from '../add-recommendation/RecommendationCard';
import styles from './AddRecommendationPage.module.css';
import LibraryHeader from '../add-recommendation/LibraryHeader';
import AddItemComponent from '../add-item/AddItemComponent'; // Import the AddItemComponent

interface Artist {
  _id: string;
  imageUrl: string;
  artist: string;
  genre: string;
  vibes: string;
  popularity: string;
}

interface Playlist {
  _id: string;
  playlistName: string;
  imageUrl: string;
  songs: string[];
  tags: string[];
}

const AddRecommendationPage: React.FC = () => {
  const [addedArtists, setAddedArtists] = useState<Artist[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

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

    const fetchPlaylists = async () => {
      try {
        const response = await fetch('/api/playlist');
        if (response.ok) {
          const data = await response.json();
          setPlaylists(data);
        } else {
          console.error('Failed to fetch playlists');
        }
      } catch (error) {
        console.error('Error fetching playlists:', error);
      }
    };

    fetchArtists();
    fetchPlaylists();
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

  const handleDeletePlaylist = async (id: string) => {
    try {
      const response = await fetch(`/api/playlist/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(errorDetails.message || 'Failed to delete playlist');
      }

      alert('Playlist deleted successfully');
      window.location.reload();
    } catch (error: any) {
      console.error('Error deleting playlist:', error.message);
      alert(error.message || 'Something went wrong while deleting the playlist');
    }
  };

  return (
    <>
      <LibraryHeader />
      <div className={styles['page-container']}>
        <div className={styles['lists-container']}>
          {/* Artists Section */}
          <div className={styles['list']}>
            <h3 className={styles['section-title']}>Added Artists</h3>
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

          {/* Break between Artists and Playlists */}
          <div className={styles['section-break']}></div>

          {/* Playlists Section */}
          <div className={styles['list']}>
            <h3 className={styles['section-title']}>My Playlists</h3>
            {playlists.map((playlist) => (
              <div key={playlist._id} className={styles['card']}>
                <h4>{playlist.playlistName}</h4>
                <img
                  src={playlist.imageUrl}
                  alt={playlist.playlistName}
                  className={styles['img-Adjust']}
                />
                <p><strong>Songs:</strong></p>
                <ul>
                  {playlist.songs.map((song, index) => (
                    <li key={index}>{song}</li>
                  ))}
                </ul>
                <p><strong>Tags:</strong></p>
                <ul>
                  {playlist.tags.map((tag, index) => (
                    <li key={index}>{tag}</li>
                  ))}
                </ul>
                <button
                  className={styles['delete-button']}
                  onClick={() => handleDeletePlaylist(playlist._id)}
                >
                  Delete Playlist
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AddRecommendationPage;
