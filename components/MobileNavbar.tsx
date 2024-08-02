"use client";

import { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Grid, Heart, User, Search, X, Swords, MountainSnow, Gamepad, PuzzleIcon, Car, Brain } from 'lucide-react';
import debounce from 'lodash/debounce';

interface MobileNavbarProps {
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

export default function MobileNavbar({ className = '' }: MobileNavbarProps) {
  const pathname = usePathname();
  const [isExtended, setIsExtended] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Game[]>([]);
  const [categoryResults, setCategoryResults] = useState<string[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [hasFetchedGames, setHasFetchedGames] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);
  const navbarRef = useRef<HTMLDivElement>(null);

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

  const toggleCategories = () => {
    setIsExtended(!isExtended);
    setIsSearchOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    setIsExtended(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target as Node)) {
        setIsExtended(false);
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'action':
        return <Swords className="text-blue-500" size={24} />;
      case 'adventure':
        return <MountainSnow className="text-blue-500" size={24} />;
      case 'arcade':
        return <Gamepad className="text-blue-500" size={24} />;
      case 'puzzle':
        return <PuzzleIcon className="text-blue-500" size={24} />;
      case 'racing':
        return <Car className="text-blue-500" size={24} />;
      case 'strategy':
        return <Brain className="text-blue-500" size={24} />;
      default:
        return null;
    }
  };

  const handleCategoryClick = (category: string) => {
    router.push(`/category/${category.toLowerCase().replace(' & ', '-')}`);
    setIsExtended(false);
  };

  return (
    <nav 
      ref={navbarRef} 
      className={`bg-[#333333] bg-opacity-100 backdrop-blur-md fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ${className} ${
        isExtended ? 'h-64' : isSearchOpen ? 'h-24' : 'h-16'
      }`}
    >
      {isExtended && (
        <div className="grid grid-cols-2 gap-4 p-4 mb-16">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className="flex items-center justify-center bg-gray-700 rounded p-2 text-white"
            >
              {getCategoryIcon(category)}
              <span className="ml-2">{category}</span>
            </button>
          ))}
        </div>
      )}
      {isSearchOpen && (
        <div className="absolute bottom-16 left-0 right-0 bg-[#333333]">
          {(searchResults.length > 0 || categoryResults.length > 0) && (
            <div className="bg-white w-full rounded-t-md shadow-lg max-h-40 overflow-y-auto">
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
          <form onSubmit={handleSearch} className="flex text-black p-2bg-[#333333] bg-opacity-100 backdrop-blur-md p-4">
            <input
              ref={searchRef}
              type="text"
              placeholder="Search games or categories"
              className="flex-grow p-2 rounded-l-md border border-gray-300 rounded-r-none"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button className="bg-blue-500 text-white p-2 rounded-r-md">
              <Search size={20} />
            </button>
          </form>
        </div>
      )}
      <div className="flex justify-around items-center h-16 absolute bottom-0 left-0 right-0">
        <NavItem href="/" icon={<Home size={24} />} label="Home" isActive={pathname === '/'} />
        <NavItem href="#" icon={<Grid size={24} />} label="Categories" isActive={isExtended} onClick={toggleCategories} />
        <NavItem href="/favourites" icon={<Heart size={24} />} label="Favourites" isActive={pathname === '/favourites'} />
        <NavItem href="#" icon={isSearchOpen ? <X size={24} /> : <Search size={24} />} label="Search" isActive={isSearchOpen} onClick={toggleSearch} />
      </div>
    </nav>
  );
}

function NavItem({ href, icon, label, isActive, onClick }: { href: string; icon: React.ReactNode; label: string; isActive: boolean; onClick?: () => void }) {
  return (
    <Link href={href} className={`flex flex-col items-center ${isActive ? 'text-blue-500' : 'text-gray-400'} hover:text-blue-300`} onClick={onClick}>
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </Link>
  );
}