import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { DatePickerWithRange } from "@/components/input/dateRangePicker"
import { DateRange } from "react-day-picker"
import { addDays } from "date-fns"
import { useState } from "react";
import { YandexMap } from "@/components/ymap/map";
import { YooptaCn } from "@/components/editor/yopta";
import { Input } from "@/components/ui/input";
import { MultiComboBox } from "@/components/input/combo";
import { Combo, Event } from "@/interfaces/interfaces"
import { CreateGroup } from "@/components/editor/group";
import { EventCard } from "@/components/card/eventCard";
import { Description } from "@radix-ui/react-toast";
import { ThemeContext } from "ymap3-components";


export const CreateEventPage = () => {
    const navigate = useNavigate();

    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(),
        to: addDays(new Date(), 2),
    })

    const orgs: Combo[] = [
        { value: 'Константин Мелекесов', label: 'Константин Мелекесов' },
    ];


    const tags: Combo[] = [
        { value: 'ДМ', label: 'Дворец Молодежи' },
        { value: 'IT куб', label: 'IT куб' },
    ];

    const event: Event = { title: "Это баннер мероприятия", description: "выберите квадратное изображание которое будет использованно на  карточке и главной странице мероприятия", theme: "" }


    return (
        <div className="flex flex-col h-full w-full items-center    gap-10 ">


            <CreateGroup name="мета-данные">

                <div className="flex flex-row gap-2">


                    <DatePickerWithRange date={date} setDate={setDate} className="" />
                    <Input placeholder="Адрес проведения" className="flex" />
                    <MultiComboBox data={orgs} placeholder="Добавить со-организатора" description="Выберите из списка" />
                    <MultiComboBox data={tags} placeholder="Теги" description="Выберите из списка" />

                </div>

            </CreateGroup>

            <CreateGroup name="загрузка баннера мероприятия">
                <div className="w-full flex flex-row gap-16">

                    <div className=" h-full flex-[1] aspect-square border-[0.5px] border-dashed border-accent-foreground  rounded-lg flex flex-col gap-4  p-6 items-center">
                        <span className="text-sm font-medium text-gray-500">Перетащите или нажмите для загрузки баннера</span>
                        <span className="text-xs text-gray-500">JPG или PNG с соотношением сторон 1:1</span>
                    </div>
                    <EventCard event={event} />
                </div>
            </CreateGroup>

            <CreateGroup name="редактор страницы мерорприятия">
                <YooptaCn />
            </CreateGroup>




            <Button onClick={() => { navigate("/") }}>Создать</Button>
        </div>
    );
}
