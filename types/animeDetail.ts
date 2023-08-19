export interface AnimeDetail {
    id:                string;
    slug:              string;
    anilistId:         number;
    coverImage:        string;
    bannerImage:       string;
    status:            string;
    season:            Season;
    title:             Title;
    mappings:          Mappings;
    currentEpisode:    number;
    next:              Date;
    synonyms:          string[];
    countryOfOrigin:   CountryOfOrigin;
    lastEpisodeUpdate: Date;
    seasonInt:         number;
    description:       string;
    duration:          number;
    averageScore:      number;
    popularity:        number;
    color:             string;
    year:              number;
    createdAt:         Date;
    updatedAt:         Date;
    format:            string;
    lastChecks?:        { [key: string]: number };
    genre:             string[];
    episodes?:          Episode[];
    relations?:         Relation[];
}

export enum CountryOfOrigin {
    Jp = "JP",
}

export interface Episode {
    id:              string;
    number:          number;
    title:           string;
    titleVariations: TitleVariations;
    description:     string;
    image:           string;
    createdAt:       Date;
    airedAt:         Date;
    sources:         Source[];
}

export interface Source {
    id:     string;
    target: string;
}

export interface TitleVariations {
    native?:   string;
    english:   string;
    japanese?: string;
}

export interface Mappings {
    mal:            number;
    anidb?:         number;
    kitsu:          number;
    anilist:        number;
    thetvdb?:       number;
    anisearch:      number;
    livechart:      number;
    "notify.moe"?:  string;
    "anime-planet": string;
    imdb?:          string;
    themoviedb?:    number;
}

export interface Relation {
    type:    Type;
    animeId: string;
    id:      string;
    anime:   Anime;
}

export interface Anime {
    id:                string;
    slug:              string;
    anilistId:         number;
    coverImage:        string;
    bannerImage:       null | string;
    status:            Status;
    season:            Season;
    title:             Title;
    mappings:          Mappings;
    currentEpisode:    number;
    next:              null;
    synonyms:          string[];
    countryOfOrigin:   CountryOfOrigin;
    lastEpisodeUpdate: Date | null;
    seasonInt:         number | null;
    description:       null | string;
    duration:          number | null;
    averageScore:      number | null;
    popularity:        number;
    color:             null | string;
    year:              number | null;
    createdAt:         Date;
    updatedAt:         Date;
    format:            Format;
    lastChecks:        { [key: string]: number } | null;
}

export enum Format {
    Movie = "MOVIE",
    Ova = "OVA",
    Special = "SPECIAL",
    Unknown = "UNKNOWN",
}

export enum Season {
    Fall = "FALL",
    Spring = "SPRING",
    Summer = "SUMMER",
    Unknown = "UNKNOWN",
    Winter = "WINTER",
}

export enum Status {
    Finished = "FINISHED",
    NotYetReleased = "NOT_YET_RELEASED",
}

export interface Title {
    native:        string;
    romaji:        string;
    english:       null | string;
    userPreferred: string;
}

export enum Type {
    Prequel = "PREQUEL",
    SideStory = "SIDE_STORY",
}
