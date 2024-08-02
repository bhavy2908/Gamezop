import { Suspense, lazy } from "react";
import { games } from "@/utils/games";
import { LazyLoadComponent } from "@/components/LazyLoadComponent";

const GameCarousel = lazy(() => import("@/components/Carousel"));
const RecentlyPlayedGames = lazy(() => import("@/components/RecentlyPlayedGames"));
const Category = lazy(() => import("@/components/Category"));

export default function Home() {
  return (
    <main className="flex-grow p-4 md:p-8">
      <div className="md:hidden flex items-center mb-4">
        <img
          src="https://www.gamezop.com/_next/image?url=https%3A%2F%2Fstatic.gamezop.com%2Flogo%2Fgamezop-logo-dark.png&w=384&q=75"
          alt="Gamezop Logo"
          width={150}
          height={80}
          className="mb-0"
          loading="lazy"
        />
      </div>
      <Suspense fallback={<div>Loading games...</div>}>
        
          <GameCarousel games={games} />
          <RecentlyPlayedGames />
          <Category categoryName="action" games={games.slice(0, 5)} />
        <LazyLoadComponent>
          <Category categoryName="adventure" games={games.slice(5, 10)} />
        </LazyLoadComponent>
        <LazyLoadComponent>
          <Category categoryName="arcade" games={games.slice(10, 15)} />
        </LazyLoadComponent>
        <LazyLoadComponent>
          <Category categoryName="puzzle" games={games.slice(15, 20)} />
        </LazyLoadComponent>
        <LazyLoadComponent>
          <Category categoryName="racing" games={games.slice(20, 25)} />
        </LazyLoadComponent>
        <LazyLoadComponent>
          <Category categoryName="strategy" games={games.slice(25, 30)} />
        </LazyLoadComponent>
      </Suspense>
    </main>
  );
}