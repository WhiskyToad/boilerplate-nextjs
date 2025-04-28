"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface SidebarItem {
  title: string;
  path: string;
  icon?: React.ReactNode;
  subItems?: SidebarItem[];
}

export interface SidebarProps {
  items: SidebarItem[];
  drawerID?: string;
  mobileTitle?: string;
  sidebarWidth?: number;
  mobileBgColor?: string;
  desktopBgColor?: string;
  topOffset?: number;
  logo?: React.ReactNode;
}

const Sidebar = ({
  items,
  drawerID = "sidebar-drawer",
  mobileTitle,
  sidebarWidth = 80,
  mobileBgColor = "bg-base-200",
  desktopBgColor = "bg-base-100",
  topOffset = 20,
  logo,
}: SidebarProps) => {
  const pathname = usePathname() || "";
  const activeItem = items.find((item) => pathname.startsWith(item.path));
  const activeSubItem = activeItem?.subItems?.find(
    (subItem) => pathname === subItem.path
  );

  return (
    <>
      <div className="lg:hidden">
        <div className="drawer">
          <input id={drawerID} type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            <div className="navbar bg-base-100 flex justify-between">
              <div className="flex-none">
                <label
                  htmlFor={drawerID}
                  className="btn btn-ghost drawer-button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="inline-block w-5 h-5 stroke-current"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    ></path>
                  </svg>
                </label>
              </div>

              <span className="text-xl font-semibold pr-12">
                {mobileTitle || activeSubItem?.title || activeItem?.title}
              </span>
            </div>
          </div>
          <div className="drawer-side z-50 fixed">
            <label
              htmlFor={drawerID}
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <div
              className={`menu ${mobileBgColor} text-base-content min-h-screen w-${sidebarWidth} p-4`}
            >
              {logo && <div className="mb-4">{logo}</div>}
              <SidebarContent items={items} />
            </div>
          </div>
        </div>
      </div>

      <div
        className={`hidden lg:block fixed top-${topOffset} left-0 h-full w-${sidebarWidth} ${desktopBgColor} overflow-y-auto shadow-lg`}
      >
        {logo && <div className="mt-4 mb-4 px-4">{logo}</div>}
        <SidebarContent items={items} />
      </div>
      <div className={`lg:ml-${sidebarWidth} w-4`} />
    </>
  );
};

interface SidebarContentProps {
  items: SidebarItem[];
}

const SidebarContent = ({ items }: SidebarContentProps) => {
  const pathname = usePathname() || "";

  return (
    <aside className="menu w-full p-4">
      {items.map((item) => {
        return (
          <div key={item.title} className="collapse collapse-arrow bg-base-100">
            <input
              type="radio"
              name={`sidebar-accordion-${item.title
                .replace(/\s+/g, "-")
                .toLowerCase()}`}
              defaultChecked={pathname.startsWith(item.path)}
            />
            <div className="collapse-title">
              <Link
                href={item.path}
                className={`block text-base-content hover:bg-base-300 rounded-lg
                  ${
                    pathname === item.path
                      ? "text-primary font-medium"
                      : "font-normal"
                  }`}
              >
                <div className="flex items-center">
                  {item.icon && <span className="mr-2">{item.icon}</span>}
                  {item.title}
                </div>
              </Link>
            </div>
            <div className="collapse-content gap-2 flex flex-col">
              {item.subItems?.map((subItem) => (
                <Link
                  key={subItem.title}
                  href={subItem.path}
                  className={`block px-3 py-2 text-sm text-base-content/70 hover:bg-base-300 rounded-lg
                    ${
                      pathname === subItem.path
                        ? "bg-primary/10 text-primary font-medium"
                        : "font-normal"
                    }`}
                >
                  <div className="flex items-center">
                    {subItem.icon && (
                      <span className="mr-2">{subItem.icon}</span>
                    )}
                    {subItem.title}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </aside>
  );
};

export default Sidebar;
