import { Search, Clock, UsersRound, Plus } from "lucide-react";
import { OrgOnly } from "../auth/roleRendering";
import { Button } from "../ui/button";
import { useState } from "react";
import { TemplateChoose } from "../editor/templates";


const CreateBtn = ({typo}: { typo: "event" | "news" }) => {

  const [openCommand, setOpenCommand] = useState<boolean>(false)


    return (
        <OrgOnly>
          <Button className="h-full  bg-primary-foreground shadow-none" variant="outline" onClick={() => { setOpenCommand(true) }}>
                <Plus strokeWidth={1} size={20} />
            </Button>
          <TemplateChoose typo={typo} openCommand={openCommand} setOpenCommand={setOpenCommand}/>
        </OrgOnly>
    );
}

interface SearchBarProps {
    typo: "event" | "news"
}

export const SearchBar = ({ typo }: SearchBarProps) => {
    return (
        <div className="w-full bg-primary rounded-[30px] focus-within:w-9/10 flex flex-row gap-2 p-[2px] transition-all delay-100 duration-500 ease-in-out">
            <div className="flex-[8]  transition-all bg-primary-foreground rounded-[27px] flex flex-row gap-2 px-4 py-2 justify-center items-center">
                <Search strokeWidth={1} className="scale-x-[-1]" size={15} />
                <input className="w-full pl-2 outline-none" placeholder="поиск..." />
            </div>

            <div className="flex-[1]   flex flex-row  gap-1  justify-center items-center">
                <div className="flex rounded-[27px]  bg-primary-foreground flex-row gap-2 p-2 justify-center items-center">
                    <Clock strokeWidth={1} size={20} />
                    <div className="w-px h-full bg-primary" />
                    <a className="font-thin"> А...Я</a>
                    <div className="w-px h-full bg-primary" />
                    <UsersRound strokeWidth={1} size={20} />

                </div>
                <CreateBtn typo={typo} />
            </div>
        </div>
    );
};
