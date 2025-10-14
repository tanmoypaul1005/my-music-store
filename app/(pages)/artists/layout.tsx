import MainCard from "@/components/ui/main-card/MainCard";
import React from "react";

const ArtistsPageLayout = ({
    children
} : {
    children: React.ReactNode
}) => {
    return <MainCard title="">{children}</MainCard>
}

export default ArtistsPageLayout;