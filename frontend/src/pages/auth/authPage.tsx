"use client";

import axios from "axios";
import { useNavigate } from "react-router-dom";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const FormSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    password: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
});

import { useAuth } from "@/contexts/authContext";

export const AuthPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    });

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        try {
            const res_reg = await axios.post(
                "http://localhost:3000/api/auth/register",
                data,
            );

            const res_log = await axios.post(
                "http://localhost:3000/api/auth/login",
                data,
            );

            var msg = "";

            if (res_reg.status == 201) {
                msg = "Вы успешно зарегистрировались и вошли в аккаунт.";
            } else if (res_reg.status == 200) {
                msg = "Вы успешно вошли в аккаунт.";
            }
            toast({
                title: "Успешно!",
                description: msg,
            });

            login(res_log.data.token);
            navigate("/");
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Что-то пошло не так",
                description:
                    "Дополнительно проверьте введенные данные или попробуйте еще раз.",
                action: (
                    <ToastAction altText="Попробовать еще">
                        Попробовать еще
                    </ToastAction>
                ),
            });
            console.error("Login failed", error);
        }
    };

    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="lg:w-[50%] w-full  flex items-center justify-center">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="w-2/3 space-y-6"
                    >
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Юзернейм</FormLabel>
                                    <FormControl>
                                        <Input
                                            autoComplete="username"
                                            placeholder="введите ваш юзернейм"
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
                                            autoComplete="current-password"
                                            placeholder="введите ваш пароль"
                                            {...field}
                                        />
                                    </FormControl>
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
