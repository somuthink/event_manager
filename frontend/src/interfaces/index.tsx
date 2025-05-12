
export interface NavItem {
    name: string;
    link: string;
    description: string;
}

export interface Event {
    title: string;
    description: string;
    theme: string;
    image: string;
    start_time: Date
    end_time: Date
    tags: Tag[]
    address: string
    structure: object
    id?: number
}


export interface News {
    title: string;
    description: string;
    image: string;
    structure: object
    id?: number
    create_time: Date
}

export interface Tag {
    name: string
}

export interface ToastInfo {
    variant: "default" | "destructive";
    title: string;
    description: string;
}


export interface Entry {
    action: string;
    time: Date;
    user_id: number;
    event_id: number;
}
