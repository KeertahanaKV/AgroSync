// components/Layout.jsx
import { Link, Outlet } from "react-router-dom";
import { HiMenuAlt1 } from "react-icons/hi";
import { MdOutlineDashboard } from "react-icons/md";
import { GiFarmTractor, GiCow } from "react-icons/gi";
import { TbAnalyze } from "react-icons/tb";
import { BiData } from "react-icons/bi";
import { GiGrain } from "react-icons/gi";
import React, { useState } from "react";

const SideBar = () => {
  const menus = [
    { name: "Dashboard", link: "/dashboard", icon: MdOutlineDashboard },
    { name: "Add Inventory", link: "/dashboard/inventory", icon: GiFarmTractor },
     { name: "Crops", link: "/dashboard/crops", icon: GiGrain },
    { name: "Livestock", link: "/dashboard/livestock", icon: GiCow },
    { name: "Talk to Data", link: "/dashboard/talktodata", icon: BiData },
  ];

  const [open, setOpen] = useState(true);

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`bg-black min-h-screen ${open ? "w-72" : "w-16"} duration-500 text-gray-100 px-4`}
      >
        <div className="py-3 flex justify-end">
          <HiMenuAlt1
            size={30}
            className="cursor-pointer"
            onClick={() => setOpen(!open)}
          />
        </div>

        <div className="mt-4 flex flex-col gap-4 relative">
          {menus.map((menu, i) => (
            <Link
              to={menu.link}
              key={i}
              className="group flex items-center text-sm gap-3.5 p-2 font-medium hover:bg-gray-800 rounded transition"
            >
              <div>{React.createElement(menu.icon, { size: 20 })}</div>
              <h2
                style={{ transitionDelay: `${i + 3}00ms` }}
                className={`whitespace-pre duration-500 ${
                  !open && "opacity-0 translate-x-28 overflow-hidden"
                }`}
              >
                {menu.name}
              </h2>
              <h2
                className={`${
                  open && "hidden"
                } absolute left-48 bg-white font-semibold whitespace-pre text-gray-900
                rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit`}
              >
                {menu.name}
              </h2>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4">
        {/* This is where each page (like Dashboard, Inventory, etc.) will show */}
        <Outlet />
      </div>
    </div>
  );
};

export default SideBar;
