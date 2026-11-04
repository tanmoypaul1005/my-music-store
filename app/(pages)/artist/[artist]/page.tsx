import type { Metadata } from "next";
import ArtistDetail from "@/components/artist-detail/ArtistDetail";
import { GetAllMusics } from "@/services/server/cloudinary";

type Props = {
  params: { artist: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const artistName = decodeURIComponent(resolvedParams.artist);
  return {
    title: `${artistName} - ${process.env.NEXT_PUBLIC_TITLE || "Music Store"}`,
  };
}

export default async function ArtistDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const artistName = decodeURIComponent(resolvedParams.artist);
  
  const allSongs = await GetAllMusics();
  
  // Filter songs by artist name (case insensitive and trim whitespace)
  const artistSongs = allSongs?.filter(
    song => song.artist.trim().toLowerCase() === artistName.trim().toLowerCase()
  );

  return <ArtistDetail artist={artistName} songs={artistSongs} />;
}
