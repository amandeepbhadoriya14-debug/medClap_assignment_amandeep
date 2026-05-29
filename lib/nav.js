import {
  LayoutDashboardIcon,
  UserRoundIcon,
  UsersIcon,
  ActivityIcon,
  SettingsIcon,
} from "lucide-react";

export const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboardIcon },
  { label: "My Profile", href: "/profile", icon: UserRoundIcon },
  { label: "Users", href: "/users", icon: UsersIcon },
  { label: "Activity", href: "/dashboard", icon: ActivityIcon, soon: true },
  { label: "Settings", href: "/profile", icon: SettingsIcon, soon: true },
];
