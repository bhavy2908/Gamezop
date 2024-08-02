"use client";
import {
  Swords,
  MountainSnowIcon,
  Gamepad,
  PuzzleIcon,
  Car,
  Brain,
  Heart
} from "lucide-react";
import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Game } from "../types/index";
import {
  addGameToFav,
  addToRecentlyPlayed,
  isFavorite,
  removeGameFromFav,
} from "@/utils/storage";

interface CategoryProps {
  categoryName: string;
  games: Game[];
}

const Category: React.FC<CategoryProps> = ({ categoryName, games }) => {
  const [displayedGames, setDisplayedGames] = useState(games.slice(0, 5));

  const playGame = (game: Game) => {
    addToRecentlyPlayed(game);
    window.location.href = game.url;
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
      <h3 className="game-name text-white font-bold text-center">
        {game.name.en}
      </h3>
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
          className="play-button-blue text-blue-500"
          onClick={() => playGame(game)}
        >
          Play
        </button>
      </div>
    </div>
  );

  return (
    <div className="category-container mb-8">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          {categoryName === "action" && (
            <Swords className="text-blue-500 mt-1 mr-2" size={24} />
          )}
          {categoryName === "adventure" && (
            <MountainSnowIcon className="text-blue-500 mt-1 mr-2" size={24} />
          )}
          {categoryName === "arcade" && (
            <Gamepad className="text-blue-500 mt-1 mr-2" size={24} />
          )}
          {categoryName === "puzzle" && (
            <PuzzleIcon className="text-blue-500 mt-1 mr-2" size={24} />
          )}
          {categoryName === "racing" && (
            <Car className="text-blue-500 mt-1 mr-2" size={24} />
          )}
          {categoryName === "strategy" && (
            <Brain className="text-blue-500 mt-1 mr-2" size={24} />
          )}
          <h2 className="text-2xl font-bold text-white first-letter:uppercase">
            {categoryName} Games
          </h2>
        </div>

        <Link href={`/category/${encodeURIComponent(categoryName)}`}>
          {" "}
          <span className="text-blue-400 hover:text-blue-300 transition-colors duration-300 mr-5">
            See All
          </span>
        </Link>
      </div>
      <div className="game-list">
        {/* Mobile view */}
        <div className="lg:hidden space-y-0">
          {displayedGames.map((game, index) => (
            <div
              key={index}
              className="game-item p-4 flex items-center rounded-lg with-grey-hr"
            >
              <Image
                src={game.assets.thumb}
                alt={game.name.en}
                width={60}
                height={60}
                className="rounded-lg"
              />
              <div className="ml-4 flex-1">
                <h4 className="game-name-small text-white font-bold">
                  {game.name.en}
                </h4>
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
        <div className="hidden lg:grid grid-cols-5 gap-4">
          {displayedGames.map(renderGameItem)}
        </div>
      </div>
    </div>
  );
};

export default Category;
