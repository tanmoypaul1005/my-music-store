"use client"
import IndexTrends from "./trends/IndexTrends";
import BanglaSongList, { HomeSections } from "@/components/bangla/BanglaSongList";
import styles from './Index.module.scss'

const Index = ({
    trends,
    sections,
}: {
    trends: Music[],
    sections: HomeSections,
}) => {
    return <section className={styles.section}>

        <IndexTrends trendsInfo={trends} />

        <div className={styles.content}>
            <BanglaSongList sections={sections} />
        </div>

    </section>
}

export default Index;
