import { AnimeMeta, MediaMini, MovieMeta, SeasonMeta, TVMeta } from "../types/meta/MediaMeta";
import { AniList } from "../types/anilist";
import { Media } from "../types/media";
import { MovieDetail, RecommendationsResult } from "../types/movieDetail";
import { TVDetails } from "../types/tvDetails";
import { SeasonDetail } from "../types/seasonDetail";
import { AniListDetail } from "../types/anilistDetails";
import { convertToDate } from "./utils";

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

export function TMDB_Movie_to_MediaMeta(data : MovieDetail){
        const _data : MovieMeta = {
            id: data.id.toString(),
            title: data.title || data.original_title || '',
            tagline: data.tagline,
            media_type: "movie",
            poster: `https://image.tmdb.org/t/p/w342${data.poster_path}`,
            year: getYear(data.release_date),
            description: data.overview,
            cover: `https://image.tmdb.org/t/p/w780${data.backdrop_path}`,
            ratings: data.vote_average,
            runtime: data.runtime,
            releaseDate: data.release_date.toString(),
            genres: data.genres,
            imdb: data.imdb_id,

            casts: data.credits?.cast.map((cast) => ({
                id: cast.id,
                name: cast.name,
                character: cast.character ?? "",
                image: `https://image.tmdb.org/t/p/w342${cast.profile_path}`,
            })),

            recommendations: data.recommendations?.results.map((result) => {
                return{
                id: result.id.toString(),
                title: result.title ?? result.name ?? '',
                media_type: result.media_type as any ?? "movie",
                poster: result.poster_path ? `https://image.tmdb.org/t/p/w342${result.poster_path}` : null,
                year: getYear(result.release_date),
                description: result.overview,
            }
            }),

            similar: data.similar?.results.map((result) => ({
                id: result.id.toString(),
                title: result.title ?? result.name ?? '',
                media_type: result.media_type as any ?? "movie",
                poster: `https://image.tmdb.org/t/p/w342${result.poster_path}`,
                year: getYear(result.release_date),
                description: result.overview,
            })),
        }
        return _data
    } 


export function TMDB_TV_to_TVMeta(data : TVDetails){
    const _data : TVMeta = {
        id: data.id.toString(),
        title: data.name || data.original_name || '',
        media_type: "tv",
        poster: `https://image.tmdb.org/t/p/w342${data.poster_path}`,
        year: getYear(data.first_air_date),
        description: data.overview,
        cover: `https://image.tmdb.org/t/p/w780${data.backdrop_path}`,
        ratings: data.vote_average,
        seasonCount: data.number_of_seasons,
        episodeCount: data.number_of_episodes,
        genres: data.genres,

        imdb : data.external_ids?.imdb_id,

        seasons: data.seasons.map((season) => ({
            id: season.id,
            seasonNumber: season.season_number,
            name: season.name,
            image: `https://image.tmdb.org/t/p/w342${season.poster_path}`,
            description: season.overview,
            year: getYear(season.air_date),
            episodeCount: season.episode_count,
        })),

        casts: data.credits?.cast.map((cast) => ({
            id: cast.id,
            name: cast.name,
            character: cast.character ?? "",
            image: `https://image.tmdb.org/t/p/w342${cast.profile_path}`,
        })),

        recommendations: data.recommendations?.results.map((result) => ({
            id: result.id.toString(),
            title: result.title ?? result.name ?? '',
            media_type: result.media_type as any ?? "tv",
            poster: `https://image.tmdb.org/t/p/w342${result.poster_path}`,
            year: getYear(result.first_air_date as any),
            description: result.overview,
        })),

        similar: data.similar?.results.map((result) => ({
            id: result.id.toString(),
            title: result.title ?? result.name ?? '',
            media_type: result.media_type as any ?? "tv",
            poster: `https://image.tmdb.org/t/p/w342${result.poster_path}`,
            year: getYear(result.first_air_date as any),
            description: result.overview,
        })),


    }
    return _data
}

export function Season_to_SeasonMeta(data : SeasonDetail){
    const _data : SeasonMeta = {
        id: data.id,
        seasonNumber: data.season_number,
        name: data.name,
        image: `https://image.tmdb.org/t/p/w342${data.poster_path}`,
        description: data.overview,
        year: getYear(data.air_date),
        episodeCount: data.episodes.length,
        episodes: data.episodes.map((episode) => ({
            id: episode.id,
            episodeNumber: episode.episode_number,
            name: episode.name,
            description: episode.overview,
            image: `https://image.tmdb.org/t/p/w342${episode.still_path}`,
            releaseDate: episode.air_date,
        })),
    }
    return _data
}

export function AniList_to_MediaMini(data : AniList){
    const _data : MediaMini = {
        id: data.id.toString(),
        title: data.title.english || data.title.romaji || data.title.native || '',
        media_type: "anilist",
        poster: data.image,
        year: data.releaseDate,
        description: data.description,
        totalCount: data.totalEpisodes,
    }
    return _data
}

export function AniList_to_AnimeMeta(data : AniListDetail){
    const _data : AnimeMeta = {
        id: data.id.toString(),
        title: data.title.romaji || data.title.english || data.title.native || '',
        media_type: "anilist",
        poster: data.image,
        year: data.releaseDate,
        description: data.description,
        totalCount: data.totalEpisodes,
        episodeCount: data.totalEpisodes,
        runtime: data.duration,
        cover: data.cover,
        ratings: data.rating / 10,
        releaseDate : convertToDate(data.startDate.day, data.startDate.month, data.startDate.year).toLocaleDateString(),
        genres: data.genres.map((genre, i) => ({
            id: i, name: genre
        })),
        episodes: data.episodes?.map((episode) => ({
            id: episode.id,
            episodeNumber: episode.number,
            name: episode.title ?? `Episode ${episode.number}`,
            description: episode.description ?? '',
            image: episode.image,
            releaseDate: episode.createdAt as any ?? '',
        })) ?? [],

        casts: data.characters?.map((character) => ({
            id: character.id,
            character: character.name.full,
            name: character.voiceActors[0]?.name.full ?? '',
            image: character.image,
        })) ?? [],

        tagline: data.title.native,
        recommendations: data.recommendations?.map((recommendation) => ({
            id: recommendation.id.toString(),
            title:  recommendation.title.english || recommendation.title.romaji || recommendation.title.native || '',
            media_type: "anilist",
            poster: recommendation.image,
            year: recommendation.type ?? '',
            description: "",
            relation: recommendation.relationType ?? '',
        })) ?? [],

        similar: data.relations?.map((similar) => ({
            id: similar.id.toString(),
            title: similar.title.romaji || similar.title.english || similar.title.native || '',
            media_type: "anilist",
            poster: similar.image,
            year: similar.type ?? '',
            type: similar.relationType ?? '',
            description: "",
            relation: similar.relationType ?? '',
        })) ?? [],
    };
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


export function MediaMeta_to_MediaMini(data : MovieMeta | TVMeta | AnimeMeta){
    const _data : MediaMini = {
        id: data.id.toString(),
        title: data.title,
        media_type: data.media_type,
        poster: data.poster,
        year: data.year,
        description: data.description,
        totalCount: data.totalCount,
    }
    return _data
}


export const WATCHED_ALREADY = 'watchedAlready';

