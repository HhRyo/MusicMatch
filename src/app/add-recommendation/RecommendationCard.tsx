'use client';

import React from 'react';
import styles from './RecommendationCard.module.css';
import Image from 'next/image';

interface RecommendationCardProps {
  _id: string;
  imageUrl: string;
  artist: string;
  genre: string;
  vibes: string;
  popularity: string;
  onDelete: (id: string) => void; 
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ _id, imageUrl, artist, genre, vibes, popularity, onDelete }) => {
  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete ${artist}?`)) {
      await onDelete(_id); // Trigger the delete action passed from the parent
    }
  };


  const validImageUrl = imageUrl && imageUrl.trim() !== '' ? imageUrl : '/headphones.png';

  return (
    <div className={styles.card}>
      <Image
        className={styles['img-Adjust']}
        src={validImageUrl}
        alt={`${artist} avatar`}
        width={100}
        height={100}
        priority
      />
      <h3>{artist}</h3>
      <p><strong>Genre:</strong> {genre}</p>
      <p><strong>Vibes:</strong> {vibes}</p>
      <p><strong>Popularity:</strong> {popularity}</p>
      <button className={styles['delete-button']} onClick={handleDelete}>
        Delete
      </button>
    </div>
  );
};

export default RecommendationCard;
