import { useAuth } from "@/contexts/authContext";
import React from "react";

export const RoleConditional = ({ children, organizer = false }: { children: React.ReactNode, organizer?: boolean }) => {
    const { isOrganizer } = useAuth();
    return (isOrganizer === organizer) && <>{children}</>;
};

