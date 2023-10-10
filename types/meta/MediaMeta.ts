export interface MediaMini {
    id : string;
    title : string;
    media_type : "movie" | "tv" | "anime" | "anilist";
    poster : string;   
    year : string | number;
    description? : string;
    totalCount? : number;
}