import { axiosInst } from "@/api/axios";
import { UploadFile } from "@/api/upload";
import { CreateGroup } from "@/components/editor/group";
import { YooptaCn } from "@/components/editor/yopta";
import { ComboBox, } from "@/components/input/combo";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { News, ToastInfo } from "@/interfaces";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { parseHttpError } from "@/lib/utils";

import { NewsCard } from "@/components/card/newsCard";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/hooks/use-toast";

export const CreateNewsPage = () => {


    const navigate = useNavigate();

    const location = useLocation();
    const template = (location.state as { template: any })?.template;

    const [eventNames, setEventNames] = useState<{ id: number, name: string }[]>([{ name: "загрузка...", id: -1 }])
    const [selectedEventName, setSelectedEventName] = useState<{ id: number, name: string }>()

    const [value, setValue] = useState(template);



    const inputRef = useRef<HTMLInputElement>(null);

    const [bannerPreview, setBannerPreview] = useState<string>("")


    const [newsData, setNewsData] = useState<News>({
        title: '',
        description: '',
        image: '',
        create_time: new Date(),
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

        setNewsData((prev) => ({ ...prev, image: file.name }));
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




    const saveEvent = async () => {


        let newsID: number

        let toastInfo: ToastInfo = {
            variant: "default",
            title: "Новость создана успешно",
            description: newsData.title,
        };

        setNewsData((prev) => ({ ...prev, create_time: new Date() }));

        try {
            const responce = await axiosInst.post<{ id: number }>("/news/", newsData);
            newsID = responce.data.id
        } catch (err: unknown) {
            toastInfo = parseHttpError(err, "Ошибка в создании мероприятия", newsData.title);
            return
        }

        toast({
            ...toastInfo,
            action: <ToastAction altText="Создать еще одно">Создать еще одно</ToastAction>,
        });

        toastInfo = {
            variant: "default",
            title: "Новость приявзяна к мероприятию",
            description: `${newsData.title} -> ${selectedEventName?.name}`,
        };

        try {
            await axiosInst.post(`/relationships/event-news?news_id=${newsID}&event_id=${selectedEventName!.id}`);
        } catch (err: unknown) {
            toastInfo = parseHttpError(err, "Ошибка в привзяке мероприятию", newsData.title);
        }

        toast({
            ...toastInfo,
            action: <ToastAction altText="Создать еще одно">Создать еще одно</ToastAction>,
        });

        navigate("/news");
    };

    useEffect(() => {
        setNewsData((prev: Object) => ({ ...prev, title: value.title.value[0].children[0].text, description: value.description.value[0].children[0].text, structure: value }));
    }
        , [value]
    )

    const onEventInput = async (input: string) => {

        try {
            const events = await axiosInst.get<{ id: number, title: string }[]>(`/events/?q=${input}`)
            if (events.data) {
                setEventNames(events.data.map(event => ({ id: event.id, name: event.title })))
            }
        } catch {
        }
    }

    useEffect(() => { onEventInput("") }, [])






    return (
        <div className="flex flex-col  w-4/5 items-center  gap-5 ">

            <div className="pattern-dots pattern-gray-500 pattern-bg-white 
  pattern-size-6 pattern-opacity-10 w-full h-full fixed inset-0 z-[-100] "></div>

            <CreateGroup name="мета-данные">

                <div className="flex flex-row gap-4 w-full  ">
                    <ComboBox data={eventNames!} value={selectedEventName!} setValue={setSelectedEventName} placeholder="Мероприятия" description="Выберите из списка" onInputChange={onEventInput} />

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
            </CreateGroup>

            <CreateGroup name="предпросмотр карточки" >
                <div className="w-2/3 p-4 gap-2     ">
                    <NewsCard {...newsData} />
                </div>
            </CreateGroup>

            <CreateGroup name="редактор страницы мерорприятия">
                <YooptaCn value={value} setValue={setValue} />
            </CreateGroup>




            <Button onClick={saveEvent}>Создать</Button>
        </div>
    );
}
