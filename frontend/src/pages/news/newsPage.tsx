import { EventCard } from "@/components/card/eventCard";
import { SearchBar } from "@/components/input/searchbar";
import { axiosInst } from "@/api/axios";
import { Event } from "@/interfaces/interfaces";
import { useState, useCallback, useEffect, useRef } from "react";

export const NewsPage = () => {

    const PAGE_SIZE = 6;

    const [events, setEvents] = useState<Event[]>([]);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const observerTarget = useRef<HTMLDivElement | null>(null);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    const fetchEvents = useCallback(async () => {
        if (!hasMore || isLoading) return;

        setIsLoading(true);
        try {
            const response = await axiosInst.get<Event[]>(
                `events/?skip=${offset}&limit=${PAGE_SIZE}`
            );

            const newEvents = response.data;
            setEvents((prevEvents) => [...prevEvents, ...newEvents]);

            if (newEvents.length < PAGE_SIZE) {
                setHasMore(false);
            } else {
                setOffset((prevOffset) => prevOffset + PAGE_SIZE);
            }
        } catch (error) {
            console.error("Error fetching events:", error);
            setHasMore(false);
        } finally {
            setIsLoading(false);
        }
    }, [offset, hasMore, isLoading]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    if (debounceRef.current) clearTimeout(debounceRef.current);

                    debounceRef.current = setTimeout(() => {
                        fetchEvents();
                    }, 0); // Задержка, чтобы избежать частых вызовов
                }
            },
            { threshold: 0.5, rootMargin: "400px" }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [fetchEvents]);

    return (
        <div className="flex flex-col gap-5 w-full">
            <SearchBar typo="news" />
            <div className="w-full grid lg:grid-cols-3 gap-5 grid-cols-2">
                {events.map((event, index) => (
                    <EventCard key={index} event={event} />
                ))}
            </div>
            {!hasMore && (
                <div className="w-full flex flex-col items-center justify-center gap-2 font-mono">
                    end
                </div>
            )}
            <div ref={observerTarget}></div>
        </div>
    );
};

