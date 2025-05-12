import { axiosInst } from "@/api/axios";
import { RoleConditional } from "@/components/auth/roleRendering";
import { EventCard } from "@/components/card/eventCard";
import { LazyContent } from "@/components/content/lazyContent";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/authContext";
import { toast } from "@/hooks/use-toast";
import { Event, ToastInfo } from "@/interfaces";
import { parseHttpError } from "@/lib/utils";
import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner';
import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const DashPage = () => {
    const { username, user_id, logout } = useAuth()
    const navigate = useNavigate()
    const [firstEvent, setFirstEvent] = useState<Event>(
        {
            title: '',
            description: '',
            theme: '',
            image: '',
            start_time: new Date(),
            end_time: new Date(),
            address: "",
            tags: [{ name: "string" }],
            structure: {},
        }
    );

    useEffect(() => {
        const fetchEventMemberOf = async () => {
            if (user_id) {

                const response = await axiosInst.get<{ event: Event }[]>(`/relationships/user-event/user/${user_id}?limit=1`)
                setFirstEvent(response.data[0]['event'])
            }
        }
        user_id && fetchEventMemberOf()
    }, [user_id])

    const logoutNav = () => {
        logout()
        navigate("/login")

    }


    const formatEvent = (data: { event: Event }): Event => {

        const event = data['event']

        return ({
            ...event,
            start_time: new Date(event.start_time),
            end_time: new Date(event.end_time),
        })
    }



    const onScan = async (barCodes: IDetectedBarcode[]) => {
        const scanned = JSON.parse(barCodes[0].rawValue)



        let toastInfo: ToastInfo = {
            variant: "default",
            title: "Участник успешно отмечен",
            description: `уникальный идентификатор участника ${scanned.user_id}`,
        };


        try {
            await axiosInst.post("/timepad/", { ...scanned, action: "enter", time: new Date() })
        } catch (err: unknown) {
            toastInfo = parseHttpError(err, "Ошибка в отметке участника", scanned.user_id);
        }

        toast({
            variant: toastInfo.variant,
            title: toastInfo.title,
            description: toastInfo.description,
        });


    }




    return (
        <div className="flex flex-col px-16  py-12 gap-10 w-full items-center ">
            <div className="flex flex-row gap-4 items-center w-full justify-start">
                <h1 className="text-3xl font-black  ">Здравствуйте <span className="text-6xl underline animate-enter-up">{username}</span>✨</h1>
                <Button variant="ghost" className="border-1 border-primary" onClick={logoutNav}>Выйти</Button>
            </div>

            <div className="flex flex-row gap-10 items-end h-full">

                <RoleConditional  >
                    <Card className="m-0 w-2/5 shadow-none border-1 border-primary rounded-[30px] animate-enter-left">
                        <CardHeader>
                            <CardTitle>QR чтобы отметится на <span className="text-xl">{firstEvent.title}</span></CardTitle>
                            <CardDescription>покажите его организатору при входе</CardDescription>
                        </CardHeader>
                        <CardContent className="flex items-center justify-center w-full">
                            <QRCodeSVG size={192} value={`{"user_id" :${user_id},"event_id":${firstEvent.id}}`} />,
                        </CardContent>

                    </Card>

                </RoleConditional  >


                <RoleConditional organizer  >
                    <Card className="m-0 w-2/5 shadow-none border-1 border-primary rounded-[30px] animate-enter-left">
                        <CardHeader>
                            <CardTitle>Скан для отметки на <span className="text-xl">{firstEvent.title}</span></CardTitle>
                            <CardDescription>отсканируйте QR из главной страницы участника</CardDescription>
                        </CardHeader>
                        <CardContent className="flex items-center justify-center w-full">
                            <Scanner onScan={onScan} />
                        </CardContent>

                    </Card>

                </RoleConditional  >
                <div className="flex w-3/5 flex-col h-full  jutify-between gap-4">

                    <h2 className="text-3xl ">Ближайшее мероприятие</h2>
                    <EventCard {...firstEvent} />

                </div>
            </div>
            <div className="w-full flex flex-col gap-4">
                <Separator className="w-full" />
                <h2 className="text-3xl ">Другие грядущие мероприятия</h2>
            </div>

            <div>

                <LazyContent<Event> query={`/relationships/user-event/user/${user_id!}?`} format={formatEvent} itemCard={EventCard} excludeItem={firstEvent.id}></LazyContent>
            </div>




        </div >
    )
}
