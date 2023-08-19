export interface AnimeRes {
    data: Anime[];
    meta: Meta;
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
    next:              Date;
    synonyms:          string[];
    countryOfOrigin:   CountryOfOrigin;
    lastEpisodeUpdate: Date | null;
    seasonInt:         number | null;
    description:       string;
    duration:          number;
    averageScore:      number;
    popularity:        number;
    color:             string;
    year:              number | null;
    createdAt:         Date;
    updatedAt:         Date;
    format:            Format;
    lastChecks?:        { [key: string]: number };
    genre:             string[];
}

export enum CountryOfOrigin {
    CN = "CN",
    Jp = "JP",
}

export enum Format {
    Ona = "ONA",
    Tv = "TV",
}

export interface Mappings {
    mal:            number;
    anidb:          number;
    kitsu:          number;
    anilist:        number;
    thetvdb:        number;
    anisearch:      number;
    livechart:      number;
    "notify.moe"?:  string;
    "anime-planet": string;
}

export enum Season {
    Fall = "FALL",
    Summer = "SUMMER",
    Unknown = "UNKNOWN",
    Winter = "WINTER",
}

export enum Status {
    Releasing = "RELEASING",
}

export interface Title {
    native:        string;
    romaji:        string;
    english:       string;
    userPreferred: string;
}

export interface Meta {
    total:       number;
    lastPage:    number;
    currentPage: number;
    perPage:     number;
    prev:        null;
    next:        number;
}
