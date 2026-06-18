import type { WPEvent } from './types';

/* Helpers de calendario / exportación a ICS y Google Calendar.
   Genéricos: operan sobre la meta de gtc_evento. */

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'long' });
}

export function formatMonthYear(dateStr: string): string {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date
    .toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })
    .replace(/^\w/, (c) => c.toUpperCase());
}

export function getEventImg(event: WPEvent): string {
  return event._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? '';
}

export function getGoogleCalUrl(event: WPEvent): string {
  const ed = event.gtc_evento_data;
  const startStr = `${ed.start_date.replace(/-/g, '')}${ed.start_time ? 'T' + ed.start_time.replace(':', '') + '00' : ''}`;
  const endStr = `${(ed.end_date || ed.start_date).replace(/-/g, '')}${ed.end_time ? 'T' + ed.end_time.replace(':', '') + '00' : ''}`;
  const title = event.title.rendered;
  const desc = '';
  const loc = ed.location_name || ed.address || '';
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startStr}/${endStr}&details=${encodeURIComponent(desc)}&location=${encodeURIComponent(loc)}`;
}

export function getICSContent(event: WPEvent): string {
  const ed = event.gtc_evento_data;
  const startStr = `${ed.start_date.replace(/-/g, '')}${ed.start_time ? 'T' + ed.start_time.replace(':', '') + '00' : ''}`;
  const endStr = `${(ed.end_date || ed.start_date).replace(/-/g, '')}${ed.end_time ? 'T' + ed.end_time.replace(':', '') + '00' : ''}`;
  const title = event.title.rendered;
  const desc = '';
  const loc = ed.location_name || ed.address || '';
  const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART:${startStr}\nDTEND:${endStr}\nSUMMARY:${title}\nDESCRIPTION:${desc}\nLOCATION:${loc}\nEND:VEVENT\nEND:VCALENDAR`;
  return `data:text/calendar;charset=utf8,${encodeURIComponent(ics)}`;
}

export function groupByMonth(events: WPEvent[]): { month: string; events: WPEvent[] }[] {
  const map = new Map<string, WPEvent[]>();
  for (const ev of events) {
    const key = formatMonthYear(ev.gtc_evento_data.start_date);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(ev);
  }
  return Array.from(map.entries()).map(([month, events]) => ({ month, events }));
}
