import { connectMongoDB } from "@/app/libs/mongodb";
import Playlist from "@/app/models/Playlist";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import mongoose from "mongoose";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ message: "Invalid ID format" }, { status: 400 });
    }

    await connectMongoDB();

    const deletedItem = await Playlist.findByIdAndDelete(id);
    if (!deletedItem) {
        return NextResponse.json({ message: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Item deleted successfully" }, { status: 200 });
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params; 
  
    await connectMongoDB();
  
    try {
      const playlist = await Playlist.findById(id);
      if (!playlist) {
        return NextResponse.json({ message: "Playlist not found" }, { status: 404 });
      }
      return NextResponse.json(playlist, { status: 200 });
    } catch (error) {
      console.error("Error fetching playlist by ID:", error);
      return NextResponse.json({ message: "Failed to fetch playlist" }, { status: 500 });
    }
  }
