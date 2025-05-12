import { axiosInst } from "@/api/axios";
import { EventCard } from "@/components/card/eventCard";
import { NewsCard } from "@/components/card/newsCard";
import { LazyContent } from "@/components/content/lazyContent";
import { ReadOnlyYoopta } from "@/components/editor/yopta";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Event, News } from "@/interfaces";
import { ArrowDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";


export const NewsEntityPage = () => {

    const relatedRef = useRef(null);

    const { id } = useParams<{ id: string }>();
    const [news, setNews] = useState<News>()
    const [event, setEvent] = useState<Event>({
        title: '',
        description: '',
        theme: '',
        image: '',
        start_time: new Date(),
        end_time: new Date(),
        address: "",
        tags: [{ name: "string" }]
    })


    const formatEvent = (event: Event): Event => ({
        ...event,
        start_time: new Date(event.start_time),
        end_time: new Date(event.end_time),
    })

    useEffect(() => {
        const fetchNewsEntity = async () => {
            try {
                const response = await axiosInst.get<News>(`news/${id}`)
                setNews(response.data)
                console.log(response.data)
            } catch (error) {
                console.error("Failed to fetch event:", error)
            } finally {
            }
        }


        const fetchRelatedEvent = async () => {
            const response = await axiosInst.get<Event[]>(`/relationships/event-news/news/${id}`)
            setEvent(formatEvent(response.data[0]))
        }


        fetchNewsEntity()
        fetchRelatedEvent()
    }, [id])


    return (

        <div className="flex  w-full px-10 gap-10  flex-col animate-enter-left">
            <div className="flex w-full gap-10 ">
                <div className="flex flex-col gap-2  w-3/5 h-[248px]  ">
                    <img src={`/api/files/?filename=${news?.image !== undefined && news.image !== "" ? news.image : "plc.png"}`}
                        className=" w-full h-5/6       rounded-2xl object-cover " />
                    <Button variant="secondary" className="h-1/6" onClick={() => { relatedRef.current.scrollIntoView() }}><ArrowDown /> Другие новости про это мероприятие</Button>
                </div>
                <div className="w-2/5 h-[248px] ">

                    <EventCard  {...event} />
                </div>
            </div>
            <Separator />
            {
                news?.structure ? (
                    <ReadOnlyYoopta className="w-full justify-start " value={news.structure} />
                ) : (
                    <></>
                )
            }
            <div className="flex flex-col gap-5">

                <Separator />
                <h1>Другие новости про <span className="underline">{event.title}</span></h1>
                <div ref={relatedRef}>
                    <LazyContent<News> query={`/relationships/event-news/event/${event.id}?`} format={(news: News) => news} itemCard={NewsCard} excludeItem={parseInt(id!)} colsClass="grid-cols-1 lg:grid-cols-2" />
                </div>
            </div>

        </div >

    )
}
