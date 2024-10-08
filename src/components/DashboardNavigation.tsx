import { useStore } from "@nanostores/react";
import {
  ChevronFirst,
  ChevronLast,
  LayoutDashboard,
  LayoutPanelTop,
  LogOut,
} from "lucide-react";

import { isActive, isExpanded } from "../lib/stores/navigationStore";

const menuItems: { icon: React.ReactNode; text: string; link: string }[] = [
  {
    icon: <LayoutDashboard size={20} />,
    text: "Dashboard",
    link: "/",
  },
  {
    icon: <LayoutPanelTop size={20} />,
    text: "Sites",
    link: "/sites",
  },
];
const DashboardNavigation = ({
  email,
  username,
  pathname,
}: {
  username: string;
  email: string;
  pathname: string;
}) => {
  const { expanded } = useStore(isExpanded);
  const { active } = useStore(isActive);
  let currentPathname = pathname.split("/app")[1];

  if (!currentPathname) {
    currentPathname = "/";
  }
  return (
    <aside className="h-screen">
      <nav className="h-full flex flex-col bg-white border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <img
            width="160"
            height="46"
            src="https://img.logoipsum.com/243.svg"
            alt="Logo"
            loading="eager"
            className={`overflow-hidden transition-all ${
              expanded ? "w-32" : "w-0"
            }`}
          />
          <button
            onClick={() => isExpanded.set({ expanded: !expanded })}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
          >
            {expanded ? <ChevronFirst size={20} /> : <ChevronLast size={20} />}
          </button>
        </div>
        <ul className="flex-1 px-3">
          {menuItems.map((navItem) => (
            <SidebarItem
              key={navItem.link}
              icon={navItem.icon}
              text={navItem.text}
              link={navItem.link}
              active={navItem.link === active}
            />
          ))}
        </ul>
        <div className="border-t flex p-3">
          <img
            width="64"
            height="64"
            src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&name=Astro%20Platforms"
            className="w-10 h-10 rounded-md"
            alt="User Avatar"
            loading="eager"
          />
          <div
            className={`
          flex justify-between items-center
          overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}
      `}
          >
            <div className="leading-4">
              <h4 className="font-semibold">{username}</h4>
              <span className="text-xs text-gray-600">{email}</span>
            </div>
            <button>
              <a href="/api/logout">
                <LogOut size={20} />
              </a>
            </button>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default DashboardNavigation;

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  link: string;
  active?: boolean;
  alert?: boolean;
}
export const SidebarItem = ({
  icon,
  text,
  link,
  active = false,
  alert = false,
}: SidebarItemProps) => {
  const { expanded } = useStore(isExpanded);
  return (
    <a
      href={link}
      onClick={() => {
        isActive.set({ active: link });
      }}
    >
      <li
        className={`
      relative flex items-center py-2 px-3 my-1
      font-medium rounded-md cursor-pointer
      transition-colors group
      ${
        active
          ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
          : "hover:bg-indigo-50 text-gray-600"
      }
  `}
      >
        {icon}
        <span
          className={`overflow-hidden transition-all ${
            expanded ? "w-52 ml-3" : "w-0"
          }`}
        >
          {text}
        </span>
        {alert && (
          <div
            className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
              expanded ? "" : "top-2"
            }`}
          />
        )}
        {!expanded && (
          <div
            className={`
          absolute left-full rounded-md px-2 py-1 ml-6
          bg-indigo-100 text-indigo-800 text-sm
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
      `}
          >
            {text}
          </div>
        )}
      </li>
    </a>
  );
};
