import { Search, Clock, UsersRound } from "lucide-react";
export const Searchbar = () => {
  return (
    <div className="w-full bg-primary rounded-[30px] flex flex-row gap-2 p-[2px]">
      <div className="flex-[8] bg-primary-foreground rounded-[27px] flex flex-row gap-2 px-4 py-2 justify-center items-center">
        <Search strokeWidth={1} className="scale-x-[-1]" size={15} />
        <input className="w-full" placeholder="поиск..." />
      </div>

      <div className="flex-1 bg-primary-foreground rounded-[27px] flex flex-row gap-2 p-2 justify-center items-center">
        <Clock strokeWidth={1} size={20} />
        <div className="w-px h-full bg-primary" />
        <a className="font-thin"> А...Я</a>
        <div className="w-px h-full bg-primary" />
        <UsersRound strokeWidth={1} size={20} />
      </div>
    </div>
  );
};
