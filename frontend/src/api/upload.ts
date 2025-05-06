import { axiosInst } from "./axios";

export const UploadFile = (file :  File) => {  

            const formData = new FormData();
            formData.append("files", file);

            axiosInst.post("/files/", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
}

