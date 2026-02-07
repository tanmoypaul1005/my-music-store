import LoadingSkeletons from "@/components/ui/skeleton/music/MusicItemSkeleton";

export default function Loading() {
  return (
    <div className="loadingPage">
      <LoadingSkeletons count={8} />
    </div>
  );
}
