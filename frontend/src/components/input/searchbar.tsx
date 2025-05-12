import debounce from "lodash.debounce";
import { Clock, Plus, Search, UsersRound } from "lucide-react";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { RoleConditional } from "../auth/roleRendering";
import { TemplateChoose } from "../editor/templates";
import { Button } from "../ui/button";

const DEBOUNCE_TIME_MS = 300;

type ContentType = "event" | "news";

interface ContentConfig {
    endpoint: string;
    label: string;
}

const CONTENT_CONFIG: Record<ContentType, ContentConfig> = {
    event: {
        endpoint: "/events",
        label: "Событий",
    },
    news: {
        endpoint: "/news",
        label: "Новостей",
    },
};



const CreateBtn = ({ typo }: { typo: "event" | "news" }) => {

    const [openCommand, setOpenCommand] = useState<boolean>(false)

    return (
        <RoleConditional organizer >
            <Button className="h-full  bg-primary-foreground shadow-none" variant="outline" onClick={() => { setOpenCommand(true) }}>
                <Plus strokeWidth={1} size={20} />
            </Button>
            <TemplateChoose typo={typo} openCommand={openCommand} setOpenCommand={setOpenCommand} />
        </RoleConditional>
    );
}

interface SearchBarProps<T extends ContentType> {
    typo: T;
    setQuery: Dispatch<SetStateAction<string>>;
}

export const SearchBar = <T extends ContentType>({ typo, setQuery }: SearchBarProps<T>) => {

    const onChange = useMemo(
        () =>
            debounce((e: React.ChangeEvent<HTMLInputElement>) => {
                setQuery(`${CONTENT_CONFIG[typo].endpoint}/?q=${e.target.value}&`);
            }, DEBOUNCE_TIME_MS),
        []
    );

    return (


        <div className="  w-[95%] bg-primary rounded-[30px]  flex flex-row  gap-[1px] p-[1px] transition-all delay-100 duration-500 focus-within:scale-x-95 ease-in-out">
            <div className="flex-[8]  transition-all bg-background rounded-[27px] flex flex-row gap-2 px-4 py-2 justify-center items-center">
                <Search strokeWidth={1} className="scale-x-[-1]" size={15} />
                <input
                    className="w-full pl-2 outline-none"
                    placeholder={`Поиск  ${CONTENT_CONFIG[typo].label}...`}
                    onChange={onChange}
                />
            </div>

            <div className="flex-[1]   flex flex-row  gap-1  justify-center items-center">
                <div className="flex rounded-[27px]  bg-primary-foreground flex-row gap-2 p-2 justify-center items-center">
                    <Clock strokeWidth={1} size={20} />
                    <div className="w-px h-full bg-primary" />
                    <a className="font-thin">А...Я</a>
                    <div className="w-px h-full bg-primary" />
                    <UsersRound strokeWidth={1} size={20} />
                </div>
                <CreateBtn typo={typo} />
            </div>
        </div>
    );
};
