
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { zodResolver } from "@hookform/resolvers/zod";

import { format, formatISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/hooks/use-toast";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

const FormSchema = z.object({
    username: z.string()
        .min(2, { message: "Юзеренйм  должен состоять минимум из 2-ух символов.", }),
    password: z
        .string()
        .min(4, {
            message: "Пароль должен состоять минимум из 4-ех символов.",
        }),
    email: z
        .string()
        .min(1, { message: "Поле должно быть заполненно" })
        .email("Введите корректную почту"),
    birthday: z
        .string()
        .date(),
    name: z.string()
        .min(2, { message: "Имя должно состоять минимум из 2-ух символов.", }),
    surname: z.string()
        .min(2, { message: "Фамилия должна состоять минимум из 2-ух символов.", }),
    patrynomic: z.string()
        .min(2, { message: "Отчество должно состоять минимум из 2-ух символов.", }).optional(),
});

import { useAuth } from "@/contexts/authContext";
import { Separator } from "@radix-ui/react-separator";

export const RegisterPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    });

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        try {
            const res_reg = await axios.post("api/users/", data, {
            });

            const res_log = await axios.post("api/token", {
                username: data.username, password: data.password
            },
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                },
            )

            var msg = "";
            if (res_reg.status == 200 && res_log.status === 200) {
                msg = "Вы успешно зарегистировали и вошли в аккаунт.";
            }
            toast({
                title: "Успешно!",
                description: msg,
            });

            login(res_log.data.access_token, res_log.data.refresh_token);
            navigate("/");
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Что-то пошло не так",
                description:
                    "Дополнительно проверьте введенные данные или попробуйте еще раз.",
                action: (
                    <ToastAction altText="Попробовать еще">Попробовать еще</ToastAction>
                ),
            });
            console.error("Login failed", error);
        }
    };

    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="lg:w-1/2 w-full  flex items-center justify-center">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="w-2/3 space-y-6"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Имя</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="введите ваше имя"
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />


                        <FormField
                            control={form.control}
                            name="surname"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Фамилия</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="введите вашу фамилию"
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />


                        <FormField
                            control={form.control}
                            name="patrynomic"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Отчество</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="введите ваше отчество (при наличии)"
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <Separator />


                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Юзернейм</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="username"
                                            placeholder="придумайте юзернейм"
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />


                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Электронная почта</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            autoComplete="email"
                                            placeholder="ваш @ email"
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Пароль</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            autoComplete="new-password"
                                            placeholder="придумайте пароль от 6-ти символов"
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />



                        <FormField
                            control={form.control}
                            name="birthday"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Дата рождения</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        " justify-start text-left font-normal border w-full px-5",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PPP")
                                                    ) : (
                                                        <span>Нажмие чтобы выбрать</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={(date) => {
                                                    if (date) {
                                                        field.onChange(formatISO(date, { representation: 'date' }));
                                                    }
                                                }}
                                                disabled={(date) =>
                                                    date > new Date() || date < new Date("1900-01-01")
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </FormItem>
                            )}
                        />

                        <Button type="submit">Подтвердить</Button>
                    </form>
                </Form>
            </div>
        </div>
    );
};
