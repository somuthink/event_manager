import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { DatePickerWithRange } from "@/components/input/dateRangePicker"
import { DateRange } from "react-day-picker"
import { addDays } from "date-fns"
import { useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton"
import { YandexMap } from "@/components/ymap/map";
import { YooptaCn } from "@/components/editor/yopta";
import { Input } from "@/components/ui/input";
import { MultiComboBox } from "@/components/input/combo";
import { Combo, Event, Tag } from "@/interfaces/interfaces"
import { CreateGroup } from "@/components/editor/group";
import { EventCard } from "@/components/card/eventCard";
import { axiosInst } from "@/api/axios";
import { UploadFile } from "@/api/upload";

import placeholder from "@/assets/placeholder.png"


export const CreateEventPage = () => {
    const navigate = useNavigate();

    const location = useLocation();
    const template = (location.state as { template: any })?.template;


    const [value, setValue] = useState(template);

    const [tags, setTags] = useState<Tag[]>([])

    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

    const inputRef = useRef<HTMLInputElement>(null);


    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(),
        to: addDays(new Date(), 2),
    })


    // const tags: Combo[] = [
    //     { value: 'ДМ', label: 'Дворец Молодежи' },
    //     { value: 'IT куб', label: 'IT куб' },
    // ];

    const [bannerPreview, setBannerPreview] = useState<string>("")


    const [eventData, setEventData] = useState<Event>({
        title: '',
        description: '',
        theme: '',
        image: '',
        start_time: new Date(),
        end_time: addDays(new Date(), 2),
        address: "",
        tags: [{ name: "string" }],
        structure: value,
    });



    const handleUpload = async () => {
        const file = inputRef?.current?.files?.[0];
        if (!file) {
            alert("No file selected!");
            return;
        }

        try {
            UploadFile(file)
        } catch (error) {
            console.error("Error uploading file:", error);
            return;
        }

        setEventData((prev) => ({ ...prev, image: file.name }));
        setBannerPreview("")


    };


    const handlePreview = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setBannerPreview(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const SaveEvent = () => {

        axiosInst.post("/events/", eventData)
        navigate("/events")


    }

    useEffect(() => {
      setEventData((prev) => ({ ...prev, title: value.title.value[0].children[0].text, description: value.description.value[0].children[0].text , structure: value}));
    }
        , [value]
    )

    useEffect(() => {
        if (date?.from && date?.to) {
            setEventData((prev) => ({
                ...prev,
                start_time: date.from,
                end_time: date.to,
            }));
        }
    }, [date]);

    useEffect(() => {
        setEventData((prev) => ({
            ...prev,
            tags: selectedTags
        }));
    }, [selectedTags])

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await axiosInst.get<Tag[]>("tags/")
                setTags(response.data)
            } catch (error) {
                console.error("Failed to fetch tags:", error)
            } finally {
            }
        }

        fetchTags()
    }, [])


    return (
        <div className="flex flex-col  w-4/5 items-center    gap-5  ">


            <CreateGroup name="мета-данные">

                <div className="flex flex-row gap-4 w-full">


                    <DatePickerWithRange date={date} setDate={setDate} className="w-full" />
                    <Input placeholder="Адрес проведения" className="w-full" onBlur={(e) => {
                        setEventData((prev) => ({
                            ...prev,
                            address: e.target.value
                        }));
                    }} />
                    <MultiComboBox data={tags} values={selectedTags} setValues={setSelectedTags} placeholder="Теги" description="Выберите из списка" />

                </div>

            </CreateGroup>

            <CreateGroup name="загрузка баннера мероприятия">
                <div className="w-full flex flex-row gap-4 h-32 justify-center ">
                    <div className="flex w-full  flex-col flex-[1] gap-2">
                        <div
                            onClick={() => { inputRef.current?.click() }}
                            className=" h-full    
                            cursor-pointer flex items-center justify-center
                            rounded-lg
                              border-1 border-accent-foreground border-dashed"
                        >
                            Загрузить jpg/png
                        </div>
                        <input
                            id="picture"
                            type="file"
                            onChange={handlePreview}
                            ref={inputRef}
                            className="hidden"
                            accept="image/*"
                        />
                        <Button onClick={handleUpload} variant="secondary">Сохранить</Button>
                    </div>
                    <div className="flex-[4] flex flex-row gap-3 items-center w-full ">
                        {bannerPreview === "" ?
                            <div className="w-full flex flex-row gap-1">
                                <Skeleton className="h-32 aspect-square rounded-lg" />
                                <Skeleton className="h-32 aspect-video rounded-lg" /> </div> :

                            <div className="w-full flex flex-row gap-1">
                                <img src={bannerPreview} className="h-32 aspect-square rounded-lg" />
                                <img src={bannerPreview} className="h-32 aspect-video rounded-lg" />
                            </div>
                        }
                        <a className="w-full text-accent-foreground/70 opacity-0 lg:opacity-100 ">в качествей баннера лучше используйте фото, изображения без текста</a>
                    </div>
                </div>
            </CreateGroup >

            <CreateGroup name="предпросмотр карточки" >
                <div className="w-2/3 p-4   ">

                    <EventCard event={eventData} />

                </div>
            </CreateGroup>

            <CreateGroup name="редактор страницы мерорприятия">
                <YooptaCn value={value} setValue={setValue} />
            </CreateGroup>




            <Button onClick={SaveEvent}>Создать</Button>
        </div >
    );
}
