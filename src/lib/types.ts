/* Tipos del REST de los plugins gtc-sermones / gtc-eventos / gtc-autores.
   Genéricos: describen la forma del JSON de los plugins, no a ninguna iglesia. */

/** Predicador, serie o tema dentro de un sermón */
export interface WPTerm {
  id: number;
  name: string;
  slug: string;
  link: string;
}

/** Datos extendidos de un predicador desde /wp/v2/predicadores */
export interface WPPreacher {
  id: number;
  name: string;
  slug: string;
  preacher_data: {
    image_url: string;
    role: string;
    short_bio: string;
  };
}

/** media del sermón — espejo de sermon_data.media del plugin */
export interface WPSermonMedia {
  audio: string;
  spotify: string;
  pdf: string;
  ppt: string;
  word: string;
  video: string;
  video_youtube: string;
  audio_size: number;
}

export interface WPSermonComputed {
  has_audio: boolean;
  has_video: boolean;
  has_notes: boolean;
  has_summary: boolean;
}

export interface WPSermonData {
  passage: string;
  summary: string;
  hook: string;
  notes: string;
  featured_image: string;
  date: string;
  date_label: string;
  duration: string;
  media: WPSermonMedia;
  preachers: WPTerm[];
  series: WPTerm[];
  topics: WPTerm[];
  computed: WPSermonComputed;
}

export interface WPSermon {
  id: number;
  title: string;
  slug: string;
  link: string;
  featured_image: string;
  sermon_data: WPSermonData;
}

export interface WPSeriesData {
  image_url: string;
  hero_image_url: string;
  state: 'en_curso' | 'completada' | string;
  dates: string;
  latest_sermon_id: number | null;
}

export interface WPSeries {
  id: number;
  name: string;
  slug: string;
  description: string;
  link: string;
  count: number;
  series_data: WPSeriesData;
}

/** Respuesta de /series/:slug/sermons — metadatos de la serie + array de sermones */
export interface WPSeriesWithSermons {
  series: WPSeries;
  sermons: WPSermon[];
}

/** Sermón tal como lo devuelve wp/v2/sermones (archivo filtrable).
 *  OJO: `title` es objeto {rendered}, distinto del shape plano de las rutas custom. */
export interface WPSermonArchive {
  id: number;
  slug: string;
  link: string;
  title: { rendered: string };
  featured_media: number;
  sermon_data: WPSermonData;
}

/** Término genérico de taxonomía (wp/v2/temas, etc.) para poblar filtros. */
export interface WPTaxonomyTerm {
  id: number;
  name: string;
  slug: string;
  count: number;
  description: string;
  link: string;
}

/** Medios «fijos» del sitio (plugin gtc-ibr-medios), editables desde el admin. */
export interface GtcMedios {
  galeria: Record<string, string>; // bento de comunidad: b1..b7
  hero_video: string;
  nosotros: { intro: string; greg: string; pedro: string };
  sermones_cta: string;
  site_logo: string;
  site_logo_dark: string;
}

/** Vocabulario fijo de tipos de evento (gtc-eventos) */
export type GtcEventType =
  | 'culto'
  | 'oracion'
  | 'escuela_biblica'
  | 'grupo_de_vida'
  | 'jovenes'
  | 'mujeres'
  | 'hombres'
  | 'capacitacion'
  | 'conferencia'
  | 'especial';

/** Meta-campos del CPT gtc_evento */
export interface WPEventData {
  start_date: string;       // "2026-05-10"
  start_time: string;       // "09:00" | ""
  end_date: string;
  end_time: string;
  all_day: boolean;
  format: 'presencial' | 'online' | 'hibrido' | string;
  location_name: string;
  address: string;
  online_url: string;
  short_location_note: string;
  event_type: GtcEventType | string;
  event_status: 'programado' | 'confirmado' | 'cancelado' | 'finalizado' | string;
  featured: boolean;
  computed: {
    has_started: boolean;
    has_finished: boolean;
    is_upcoming: boolean;
  };
}

export interface WPEvent {
  id: number;
  slug: string;
  title: { rendered: string };
  featured_image_url: string | null; // inyectado por el proxy o _embedded
  gtc_evento_data: WPEventData;
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url: string }>;
  };
}

export type GtcAutor = {
  id: number;
  nombre: string;
  bio: string;
  foto: {
    url: string;
    alt: string;
  } | null;
} | null;

/** Post (Artículos) de WordPress, con el campo gtc_autor del plugin gtc-autores */
export interface WPPost {
  id: number;
  date: string;
  slug: string;
  link: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  author: number;
  gtc_autor: GtcAutor;
  featured_media: number;
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url: string }>;
    'wp:term'?: Array<Array<{ name: string; slug: string; taxonomy: string }>>;
  };
}
