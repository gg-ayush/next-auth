"use client";

import {
  fetchOwnedGames,
  fetchSteamProfile,
  fetchUserStatsForGame,
} from "@/actions/genius-profile/steam";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/ui/avatar";
import { Button } from "@/src/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/ui/card";
import { Input } from "@/src/ui/input";
import {
  GetOwnedGamesResponse,
  SteamPlayerData,
  UserGameStats,
} from "@/services/steam";
import Image from "next/image";
import React, { forwardRef, useState } from "react";

interface SteamProfileProps {
  // Add any props here if needed
}

const SteamProfile = forwardRef<HTMLDivElement, SteamProfileProps>(
  (props, ref) => {
    const [steamId, setSteamId] = useState("");
    const [profile, setProfile] = useState<SteamPlayerData | null>(null);
    const [ownedGames, setOwnedGames] = useState<GetOwnedGamesResponse | null>(
      null
    );
    const [selectedGameStats, setSelectedGameStats] =
      useState<UserGameStats | null>(null);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      setProfile(null);
      setOwnedGames(null);
      setSelectedGameStats(null);

      try {
        const profileResult = await fetchSteamProfile({ steamId });
        if (
          profileResult.success &&
          "data" in profileResult &&
          profileResult.data
        ) {
          setProfile(profileResult.data);

          const gamesResult = await fetchOwnedGames({ steamId });
          if (
            gamesResult.success &&
            "data" in gamesResult &&
            gamesResult.data
          ) {
            setOwnedGames(gamesResult.data);
          } else {
            setError("Failed to fetch owned games");
          }
        } else {
          setError("Failed to fetch profile");
        }
      } catch (err) {
        setError("An unexpected error occurred");
        console.error(err);
      }
    };

    const handleGameSelect = async (appId: number) => {
      try {
        const statsResult = await fetchUserStatsForGame({ steamId, appId });
        if (statsResult.success && "data" in statsResult && statsResult.data) {
          setSelectedGameStats(statsResult.data);
        } else {
          setError("Failed to fetch game stats");
        }
      } catch (err) {
        setError("An unexpected error occurred while fetching game stats");
        console.error(err);
      }
    };

    const getPersonaState = (state: number) => {
      const states = [
        "Offline",
        "Online",
        "Busy",
        "Away",
        "Snooze",
        "Looking to trade",
        "Looking to play",
      ];
      return states[state] || "Unknown";
    };

    return (
      <div ref={ref} className="max-w-4xl mx-auto p-4">
        <form
          onSubmit={handleSubmit}
          className="mb-6 flex gap-2 items-center md:flex-row flex-col"
        >
          <Input
            type="text"
            value={steamId}
            onChange={(e) => setSteamId(e.target.value)}
            placeholder="Enter Steam ID"
            className="flex-grow text-white"
          />
          <Button type="submit" className="border border-white">
            Fetch Profile
          </Button>
        </form>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {profile && (
          <Card className="mb-6 text-white">
            <CardHeader>
              <CardTitle>{profile.personaname}&apos;s Steam Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={profile.avatarfull}
                    alt={profile.personaname}
                  />
                  <AvatarFallback>{profile.personaname[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">{profile.personaname}</h2>
                  <p className="font-light">
                    Status: {getPersonaState(profile.personastate)}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Steam ID</h3>
                  <p>{profile.steamid}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Profile URL</h3>
                  <a
                    href={profile.profileurl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    View Profile
                  </a>
                </div>
                {profile.realname && (
                  <div>
                    <h3 className="font-semibold">Real Name</h3>
                    <p>{profile.realname}</p>
                  </div>
                )}
                {profile.loccountrycode && (
                  <div>
                    <h3 className="font-semibold">Country</h3>
                    <p>{profile.loccountrycode}</p>
                  </div>
                )}
                {profile.timecreated && (
                  <div>
                    <h3 className="font-semibold">Account Created</h3>
                    <p>
                      {new Date(
                        profile.timecreated * 1000
                      ).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {profile.gameextrainfo && (
                  <div>
                    <h3 className="font-semibold">Currently Playing</h3>
                    <p>{profile.gameextrainfo}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {ownedGames && (
          <Card className="mb-6 text-white">
            <CardHeader>
              <CardTitle>Owned Games ({ownedGames.game_count})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {ownedGames.games.slice(0, 12).map((game) => (
                  <div
                    key={game.appid}
                    className="flex flex-col items-center text-center"
                  >
                    {game.img_icon_url ? (
                      <Image
                        src={`http://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`}
                        alt={game.name}
                        width={128}
                        height={64}
                        className="w-32 h-16 object-cover mb-2 cursor-pointer"
                        onClick={() => handleGameSelect(game.appid)}
                      />
                    ) : (
                      <div
                        className="w-32 h-16 bg-gray-200 flex items-center justify-center mb-2 cursor-pointer"
                        onClick={() => handleGameSelect(game.appid)}
                      >
                        <span className="text-gray-500">No image</span>
                      </div>
                    )}
                    <p className="font-semibold">{game.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {Math.round(game.playtime_forever / 60)} hours played
                    </p>
                  </div>
                ))}
              </div>
              {ownedGames.game_count > 12 && (
                <p className="mt-4 text-center font-light">
                  Showing 12 of {ownedGames.game_count} games
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {selectedGameStats && (
          <Card>
            <CardHeader>
              <CardTitle>{selectedGameStats.gameName} Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible>
                <AccordionItem value="stats">
                  <AccordionTrigger>Game Stats</AccordionTrigger>
                  <AccordionContent>
                    <ul>
                      {selectedGameStats.stats.map((stat, index) => (
                        <li key={index} className="mb-2">
                          <span className="font-semibold">{stat.name}:</span>{" "}
                          {stat.value}
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="achievements">
                  <AccordionTrigger>Achievements</AccordionTrigger>
                  <AccordionContent>
                    <ul>
                      {selectedGameStats.achievements.map(
                        (achievement, index) => (
                          <li key={index} className="mb-2">
                            <span className="font-semibold">
                              {achievement.name}:
                            </span>{" "}
                            {achievement.achieved ? "Unlocked" : "Locked"}
                          </li>
                        )
                      )}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }
);

SteamProfile.displayName = "SteamProfile";

export default SteamProfile;
