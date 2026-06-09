/** Extrae el ID de un video de YouTube de una URL `watch?v=` o `youtu.be/`. */
export function extractYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  return match ? match[1] : null;
}
