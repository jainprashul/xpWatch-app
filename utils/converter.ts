import { MediaMini } from "../types/meta/MediaMeta";
import { AniList } from "../types/anilist";
import { Media } from "../types/media";
import { RecommendationsResult } from "../types/movieDetail";

function getYear(date: Date | undefined) {
    if (!date) return ''
    return new Date(date).getFullYear() ?? ''
}

export function TMDB_to_MediaMini(data : Media){
    const _data : MediaMini = {
        id: data.id.toString(),
        title: data.title || data.name || data.original_title || data.original_name || '',
        media_type: data.media_type,
        poster: `https://image.tmdb.org/t/p/w342${data.poster_path}`,
        year: getYear(data.release_date || data.first_air_date),
        description: data.overview,
    } 
    return _data
}


export function AniList_to_MediaMini(data : AniList){
    const _data : MediaMini = {
        id: data.id.toString(),
        title: data.title.romaji || data.title.english || data.title.native || '',
        media_type: "anilist",
        poster: data.image,
        year: data.releaseDate,
        description: data.description,
        totalCount: data.totalEpisodes,
    }
    return _data
}

export function Recommendations_to_MediaMini(data : RecommendationsResult){
    const _data : MediaMini = {
        id: data.id.toString(),
        title: data.title ?? data.name ?? '' ,
        media_type: data.media_type as any,
        poster: `https://image.tmdb.org/t/p/w342${data.poster_path}`,
        year: getYear(data.release_date),
        description: data.overview,
    } 
    return _data
}