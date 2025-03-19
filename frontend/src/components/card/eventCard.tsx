import placholder from "@/assets/placeholder.png";

export const EventCard = () => {
  return (
    <div className="flex border-primary rounded-[30px] border-1 flex-row  gap-3">
      <div className="flex  flex-col">
        <img
          src={placholder}
          className=" max-h-50 max-w-50 aspect-square rounded-[27px]"
        />
        <a className="font-normal mx-4 my-2">Сегодня 15:40•IT</a>
      </div>

      <div className="flex  flex-col overflow-clip p-3 gap-3">
        <h1 className="font-black text-xl ">Мероприятие для любителей </h1>
        <a className="text-muted-foreground">
          Вскоре состоится AI Спринт — захватывающее IT-мероприятие, посвящённое
          искусственному интеллекту и его возможностям. В программе —
          увлекательные сессии, лекции и мастер-классы, где участники смогут
          узнать о последних достижениях в области ИИ, его применении в разных
          сферах и перспективах развития технологий.
        </a>
      </div>
    </div>
  );
};
