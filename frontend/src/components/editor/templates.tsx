import {
    CommandDialog,
    CommandEmpty,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
  CommandGroup,
} from "@/components/ui/command"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"


import { base } from "@/assets/templates/base"
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

interface TemplateItem {
    name: string
    value: object
}

const HardCode: { [key: string]: TemplateItem } = {
    "base": {
        name: "Базовый",
        value: base
    },
    "minimal": {
        name: "Минимальный",
        value: base
    },
    "gallery": {
        name: "С галереей",
        value: base
    },
    "custom": {
        name: "Мой шаблон эээыыы",
        value: base
    }
}

interface TemplateChooseProps {
    typo: "event" | "news"
    openCommand: boolean
    setOpenCommand: React.Dispatch<React.SetStateAction<boolean>>
}


export const TemplateChoose = ({ typo, openCommand, setOpenCommand }: TemplateChooseProps) => {

    const navigate = useNavigate();

    const [openTemplater, setOpenTemplater] = useState<boolean>(false)
    const [selected, setSelected] = useState<string>("base");

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        HardCode[selected].value.title.value[0].children[0].text = e.target.value;
        console.log(HardCode[selected].value)
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        HardCode[selected].value.description.value[0].children[0].text = e.target.value;
    };

    return (
        <>
            <CommandDialog open={openCommand} onOpenChange={setOpenCommand}>
                <CommandInput placeholder="Поиск по название шаблона..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandSeparator />
 <CommandGroup heading="Шаблоны мерорприятий">
                    {Object.entries(HardCode).map(([key, templateItem]) => (
                        <CommandItem key={key} value={templateItem.name}
                            onSelect={() => {
                                setSelected(key)
                                setOpenCommand(false)
                                setOpenTemplater(true)
                            }}>
                            {templateItem.name}
                        </CommandItem>
                    ))}
 </CommandGroup>
                </CommandList>
            </CommandDialog>

            <Dialog open={openTemplater} onOpenChange={setOpenTemplater} >
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Разметка</DialogTitle>
                        <DialogDescription>
                            Заполните основные поля для выбранного шаблона
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" >
                                Название
                            </Label>
                            <Input
                                id="name"
                                placeholder="Введите название мероприятия"
                                className="col-span-4"
                                onBlur={handleTitleChange}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" >
                                Описание
                            </Label>
                            <Textarea id="description" className="col-span-4 " placeholder="Напишите небольшое описание " onBlur={handleDescriptionChange} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="submit"
                            onClick={() => {
                              navigate(`/create/${typo}/`, {
                                    state: { template: HardCode[selected].value }
                                });
                            }}
                        >
                            Далее
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );

}
