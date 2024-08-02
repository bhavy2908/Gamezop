"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Head from "next/head";
import { useRouter } from "next/navigation";

import { Game } from "../types/index";
import {
addGameToFav,
addToRecentlyPlayed,
isFavorite,
removeGameFromFav,
} from "@/utils/storage";

interface GameCarouselProps {
games: Game[];
}

export default function GameCarousel({ games }: GameCarouselProps) {
const router = useRouter();
const limitedGames = games.slice(10, 15);

const [currentIndex, setCurrentIndex] = useState(0);
const [fade, setFade] = useState(true);

useEffect(() => {
const interval = setInterval(() => {
setFade(false);
setTimeout(() => {
setCurrentIndex((prevIndex) => (prevIndex + 1) % limitedGames.length);
setFade(true);
}, 500);
}, 10000);

return () => clearInterval(interval);
}, [limitedGames.length]);

const currentGame = limitedGames[currentIndex];

const handleGameClick = (index: number) => {
setCurrentIndex(index);
};

const playGame = (game: Game) => {
addToRecentlyPlayed(game);
router.push(game.url);
};

return (
<div className="carousel-wrapper mb-6 flex">


    <div className="carousel-container">
        <div className={`carousel-slide ${fade ? "fade-in" : "fade-out" }`}>
            <div className="carousel-image relative">

                <Head>
                    <link rel="preload" as="image" href="https://static.gamezop.com/NJ3xGOyfb5l/cover.jpg" />
                </Head>

                <Image src={currentGame.assets.cover} alt={currentGame.name.en} className="carousel-img" width={100}
                    height={100} />
            </div>
            <div className="carousel-details">
                <div className="details-overlay">
                    <p className="featured">FEATURED</p>
                    <p className="category">{currentGame.categories.en}</p>
                    <p className="description">{currentGame.description.en}</p>
                </div>
            </div>
            <div className="carousel-footer backdrop-blur-md">
                <div className="footer-left">
                    <Image src={currentGame.assets.thumb} alt={currentGame.name.en} className="brick-image" width={20}
                        height={20} loading="lazy" fetchPriority="high" />
                    <div className="game-info">
                        <h3 className="game-name">{currentGame.name.en}</h3>
                        <div className="rating flex items-center">
                            {Array.from({ length: 5 }, (_, index) => {
                            const isFilled = index < Math.floor(currentGame.rating); const
                                isHalf=index===Math.floor(currentGame.rating) && currentGame.rating % 1> 0;
                                return (
                                <span key={index} className={`rating-star ${ isFilled ? "text-yellow-400" : isHalf
                                    ? "text-yellow-300" : "text-gray-400" }`}>
                                    {isHalf ? "☆" : "★"}
                                </span>
                                );
                                })}
                                <span className="rating-value text-white ml-1 font-bold">
                                    {currentGame.rating.toFixed(1)}
                                </span>
                                <span className="rating-count text-gray-400 ml-1">
                                    ({currentGame.numberOfRatings})
                                </span>
                        </div>
                    </div>
                </div>
                {/* {isFavorite(currentGame) ? (
                <button className="mr-2" onClick={()=> removeGameFromFav(currentGame)}
                    >
                    <Heart fill="white" size={20} />
                </button>
                ) : (
                <button className="mr-2" onClick={()=> addGameToFav(currentGame)}
                    >
                    <Heart size={20} />
                </button>
                )} */}
                <button className="play-button" onClick={()=> playGame(currentGame)}
                    >
                    Play
                </button>
            </div>
        </div>
    </div>
    <div className="game-sidebar hidden lg:block lg:w-1/3 ml-2">
        {limitedGames.map((game, index) => (
        <div key={index} className={`game-item ${ currentIndex===index ? "black" : "black" } p-4 flex items-center
            rounded`} onClick={()=> handleGameClick(index)}
            style={{ backgroundColor: currentIndex === index ? "#333" : "" }}
            >
            <Image src={game.assets.thumb} alt={game.name.en} className="brick-image" width={50} height={50}
                loading="lazy" />
            <div className="ml-4 flex-1">
                <h3 className="game-name text-white font-bold">{game.name.en}</h3>
                <div className="rating flex items-center">
                    {Array.from({ length: 5 }, (_, idx) => {
                    const isFilled = idx < Math.floor(game.rating); const isHalf=idx===Math.floor(game.rating) &&
                        game.rating % 1> 0;
                        return (
                        <span key={idx} className={`rating-star ${ isFilled ? "text-yellow-400" : isHalf
                            ? "text-yellow-300" : "text-gray-400" }`}>
                            {isHalf ? "☆" : "★"}
                        </span>
                        );
                        })}
                        <span className="rating-value text-white ml-1 font-bold">
                            {game.rating.toFixed(1)}
                        </span>
                        <span className="rating-count text-gray-400 ml-1">
                            ({game.numberOfRatings})
                        </span>
                </div>
            </div>
            {/* {isFavorite(game) ? (
            <button className="mr-0" onClick={()=> removeGameFromFav(game)}>
                <Heart fill="white" size={20} />
            </button>
            ) : (
            <button className="mr-0" onClick={()=> addGameToFav(game)}>
                <Heart size={20} />
            </button>
            )} */}
            <button className="play-button-blue text-blue-500 ml-4" onClick={()=> playGame(game)}>
                Play
            </button>
        </div>
        ))}
    </div>
</div>
);
}