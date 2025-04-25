import { ReactNode } from "react";


interface CreateGroupProps {
    name: string
    children: ReactNode
}


export const CreateGroup = ({ name, children }: CreateGroupProps) => {

    return (
        <div className="w-full flex flex-col rounded-2xl  border-1 border-accent-foreground border-dashed  ">

            <a className="text-primary/80 border-b-1 px-4 py-2   border-accent-foreground border-dashed w-full">{name}</a>

            <div className="w-full px-4 py-2 flex items-center justify-center">
                {children}
            </div>


        </div>

    );
}
