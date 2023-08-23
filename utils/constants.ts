export const tImg = `https://image.tmdb.org/t/p/original/`;
const count = 25;

export const m = (id: any) => `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.EXPO_PUBLIC_TMDB_API_KEY}&language=en-US&append_to_response=credits,videos,images,keywords,recommendations,similar,external_ids`;
export const t = (id: any) => `https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.EXPO_PUBLIC_TMDB_API_KEY}&language=en-US&append_to_response=credits,videos,images,keywords,recommendations,similar,external_ids`;
export const p = (id: any) => `https://api.themoviedb.org/3/person/${id}?api_key=${process.env.EXPO_PUBLIC_TMDB_API_KEY}&language=en-US&append_to_response=credits,images,movie_credits,tv_credits`;
export const movie = {
    popular: (page: number) => `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.EXPO_PUBLIC_TMDB_API_KEY}&region=IN&page=${page}`,
    topRated: (page: number) => `https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.EXPO_PUBLIC_TMDB_API_KEY}&region=IN&page=${page}`,
    discover: (page: number) => `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.EXPO_PUBLIC_TMDB_API_KEY}&region=IN&page=${page}`,
    genres: `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.EXPO_PUBLIC_TMDB_API_KEY}&region=IN`,
    credits: (id: any) => `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.EXPO_PUBLIC_TMDB_API_KEY}&region=IN`,
}

export const anime = {
    tv: (page: number) => `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.EXPO_PUBLIC_TMDB_API_KEY}&with_keywords=210024|222243&page=${page}`,
    movie: (page: number) => `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.EXPO_PUBLIC_TMDB_API_KEY}&with_keywords=210024|222243&page=${page}`,
}

export const animeX = {
    popular: (page: number) => `https://api.enime.moe/popular?page=${page}&perPage=${count}`,
    recent: (page: number) => `https://api.enime.moe/recent?page=${page}&perPage=${count}`,
    search: (query: string, page: number) => `https://api.enime.moe/search/${query}?page=${page}&perPage=${15}`,
    anime: (id: any) => `https://api.enime.moe/anime/${id}`,
    episode: (id: string) => `https://api.enime.moe/episode/${id}`,
    animeEpisodes: (id: string) => `https://api.enime.moe/anime/${id}/episodes`,
}

export const tv = {
    popular: (page: number) => `https://api.themoviedb.org/3/tv/popular?api_key=${process.env.EXPO_PUBLIC_TMDB_API_KEY}&region=IN&language=en-US&page=${page}`,
    topRated: (page: number) => `https://api.themoviedb.org/3/tv/top_rated?api_key=${process.env.EXPO_PUBLIC_TMDB_API_KEY}&region=IN&language=en-US&page=${page}`,
    discover: (page: number) => `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.EXPO_PUBLIC_TMDB_API_KEY}&region=IN&language=en-US&page=${page}`,
    genres: `https://api.themoviedb.org/3/genre/tv/list?api_key=${process.env.EXPO_PUBLIC_TMDB_API_KEY}`,
    season: (id: string, season: number) => `https://api.themoviedb.org/3/tv/${id}/season/${season}?api_key=${process.env.EXPO_PUBLIC_TMDB_API_KEY}`,
    credits: (id: any) => `https://api.themoviedb.org/3/tv/${id}/credits?api_key=${process.env.EXPO_PUBLIC_TMDB_API_KEY}`,
}

export const hindi = {
    movie: (page: number) => `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.EXPO_PUBLIC_TMDB_API_KEY}&with_original_language=hi&page=${page}&region=IN&sort_by=popularity.desc`,
    recentMovie: (page: number) => `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.EXPO_PUBLIC_TMDB_API_KEY}&with_original_language=hi&page=${page}&region=IN&sort_by=popularity.desc&primary_release_year=${new Date().getFullYear()}`,
    tv: (page: number) => `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.EXPO_PUBLIC_TMDB_API_KEY}&with_original_language=hi&page=${page}&region=IN&sort_by=popularity.desc`,
}

