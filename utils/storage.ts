import { Game } from "@/types";

const FAV_KEY = "gamezop:favourites";
const RECENTLY_PLAYED_KEY = "gamezop:recent";

function safeLocalStorage() {
  if (typeof window !== 'undefined') {
    return window.localStorage;
  }
  return null;
}


export function addGameToFav(game: Game) {
  const storage = safeLocalStorage();
  if (storage) {
    const favs = getFavs();
    const newFavs = [game, ...favs];
    storage.setItem(FAV_KEY, JSON.stringify(newFavs));
  }
}

export function getFavs(): Game[] {
  const storage = safeLocalStorage();
  if (storage) {
    const favs = storage.getItem(FAV_KEY);
    if (favs) return JSON.parse(favs);
  }
  return [];
}

export function removeGameFromFav(game: Game) {
  const storage = safeLocalStorage();
  if (storage) {
    const favs = getFavs();
    const newFavs = favs.filter((fav) => fav.code !== game.code);
    storage.setItem(FAV_KEY, JSON.stringify(newFavs));
  }
}

export function isFavorite(game: Game) {
  const favs = getFavs();
  return !!favs.find((fav) => fav.code === game.code);
}


type RecentlyPlayed = { game: Game; timestamp: number };

export function addToRecentlyPlayed(game: Game) {
  const storage = safeLocalStorage();
  if (storage) {
    const playedIndex = alreadyPlayed(game);
    const recentlyPlayed = getRecentlyPlayed();
    if (playedIndex === -1) {
      recentlyPlayed.push({ game, timestamp: Date.now() });
    } else {
      recentlyPlayed[playedIndex].timestamp = Date.now();
    }
    storage.setItem(RECENTLY_PLAYED_KEY, JSON.stringify(recentlyPlayed));
  }
}

export function getRecentlyPlayed(): RecentlyPlayed[] {
  const storage = safeLocalStorage();
  if (storage) {
    const rp = storage.getItem(RECENTLY_PLAYED_KEY);
    if (rp) return JSON.parse(rp);
  }
  return [];
}

function alreadyPlayed(game: Game) {
  const recentlyPlayed = getRecentlyPlayed();
  return recentlyPlayed.findIndex((val) => val.game.code === game.code);
}