import mongoose, { Schema, model, models } from "mongoose";

const playlistSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      alias: 'playlistName',
    },
    imageUrl: {
      type: String,
      required: false,
      default: "/headphones.png"
    },
    songs: {
      type: [String],
      required: true,
      default: [],
    },
    tags: {
      type: [String],
      required: false,
      default: [],
    },
  },
);

const Playlist = models.Playlist || model("Playlist", playlistSchema);

export default Playlist;

