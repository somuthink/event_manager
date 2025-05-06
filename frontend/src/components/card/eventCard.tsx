import { Event, Tag } from "@/interfaces/interfaces";
import { useNavigate } from "react-router-dom";

export const EventCard = ({ event }: { event: Event }) => {

  const navigate = useNavigate();

    const today = new Date();

  var isToday : boolean = false
  var dayMonth : string = ""
  if (event.start_time  instanceof Date  ) {
     isToday = event.start_time.toDateString() === today.toDateString();

     dayMonth = event.start_time.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
}

    return (
      <div className="flex border-primary rounded-[30px] border-1 flex-col  gap-2" onClick={() => {navigate(`/events/${event.id}`)}}>

            <div className="flex flex-row">
                <img
                    src={`/api/files/?filename=${event.image !== undefined && event.image !== "" ? event.image : "plc.png"}`}
                    className=" max-w-40 aspect-square rounded-[27px]"
                />
                <div className="flex  flex-col overflow-clip p-3 gap-3">
                    <h1 className="font-black text-xl ">{event.title} </h1>
                    <a className="text-muted-foreground">{event.description}</a>
                </div>
            </div>



            <div className="flex flex-row items-center justify-between gap-2 pl-4 pr-6 pb-2  mb-1">
                <div className="flex flex-row items-center gap-2">
                    <div className="bg-[#97FFA5] text-black font-normal text-xs px-2.5 py-0.5  rounded-full">{isToday ? 'Сегодня' : dayMonth}</div>
                  <a className="font-normal mb-0.5">{`${event.start_time.getHours()}:${event.start_time.getMinutes()}`}</a>
                </div>
              <a className="mb-0.5 text-xs"> {event.tags.map((tag: Tag, i )  => (
                <span>{tag.name} {i !== event.tags.length - 1 ? "•" : ""  }</span>
              ) )}</a>

            </div>
        </div>
    );
};
