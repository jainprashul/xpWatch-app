import { AniListDetail } from "../types/anilistDetails";
import { AnimeRes } from "../types/anime";
import { AnimeDetail } from "../types/animeDetail";
import { MovieDetail } from "../types/movieDetail";
import { TVDetails } from "../types/tvDetails";
import { anilist, animeAPI, animeX, m, movieAPI, t, tv, tvAPI } from "./constants"

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


export const getAnilistDetails = async (id : string) => {
    try {
        const res = await (await fetch(anilist.anime(id))).json() as AniListDetail;
        const { episodes, relations: similar, recommendations  } = res;
        delete res.episodes;
        delete res.relations;
        delete res.recommendations;

        const similars = similar?.map(item => ({ ...item, media_type: 'anime', type: item.type }));
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

export const getAniEpisodeSources = async (id : string) => {
   try {
    const res = await fetch(anilist.watchEpisode(id))
    const links = await res.json();
    
    console.log(anilist.watchEpisode(id), links)
    const watchLinks = links.map((l : any) => ({
        server: l.name,
        quality: 'HD',
        title: 'Watch on ' + l.name,
        url: l?.url || '',
        type: 'embed',
        videoSrc: l?.url || '',
    }))
    return watchLinks;
   } catch (error) {
    const res = await fetch(anilist.watchEpisode2(id))
    const links = await res.json();
    const watchLinks = [{
        server: 'AnimeX',
        quality: 'HD',
        title: 'Watch on AnimeX',
        url: links.headers.Referer,
        type: 'embed',
        videoSrc: links.headers.Referer,
    }]
    return watchLinks;
   }
}

export const getTVData = async (id : string, seasonID = 1, episodeID = 1) => {
    try {
        console.log('tv', t(id));
        const res = await (await fetch(t(id))).json() as TVDetails;
        const { recommendations: recommandation, credits: credit, similar, external_ids } = res;
        delete res.recommendations;
        delete res.credits;
        delete res.similar;

        const recommandations = recommandation?.results.map(item => ({ ...item, media_type: 'tv' }));
        const similars = similar?.results.map(item => ({ ...item, media_type: 'tv' }));

        return {
            result: res,
            recommandations,
            similars,
            cast: credit?.cast,
            imdb: external_ids.imdb_id,
            external_ids
        }
    } catch (error) {
        console.error(error)
    }
}

export type TvShowsX = Awaited<ReturnType<typeof getTVData>>;

export const getTVSeasonData = async (id : string, seasonID = 1) => {
    console.log('tv', tv.season(id, seasonID));
    const season = await (await fetch(tv.season(id, seasonID))).json();
    return season;
}

/**
 * 
 * @param {string} id 
 * @param {number} seasonID 
 * @param {number} episodeID 
 * @param {string} imdb_id
 * @returns 
 */
export const getTVSeasonEpisodeSources = (id : string, seasonID = 1, episodeID = 1, imdb_id : string) => {
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

export const getMovieData = async (id : string) => {
    console.log('movie', m(id));
    const res = await (await fetch(m(id))).json() as MovieDetail;
    const { recommendations: recommandation, credits: credit, similar, external_ids } = res;


    delete res.recommendations;
    delete res.credits;
    delete res.similar;

    return {
        result: res as MovieDetail | undefined,
        cast: credit?.cast,
        recommandations: recommandation?.results.map(item => ({ ...item, media_type: 'movie' })),
        similars: similar?.results.map(item => ({ ...item, media_type: 'movie' })),
        imdb: external_ids.imdb_id,
        external_ids,
    }
}

export type MovieX = Awaited<ReturnType<typeof getMovieData>>;

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
