"use client";

import Image from "next/image";

import { Button as MovingBorderButton } from "@/src/ui/border/moving-border";
import { Card, CardContent } from "@/src/ui/card";
import { Button } from "@/src/ui/button/button";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import ExpressionBottomMidHud from "../Huds/ExpressionBottomMidHud";
import { Dialog, DialogContent, DialogTrigger } from "@/src/ui/dialog";
import {
  AvatarCreator,
  AvatarCreatorConfig,
  BodyType,
  Language,
} from "../AvatarComponents/avatar_creator";
import { useAvatar } from "../AvatarManager/provider/AvatarManagerContext";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/src/ui/carousel/carousel";
import AvatarManagerClientProfile from "../AvatarManager/avatar-manager-client-profile";
import ExpressionCard from "../Huds/ExpressionsCard";
import { usePublicAvatar } from "../AvatarManager/provider/AvatarManagerPublicContext";

const AchievementSlider: React.FC = () => {
  return (
    <Carousel className="w-full">
      <CarouselContent className="-ml-1">
        <CarouselItem className="pl-1 basis-1/4">
          <Card
            className={`group relative size-[90px] rounded-lg dark:bg-black/40 hover:border-2 border-white bg-gray-200 flex items-center justify-center text-3xl transition-colors duration-300`}
          >
            <Image
              src="/achievements/gg/GG-Beta-Tester.png"
              alt="GG-Trophy"
              width={74}
              height={74}
            />
            <div className="absolute bottom-0 group-hover:opacity-100 opacity-0 uppercase text-yellow-500 text-xs font-bold">
              Beta Tester
            </div>
          </Card>
        </CarouselItem>

        <CarouselItem className="pl-1 basis-1/4">
          <Card
            className={`group relative size-[90px] rounded-lg dark:bg-black/40 hover:border-2 border-white bg-gray-200 flex items-center justify-center text-3xl transition-colors duration-300`}
          >
            <Image
              src="/achievements/gg/Globe.png"
              alt="GG-Trophy"
              width={64}
              height={64}
            />
            <div className="absolute bottom-0 group-hover:opacity-100 opacity-0 uppercase text-yellow-500 text-xs font-bold">
              GG-Globe
            </div>
          </Card>
        </CarouselItem>
        <CarouselItem className="pl-1 basis-1/4">
          <Card
            className={`group relative size-[90px] rounded-lg dark:bg-black/40 hover:border-2 border-white bg-gray-200 flex items-center justify-center text-3xl transition-colors duration-300`}
          >
            <Image
              src="/achievements/gg/GG-Member-Trophy.png"
              alt="GG-Trophy"
              width={64}
              height={64}
            />
            <div className="absolute bottom-0 group-hover:opacity-100 opacity-0 uppercase text-yellow-500 text-xs font-bold">
              GG-Member
            </div>
          </Card>
        </CarouselItem>
        <CarouselItem className="pl-1 basis-1/4">
          <Card
            className={`group relative size-[90px] rounded-lg dark:bg-black/40 hover:border-2 border-white bg-gray-200 flex items-center justify-center text-3xl transition-colors duration-300`}
          >
            <Image
              src="/achievements/gg/User-Profile-Achievement.png"
              alt="User-Profile-Achievement"
              width={66}
              height={66}
            />
            <div className="absolute bottom-0 group-hover:opacity-100 opacity-0 uppercase text-yellow-500 text-xs font-bold">
              GG-User
            </div>
          </Card>
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  );
};

