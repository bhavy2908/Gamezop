"use client";
import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
    Swords,
    MountainSnowIcon,
    Gamepad,
    PuzzleIcon,
    Car,
    Brain,
    Heart
  } from "lucide-react";
import { Game } from "../types/index";
import {
  isFavorite,
  addGameToFav,
  removeGameFromFav,
  addToRecentlyPlayed,
} from "@/utils/storage";

interface CategoryAllGamesProps {
  categoryName: string;
  games: Game[];
}

const CategoryAllGames: React.FC<CategoryAllGamesProps> = ({
  categoryName,
  games,
}) => {
  const router = useRouter();
  const [displayedGames, setDisplayedGames] = useState(games);
  categoryName = games[1].categories.en[0]

  const playGame = (game: Game) => {
    addToRecentlyPlayed(game);
    router.push(game.url);
  };

  const toggleFavorite = (game: Game) => {
    if (favoriteStatus[game.code]) {
      removeGameFromFav(game);
    } else {
      addGameToFav(game);
    }
    setDisplayedGames([...displayedGames]);
  };

  const favoriteStatus = useMemo(() => {
    return displayedGames.reduce((acc, game) => {
      acc[game.code] = isFavorite(game);
      return acc;
    }, {} as Record<string, boolean>);
  }, [displayedGames]);

  const renderGameItem = (game: Game, index: number) => (
    <div
      key={index}
      className="game-item p-4 rounded-lg flex flex-col items-center"
    >
      <Image
        src={game.assets.thumb}
        alt={game.name.en}
        width={150}
        height={150}
        className="rounded-lg mb-2"
      />
      <h1 className="game-name text-white font-bold text-center">
        {game.name.en}
      </h1>
      <div className="rating flex items-center justify-center mt-1">
        {Array.from({ length: 5 }, (_, idx) => {
          const isFilled = idx < Math.floor(game.rating);
          const isHalf = idx === Math.floor(game.rating) && game.rating % 1 > 0;
          return (
            <span
              key={idx}
              className={`rating-star ${
                isFilled
                  ? "text-yellow-400"
                  : isHalf
                  ? "text-yellow-300"
                  : "text-gray-400"
              }`}
            >
              {isHalf ? "☆" : "★"}
            </span>
          );
        })}
        <span className="text-white ml-1 text-sm">
          {game.rating.toFixed(1)}
        </span>
      </div>
      <div className="mt-2 flex items-center">
        <button className="mr-2" onClick={() => toggleFavorite(game)}>
          <Heart
            size={20}
            fill={favoriteStatus[game.code] ? "white" : "none"}
          />
        </button>
        <button
          className="play-button-blue text-blue-500 px-4 py-1 rounded"
          onClick={() => playGame(game)}
        >
          Play
        </button>
      </div>
    </div>
  );

  return (
    <div className="category-all-games-container animate-fade-in">
      <div className="flex justify-between items-center mb-5">
        <div className="flex">
      {categoryName === "Action" && (
            <Swords className="text-blue-500 mt-5 mr-0 ml-3" size={28} />
          )}
          {categoryName === "Adventure" && (
            <MountainSnowIcon className="text-blue-500 mt-5 mr-0 ml-3" size={28} />
          )}
          {categoryName === "Arcade" && (
            <Gamepad className="text-blue-500 mt-5 mr-0 ml-3" size={28} />
          )}
          {categoryName === "Puzzle & Logic" && (
            <PuzzleIcon className="text-blue-500 mt-5 mr-0 ml-3" size={28} />
          )}
          {categoryName === "Sports & Racing" && (
            <Car className="text-blue-500 mt-5 mr-0 ml-3" size={28} />
          )}
          {categoryName === "Strategy" && (
            <Brain className="text-blue-500 mt-5 mr-0 ml-3" size={28} />
          )}
        <h1 className="text-3xl font-bold text-white ml-3 mt-4">
          All {games[1].categories.en} Games
        </h1>
        </div>
        <button
          className="text-blue-400 hover:text-blue-300 transition-colors duration-300 mr-3 mt-4"
          onClick={() => router.back()}
        >
          Go Back
        </button>
      </div>
      {/* Mobile view */}
      <div className="lg:hidden space-y-4">
        {displayedGames.map((game, index) => (
          <div
            key={index}
            className="game-item p-4 flex items-center rounded-lg with-grey-hr"
          >
            <Image
              src={game.assets.thumb}
              alt={game.name.en}
              width={50}
              height={50}
              className="rounded-lg"
            />
            <div className="ml-4 flex-1">
              <h3 className="game-name text-white font-bold">{game.name.en}</h3>
              <div className="rating flex items-center">
                {Array.from({ length: 5 }, (_, idx) => {
                  const isFilled = idx < Math.floor(game.rating);
                  const isHalf =
                    idx === Math.floor(game.rating) && game.rating % 1 > 0;
                  return (
                    <span
                      key={idx}
                      className={`rating-star ${
                        isFilled
                          ? "text-yellow-400"
                          : isHalf
                          ? "text-yellow-300"
                          : "text-gray-400"
                      }`}
                    >
                      {isHalf ? "☆" : "★"}
                    </span>
                  );
                })}
                <span className="text-white ml-1 text-sm">
                  {game.rating.toFixed(1)}
                </span>
              </div>
            </div>
            <button className="mr-2" onClick={() => toggleFavorite(game)}>
              <Heart
                size={20}
                fill={favoriteStatus[game.code] ? "white" : "none"}
              />
            </button>
            <button
              className="play-button-blue text-blue-500 px-4 py-1 rounded"
              onClick={() => playGame(game)}
            >
              Play
            </button>
          </div>
        ))}
      </div>
      {/* Desktop view */}
      <div className="hidden lg:grid grid-cols-5 gap-6">
        {displayedGames.map(renderGameItem)}
      </div>
    </div>
  );
};

export default CategoryAllGames;
