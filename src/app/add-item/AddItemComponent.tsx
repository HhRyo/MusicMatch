'use client';

import React, { useState, useRef, ChangeEvent, FormEvent, useEffect } from 'react';
import styles from './AddItemComponent.module.css';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

interface FormData {
  name: string; 
  imageUrl: string; 
  songInput: string;
  songs: string[];
  tags: string;
}

interface Playlist {
  _id: string;
  name: string; // Replaced playlistName with name
  imageUrl: string;
  songs: string[];
  tags: string | string[];
}

const AddItemComponent: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: '', // Replaced playlistName with name
    imageUrl: '',
    songInput: '',
    songs: [],
    tags: '',
  });
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Fetch playlists from the backend
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

    fetchPlaylists();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const searchiTunes = async (query: string) => {
    try {
      const response = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song`
      );
      const data = await response.json();
      setSearchResults(data.results);
    } catch (error) {
      console.error('Error searching iTunes:', error);
    }
  };

  const handleSongSearch = async () => {
    if (formData.songInput) {
      await searchiTunes(formData.songInput);
    }
  };

  const handleAddSong = (song: any) => {
    const updatedSongs = [...formData.songs, `${song.trackName} by ${song.artistName}`];
    setFormData({
      ...formData,
      songs: updatedSongs,
      songInput: '',
    });
    setSearchResults([]); 
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const tagsArray = formData.tags.split(',').map(tag => tag.trim());

    if (!formData.name || formData.songs.length === 0 || tagsArray.length === 0) {
      alert('Please fill out all fields!');
      return;
    }

    const newPlaylist = {
      name: formData.name, 
      imageUrl: formData.imageUrl, 
      songs: formData.songs,
      tags: tagsArray, 
    };

    try {
      const response = await fetch('/api/playlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPlaylist),
      });

      if (response.ok) {
        const data = await response.json();
        setPlaylists([...playlists, data.artist]); 
        setFormData({
          name: '', 
          imageUrl: '',
          songInput: '',
          songs: [],
          tags: '',
        });
        if (imageInputRef.current) {
          imageInputRef.current.value = '';
        }
      } else {
        alert('Error creating playlist');
      }
    } catch (error) {
      console.error('Error creating playlist:', error);
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  const handleGoToMusicMatch = () => {
    router.push('/add-recommendation');
  };

  const handleDeletePlaylist = async (id: string) => {
    try {
      const response = await fetch(`/api/playlist/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPlaylists(playlists.filter((playlist) => playlist._id !== id));
      } else {
        console.error('Error deleting playlist');
      }
    } catch (error) {
      console.error('Error deleting playlist:', error);
    }
  };

  return (
    <div className={styles['create-playlist-container']}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <img src="/logo.png" alt="logo" />
        </div>
        <h1>MusicMatch</h1>
        <div className={styles['user-profile']}>
          <button className={styles['action-button']} onClick={handleGoToMusicMatch}>
            Go to Music Match
          </button>
          <button className={styles['action-button']} onClick={handleLogout}>
            Logout
          </button>
          <img src="/person.png" alt="user profile" className={styles['user-image']} />
        </div>
      </header>

      <div className={styles['create-playlist']}>
        <form onSubmit={handleSubmit} className={styles['playlist-form']}>
          <div className={styles['form-group']}>
            <label htmlFor="name">Playlist Name</label>
            <input
              type="text"
              id="name" 
              name="name" 
              value={formData.name} 
              onChange={handleChange}
            />
          </div>

          <div className={styles['form-group']}>
            <label htmlFor="imageUrl">Add Image URL</label>
            <input
              type="text"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
            />
          </div>

          <div className={styles['form-group']}>
            <label htmlFor="songInput">Search for a Song</label>
            <input
              type="text"
              id="songInput"
              name="songInput"
              value={formData.songInput}
              onChange={handleChange}
            />
            <button  className={styles['s-button']} type="button" onClick={handleSongSearch} >
              Search
            </button>
          </div>

          <div className={styles['search-results']}>
            {searchResults.map((song, index) => (
              <div key={index} onClick={() => handleAddSong(song)} className={styles['search-result']}>
                <p>{song.trackName} by {song.artistName}</p>
              </div>
            ))}
          </div>

          <div className={styles['songs-list']}>
            {formData.songs.map((song, index) => (
              <p key={index}>{song}</p>
            ))}
          </div>

          <div className={styles['form-group']}>
            <label htmlFor="tags">Tags</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className={styles['submit-button']}>Create Playlist</button>
        </form>
      </div>

      <div className={styles['my-playlists']}>
        <h2>My Playlists</h2>
        {playlists.map((playlist) => (
          <div key={playlist._id} className={styles['playlist-card']}>
            <h3>{playlist.name}</h3> 
            <img src={playlist.imageUrl} alt={playlist.name} /> 
            <p><strong>Songs:</strong></p>
            {playlist.songs.map((song, i) => (
              <p key={i}>{song}</p>
            ))}
            <p><strong>Tags:</strong></p>
            {Array.isArray(playlist.tags) ? (
              playlist.tags.map((tag, i) => <p key={i}>{tag}</p>)
            ) : (
              <p>{playlist.tags}</p>
            )}
            <button  className={styles['delete-button']} onClick={() => handleDeletePlaylist(playlist._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddItemComponent;
