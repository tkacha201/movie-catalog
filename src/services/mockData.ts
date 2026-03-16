/**
 * Mock movie data used as fallback when no TMDB API token is configured.
 * This lets the app run out-of-the-box for reviewers / evaluators.
 */
import type { TMDBMovie, TMDBMovieDetails } from './movieService';

export const MOCK_MOVIES: TMDBMovie[] = [
  {
    id: 1001,
    title: 'The Shawshank Redemption',
    poster_path: null,
    backdrop_path: null,
    release_date: '1994-09-23',
    overview:
      'Framed in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank prison.',
    vote_average: 8.7,
    genre_ids: [18, 80],
  },
  {
    id: 1002,
    title: 'The Dark Knight',
    poster_path: null,
    backdrop_path: null,
    release_date: '2008-07-18',
    overview:
      'When the menace known as the Joker wreaks havoc on Gotham, Batman must accept one of the greatest tests of his ability to fight injustice.',
    vote_average: 9.0,
    genre_ids: [28, 80, 18],
  },
  {
    id: 1003,
    title: 'Inception',
    poster_path: null,
    backdrop_path: null,
    release_date: '2010-07-16',
    overview:
      'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    vote_average: 8.4,
    genre_ids: [28, 878, 12],
  },
  {
    id: 1004,
    title: 'Interstellar',
    poster_path: null,
    backdrop_path: null,
    release_date: '2014-11-07',
    overview:
      "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    vote_average: 8.6,
    genre_ids: [878, 18, 12],
  },
  {
    id: 1005,
    title: 'Parasite',
    poster_path: null,
    backdrop_path: null,
    release_date: '2019-05-30',
    overview:
      'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
    vote_average: 8.5,
    genre_ids: [35, 53, 18],
  },
  {
    id: 1006,
    title: 'The Matrix',
    poster_path: null,
    backdrop_path: null,
    release_date: '1999-03-31',
    overview:
      'A computer programmer discovers that reality as he knows it is a simulation created by machines, and joins a rebellion to free humanity.',
    vote_average: 8.2,
    genre_ids: [28, 878],
  },
  {
    id: 1007,
    title: 'Spirited Away',
    poster_path: null,
    backdrop_path: null,
    release_date: '2001-07-20',
    overview:
      "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits.",
    vote_average: 8.5,
    genre_ids: [16, 10751, 14],
  },
  {
    id: 1008,
    title: 'Whiplash',
    poster_path: null,
    backdrop_path: null,
    release_date: '2014-10-10',
    overview:
      'A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing.',
    vote_average: 8.4,
    genre_ids: [18, 10402],
  },
  {
    id: 1009,
    title: 'Get Out',
    poster_path: null,
    backdrop_path: null,
    release_date: '2017-02-24',
    overview:
      "A young African-American visits his white girlfriend's parents for the weekend, where his simmering uneasiness about their reception of him eventually reaches a boiling point.",
    vote_average: 7.6,
    genre_ids: [27, 53, 9648],
  },
  {
    id: 1010,
    title: 'La La Land',
    poster_path: null,
    backdrop_path: null,
    release_date: '2016-12-09',
    overview:
      'An aspiring actress and a dedicated jazz musician struggle with their relationship as they chase their dreams in Los Angeles.',
    vote_average: 7.9,
    genre_ids: [35, 18, 10749],
  },
];

export const MOCK_UPCOMING: TMDBMovie[] = [
  {
    id: 2001,
    title: 'Galactic Odyssey',
    poster_path: null,
    backdrop_path: null,
    release_date: '2026-06-15',
    overview: "Humanity's first mission beyond the solar system uncovers an ancient alien civilisation.",
    vote_average: 0,
    genre_ids: [878, 12],
  },
  {
    id: 2002,
    title: 'The Last Heist',
    poster_path: null,
    backdrop_path: null,
    release_date: '2026-04-20',
    overview: 'A retired thief is pulled back in for one final job that could change everything.',
    vote_average: 0,
    genre_ids: [28, 53, 80],
  },
  {
    id: 2003,
    title: 'Echoes in the Dark',
    poster_path: null,
    backdrop_path: null,
    release_date: '2026-10-31',
    overview: 'A family moves into a centuries-old estate where the walls remember every secret.',
    vote_average: 0,
    genre_ids: [27, 9648],
  },
  {
    id: 2004,
    title: 'Summer in Seville',
    poster_path: null,
    backdrop_path: null,
    release_date: '2026-07-04',
    overview: 'Two strangers meet during a Spanish festival and discover unexpected love.',
    vote_average: 0,
    genre_ids: [10749, 35],
  },
];

const GENRE_MAP: Record<number, string> = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
  99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History',
  27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi',
  10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western',
};

export function getMockMovieDetails(id: number): TMDBMovieDetails | null {
  const movie = [...MOCK_MOVIES, ...MOCK_UPCOMING].find((m) => m.id === id);
  if (!movie) return null;
  return {
    ...movie,
    runtime: 120,
    tagline: '',
    genres: (movie.genre_ids ?? []).map((gid) => ({
      id: gid,
      name: GENRE_MAP[gid] ?? 'Unknown',
    })),
  };
}
