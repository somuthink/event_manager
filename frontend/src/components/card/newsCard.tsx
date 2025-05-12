import { axiosInst } from "@/api/axios";
import { Button } from "@/components/ui/button";
import { News } from "@/interfaces";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { TimeBadge } from "./timeBadge";


const goToEvent = async (id: number, navigate: NavigateFunction) => {
    const response = await axiosInst.get<{ id: number }[]>(`/relationships/event-news/news/${id}`)
    navigate(`/events/${response.data[0].id}`)
}

export const FirstNewsCard = ({ title, description, image, id, create_time = new (Date) }: News) => {

    const navigate = useNavigate();

    return (
        <div className="flex flex-row gap-5 justify-center items-center animate-enter-left">
            <div className="flex-[3]">


                <div className="flex w-full border-primary rounded-[30px] border-1 flex-col  gap-2" >

                    <div className={`w-full
            aspect-[calc(16/5)] 
            relative
            overflow-hidden
            z-10
            rounded-[27px]

                     
            flex items-end justify-center p-10
						
            bg-cover
            bg-no-repeat
            bg-center

            before:content-['']
            before:absolute
            before:inset-0
            before:block
            before:bg-gradient-to-b
            before:from-black/0
                    before:to-black/70
            before:z-[-5]
			`} style={{
                            backgroundImage: `url('/api/files/?filename=${encodeURIComponent(image || "plc.png")}')`
                        }}>
                        <a className=" text-white">{description}</a>
                    </div>
                    <h1 className="mx-4 font-black text-xl ">{title} </h1>
                    <div className=" pl-2  pb-2  mb-1">
                        <TimeBadge time={create_time} />
                    </div>
                </div>

            </div>
            <div className="flex-[1] flex gap-2 flex-col items-start">
                <h1 className="text-3xl font-semibold ml-2">Главное <br /> на сегодня</h1>
                <Button className="py-7"
                    onClick={() => { navigate(`/news/${id}`) }}
                >Читать новость</Button>
                <Button variant="outline" className="w-full py-7 border-1 border-primary" onClick={() => { goToEvent(id!, navigate) }}>Перейти на страницу мероприятия</Button>
            </div>
        </div>
    );
}


export const NewsCard = ({ title, description, image, id, create_time = new (Date) }: News) => {

    const navigate = useNavigate()


    return (
        <div className="flex w-full border-primary rounded-[30px] border-1 flex-col  gap-2  animate-enter-up overflow-hidden" >

            <div className="flex flex-row group">
                <img
                    src={`/api/files/?filename=${image !== undefined && image !== "" ? image : "plc.png"}`}
                    className="object-cover max-w-44 aspect-square rounded-[27px] transition-all duration-500 ease-in-out group-hover:-translate-x-3/8 group-hover:scale-90 group-hover:brightness-75 group-hover:blur-sm"
                />

                <div
                    className="flex flex-col  gap-2 absolute left-0  top-0 translate-y-1/2  opacity-0 
                    transition-all duration-500 ease-in-out group-hover:opacity-100 group-hover:translate-x-5/8 "
                >
                    <Button
                        variant="outline"
                        onClick={() => { navigate(`/news/${id}`) }}
                    >
                        подробнее
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => { goToEvent(id!, navigate) }}
                    >
                        мероприятие
                    </Button>
                </div>
                <div className="flex flex-col justify-between items-end w-full p-3">
                    <div className="flex  flex-col w-full overflow-clip  gap-3 transition-all duration-500 ease-in-out group-hover:translate-x-2/10">
                        <h1 className="font-black text-xl ">{title} </h1>
                        <a className="text-muted-foreground">{description}</a>
                    </div>
                    <TimeBadge time={create_time} />
                </div>
            </div>
        </div >
    );
};
