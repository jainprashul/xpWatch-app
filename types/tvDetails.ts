export interface TVDetails {
    adult:                boolean;
    backdrop_path:        string;
    created_by:           CreatedBy[];
    episode_run_time:     any[];
    first_air_date:       Date;
    genres:               Genre[];
    homepage:             string;
    id:                   number;
    in_production:        boolean;
    languages:            OriginalLanguage[];
    last_air_date:        Date;
    last_episode_to_air:  LastEpisodeToAir;
    name:                 string;
    next_episode_to_air:  null;
    networks:             Network[];
    number_of_episodes:   number;
    number_of_seasons:    number;
    origin_country:       string[];
    original_language:    OriginalLanguage;
    original_name:        string;
    overview:             string;
    popularity:           number;
    poster_path:          string;
    production_companies: Network[];
    production_countries: ProductionCountry[];
    seasons:              Season[];
    spoken_languages:     SpokenLanguage[];
    status:               string;
    tagline:              string;
    type:                 string;
    vote_average:         number;
    vote_count:           number;
    credits?:             Credits;
    videos:               Videos;
    images:               Images;
    keywords:             Keywords;
    recommendations?:      Recommendations;
    similar?:              Recommendations;
    external_ids:         ExternalIDS;
}

export interface CreatedBy {
    id:           number;
    credit_id:    string;
    name:         string;
    gender:       number;
    profile_path: string;
}

export interface Credits {
    cast: Cast[];
    crew: any[];
}

export interface Cast {
    adult:                boolean;
    gender:               number;
    id:                   number;
    known_for_department: KnownForDepartment;
    name:                 string;
    original_name:        string;
    popularity:           number;
    profile_path:         string;
    character:            string;
    credit_id:            string;
    order:                number;
}

export enum KnownForDepartment {
    Acting = "Acting",
}

export interface ExternalIDS {
    imdb_id:      string;
    freebase_mid: null;
    freebase_id:  null;
    tvdb_id:      number;
    tvrage_id:    null;
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
    results: Genre[];
}

export enum OriginalLanguage {
    De = "de",
    En = "en",
    Es = "es",
    Ja = "ja",
    Ko = "ko",
    Tl = "tl",
}

export interface LastEpisodeToAir {
    id:              number;
    name:            string;
    overview:        string;
    vote_average:    number;
    vote_count:      number;
    air_date:        Date;
    episode_number:  number;
    episode_type:    string;
    production_code: string;
    runtime:         number;
    season_number:   number;
    show_id:         number;
    still_path:      string;
}

export interface Network {
    id:             number;
    logo_path:      null | string;
    name:           string;
    origin_country: string;
}

export interface ProductionCountry {
    iso_3166_1: string;
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
    name:              string;
    title?:             string;
    original_language: OriginalLanguage;
    original_name:     string;
    overview:          string;
    poster_path:       null | string;
    media_type?:       MediaType;
    genre_ids:         number[];
    popularity:        number;
    first_air_date:    string;
    vote_average:      number;
    vote_count:        number;
    origin_country:    string[];
}

export enum MediaType {
    Tv = "tv",
}

export interface Season {
    air_date:      Date;
    episode_count: number;
    id:            number;
    name:          string;
    overview:      string;
    poster_path:   string;
    season_number: number;
    vote_average:  number;
}

export interface SpokenLanguage {
    english_name: string;
    iso_639_1:    OriginalLanguage;
    name:         string;
}

export interface Videos {
    results: VideosResult[];
}

export interface VideosResult {
    iso_639_1:    OriginalLanguage;
    iso_3166_1:   string;
    name:         string;
    key:          string;
    site:         string;
    size:         number;
    type:         string;
    official:     boolean;
    published_at: Date;
    id:           string;
}
