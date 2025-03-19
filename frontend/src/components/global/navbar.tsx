import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { NavItem } from "@/interfaces/interfaces";

import { useLocation } from "react-router-dom";

const NavItems: NavItem[] = [
  {
    name: "Новости",
    link: "/",
    description: "Просмотреть новости связанные с мероприятиями",
  },
  {
    name: "Мероприятия",
    link: "/events",
    description: "Просмотреть все мероприятия списком или карточками",
  },
  {
    name: "Участники",
    link: "/participants",
    description: "Отметить или посмотреть информацию об всех участниках",
  },
];

export const Navbar = () => {
  const location = useLocation();
  return (
    <header className="w-full flex items-center justify-center ">
      <NavigationMenu className="">
        <NavigationMenuList>
          {NavItems.map((navItem, i) => {
            const isActive = location.pathname === navItem.link;

            return (
              <NavigationMenuItem key={i}>
                <NavigationMenuTrigger isActive={isActive}>
                  {navItem.name}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <NavigationMenuLink href={navItem.link}>
                    <a className="w-100"> {navItem.description}</a>
                  </NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>
            );
          })}
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};
