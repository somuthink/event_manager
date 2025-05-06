import { axiosInst } from "@/api/axios";
import { ReadOnlyYoopta } from "@/components/editor/yopta";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Event } from "@/interfaces/interfaces"

export const EventPage = () => {

    const { id } = useParams<{ id: string }>();
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


    return (
        <div className="w-full flex flex-row px-10">

            <div className="flex flex-[2] w-full gap-10 flex-col">
                {event ? (
                    <ReadOnlyYoopta className="w-full justify-start " value={event!.structure} />
                ) : (
                    <></>
                )}
            </div>
            <div className="flex flex-col flex-[1] w-full gap-2">
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

    )
}

