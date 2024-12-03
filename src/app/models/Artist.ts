import mongoose, { Schema, model, models } from "mongoose";

const artistSchema = new Schema(
  {
    vibes: {
      type: String,
      required: true,
    },
    genre: {
        type: String,
        required: true,
    },
    artist: {
        type: String,
        required: true,
    },
    popularity: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: false,
        default:"/logo.png"
    },
  },
);

const Artist = models.Artist || model("Artist", artistSchema);

export default Artist;

