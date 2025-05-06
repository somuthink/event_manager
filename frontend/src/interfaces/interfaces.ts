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
  address : string
  structure: object
  id?: number
}

export interface Tag {
  name: string
}

export interface Combo {
  value: string;
  label: string;
}
