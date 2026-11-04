import MainCard from "@/components/ui/main-card/MainCard";
import React from "react";

const UploadsLayout = ({ children }: { children: React.ReactNode }) => {
    return <MainCard title="Upload Song">{children}</MainCard>
}

export default UploadsLayout;
