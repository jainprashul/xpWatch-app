export interface MediaMini {
    id: string;
    title: string;
    media_type: "movie" | "tv" | "anime" | "anilist";
    poster: string | null;
    year: string | number;
    description?: string;
    totalCount?: number;
    relation?: string;
}


interface Media extends MediaMini {
    cover: string;
    tagline?: string;
    ratings: number;
    genres: {
        id: number;
        name: string;
    }[];
    casts?: Cast[];
    recommendations?: MediaMini[];
    similar?: MediaMini[];
}

export interface MovieMeta extends Media {
    runtime: number;
    releaseDate: string;
    imdb: string;
}

export interface TVMeta extends Media {
    seasonCount: number;
    episodeCount: number;
    imdb: string;
    seasons: Season[];
}

export interface AnimeMeta extends Media {
    releaseDate: string;
    episodeCount: number;
    runtime: number;
    episodes: EpisodeMeta[];
}

type Cast = {
    id: number;
    name: string;
    character: string;
    image: string;
}

type Season = {
    id: number;
    seasonNumber: number;
    name: string;
    image?: string;
    description?: string;
    year: number | string;
    episodeCount: number;
}

export interface SeasonMeta extends Season {
    episodes: EpisodeMeta[];
}

export type EpisodeMeta = {
    id: number | string;
    episodeNumber: number;
    name: string;
    description?: string;
    releaseDate: string;
    runtime?: number;
    image?: string;
}