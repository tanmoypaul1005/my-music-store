import type { Metadata } from "next";
import banglaSong from "@/server/banglaSong.json";
import populerBanglaSong from "@/server/populerBanglaSong.json";
import hindiSong from "@/server/hindiSong.json";
import topSong from "@/server/topSong.json";
import ArtistDetail from "@/components/artist-detail/ArtistDetail";

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
  
  // Merge all songs from all sources
  const allSongs = [
    ...banglaSong.music, 
    ...populerBanglaSong.music,
    ...hindiSong.music,
    ...topSong.music
  ];
  
  // Filter songs by artist name (case insensitive and trim whitespace)
  const artistSongs = allSongs?.filter(
    song => song.artist.trim().toLowerCase() === artistName.trim().toLowerCase()
  );

  return <ArtistDetail artist={artistName} songs={artistSongs} />;
}
