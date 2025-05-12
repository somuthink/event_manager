import { FirstNewsCard, NewsCard } from "@/components/card/newsCard";
import { LazyContent } from "@/components/content/lazyContent";
import { SearchBar } from "@/components/input/searchbar";
import { News } from "@/interfaces";
import { useState } from "react";


export const NewsPage = () => {

    const [query, setQuery] = useState<string>("/news/?")

    return (
        <div className="flex flex-col px-16 gap-5 w-full items-center ">
            <SearchBar typo="news" setQuery={setQuery} />
            <LazyContent<News> query={query} format={(news: News) => news} itemCard={NewsCard} firstItemCard={FirstNewsCard} colsClass="grid-cols-1 lg:grid-cols-2" />
        </div>
    );
};

