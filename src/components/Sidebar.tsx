"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarItem {
  title: string;
  path: string;
  subItems?: SidebarItem[];
}

const Sidebar = ({ items }: { items: SidebarItem[] }) => {
  const pathname = usePathname() || "";
  const activeItem = items.find((item) => pathname.startsWith(item.path));
  const activeSubItem = activeItem?.subItems?.find(
    (subItem) => pathname === subItem.path
  );
  return (
    <>
      <div className="lg:hidden">
        <div className="drawer">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            <div className="navbar bg-base-100 flex justify-between">
              <div className="flex-none ">
                <label
                  htmlFor="my-drawer"
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
                {activeSubItem?.title || activeItem?.title}
              </span>
            </div>
          </div>
          <div className="drawer-side z-50 fixed">
            <label
              htmlFor="my-drawer"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <div className="menu bg-base-200 text-base-content min-h-screen w-80 p-4">
              <SidebarContent items={items} />
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:block fixed top-20 left-0 h-full w-80 bg-base-100 overflow-y-auto shadow-lg">
        <SidebarContent items={items} />
      </div>
      <div className="lg:ml-80 w-4" />
    </>
  );
};

const SidebarContent = ({ items }: { items: SidebarItem[] }) => {
  const pathname = usePathname() || "";

  return (
    <aside className="menu w-80 p-4">
      {items.map((item) => {
        return (
          <div key={item.title} className="collapse collapse-arrow bg-base-100">
            <input
              type="radio"
              name={`my-accordion-${item.title}`}
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
                {item.title}
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
                  {subItem.title}
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
