import type {
  WPSermon,
  WPSermonArchive,
  WPSeries,
  WPSeriesWithSermons,
  WPTaxonomyTerm,
  WPPreacher,
  WPEvent,
  WPPost,
  GtcMedios,
} from './types';

const BASE_URL = import.meta.env.VITE_WP_API_URL as string;

export async function wpFetch<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error(`API error ${response.status}: ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

/* ── Rutas custom: namespace gtc-sermones/v1 ── */

export function getLatestSermons(perPage = 10): Promise<WPSermon[]> {
  return wpFetch<WPSermon[]>(`/gtc-sermones/v1/latest-sermons?per_page=${perPage}`);
}

export function getActiveSeries(limit = 20): Promise<WPSeries[]> {
  return wpFetch<WPSeries[]>(`/gtc-sermones/v1/active-series?limit=${limit}`);
}

export function getSermonBySlug(slug: string): Promise<WPSermon> {
  return wpFetch<WPSermon>(`/gtc-sermones/v1/sermon/${slug}`);
}

/** Devuelve { series, sermons[] } — el endpoint combina ambos en una sola llamada */
export function getSeriesWithSermons(slug: string): Promise<WPSeriesWithSermons> {
  return wpFetch<WPSeriesWithSermons>(`/gtc-sermones/v1/series/${slug}/sermons`);
}

/* ── wp/v2: archivo filtrable + listas de términos para los filtros ── */

/** Archivo completo de sermones para filtrar en cliente (con sermon_data). */
export function getAllSermons(perPage = 100): Promise<WPSermonArchive[]> {
  return wpFetch<WPSermonArchive[]>(`/wp/v2/sermones?per_page=${perPage}`);
}

export function getAllSeries(perPage = 100): Promise<WPSeries[]> {
  return wpFetch<WPSeries[]>(`/wp/v2/series?per_page=${perPage}`);
}

export function getAllPreachers(perPage = 100): Promise<WPPreacher[]> {
  return wpFetch<WPPreacher[]>(`/wp/v2/predicadores?per_page=${perPage}`);
}

export function getAllTopics(perPage = 100): Promise<WPTaxonomyTerm[]> {
  return wpFetch<WPTaxonomyTerm[]>(`/wp/v2/temas?per_page=${perPage}`);
}

/** Datos extendidos de un predicador (bio, cargo, foto) por su slug. */
export async function getPreacherBySlug(slug: string): Promise<WPPreacher | null> {
  const results = await wpFetch<WPPreacher[]>(`/wp/v2/predicadores?slug=${slug}`);
  return results?.[0] ?? null;
}

/* ── Eventos (gtc_evento) ──
   Sin orderby=date: ese orden es por fecha de publicación, no por _gtc_start_date.
   El orden/separación próximos-vs-pasados se hace en cliente con los flags computados. */
export function getEvents(perPage = 50): Promise<WPEvent[]> {
  return wpFetch<WPEvent[]>(`/wp/v2/gtc_evento?per_page=${perPage}&_embed=wp:featuredmedia`);
}

/* ── Artículos (Posts estándar de WP, con gtc_autor) ── */

export function getPosts(perPage = 10): Promise<WPPost[]> {
  return wpFetch<WPPost[]>(`/wp/v2/posts?per_page=${perPage}&_embed=wp:featuredmedia`);
}

export async function getPostBySlug(slug: string): Promise<WPPost> {
  const posts = await wpFetch<WPPost[]>(`/wp/v2/posts?slug=${slug}&_embed=wp:featuredmedia`);
  if (!posts || posts.length === 0) throw new Error('Artículo no encontrado');
  return posts[0];
}

/* ── Medios fijos del sitio (plugin site-specific gtc-ibr-medios) ── */
export function getMedios(): Promise<GtcMedios> {
  return wpFetch<GtcMedios>('/gtc-ibr/v1/medios');
}
