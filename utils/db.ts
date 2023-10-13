import { AniListDetail } from "../types/anilistDetails";
import { AnimeRes } from "../types/anime";
import { AnimeDetail } from "../types/animeDetail";
import { MovieDetail } from "../types/movieDetail";
import { SeasonDetail } from "../types/seasonDetail";
import { TVDetails } from "../types/tvDetails";
import { anilist, animeAPI, animeX, m, movieAPI, t, tv, tvAPI } from "./constants"
import { AniList_to_AnimeMeta, TMDB_Movie_to_MediaMeta, TMDB_TV_to_TVMeta } from "./converter";

export async function getAnimeData(id : string) {
    try {
        const res = await (await fetch(animeX.anime(id))).json() as AnimeDetail;
        const { relations: similar, mappings: external_ids, episodes, mappings } = res;

        delete res.lastChecks;
        delete res.relations;
        delete res.episodes;

        const similars = similar?.map(item => ({ ...item.anime, media_type: 'anime', type: item.type }));
        // const recommandations = recommandation.map(item => ({ ...item, media_type: 'anime' }))

        return {
            result: res,
            external_ids,
            episodes,
            mappings,
            similars,
            recommandations: [],
        }
    } catch (error) {
        throw error;
    }
}
export type AnimeX = Awaited<ReturnType<typeof getAnimeData>>;

export const getEpisodeSources = async (sources : any ) => {
    const links = await animeAPI(sources)
    const watchLinks = links.map(l => ({
        server: "AnimeX" + l.priority,
        quality: 'HD',
        title: 'Watch on AnimeX' + l.priority,
        url: l?.referer || '',
        type: 'embed',
        videoSrc: l?.url || '',
    }))
    return watchLinks;
}

export async function fetchAnilist(id : string){
    const res = await (await fetch(anilist.anime(id))).json() as AniListDetail;
    const data = AniList_to_AnimeMeta(res);
    return data;
}

export const getAnilistDetails = async (id : string) => {
    try {
        const res = await (await fetch(anilist.anime(id))).json() as AniListDetail;
        const { episodes, relations: similar, recommendations  } = res;

        const similars = similar?.map(item => ({ ...item, media_type: 'anime', type: item.type })).filter((item : any) => item.type !== 'MANGA');
        const recommandations = recommendations?.map(item => ({ ...item, media_type: 'anime' }))

        return {
            result: res,
            similars,
            recommandations,
            episodes,
        }
    } catch (error) {
        throw error;
    }
}

export type AnilistX = Awaited<ReturnType<typeof getAnilistDetails>>;


export type AniEpisodeSrc = {
    server: string;
    quality: string;
    title: string;
    url: string;
    type: string;
    videoSrc: string;
}

export const getAniEpisodeSources = async (id : string) => {
   try {
    console.log(anilist.watchEpisode(id))
    const res = await fetch(anilist.watchEpisode(id))
    console.log("Res", res)
    if (!res.ok) {
        const res = await fetch(anilist.watchEpisode2(id))
        console.log(anilist.watchEpisode2(id))
        if (!res.ok) {
            throw new Error('Not Found')
        }
        const links = await res.json();
        const watchLinks : AniEpisodeSrc[]  = [{
            server: 'AnimeX',
            quality: 'HD',
            title: 'Watch on AnimeX',
            url: links.headers.Referer,
            type: 'embed',
            videoSrc: links.headers.Referer,
        }]
        return watchLinks;
    }
    const links = await res.json();
    
    console.log(anilist.watchEpisode(id), links)
    const watchLinks : AniEpisodeSrc[] = links.map((l : any) => ({
        server: l.name,
        quality: 'HD',
        title: 'Watch on ' + l.name,
        url: l?.url || '',
        type: 'embed',
        videoSrc: l?.url || '',
    }))
    return watchLinks;
   } catch (error) {
    console.error("ERROR FETCH",error)
    throw error;
   }
}

export async function fetchTVDetails(id : string){
    const res = await (await fetch(t(id))).json() as TVDetails; 
    const data = TMDB_TV_to_TVMeta(res);
    return data;
}


export const getTVSeasonData = async (id : string, seasonID = 1) => {
    console.log('tv', tv.season(id, seasonID));
    const season = await (await fetch(tv.season(id, seasonID))).json() as SeasonDetail;
    return season;
}


export const getTVSeasonEpisodeSources = (id : string, seasonID: number = 1, episodeID: number = 1, imdb_id : string): { server: string; quality: string; title: string; url: string; }[] => {
    try {
        const watchLinks = [
            {
                server: "AlphaX",
                quality: 'HD',
                title: 'Watch on AlphaX',
                url : `https://vidsrc.to/embed/tv/${imdb_id}/${seasonID}/${episodeID}`
            },
            {
                server : "BetaX",
                quality : 'HD',
                title : 'Watch on BetaX',
                url: `https://multiembed.mov/directstream.php?video_id=${imdb_id}&s=${seasonID}&e=${episodeID}`
            },
            {
                server: "GammaX",
                quality: 'HD',
                title: 'Watch on GammaX',
                url: `https://vidsrc.me/embed/tv?imdb=${imdb_id}&season=${seasonID}&episode=${episodeID}`
            }, 
            {
                server: "VidSrc",
                quality: 'HD',
                title: 'Watch on VidSrc',
                url: `https://v2.vidsrc.me/embed/${imdb_id}/${seasonID}-${episodeID}/`
            }, 
            {
                server: "2embed",
                quality: 'HD',
                title: 'Watch on 2embed',
                url: `https://2embed.org/embed/series?tmdb=${id}&sea=${seasonID}&epi=${episodeID}`
            }, 
        ]

        return watchLinks;
    } catch (error) {
        console.error(error)
        throw error;
    }
}

export type TvShowsSrc = Awaited<ReturnType<typeof getTVSeasonEpisodeSources>>;

export async function fetchMovie(id : string){
    const res = await (await fetch(m(id))).json() as MovieDetail;
    const data = TMDB_Movie_to_MediaMeta(res);
    return data;
}

export const getMovieSources =  (id : string, imdb_id : string) => {
    const watchLinks = [
        {
            server: "AlphaX",
            quality: 'HD',
            title: 'Watch on AlphaX',
            url : `https://vidsrc.to/embed/movie/${imdb_id}`
        },
        {
            server : "BetaX",
            quality : 'HD',
            title : 'Watch on BetaX',
            url: `https://multiembed.mov/directstream.php?video_id=${imdb_id}`
        },
        {
            server: "GammaX",
            quality: 'HD',
            title: 'Watch on GammaX',
            url: `https://vidsrc.me/embed/movie?imdb=${imdb_id}`
        },
        {
            server: "VidSrc",
            quality: 'HD',
            title: 'Watch on VidSrc',
            url: `https://v2.vidsrc.me/embed/${imdb_id}`
        },
        {
            server: "2embed",
            quality: 'HD',
            title: 'Watch on 2embed',
            url: `https://2embed.org/embed/series?tmdb=${id}`
        }, 
    ]
    return watchLinks;
}

export type MovieSrc = Awaited<ReturnType<typeof getMovieSources>>;
