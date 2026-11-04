"use client"
import IndexTrends from "./trends/IndexTrends";
import BanglaSongList from "@/components/bangla/BanglaSongList";
import styles from './Index.module.scss'

const Index = ({
    trends,
}: {
    trends: Music[],
}) => {
    return <section className={styles.section}>

        <IndexTrends trendsInfo={trends} />

        <div className={styles.content}>
            <BanglaSongList />
        </div>

    </section>
}

export default Index;
