import { EventCard } from "@/components/card/eventCard";
import { Searchbar } from "@/components/input/searchbar";
export const HomePage = () => {
  return (
    <div className="flex flex-col gap-5">
      <Searchbar />
      <div className="w-full grid grid-cols-2 gap-5">
        {[...Array(5)].map((_, index) => (
          <EventCard key={index} />
        ))}
      </div>
    </div>
  );
};
