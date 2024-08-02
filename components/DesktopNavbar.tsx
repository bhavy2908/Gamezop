"use client";

import { useState, useCallback, useRef } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { Search, Home, Heart, Swords, MountainSnow, Gamepad, PuzzleIcon, Car, Brain } from "lucide-react";
import { usePathname } from "next/navigation";
import debounce from 'lodash/debounce';

interface DesktopNavbarProps {
  className?: string;
}

interface Game {
  code: string;
  url: string;
  name: {
    en: string;
  };
  categories: {
    en: string[];
  };
  assets: {
    cover: string;
  };
}

const categories = ["Action", "Adventure", "Arcade", "Puzzle", "Racing", "Strategy"];

export default function DesktopNavbar({ className = "" }: DesktopNavbarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Game[]>([]);
  const [categoryResults, setCategoryResults] = useState<string[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [hasFetchedGames, setHasFetchedGames] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchRef = useRef<HTMLInputElement>(null);

  const fetchGames = async () => {
    if (hasFetchedGames) return games;
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_GAMES_API_URL;
      if (!apiUrl) {
        throw new Error("NEXT_PUBLIC_GAMES_API_URL is not defined");
      }
      const res = await fetch(apiUrl);
      if (!res.ok) {
        throw new Error("Failed to fetch games");
      }
      const data = await res.json();
      setGames(data.games);
      setHasFetchedGames(true);
      return data.games;
    } catch (error) {
      console.error("Error fetching games:", error);
      return [];
    }
  };

  const performSearch = async (term: string, gameData: Game[]) => {
    if (term.length > 2) {
      const gameResults = gameData.filter(game => 
        game.name.en.toLowerCase().includes(term.toLowerCase()) ||
        game.categories.en.some(category => category.toLowerCase().includes(term.toLowerCase()))
      ).slice(0, 5);

      const uniqueCategories = Array.from(new Set(
        gameResults.flatMap(game => game.categories.en)
          .filter(category => category.toLowerCase().includes(term.toLowerCase()))
      )).slice(0, 3);

      setSearchResults(gameResults);
      setCategoryResults(uniqueCategories);
    } else {
      setSearchResults([]);
      setCategoryResults([]);
    }
  };

  const debouncedSearch = useCallback(
    debounce(async (term: string) => {
      let gameData = games;
      if (!hasFetchedGames) {
        gameData = await fetchGames();
      }
      performSearch(term, gameData);
    }, 300),
    [games, hasFetchedGames]
  );

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (!hasFetchedGames) {
      const gameData = await fetchGames();
      performSearch(term, gameData);
    } else {
      debouncedSearch(term);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'action':
        return <Swords className="text-blue-500 mt-1 mr-2" size={24} />;
      case 'adventure':
        return <MountainSnow className="text-blue-500 mt-1 mr-2" size={24} />;
      case 'arcade':
        return <Gamepad className="text-blue-500 mt-1 mr-2" size={24} />;
      case 'puzzle':
        return <PuzzleIcon className="text-blue-500 mt-1 mr-2" size={24} />;
      case 'racing':
        return <Car className="text-blue-500 mt-1 mr-2" size={24} />;
      case 'strategy':
        return <Brain className="text-blue-500 mt-1 mr-2" size={24} />;
      default:
        return null;
    }
  };

  return (
    <nav
      className={`w-90 p-4 flex flex-col fixed top-0 left-0 h-screen overflow-y-auto ${className}`}
      style={{ backgroundColor: "#333" }}
    >
      <div className="mb-6">
        <img
          src="https://www.gamezop.com/_next/image?url=https%3A%2F%2Fstatic.gamezop.com%2Flogo%2Fgamezop-logo-dark.png&w=384&q=75"
          alt="Gamezop Logo"
          width={150}
          height={80}
          className="mb-0 ml-2 mt-2"
          fetchPriority='high'
        />
      </div>
      <div className="mb-6 relative">
        <form onSubmit={handleSearch} className="flex text-black">
          <input
            ref={searchRef}
            type="text"
            placeholder="Search games or categories"
            className="flex-grow p-2 rounded-l-md border border-gray-300 2xl:min-w-[100px]"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button
            className="bg-blue-500 text-white p-2 rounded-r-md"
          >
            <Search size={20} />
          </button>
        </form>
        {(searchResults.length > 0 || categoryResults.length > 0) && (
          <div className="absolute z-10 bg-white w-full mt-1 rounded-md shadow-lg max-h-80 overflow-y-auto">
            {searchResults.map((game) => (
              <Link href={game.url} key={game.code} className="block p-2 hover:bg-gray-100 text-black">
                <img src={game.assets.cover} alt={game.name.en} className="w-8 h-8 inline-block mr-2" />
                {game.name.en}
              </Link>
            ))}
            {categoryResults.map((category) => (
              <Link 
                href={`/category/${category.toLowerCase().replace(' & ', '-')}`} 
                key={category} 
                className="block p-4 hover:bg-gray-100 font-bold text-black"
              >
                View All {category} Games
              </Link>
            ))}
          </div>
        )}
      </div>
      <div className="space-y-4">
        <NavItem href="/" icon={<Home className='text-white-500 mt-1 mr-2' size={24} />} label="Home" active={pathname === '/'} />
        <NavItem href="/favourites" icon={<Heart className='text-red-500 mt-1 mr-2' size={24} />} label="Favourites" active={pathname === '/favourites'} />
        {categories.map((category) => (
          <NavItem 
            key={category} 
            href={`/category/${category.toLowerCase().replace(' & ', '-')}`} 
            icon={getCategoryIcon(category)} 
            label={category} 
            active={pathname === `/category/${category.toLowerCase().replace(' & ', '-')}`}
          />
        ))}
      </div>
    </nav>
  );
}

function NavItem({
  href,
  icon,
  label,
  active,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex text-2xl font-bold first-letter:uppercase hover:opacity-100 ${
        active ? "text-blue-500" : "text-white opacity-70"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}