export default function BottomSection({
  userInfo,
  ifOwnProfile,
}: {
  userInfo: any;
  ifOwnProfile: boolean;
}) {
  'use cache'
  const {
    avatars,
    selectedAvatar,
    isAvatarCreatorOpen,
    isProcessing,
    expressions,
    setIsAvatarCreatorOpen,
    handleCreateAvatar,
    handleEditAvatar,
    handleDeleteAvatar,
    handleAvatarCreated,
    handleUpdateAvatar,
    handleEmote,
    editingAvatar,
    setSelectedAvatar,
    getAvatarCreatorUrl,
  } = useAvatar();

  const { publicExpressions, handlePublicEmote } = usePublicAvatar();

  const baseAvatarCreatorConfig: AvatarCreatorConfig = {
    bodyType: "fullbody" as BodyType,
    quickStart: true,
    language: "en" as Language,
  };

  const createAvatarConfig: AvatarCreatorConfig = {
    ...baseAvatarCreatorConfig,
    clearCache: true,
  };

  const editAvatarConfig: AvatarCreatorConfig = {
    ...baseAvatarCreatorConfig,
    clearCache: false,
  };

  const extractUserId = (avatarUrl: string | undefined): string | undefined => {
    if (!avatarUrl) return undefined;
    const match = avatarUrl.match(/\/([^/]+)\.glb$/);
    return match ? match[1] : undefined;
  };
  return (
    <>
      {!ifOwnProfile ? (
        <>
          <div className="w-full">
            <div className="relative w-full h-[250px] flex justify-end z-40">
              <div className="absolute bottom-12 left-2">
                <ExpressionBottomMidHud
                  expressions={expressions}
                  handleEmote={handleEmote}
                />
              </div>
              <div className="h-full w-[70%]">
                <AvatarManagerClientProfile
                  fov={40}
                  cameraInitialDistance={4}
                  cameraTarget={0}
                />
              </div>
            </div>
            <div className="relative flex border p-2 rounded-xl overflow-auto backdrop-blur-md border-black/10 dark:border-white/10 dark:hover:border-[#FCBB3F]/60 hover:border-sky-500/60 transition-all duration-200 ease-in-out">
              <ExpressionCard
                expressions={publicExpressions}
                handleEmote={handlePublicEmote}
              />
            </div>

            <div className="relative flex border p-2 mt-4 rounded-xl overflow-auto backdrop-blur-md border-black/10 dark:border-white/10 dark:hover:border-[#FCBB3F]/60 hover:border-sky-500/60 transition-all duration-200 ease-in-out">
              <AchievementSlider />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="w-full ">
            <div className="w-full flex justify-center">
              <Dialog
                open={isAvatarCreatorOpen}
                onOpenChange={setIsAvatarCreatorOpen}
              >
                <DialogTrigger asChild>
                  <MovingBorderButton
                    onClick={handleCreateAvatar}
                    className="p-2"
                  >
                    {isProcessing ? "..." : "Create New Avatar"}
                  </MovingBorderButton>
                </DialogTrigger>
                <DialogContent>
                  <div className="h-[600px] w-full relative rounded-xl overflow-hidden">
                    <AvatarCreator
                      subdomain="gguser"
                      config={
                        editingAvatar
                          ? {
                              ...editAvatarConfig,
                              avatarId: extractUserId(editingAvatar.avatar_url),
                            }
                          : createAvatarConfig
                      }
                      onAvatarExported={
                        editingAvatar ? handleUpdateAvatar : handleAvatarCreated
                      }
                      onUserSet={(event) => console.log("User set:", event)}
                      iframeUrl={
                        editingAvatar
                          ? getAvatarCreatorUrl(editingAvatar.avatar_url)
                          : undefined
                      }
                    />
                    {isProcessing && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        {editingAvatar
                          ? "Updating avatar..."
                          : "Creating avatar..."}
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="w-full relative mt-4 h-fit backdrop-blur-lg rounded-lg border dark:border-white/20 border-black/20 hover:border-yellow-500 transition-all duration-300 ease-in-out">
              <Carousel className="w-full">
                <CarouselContent className="-ml-1">
                  {avatars.map((avatar, index) => (
                    <CarouselItem key={index} className="pl-1 basis-1/3">
                      <div className="p-2">
                        <Card
                          key={avatar.avatar_id}
                          className={`border h-fit rounded-lg  transition-all duration-300 ease-in-out ${
                            selectedAvatar === avatar.avatar_url
                              ? "border-sky-500"
                              : "border-black/20 dark:border-white/20 hover:border-black dark:hover:border-white"
                          }`}
                        >
                          <CardContent className="relative pt-6 pb-1">
                            <div className="flex flex-col items-center space-y-1 w-full">
                              <Image
                                src={
                                  avatar.avatar_url?.replace(".glb", ".png") ||
                                  "/placeholder-avatar.png"
                                }
                                alt="Avatar"
                                width={128}
                                height={128}
                                className="rounded-full"
                              />
                              <Button
                                variant="black"
                                className={`hover:text-yellow-500 w-full h-5 font-light text-xs ${
                                  selectedAvatar === avatar.avatar_url
                                    ? "text-sky-500"
                                    : ""
                                }`}
                                onClick={() =>
                                  setSelectedAvatar(avatar.avatar_url)
                                }
                              >
                                {selectedAvatar === avatar.avatar_url
                                  ? "Selected"
                                  : "Select"}
                              </Button>
                            </div>
                            <div className="absolute top-1 flex gap-1 right-1">
                              {/* <Button
                                variant="transparent_rounded"
                                className="hover:text-yellow-500 hover:bg-transparent text-sky-600 p-[1px]"
                                size="mini2"
                                onClick={() => handleEditAvatar(avatar)}
                              >
                                <IconEdit size={12} />
                              </Button> */}
                              <Button
                                variant="transparent_rounded"
                                className="hover:text-yellow-500 hover:bg-transparent text-red-600 p-[1px]"
                                size="mini2"
                                onClick={() =>
                                  handleDeleteAvatar(avatar.avatar_id)
                                }
                              >
                                <IconTrash size={12} />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
            <div className="relative mt-4 flex border p-2 rounded-xl overflow-auto backdrop-blur-md border-black/10 dark:border-white/10 dark:hover:border-[#FCBB3F]/60 hover:border-sky-500/60 transition-all duration-200 ease-in-out">
              <ExpressionCard
                expressions={expressions}
                handleEmote={handleEmote}
              />
            </div>

            <div className="relative flex border p-2 mt-4 rounded-xl overflow-auto backdrop-blur-md border-black/10 dark:border-white/10 dark:hover:border-[#FCBB3F]/60 hover:border-sky-500/60 transition-all duration-200 ease-in-out">
              <AchievementSlider />
            </div>
          </div>
        </>
      )}
    </>
  );
}
