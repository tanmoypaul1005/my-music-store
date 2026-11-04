import MusicList from "@/components/music/MusicList";
import UploadForm from "@/components/upload/UploadForm";
import GetUploadedMusics from "@/services/server/cloudinary";

export const metadata = {
    title: "Uploads"
}

const UploadsPage = async () => {
    const musics: Music[] = await GetUploadedMusics()

    return <>
        <UploadForm />
        {musics.length > 0
            ? <MusicList name="Uploaded songs" musics={musics} playListId="uploads-page-playlist" />
            : <p style={{ color: 'var(--text-color)' }}>No uploaded songs yet.</p>}
    </>
}

export default UploadsPage;
