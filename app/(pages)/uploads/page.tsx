import MusicList from "@/components/music/MusicList";
import UploadForm from "@/components/upload/UploadForm";
import EditSongs from "@/components/upload/EditSongs";
import GetUploadedMusics, { GetEditableSongs } from "@/services/server/cloudinary";

export const metadata = {
    title: "Uploads"
}

const UploadsPage = async () => {
    const [musics, editable] = await Promise.all([GetUploadedMusics(), GetEditableSongs()])

    return <>
        <UploadForm />
        <EditSongs songs={editable} />
        {musics.length > 0
            ? <MusicList name="Uploaded songs" musics={musics} playListId="uploads-page-playlist" />
            : <p style={{ color: 'var(--text-color)' }}>No uploaded songs yet.</p>}
    </>
}

export default UploadsPage;
