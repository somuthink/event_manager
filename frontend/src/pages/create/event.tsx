import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { DatePickerWithRange } from "@/components/input/dateRangePicker"
import { DateRange } from "react-day-picker"
import { addDays } from "date-fns"
import { useState } from "react";
import { YandexMap } from "@/components/ymap/map";
import { YooptaCn } from "@/components/redactor/yopta";
import { Input } from "@/components/ui/input";
import { ComboBox, MultiComboBox } from "@/components/input/combo";
import { MapPin } from "lucide-react";

export const CreateEventPage = () => {
    const navigate = useNavigate();

    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(),
        to: addDays(new Date(), 2),
    })



    return (
        <div className="flex flex-col h-full w-3/5 items-center    gap-[10%] ">


            <div className="flex flex-row gap-2">

                <DatePickerWithRange date={date} setDate={setDate} className="" />
                <Input placeholder="Адрес проведения" className="flex" />
                <MultiComboBox placeholder="Добавить со-организатора" description="Выберите из списка" />
                <MultiComboBox placeholder="Теги" description="Выберите из списка" />

            </div>
            <YooptaCn />




            <Button onClick={() => { navigate("/") }}>Создать</Button>
        </div>
    );
}
