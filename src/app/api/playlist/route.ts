import Playlist from "@/app/models/Playlist";
import { NextResponse } from "next/server";
import { connectMongoDB } from "@/app/libs/mongodb";
import { NextRequest } from "next/server";


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Incoming request body:", body);

    await connectMongoDB();
    console.log("Connected to MongoDB");

  
    const newPlaylist = await Playlist.create(body);
    console.log("New playlist created:", newPlaylist);

    return NextResponse.json({ message: "Recommendation added", artist: newPlaylist }, { status: 201 });
  } catch (error) {
    console.error("Error adding playlist:", error);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectMongoDB();

    const playlists = await Playlist.find().select(" -__v"); 

    return NextResponse.json(playlists, { status: 200 });
  } catch (error) {
    console.error("Error retrieving playlists:", error);
    return NextResponse.json({ message: "Error retrieving playlists." }, { status: 500 });
  }
}
