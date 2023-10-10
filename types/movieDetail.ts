export interface MovieDetail {
    adult:                 boolean;
    backdrop_path:         string;
    belongs_to_collection: BelongsToCollection;
    budget:                number;
    genres:                Genre[];
    homepage:              string;
    id:                    number;
    imdb_id:               string;
    original_language:     OriginalLanguage;
    original_title:        string;
    overview:              string;
    popularity:            number;
    poster_path:           string;
    production_companies:  ProductionCompany[];
    production_countries:  ProductionCountry[];
    release_date:          Date;
    revenue:               number;
    runtime:               number;
    spoken_languages:      SpokenLanguage[];
    status:                string;
    tagline:               string;
    title:                 string;
    video:                 boolean;
    vote_average:          number;
    vote_count:            number;
    credits?:               Credits;
    videos:                Videos;
    images:                Images;
    keywords:              Keywords;
    recommendations?:       Recommendations;
    similar?:               Recommendations;
    external_ids:          ExternalIDS;
}

export interface BelongsToCollection {
    id:            number;
    name:          string;
    poster_path:   string;
    backdrop_path: string;
}

export interface Credits {
    cast: Cast[];
    crew: Cast[];
}

export interface Cast {
    adult:                boolean;
    gender:               number;
    id:                   number;
    known_for_department: Department;
    name:                 string;
    original_name:        string;
    popularity:           number;
    profile_path:         null | string;
    cast_id?:             number;
    character?:           string;
    credit_id:            string;
    order?:               number;
    department?:          Department;
    job?:                 string;
}

export enum Department {
    Acting = "Acting",
    Art = "Art",
    Camera = "Camera",
    CostumeMakeUp = "Costume & Make-Up",
    Crew = "Crew",
    Directing = "Directing",
    Editing = "Editing",
    Lighting = "Lighting",
    Production = "Production",
    Sound = "Sound",
    VisualEffects = "Visual Effects",
    Writing = "Writing",
}

export interface ExternalIDS {
    imdb_id:      string;
    wikidata_id:  string;
    facebook_id:  string;
    instagram_id: string;
    twitter_id:   string;
}

export interface Genre {
    id:   number;
    name: string;
}

export interface Images {
    backdrops: any[];
    logos:     any[];
    posters:   any[];
}

export interface Keywords {
    keywords: Genre[];
}

export enum OriginalLanguage {
    En = "en",
}

export interface ProductionCompany {
    id:             number;
    logo_path:      null | string;
    name:           string;
    origin_country: OriginCountry;
}

export enum OriginCountry {
    Us = "US",
}

export interface ProductionCountry {
    iso_3166_1: OriginCountry;
    name:       string;
}

export interface Recommendations {
    page:          number;
    results:       RecommendationsResult[];
    total_pages:   number;
    total_results: number;
}

export interface RecommendationsResult {
    adult:             boolean;
    backdrop_path:     null | string;
    id:                number;
    title:             string;
    name?:              string;
    original_language: string;
    original_title:    string;
    overview:          string;
    poster_path:       null | string;
    media_type?:       string;
    genre_ids:         number[];
    popularity:        number;
    release_date:      Date;
    video:             boolean;
    vote_average:      number;
    vote_count:        number;
}

export enum MediaType {
    Movie = "movie",
}

export interface SpokenLanguage {
    english_name: string;
    iso_639_1:    string;
    name:         string;
}

export interface Videos {
    results: VideosResult[];
}

export interface VideosResult {
    iso_639_1:    OriginalLanguage;
    iso_3166_1:   OriginCountry;
    name:         string;
    key:          string;
    site:         Site;
    size:         number;
    type:         Type;
    official:     boolean;
    published_at: Date;
    id:           string;
}

export enum Site {
    YouTube = "YouTube",
}

export enum Type {
    BehindTheScenes = "Behind the Scenes",
    Clip = "Clip",
    Featurette = "Featurette",
    Teaser = "Teaser",
    Trailer = "Trailer",
}
