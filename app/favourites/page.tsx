"use client";

import { Game } from "@/types";
import {
  addToRecentlyPlayed,
  getFavs,
  removeGameFromFav,
} from "@/utils/storage";
import { Heart } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Favourites() {
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    setGames(getFavs());
  }, []);

  const playGame = (game: Game) => {
    addToRecentlyPlayed(game);
    window.location.href = game.url;
  };

  const refreshFavs = () => {
    setGames(getFavs());
  };

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
        <button
          className="mr-2"
          onClick={() => {
            removeGameFromFav(game);
            refreshFavs();
          }}
        >
          <Heart size={20} fill={"white"} />
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
      <div className="flex justify-between items-center mb-4 m-4">
        <div className="flex items-center">
          <Heart className="text-blue-500 mt-1 mr-2" size={24} />
          <h2 className="text-2xl font-bold text-white first-letter:uppercase">
            Favourites
          </h2>
        </div>
      </div>

      {games.length === 0 ? (
        <div className="ml-4">No favourites added</div>
      ) : null}

      <div className="game-list">
        {/* Mobile view */}
        <div className="lg:hidden space-y-0">
          {games.map((game, index) => (
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
              <button
                className="mr-2"
                onClick={() => {
                  removeGameFromFav(game);
                  refreshFavs();
                }}
              >
                <Heart size={20} fill={"white"} />
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
          {games.map(renderGameItem)}
        </div>
      </div>
    </div>
  );
}
