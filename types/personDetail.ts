export interface PersonDetail {
    adult:                boolean;
    also_known_as:        string[];
    biography:            string;
    birthday:             string;
    deathday:             null;
    gender:               number;
    homepage:             null;
    id:                   number;
    imdb_id:              string;
    known_for_department: string;
    name:                 string;
    place_of_birth:       string;
    popularity:           number;
    profile_path:         string;
    credits:              Credits;
    images:               Images;
    movie_credits:        Credits;
    tv_credits:           TvCredits;
}

export interface Credits {
    cast: CreditsCast[];
    crew: CreditsCast[];
}

export interface CreditsCast {
    adult:             boolean;
    backdrop_path:     null | string;
    genre_ids:         number[];
    id:                number;
    original_language: OriginalLanguage;
    original_title:    string;
    overview:          string;
    popularity:        number;
    poster_path:       null | string;
    release_date:      string;
    title:             string;
    video:             boolean;
    vote_average:      number;
    vote_count:        number;
    character?:        string;
    credit_id:         string;
    order?:            number;
    department?:       Department;
    job?:              Job;
}

export enum Department {
    Production = "Production",
}

export enum Job {
    AssociateProducer = "Associate Producer",
    ExecutiveProducer = "Executive Producer",
    Producer = "Producer",
}

export enum OriginalLanguage {
    En = "en",
}

export interface Images {
    profiles: Profile[];
}

export interface Profile {
    aspect_ratio: number;
    height:       number;
    iso_639_1:    null;
    file_path:    string;
    vote_average: number;
    vote_count:   number;
    width:        number;
}

export interface TvCredits {
    cast: TvCreditsCast[];
    crew: TvCreditsCast[];
}

export interface TvCreditsCast {
    adult:             boolean;
    backdrop_path:     null | string;
    genre_ids:         number[];
    id:                number;
    origin_country:    OriginCountry[];
    original_language: OriginalLanguage;
    original_name:     string;
    overview:          string;
    popularity:        number;
    poster_path:       string;
    first_air_date:    Date;
    name:              string;
    vote_average:      number;
    vote_count:        number;
    character?:        string;
    credit_id:         string;
    episode_count:     number;
    department?:       Department;
    job?:              Job;
}

export enum OriginCountry {
    Au = "AU",
    Us = "US",
}
