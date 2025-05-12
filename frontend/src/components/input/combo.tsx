"use client"

import { Check, ChevronsUpDown } from "lucide-react"
import * as React from "react"

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
import { cn } from "@/lib/utils"



interface BaseComboBoxProps<T> {
    placeholder: string
    description: string
    data: T[]
    onInputChange?: (e: string) => void
}

interface ComboBoxProps<T> extends BaseComboBoxProps<T> {
    value: T | null
    setValue: React.Dispatch<React.SetStateAction<T>>
}

interface MultiComboBoxProps<T> extends BaseComboBoxProps<T> {
    values: T[]
    setValues: React.Dispatch<React.SetStateAction<T[]>>
}



export function ComboBox<T extends { name: string }>({ placeholder, description, data, value, setValue, onInputChange }: ComboBoxProps<T>) {
    const [open, setOpen] = React.useState(false)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={`w-full justify-between text-left font-normal border px-5 ${!value && "text-muted-foreground"}`}
                >
                    {value ? value.name : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-xl p-0">
                <Command>
                    <CommandInput placeholder={description} onValueChange={onInputChange} />
                    <CommandList>
                        <CommandEmpty>No item found.</CommandEmpty>
                        <CommandGroup>
                            {data.map((item) => (
                                <CommandItem
                                    key={item.name}
                                    value={item.name}
                                    onSelect={() => {
                                        setValue(item)
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value?.name === item.name ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {item.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}


export function MultiComboBox<T extends { name: string }>({ data, placeholder, description, values, setValues, onInputChange }: MultiComboBoxProps<T>) {
    const [open, setOpen] = React.useState(false)

    const toggleValue = (item: T) => {
        setValues((prev: T[]) => {
            if (prev.some(v => v.name === item.name)) {
                return prev.filter(v => v.name !== item.name)
            } else {
                return [...prev, item]
            }
        })
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={`w-full justify-between  font-normal border px-5 ${!values.length && "text-muted-foreground"}`}
                >
                    <div className="w-full justify-center">
                        {values.length
                            ? `${values[0].name}${values.length > 1 ? "..." : ""}`
                            : placeholder}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-xl p-0">
                <Command>
                    <CommandInput placeholder={description} onValueChange={onInputChange} />
                    <CommandList>
                        <CommandEmpty>No item found.</CommandEmpty>
                        <CommandGroup>
                            {data.map((item) => (
                                <CommandItem
                                    key={item.name}
                                    value={item.name}
                                    onSelect={() => toggleValue(item)}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            values.some(v => v.name === item.name) ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {item.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

