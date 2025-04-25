import { useAuth } from "@/contexts/authContext";
import React from "react";

export const OrgOnly = ({ children }: { children: React.ReactNode }) => {
    const { isOrganizer } = useAuth();
    return isOrganizer ? <>{children}</> : null;
};

