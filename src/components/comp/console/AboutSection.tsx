"use client";

import {
  Icon360View,
  IconActivityHeartbeat,
  IconMedal,
  IconMedal2,
  IconTrophy,
} from "@tabler/icons-react";

interface AboutSectionProps {
  aboutUser: {
    name: string;
    faculty: string;
    guild?: "BUDDHA" | "VAJRA" | "PADMA" | "RATNA" | "KARMA";
    age?: number;
    email: string;
    username: string;
    description: string;
    updatedAt?: string;
  };
}

import { usePathname } from "next/navigation";

export default function AboutSection({ aboutUser }: AboutSectionProps) {
  const pathname = usePathname();
  return (
    <div className="flex flex-col gap-y-16">
      <div className="flex flex-col gap-4 mb-3">
        <div className="flex items-center gap-3 text-black dark:text-gray-300">
          <span className="uppercase">{aboutUser.name}</span> |{" "}
          <span>
            {aboutUser.updatedAt
              ? aboutUser.updatedAt
              : aboutUser.guild
              ? aboutUser.guild
              : "NO GUILD"}
          </span>{" "}
          {aboutUser.age && <span>|</span>}
          {aboutUser.age && <span>{aboutUser.age}</span>}
        </div>
      </div>
      {pathname.startsWith("/genius-profile") && (
        <div className="gap-2 flex flex-wrap overflow-x-auto w-full">
          <div className="size-12 bg-black/20 dark:bg-white/20 rounded-full text-black dark:text-white">
            <IconMedal className="flex justify-center items-center size-full p-2 text-emerald-500" />
          </div>
          <div className="size-12 bg-black/20 dark:bg-white/20 rounded-full text-black dark:text-white">
            <IconMedal2 className="flex justify-center items-center size-full p-2 text-amber-600" />
          </div>
          <div className="size-12 bg-black/20 dark:bg-white/20 rounded-full text-black dark:text-white">
            <IconTrophy className="flex justify-center items-center size-full p-2 text-yellow-500" />
          </div>
          <div className="size-12 bg-black/20 dark:bg-white/20 rounded-full text-black dark:text-white">
            <IconActivityHeartbeat className="flex justify-center items-center size-full p-2 text-red-600" />
          </div>
          <div className="size-12 bg-black/20 dark:bg-white/20 rounded-full text-black dark:text-white">
            <Icon360View className="flex justify-center items-center size-full p-2 text-purple-600" />
          </div>
          <div className="size-12 bg-black/20 dark:bg-white/20 rounded-full text-black dark:text-white">
            <IconActivityHeartbeat className="flex justify-center items-center size-full p-2 text-red-600" />
          </div>
          <div className="size-12 bg-black/20 dark:bg-white/20 rounded-full text-black dark:text-white">
            <Icon360View className="flex justify-center items-center size-full p-2 text-purple-600" />
          </div>
          <div className="size-12 bg-black/20 dark:bg-white/20 rounded-full text-black dark:text-white">
            <IconActivityHeartbeat className="flex justify-center items-center size-full p-2 text-red-600" />
          </div>
          <div className="size-12 bg-black/20 dark:bg-white/20 rounded-full text-black dark:text-white">
            <Icon360View className="flex justify-center items-center size-full p-2 text-purple-600" />
          </div>
          <div className="size-12 bg-black/20 dark:bg-white/20 rounded-full text-black dark:text-white">
            <IconActivityHeartbeat className="flex justify-center items-center size-full p-2 text-red-600" />
          </div>
          <div className="size-12 bg-black/20 dark:bg-white/20 rounded-full text-black dark:text-white">
            <Icon360View className="flex justify-center items-center size-full p-2 text-purple-600" />
          </div>
          <div className="size-12 bg-black/20 dark:bg-white/20 rounded-full text-black dark:text-white">
            <IconActivityHeartbeat className="flex justify-center items-center size-full p-2 text-red-600" />
          </div>
          <div className="size-12 bg-black/20 dark:bg-white/20 rounded-full text-black dark:text-white">
            <Icon360View className="flex justify-center items-center size-full p-2 text-purple-600" />
          </div>
          <div className="size-12 bg-black/20 dark:bg-white/20 rounded-full text-black dark:text-white">
            <IconActivityHeartbeat className="flex justify-center items-center size-full p-2 text-red-600" />
          </div>
          <div className="size-12 bg-black/20 dark:bg-white/20 rounded-full text-black dark:text-white">
            <Icon360View className="flex justify-center items-center size-full p-2 text-purple-600" />
          </div>
          <div className="size-12 bg-black/20 dark:bg-white/20 rounded-full text-black dark:text-white">
            <IconActivityHeartbeat className="flex justify-center items-center size-full p-2 text-red-600" />
          </div>
        </div>
      )}
      <p
        className={`text-black dark:text-gray-300 overflow-hidden text-ellipsis whitespace-normal line-clamp-2 ${
          pathname.startsWith("/genius-profile") ? "" : "mt-20"
        }`}
      >
        {aboutUser.description}
      </p>
    </div>
  );
}
