import { Event } from "@/interfaces/interfaces";
import placholder from "@/assets/placeholder.png";
import { Badge } from "../ui/badge";

export const EventCard = ({ event }: { event: Event }) => {
    return (
        <div className="flex border-primary rounded-[30px] border-1 flex-col  gap-2">

            <div className="flex flex-row">
                <img
                    src={placholder}
                    className=" max-w-40 aspect-square rounded-[27px]"
                />
                <div className="flex  flex-col overflow-clip p-3 gap-3">
                    <h1 className="font-black text-xl ">{event.title} </h1>
                    <a className="text-muted-foreground">{event.description}</a>
                </div>
            </div>



            <div className="flex flex-row items-center justify-between gap-2 pl-4 pr-6 pb-2  mb-1">
                <div className="flex flex-row items-center gap-2">
                    <div className="bg-[#97FFA5] text-black font-normal text-xs px-2.5 py-0.5  rounded-full">Сегодня</div>
                    <a className="font-normal mb-0.5">15:40</a>
                </div>

                <a className="mb-0.5 text-xs">ДМ • Айти</a>

            </div>
        </div>
    );
};
