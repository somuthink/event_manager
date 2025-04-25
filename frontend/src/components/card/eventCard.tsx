import { Event } from "@/interfaces/interfaces";
import placholder from "@/assets/placeholder.png";

export const EventCard = ({ event }: { event: Event }) => {
    return (
        <div className="flex border-primary rounded-[30px] border-1 flex-row  gap-2">
            <div className="flex  flex-col">
                <img
                    src={placholder}
                    className=" max-w-40 aspect-square rounded-[27px]"
                />
                <a className="font-normal mx-4 my-2">Сегодня 15:40•IT</a>
            </div>

            <div className="flex  flex-col overflow-clip p-3 gap-3">
                <h1 className="font-black text-xl ">{event.title} </h1>
                <a className="text-muted-foreground">{event.description}</a>
            </div>
        </div>
    );
};
