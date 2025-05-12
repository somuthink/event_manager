import { Event, Tag } from "@/interfaces";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { TimeBadge } from "./timeBadge";

export const EventCard = ({ title, description, start_time, image, id, tags }: Event) => {

    const navigate = useNavigate();

    return (
        <div className={`flex w-full h-full  border-primary rounded-[30px] border-1 flex-col group overflow-hidden gap-1 animate-enter-up `} >
            <div className="relative w-full  overflow-hidden">
                <div className="transition-all duration-500 ease-in-out group-hover:-translate-y-1/8">
                    <img
                        src={`/api/files/?filename=${image !== undefined && image !== "" ? image : "plc.png"}`}
                        className="w-full aspect-3/2 rounded-[27px] object-cover max-h-40 transition-all duration-500 ease-in-out  group-hover:scale-105 group-hover:brightness-75 group-hover:blur-sm"
                    />
                    <div className="absolute inset-0 flex items-center justify-center p-4  pointer-events-none">
                        <p className="opacity-0 text-white/90 text-center font-normal  transform transition-all  duration-500 ease-in-out group-hover:opacity-100 group-hover:translate-y-0">
                            {description}
                        </p>
                    </div>
                </div>
                <div
                    className="flex flex-row  gap-1 absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full opacity-0 
                    transition-all duration-500 ease-in-out group-hover:opacity-100 group-hover:-translate-y-1/5"
                >
                    <Button
                        variant="outline"
                        onClick={() => { navigate(`/events/${id}`) }}
                    >
                        подробнее
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => { navigate(`/events/${id}`) }}
                    >
                        новости
                    </Button>
                </div>
            </div>
            <h1 className="font-black text-xl pl-4 mb-1 mt-2">{title}</h1>
            <div className="flex flex-row items-center justify-between gap-2 pl-4 pr-5 pb-2  mb-1">
                <TimeBadge time={start_time} badge />
                <a className=" text-xs"> {tags && tags.map((tag: Tag, i) => (
                    <span>{tag.name} {i !== tags.length - 1 && "•"}</span>
                ))}</a>

            </div>
        </div>
    );
};
