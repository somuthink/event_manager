
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const CreateRoute = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col h-full items-center justify-center gap-10">
            <a>Выберите что хотите создать</a>
            <div className="flex  items-center justify-center gap-[10%] ">
                <Button onClick={() => { navigate("news", { relative: "path" }); }}>Новость</Button>
                <Button onClick={() => { navigate("event", { relative: "path" }); }}>Мероприятие</Button>
            </div>
        </div>
    );
}
