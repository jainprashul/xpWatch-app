export interface AnilistRes {
    currentPage: number;
    hasNextPage: boolean;
    results:     AniList[];
}

export interface AniList {
    id:            string;
    malId:         number;
    title:         Title;
    image:         string;
    trailer?:       Trailer;
    popularity?:    number;
    description:   string;
    status:        Status;
    cover:         string;
    rating:        number;
    releaseDate:   number;
    color:         string;
    genres:        string[];
    totalEpisodes: number;
    duration:      number;
    type:          Type;

    // added by me
    media_type?:     "tv" | "movie" | "anime";
}

export enum Status {
    Completed = "Completed",
    Ongoing = "Ongoing",
}

export interface Title {
    romaji:        string;
    english:       string;
    native:        string;
    userPreferred: string;
}

export interface Trailer {
    id?:        string;
    site?:      string;
    thumbnail?: string;
}

export enum Type {
    Tv = "TV",
    Movie = "MOVIE",
}