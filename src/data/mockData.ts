export type ContentType = 'movie' | 'anime' | 'series';

export interface EpisodeInfo {
  epNumber: number | string;
  epLabel: string;
  driveUrl?: string;
  usersDriveUrl?: string;
}

export interface ContentItem {
  id: string;
  title: string;
  type: ContentType;
  genre: string[];
  coverUrl: string;
  heroUrl: string;
  description: string;
  year: number;
  rating: number;
  featured?: boolean;
  videoUrl: string;
  episodes?: EpisodeInfo[];
}

const genres = ['Ação', 'Aventura', 'Comédia', 'Ficção Científica', 'Drama', 'Fantasia', 'Suspense'];

// Function to generate deterministic fake images via picsum, using modulo to avoid 300+ unique downloads
const getImg = (seed: string, width: number, height: number, blur = 0) => 
  `https://picsum.photos/seed/${seed}/${width}/${height}${blur ? `?blur=${blur}` : ''}`;

const sampleVideos = [
  'https://www.w3schools.com/html/mov_bbb.mp4',
  'https://media.w3.org/2010/05/sintel/trailer.mp4',
  'https://media.w3.org/2010/05/bunny/trailer.mp4'
];

export const mockContent: ContentItem[] = [
  // FEATURED
  {
    id: 'f1',
    title: 'Solo Leveling: Arise',
    type: 'anime',
    genre: ['Ação', 'Ficção Científica', 'Fantasia'],
    coverUrl: getImg('solocover', 400, 600),
    heroUrl: getImg('solohero', 1920, 1080),
    description: 'Em um mundo onde caçadores devem lutar contra monstros mortais para proteger a humanidade, o caçador mais fraco descobre um segredo para se tornar invencível.',
    year: 2024,
    rating: 9.8,
    featured: true,
    videoUrl: sampleVideos[0]
  },
  {
    id: 'f2',
    title: 'O Último Guardião do Universo',
    type: 'movie',
    genre: ['Ação', 'Aventura', 'Ficção Científica'],
    coverUrl: getImg('guardian', 400, 600),
    heroUrl: getImg('guardian_hero', 1920, 1080),
    description: 'Um herói improvável descobre que carrega o destino do multiverso em suas mãos. Um épico cheio de magia e combates incríveis em outra galáxia.',
    year: 2023,
    rating: 8.5,
    featured: false,
    videoUrl: sampleVideos[1]
  },
  
  // ANIMES (Mocking 60 items)
  ...Array.from({ length: 60 }).map((_, i) => ({
    id: `a${i}`,
    title: `Anime Épico: A Jornada Volume ${i + 1}`,
    type: 'anime' as ContentType,
    genre: [genres[i % genres.length], genres[(i + 1) % genres.length]],
    coverUrl: getImg(`anime_cov_${i % 15}`, 400, 600),
    heroUrl: getImg(`anime_hero_${i % 15}`, 1920, 1080),
    description: 'Episódios incríveis de uma jornada inesquecível pelo desconhecido, com combates, magia e um enorme universo para ser explorado.',
    year: 2018 + (i % 6),
    rating: 7.0 + (i % 3),
    videoUrl: sampleVideos[i % sampleVideos.length]
  })),

  // MOVIES (Mocking 200 items to guarantee more than 200 movies as requested)
  ...Array.from({ length: 205 }).map((_, i) => ({
    id: `m${i}`,
    title: `Blockbuster de Hollywood ${i + 1}`,
    type: 'movie' as ContentType,
    genre: [genres[(i + 2) % genres.length], genres[(i + 3) % genres.length]],
    coverUrl: getImg(`movie_cov_${i % 20}`, 400, 600),
    heroUrl: getImg(`movie_hero_${i % 20}`, 1920, 1080),
    description: 'Uma produção cinematográfica de alto nível, com cenários deslumbrantes, muita emoção e uma atuação que marcará história nos cinemas.',
    year: 2000 + (i % 24),
    rating: 6.5 + (i % 3.5),
    videoUrl: sampleVideos[(i + 1) % sampleVideos.length]
  })),

  // SERIES (Mocking 50 items)
  ...Array.from({ length: 50 }).map((_, i) => ({
    id: `s${i}`,
    title: `Série Mistério Temporada ${i + 1}`,
    type: 'series' as ContentType,
    genre: ['Suspense', 'Drama'],
    coverUrl: getImg(`series_cov_${i % 10}`, 400, 600),
    heroUrl: getImg(`series_hero_${i % 10}`, 1920, 1080),
    description: 'Descubra os segredos obscuros que rondam esta cidade intrigante. Mistérios e conspirações a cada novo episódio revelador.',
    year: 2020 + (i % 4),
    rating: 8.0 + (i % 2),
    videoUrl: sampleVideos[(i + 2) % sampleVideos.length]
  }))
];
