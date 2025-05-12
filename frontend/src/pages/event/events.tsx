import { EventCard } from "@/components/card/eventCard";
import { LazyContent } from "@/components/content/lazyContent";
import { SearchBar } from "@/components/input/searchbar";
import { Event } from "@/interfaces/";
import { useState } from "react";

export const EventsPage = () => {

    const formatEvent = (event: Event): Event => ({
        ...event,
        start_time: new Date(event.start_time),
        end_time: new Date(event.end_time),
    })

    const [query, setQuery] = useState<string>("/events/?");

    return (
        <div className="flex flex-col items-center px-16 gap-5 w-full">
            <SearchBar typo="event" setQuery={setQuery} />
            <LazyContent<Event> format={formatEvent} itemCard={EventCard} query={query} />
        </div>
    );
};

