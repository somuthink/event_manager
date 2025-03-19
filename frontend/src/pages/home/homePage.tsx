import { EventCard } from "@/components/card/eventCard";
import { Searchbar } from "@/components/input/searchbar";
export const HomePage = () => {
  return (
    <div className="flex flex-col gap-5">
      <Searchbar />
      <EventCard />
    </div>
  );
};
