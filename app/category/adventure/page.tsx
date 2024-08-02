"use client";

import { useEffect, useState } from "react";
import CategoryAllGames from "../../../components/CategoryAllGames";
import { Game } from "../../../types/index";

const CategoryPage: React.FC = () => {
  const categoryName = "Adventure";
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCategoryData = async () => {
      if (!categoryName) {
        setLoading(false);
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_GAMES_API_URL;
      if (!apiUrl) {
        console.error("NEXT_PUBLIC_GAMES_API_URL is not defined");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(apiUrl, { cache: "no-store" });
        if (!res.ok) {
          throw new Error(`Failed to fetch games: ${res.statusText}`);
        }
        const data = await res.json();
        const allGames: Game[] = data.games;

        const categoryGames = allGames.filter(
          (game) => game.categories.en[0] === categoryName
        );

        setGames(categoryGames);
      } catch (error) {
        console.error("Error fetching or processing data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [categoryName]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <CategoryAllGames categoryName={"Action"} games={games} />;
};

export default CategoryPage;
