import { axiosInst } from "@/api/axios";
export const createReview = async (
    filmId: number,
    positive: boolean,
    content: string,
) => {
    try {
        await axiosInst.post(
            `reviews/create?id=${filmId}&positive=${positive ? "yes" : "no"}&content=${content}`,
        );
    } catch (error) {
        console.log((error as Error).message);
    }
};

export const howLongAgo = (timestamp: string): string => {
    const now = new Date();
    const updatedAt = new Date(timestamp);
    const diffInSeconds = Math.floor(
        (now.getTime() - updatedAt.getTime()) / 1000,
    );

    if (diffInSeconds < 60) {
        return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} day${days > 1 ? "s" : ""} ago`;
    }
};
