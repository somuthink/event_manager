export const TimeBadge = ({ time, badge }: { time: Date, badge?: Boolean }) => {
    const date = time instanceof Date ? time : new Date(time);

    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    const dayMonth = date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return (
        <div className="flex flex-row items-center gap-2">
            <div className={`${badge && "bg-[#97FFA5]"} text-black font-normal text-xs  px-2.5 py-0.5 rounded-full`}>
                {isToday ? 'Сегодня' : dayMonth}
            </div>
            <a className={`font-normal ${badge ? "mb-0.5" : "text-xs"}`}>{`${hours}:${minutes}`}</a>
        </div>
    );
};
