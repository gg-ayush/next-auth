"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GiBarbedStar, GiShipWheel } from "react-icons/gi";
import { IoMdArrowRoundBack } from "react-icons/io";
import { RiEarthFill } from "react-icons/ri";
import Hamburger from "hamburger-react";
import CustomToolTipLeftRight from "../CustomComponents/CustomToolTipLeftRight";

const NavbarClient = () => {
  const [isOpen, setOpen] = useState(false);
  const closeMenu = () => setOpen(false);

  const pathname = usePathname();
  // Hide middle nav
  const [hideMiddleNav, setHideMiddleNav] = useState(true);

  // Hide middle nav on slider page
  useEffect(() => {
    setHideMiddleNav(pathname === "/slider");
  }, [pathname]);

  return (
    <>
      <div className={`fixed left-0 top-3 z-50 flex items-center rounded-full`}>
        <div className="flex items-center justify-center text-black dark:text-white">
          <div className="flex items-center gap-x-4 text-black dark:text-white">
            <div className="flex items-center lg:hidden">
              <Hamburger
                toggled={isOpen}
                toggle={setOpen}
                color="#4FD1C5"
                size={20}
                duration={0.3}
                rounded={true}
                label="Show menu"
              />
            </div>
          </div>
        </div>
      </div>

      {!hideMiddleNav && (
        <div className="fixed left-[5px] md:left-[20px] z-50 flex w-[33px] top-1/2 -translate-y-1/2 select-none flex-col items-center space-y-[6px] rounded-full px-[6px] py-[4px] transition-all duration-500 ease-in-out">
          <div className="hidden text-black/70 lg:flex">
            <div className="flex flex-col w-10 items-center justify-center gap-2 rounded-full bg-white py-1 shadow-lg backdrop-blur-md  md:gap-y-3">
              <Link
                href="#"
                className={`group ${
                  pathname === "/hud"
                    ? "scale-110 py-2 text-2xl font-bold text-pink-700"
                    : "py-2 font-semibold transition-all duration-300 ease-out hover:scale-105 hover:text-purple-600"
                }`}
              >
                <GiShipWheel size={25} className="drop-shadow" />
                <CustomToolTipLeftRight
                  content="HUD"
                  top="0"
                  left={29}
                  translateY="10"
                />
              </Link>

              <Link
                href="/"
                className={`group ${
                  pathname === "/discover"
                    ? "scale-110 py-2 text-2xl font-bold  text-pink-700 drop-shadow"
                    : "py-2 font-semibold transition duration-300 ease-out hover:scale-105 hover:text-purple-600"
                }`}
              >
                <GiBarbedStar size={30} className="drop-shadow" />
                <CustomToolTipLeftRight
                  content="DISCOVER"
                  top="0"
                  left={29}
                  translateY="10"
                />
              </Link>

              <Link
                href="#"
                className={`group ${
                  pathname.startsWith("/regions")
                    ? "scale-110 py-2 text-2xl font-bold text-pink-700 drop-shadow"
                    : "py-2 font-semibold transition duration-300 ease-out hover:scale-105 hover:text-purple-600"
                }`}
              >
                <RiEarthFill size={25} className="drop-shadow" />
                <CustomToolTipLeftRight
                  content="REGIONS"
                  top="0"
                  left={29}
                  translateY="10"
                />
              </Link>
            </div>
          </div>
        </div>
      )}

      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          isOpen ? "bg-black/30 opacity-100" : "pointer-events-none opacity-0 "
        }`}
        onClick={closeMenu}
      ></div>
      <div
        className={`fixed inset-y-0 left-0 z-50 transition-all duration-200 lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } flex w-[75%] flex-col bg-slate-800 shadow-xl dark:bg-black`}
      >
        <div className="p-4 ">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-md text-gray-300 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Close panel"
          >
            <span className="sr-only">Close panel</span>
            <IoMdArrowRoundBack className="text-white dark:text-purple-200" />
          </button>
        </div>
        <div className="px-4 py-6 ">
          <ul className="flex flex-col gap-y-4">
            <li>
              <Link
                href="#"
                className="hover:text-violet-400"
                onClick={closeMenu}
              >
                DISCOVER
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="hover:text-violet-400"
                onClick={closeMenu}
              >
                HUD
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="hover:text-violet-400"
                onClick={closeMenu}
              >
                REGIONS
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default NavbarClient;