export const genre = {
    list: `https://api.themoviedb.org/3/genre/list?api_key=${process.env.EXPO_PUBLIC_TMDB_API_KEY}&language=en-US`,
    listTv: `https://api.themoviedb.org/3/genre/tv/list?api_key=${process.env.EXPO_PUBLIC_TMDB_API_KEY}&language=en-US`,
    listMovie: `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.EXPO_PUBLIC_TMDB_API_KEY}&language=en-US`,
    tv: (id: any, page = 1) => `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.EXPO_PUBLIC_TMDB_API_KEY}&with_genres=${id}&page=${page}`,
    movie: (id: any, page = 1) => `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.EXPO_PUBLIC_TMDB_API_KEY}&with_genres=${id}&page=${page}`,
}

export const discover = {
    movie: `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.EXPO_PUBLIC_TMDB_API_KEY}&region=IN`,
}

export const trending = {
    today : {
        movies: `https://api.themoviedb.org/3/trending/movie/day?api_key=${process.env.EXPO_PUBLIC_TMDB_API_KEY}`,
        tv: `https://api.themoviedb.org/3/trending/tv/day?api_key=${process.env.EXPO_PUBLIC_TMDB_API_KEY}`,
        all: `https://api.themoviedb.org/3/trending/all/day?api_key=${process.env.EXPO_PUBLIC_TMDB_API_KEY}`,
    },
    movies: `https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.EXPO_PUBLIC_TMDB_API_KEY}`,
    tv: `https://api.themoviedb.org/3/trending/tv/week?api_key=${process.env.EXPO_PUBLIC_TMDB_API_KEY}`,
    all: `https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.EXPO_PUBLIC_TMDB_API_KEY}`,
}

export const search = {
    movie: (q: string, i: number) => `https://api.themoviedb.org/3/search/movie?api_key=${process.env.EXPO_PUBLIC_TMDB_API_KEY}&language=en-US&query=${q}&page=${i}`,
    tv: (q: string, i: number) => `https://api.themoviedb.org/3/search/tv?api_key=${process.env.EXPO_PUBLIC_TMDB_API_KEY}&language=en-US&query=${q}&page=${i}`,
    all: (q: string, i: number) => `https://api.themoviedb.org/3/search/multi?api_key=${process.env.EXPO_PUBLIC_TMDB_API_KEY}&language=en-US&query=${q}&page=${i}`,
    person: (q: string, i: number) => `https://api.themoviedb.org/3/search/person?api_key=${process.env.EXPO_PUBLIC_TMDB_API_KEY}&language=en-US&query=${q}&page=${i}`,
}

export const recommanded = {
    movie: (id: string) => `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${process.env.EXPO_PUBLIC_TMDB_API_KEY}&language=en-US&page=1`,
    tv: (id: string) => `https://api.themoviedb.org/3/tv/${id}/recommendations?api_key=${process.env.EXPO_PUBLIC_TMDB_API_KEY}&language=en-US&page=1`,
}

export const similar = {
    movie: (id: string) => `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${process.env.EXPO_PUBLIC_TMDB_API_KEY}&language=en-US&page=1`,
    tv: (id: string) => `https://api.themoviedb.org/3/tv/${id}/similar?api_key=${process.env.EXPO_PUBLIC_TMDB_API_KEY}&language=en-US&page=1`,
}

export const movieAPI = (id: string) => `https://seapi.link/?type=tmdb&id=${id}&max_results=1`;
export const tvAPI = (id: string, s = 1, e = 1) => `https://seapi.link/?type=tmdb&id=${id}&season=${s}&episode=${e}&max_results=1`;


export type Source = {
    id: string,
    url: string,
    referer: string,
    priority: number,
    browser: string,
    website: string,
}


export const animeAPI = async (srcs: Source[]) => {
    const data = await Promise.all(srcs.map((src) => fetch(`https://api.enime.moe/source/${src.id}`).then((res) => res.json())));
    return data;
}