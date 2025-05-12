import { axiosInst } from "@/api/axios";
import { NewsCard } from "@/components/card/newsCard";
import { LazyContent } from "@/components/content/lazyContent";
import { ReadOnlyYoopta } from "@/components/editor/yopta";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/authContext";
import { toast } from "@/hooks/use-toast";
import { Event, News, ToastInfo } from "@/interfaces";
import { parseHttpError } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const EventPage = () => {

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY && currentScrollY > 100 && !isCollapsed) {
                setIsCollapsed(true);
            }
            else if ((currentScrollY < lastScrollY || currentScrollY <= 100) && isCollapsed) {
                setIsCollapsed(false);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY, isCollapsed]);


    const { id } = useParams<{ id: string }>();
    const { user_id } = useAuth();
    const [event, setEvent] = useState<Event>()

    useEffect(() => {

        const fetchEvent = async () => {
            try {
                const response = await axiosInst.get<Event>(`events/${id}`)
                response.data.start_time = new Date(response.data.start_time),
                    response.data.end_time = new Date(response.data.end_time),
                    setEvent(response.data)
                console.log(response.data)
            } catch (error) {
                console.error("Failed to fetch event:", error)
            } finally {
            }
        }

        fetchEvent()
    }, [id])

    const connectUserEvent = async () => {

        let toastInfo: ToastInfo = {
            variant: "default",
            title: "Вы успешно записались на мероприятие",
            description: event!.title,
        };

        try {
            await axiosInst.post(`/relationships/user-event?user_id=${user_id}&event_id=${id}`, {})
                ;
        } catch (err: unknown) {
            toastInfo = parseHttpError(err, "Ошибка в записи на мероприятие", event!.title);
        }

        toast({
            variant: toastInfo.variant,
            title: toastInfo.title,
            description: toastInfo.description,
        });

    }


    return (
        <div className="w-full flex flex-col px-10 gap-10 items-center">

            <div className={`fixed z-[100] bottom-10 left-10 w-1/3 shadow-xl bg-primary rounded-[30px] flex flex-row p-[2px] items-center group transition-all duration-500 ease-in-out ${isCollapsed ? 'w-[60px]' : ''
                }`}>
                <div className={`${isCollapsed ? 'flex-[1]' : 'flex-[1] group-hover:flex-[3]'
                    } bg-primary-foreground rounded-[27px] py-5 flex items-center justify-center transition-all duration-500 ease-in-out`}>
                    <ArrowRight
                        size={24}
                        className="bg-primary-foreground rounded-[27px]"
                        strokeWidth={1}
                    />
                </div>
                <Button
                    className={`flex-[6] h-full  text-primary bg-primary-foreground rounded-[27px] text-2xl py-4 px-2 group-hover:underline transition-all duration-500 ease-in-out hover:bg-primary-foreground truncate ${isCollapsed ? 'hidden ' : ""}'`}
                    onClick={connectUserEvent}
                >
                    Записаться
                </Button>
            </div>
            <div className="w-full flex flex-row  gap-10 ">

                <div className="flex flex-[2] w-full gap-10 flex-col animate-enter-left">
                    {event && (
                        <ReadOnlyYoopta className="w-full justify-start " value={event.structure} />
                    )
                    }

                </div>
                <div className="flex flex-col flex-[1] w-full gap-2 animate-enter-up" >
                    <img src={`/api/files/?filename=${event?.image !== undefined && event.image !== "" ? event.image : "plc.png"}`}
                        className="w-full aspect-video rounded-2xl" />
                    <div className="bg-primary w-full flex  rounded-2xl  p-0.5 gap-0.5 flex-col items-center">
                        <a className="text-accent">Теги</a>
                        <div className="w-full flex  gap-0.5">
                            {event?.tags.map((el, i) => {
                                return (
                                    <div
                                        key={i}
                                        className={"w-full p-2 text-center items-center justify-center bg-[#97FFA5] rounded-[15px]"}
                                    >
                                        {el.name}
                                    </div>
                                );
                            })}
                        </div>
                    </div>



                    <div className="bg-primary w-full flex  rounded-2xl  p-0.5 gap-0.5 flex-col items-center">
                        <a className="text-accent">Даты проведения</a>
                        <div className="w-full flex  gap-0.5 justify-center items-center">
                            <div className="flex w-full flex-col items-center justify-center h-32 bg-primary-foreground rounded-[15px]">
                                <a className="text-xl">
                                    {`${event?.start_time.getHours()}:${event?.start_time.getMinutes()}`}
                                </a>
                                <a>
                                    {event?.start_time.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
                                </a>
                            </div>
                            <a className="text-accent text-xl mx-1">{">"}</a>

                            <div className="flex w-full flex-col items-center justify-center h-32 bg-primary-foreground rounded-[15px]">
                                <a className="text-xl">
                                    {`${event?.end_time.getHours()}:${event?.end_time.getMinutes()}`}
                                </a>
                                <a>
                                    {event?.end_time.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
                                </a>
                            </div>
                        </div>
                    </div>


                    <div className="bg-primary w-full flex  rounded-2xl  p-0.5 gap-0.5 flex-col items-center">
                        <a className="text-accent">Адрес Проведения</a>
                        <div className="w-full flex  gap-0.5 justify-center items-center overflow-hidden">
                            <iframe src="https://yandex.ru/map-widget/v1/?um=constructor%3A637969783107e0234bdf50795ada0323d87d9bb049a5eafa0c4c1967ff1761cb&amp;source=constructor" width="100%" height="279" ></iframe>
                        </div>
                    </div>

                </div>


            </div>

            <div className="flex item-start w-full">



            </div>
            <div className="flex flex-col gap-5 w-full jusitfy-start">
                <Separator />
                <h1>Связанные новости </h1>
                <div >
                    <LazyContent<News> query={`/relationships/event-news/event/${event?.id}?`} format={(news: News) => news} itemCard={NewsCard} colsClass="grid-cols-1 lg:grid-cols-2" />
                </div>
            </div>
        </div >

    )
}

