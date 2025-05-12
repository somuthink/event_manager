
import { axiosInst } from "@/api/axios";
import { Separator } from "@/components/ui/separator";
import { useCallback, useEffect, useRef, useState } from "react";


interface LazyContentProps<T> {
    page_size?: number;
    query: string;
    format(item: T | { event: T }): T;
    itemCard: React.ComponentType<T>;
    firstItemCard?: React.ComponentType<T>;
    excludeItem?: number;
    colsClass?: string;
}

export const LazyContent = <T extends { id?: number }>({ page_size = 3, query, format, itemCard: ItemCard, firstItemCard: FirstItemCard, excludeItem, colsClass = "grid-cols-2 lg:grid-cols-3 md:grid-cols-3 " }: LazyContentProps<T>) => {


    const [items, setItems] = useState<T[]>([]);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const observerTarget = useRef<HTMLDivElement | null>(null);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    const [pendingAnimations, setPendingAnimations] = useState(0);

    const fetchEvents = useCallback(async () => {
        if (!hasMore || isLoading) return;

        setIsLoading(true);
        try {
            const response = await axiosInst.get<T[]>(
                `${query}skip=${offset}&limit=${page_size}`
            );

            const newItems = response.data.map(format);
            setPendingAnimations(newItems.length);

            // newItems.forEach((item, index) => {
            //     setTimeout(() => {
            //         setItems(prev => [...prev, item]);
            //     }, 100 * index);

            // });

            // setItems(prev => [...prev, ...newItems]);

            newItems.forEach((item, index) => {
                setTimeout(() => {
                    setItems(prev => [...prev, item]);
                    setPendingAnimations(prev => prev - 1);
                }, 100 * index);
            });

            if (newItems.length < page_size) {
                setHasMore(false);
            } else {
                setOffset((prevOffset) => prevOffset + page_size);
            }
        } catch (error) {
            console.error("Error fetching events:", error);
            setHasMore(false);
        } finally {
        }
    }, [offset, hasMore, isLoading, query]);


    useEffect(() => {
        if (pendingAnimations === 0 && isLoading) {
            setIsLoading(false);
        }
    }, [pendingAnimations]);


    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    if (debounceRef.current) clearTimeout(debounceRef.current);

                    debounceRef.current = setTimeout(() => {
                        fetchEvents();
                    }, 0);
                }
            },
            { threshold: 0.5, rootMargin: "20px" }
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
    });

    useEffect(() => {
        setPendingAnimations(0)
        setItems([])
        setOffset(0)
        setHasMore(true)
        setIsLoading(false)
    }, [query])


    return (
        <div className="w-full flex gap-5 flex-col ">
            {items[0] && FirstItemCard ? <FirstItemCard {...items[0]} /> : <></>}
            <div className={`w-full grid   gap-5 ${colsClass}`}>
                {items.map((item, index) => (
                    <>
                        {!(index === 0 && FirstItemCard) && item.id !== excludeItem &&
                            <div className="flex flex-col gap-4 items-center w-full ">
                                <ItemCard key={index} {...item} />
                                <Separator className="w-2/3 " />
                            </div>
                        }

                    </>
                ))}
            </div>
            {
                !hasMore && (
                    <div className="w-full flex flex-col items-center justify-center gap-2 font-mono">
                        🔚
                    </div>
                )
            }
            <div ref={observerTarget}></div>
        </div>
    );

}
