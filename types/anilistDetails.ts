export interface AniListDetail {
    id:                string;
    title:             Title;
    malId:             number;
    synonyms:          string[];
    isLicensed:        boolean;
    isAdult:           boolean;
    countryOfOrigin:   string;
    image:             string;
    popularity:        number;
    color:             string;
    cover:             string;
    description:       string;
    status:            Status;
    releaseDate:       number;
    startDate:         EndDateClass;
    endDate:           EndDateClass;
    nextAiringEpisode: NextAiringEpisode;
    totalEpisodes:     number;
    currentEpisode:    number;
    rating:            number;
    duration:          number;
    genres:            string[];
    season:            string;
    studios:           string[];
    subOrDub:          string;
    type:              string;
    recommendations?:   Ation[];
    characters:        Character[];
    relations?:         Ation[];
    episodes?:          EpisodeAni[];
}

export interface Character {
    id:          number;
    role:        Role;
    name:        Name;
    image:       string;
    voiceActors: VoiceActor[];
}

export interface Name {
    first:         string;
    last:          null | string;
    full:          string;
    native:        null | string;
    userPreferred: string;
}

export enum Role {
    Main = "MAIN",
    Supporting = "SUPPORTING",
}

export interface VoiceActor {
    id:       number;
    language: Language;
    name:     Name;
    image:    string;
}

export enum Language {
    English = "English",
    French = "French",
    German = "German",
    Hebrew = "Hebrew",
    Italian = "Italian",
    Japanese = "Japanese",
    Korean = "Korean",
    Portuguese = "Portuguese",
    Spanish = "Spanish",
}

export interface EndDateClass {
    year:  number | null;
    month: number | null;
    day:   number | null;
}

export interface EpisodeAni {
    id:          string;
    title:       null | string;
    image:       string;
    number:      number;
    createdAt:   Date | null;
    description: null;
    url:         string;
}

export interface NextAiringEpisode {
    airingTime:      number;
    timeUntilAiring: number;
    episode:         number;
}

export interface Ation {
    id:            number;
    malId:         number | null;
    title:         Title;
    status:        Status;
    episodes:      number | null;
    image:         string;
    cover:         string;
    rating:        number | null;
    type:          null | string;
    relationType?: RelationType;
    color?:        null | string;
}

export enum RelationType {
    Adaptation = "ADAPTATION",
    Alternative = "ALTERNATIVE",
    Character = "CHARACTER",
    Other = "OTHER",
    Prequel = "PREQUEL",
    SideStory = "SIDE_STORY",
    Summary = "SUMMARY",
}

export enum Status {
    Completed = "Completed",
    NotYetAired = "Not yet aired",
    Ongoing = "Ongoing",
}

export interface Title {
    romaji:         string;
    english:        null | string;
    native:         string;
    userPreferred?: string;
}
