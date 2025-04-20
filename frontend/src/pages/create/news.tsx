import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";



export const CreateNewsPage = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col h-full   gap-[10%] ">

            <Button onClick={() => { navigate("/") }}>Создать</Button>
        </div>
    );
}
