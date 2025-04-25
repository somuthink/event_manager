"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { Combo } from "@/interfaces/interfaces"


interface ComboBoxProps {
    placeholder: string
    description: string
    data: Combo[]

}

export function ComboBox({ placeholder, description, data }: ComboBoxProps) {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={`w-full justify-between text-left font-normal border  px-5 ${!value && "text-muted-foreground"}`}
                >
                    {value
                        ? initVals.find((frame) => frame.value === value)?.label
                        : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-xl p-0">
                <Command>
                    <CommandInput placeholder={description} />
                    <CommandList>
                        <CommandEmpty>No framework found.</CommandEmpty>
                        <CommandGroup>
                            {data.map((frame) => (
                                <CommandItem
                                    key={frame.value}
                                    value={frame.value}
                                    onSelect={(currentValue) => {
                                        setValue(currentValue === value ? "" : currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === frame.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {frame.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}


export function MultiComboBox({ data, placeholder, description }: ComboBoxProps) {
    const [open, setOpen] = React.useState(false)
    const [values, setValues] = React.useState<string[]>()

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={`w-full justify-between text-left font-normal border px-5 ${!values?.length && "text-muted-foreground"}`}
                >
                    {values?.length
                        ? `${values[0]}${values.length > 1 ? "..." : ""}`
                        : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-xl p-0">
                <Command>
                    <CommandInput placeholder={description} />
                    <CommandList>
                        <CommandEmpty>No framework found.</CommandEmpty>
                        <CommandGroup>
                            {data.map((frame) => (
                                <CommandItem
                                    key={frame.value}
                                    value={frame.value}
                                    onSelect={(currentValue) => {
                                        setValues((prevValues: string[] | undefined) => {
                                            if (!prevValues) {
                                                return [currentValue];
                                            }
                                            return prevValues.includes(currentValue)
                                                ? prevValues.filter(item => item !== currentValue)
                                                : [...prevValues, currentValue];
                                        });
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            values?.includes(frame.value) ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {frame.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

