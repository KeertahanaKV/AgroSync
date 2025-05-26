// pages/Dashboard.jsx
import { Link } from "react-router-dom";
import { HiMenuAlt1 } from "react-icons/hi";
import { MdOutlineDashboard } from "react-icons/md";
import { GiFarmTractor } from "react-icons/gi";
import { GiCow } from "react-icons/gi";
import { FaChartLine } from "react-icons/fa";
import { TbAnalyze } from "react-icons/tb";
import { AiOutlineRobot } from "react-icons/ai";
import { BiData } from "react-icons/bi";
import React, { useState } from "react";

const Dashboard = () => {
  const menus = [
    { name: "Dashboard", link: "/dashboard", icon: MdOutlineDashboard },
    { name: "Inventory", link: "/inventory", icon: GiFarmTractor },
    { name: "Livestock", link: "/livestock", icon: GiCow },
    { name: "Market Prices", link: "/marketprice", icon: FaChartLine },
    {
      name: "Resource Estimation",
      link: "/resourceestimation",
      icon: AiOutlineRobot,
    },
    { name: "Talk to Data", link: "/talktodata", icon: BiData },
    { name: "Analysis", link: "/analysis", icon: TbAnalyze },
  ];
  const [open, setOpen] = useState(true);
  return (
    <div>
      <section className="flex gap-6">
        {/* Sidebar */}
        <div
          className={`bg-black min-h-screen ${
            open ? "w-72" : "w-16"
          } duration-500 text-gray-100 px-4`}
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
                className=" group flex items-center text-sm gap-3.5 p-2 font-medium hover:bg-gray-800 rounded transition"
              >
                <div>{React.createElement(menu.icon, { size: 20 })}</div>
                <h2
                  style={{
                     transitionDelay:`${i+3}00ms`
                  }}
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
                rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14  group-hover:duration-300 group-hover:w-fit`}>
                  {menu.name}
                </h2>
              </Link>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="m-3 text-xl text-orange-600 font-semibold">
          AgroSync
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
