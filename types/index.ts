export interface Game {
    code: string;
    url: string;
    name: {
      en: string;
    };
    isPortrait: boolean;
    description: {
      en: string;
    };
    gamePreviews: {
      en: string;
    };
    assets: {
      cover: string;
      brick: string;
      thumb: string;
      wall: string;
      square: string;
      screens: string[];
      coverTiny: string;
      brickTiny: string;
    };
    categories: {
      en: string[];
    };
    tags: {
      en: string[];
    };
    width: number;
    height: number;
    colorMuted: string;
    colorVibrant: string;
    privateAllowed: boolean;
    rating: number;
    numberOfRatings: number;
    gamePlays: number;
    hasIntegratedAds: boolean;
  }