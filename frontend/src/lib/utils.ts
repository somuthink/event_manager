import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {  isAxiosError } from "axios";
import {ToastInfo} from "@/interfaces"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function parseHttpError(error: unknown, fallbackTitle = "Ошибка", fallbackDescription = "Что-то пошло не так"): ToastInfo {
  let title = fallbackTitle;
  let description = fallbackDescription;
  let variant: "default" | "destructive" = "destructive";

  if (isAxiosError(error)) {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          description = "Неавторизован. Пожалуйста, войдите в систему.";
          break;
        case 404:
          description = "Ресурс не найден.";
          break;
        default:
          description = error.response.data?.detail || "Ошибка сервера";
      }
    } else if (error.request) {
      description = "Нет ответа от сервера. Проверьте соединение.";
    } else {
      description = error.message;
    }
  } else if (error instanceof Error) {
    description = error.message;
  }

  return { variant, title, description };
}


