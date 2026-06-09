import type { ReactNode } from 'react';
import { useFetch, type FetchState } from '../lib/hooks';
import {
  getLatestSermons,
  getActiveSeries,
  getSermonBySlug,
  getSeriesWithSermons,
  getAllSermons,
  getAllSeries,
  getAllPreachers,
  getAllTopics,
  getPreacherBySlug,
  getEvents,
  getPosts,
} from '../lib/api';

/* Página cruda de Fase 3 — verificación de datos SIN estilo.
   Solo confirma que cada endpoint del backend gtc-ibr devuelve y renderiza. */

function Section<T>({
  title,
  state,
  render,
}: {
  title: string;
  state: FetchState<T>;
  render: (data: T) => ReactNode;
}) {
  return (
    <section style={{ borderBottom: '1px solid #ddd', padding: '10px 0' }}>
      <h2 style={{ font: '600 13px monospace', margin: '0 0 6px', color: '#333' }}>{title}</h2>
      {state.loading && <p style={{ margin: 0, color: '#999' }}>cargando…</p>}
      {state.error && <p style={{ margin: 0, color: '#c00' }}>ERROR: {state.error}</p>}
      {state.data != null && <div style={{ fontSize: 14 }}>{render(state.data)}</div>}
    </section>
  );
}

export default function DevDiagnostics() {
  const latest = useFetch(() => getLatestSermons());
  const active = useFetch(() => getActiveSeries());
  const allSermons = useFetch(() => getAllSermons());
  const allSeries = useFetch(() => getAllSeries());
  const preachers = useFetch(() => getAllPreachers());
  const topics = useFetch(() => getAllTopics());
  const events = useFetch(() => getEvents());
  const posts = useFetch(() => getPosts());
  const oneSermon = useFetch(() => getSermonBySlug('sermon-de-prueba-1'));
  const oneSeries = useFetch(() => getSeriesWithSermons('serie-de-prueba-1'));
  const onePreacher = useFetch(() => getPreacherBySlug('predicador-de-prueba-1'));

  return (
    <div style={{ font: '16px system-ui', padding: 24, maxWidth: 940, margin: '0 auto' }}>
      <h1>gt-ibr — Diagnóstico de datos (Fase 3)</h1>
      <p style={{ color: '#666' }}>
        Verificación cruda de endpoints contra <code>gtc-ibr.local</code> vía <code>/api</code>. Sin diseño.
      </p>

      <Section
        title="GET /gtc-sermones/v1/latest-sermons"
        state={latest}
        render={(d) => <p>✓ {d.length} sermones · {d.map((s) => s.title).join(' | ')}</p>}
      />

      <Section
        title="GET /gtc-sermones/v1/active-series"
        state={active}
        render={(d) => (
          <p>✓ {d.length} activa(s) · {d.map((s) => `${s.name} (${s.series_data?.state})`).join(' | ')}</p>
        )}
      />

      <Section
        title="GET /wp/v2/sermones?per_page=100  (archivo filtrable)"
        state={allSermons}
        render={(d) => (
          <>
            <p>✓ {d.length} sermones</p>
            <ul style={{ margin: 0 }}>
              {d.map((s) => (
                <li key={s.id}>
                  <strong>{s.title.rendered}</strong> — {s.sermon_data?.passage} · serie:{' '}
                  {s.sermon_data?.series?.[0]?.name ?? '—'} · pred:{' '}
                  {s.sermon_data?.preachers?.[0]?.name ?? '—'} · temas:{' '}
                  {(s.sermon_data?.topics ?? []).map((t) => t.name).join(', ') || '—'} · audio:{' '}
                  {s.sermon_data?.computed?.has_audio ? 'sí' : 'no'} · video:{' '}
                  {s.sermon_data?.computed?.has_video ? 'sí' : 'no'}
                </li>
              ))}
            </ul>
          </>
        )}
      />

      <Section
        title="GET /wp/v2/series  (dropdown filtro)"
        state={allSeries}
        render={(d) => <p>✓ {d.map((s) => `${s.name} [${s.count}]`).join(' | ')}</p>}
      />

      <Section
        title="GET /wp/v2/predicadores  (dropdown filtro)"
        state={preachers}
        render={(d) => <p>✓ {d.map((p) => `${p.name} — ${p.preacher_data?.role ?? ''}`).join(' | ')}</p>}
      />

      <Section
        title="GET /wp/v2/temas  (dropdown filtro)"
        state={topics}
        render={(d) => <p>✓ {d.map((t) => `${t.name} [${t.count}]`).join(' | ')}</p>}
      />

      <Section
        title="GET /wp/v2/gtc_evento"
        state={events}
        render={(d) => (
          <ul style={{ margin: 0 }}>
            {d.map((e) => {
              const c = e.gtc_evento_data?.computed;
              return (
                <li key={e.id}>
                  <strong>{e.title.rendered}</strong> — {e.gtc_evento_data?.start_date} · tipo:{' '}
                  {e.gtc_evento_data?.event_type} · upcoming: {c?.is_upcoming ? 'sí' : 'no'} · started:{' '}
                  {c?.has_started ? 'sí' : 'no'}
                </li>
              );
            })}
          </ul>
        )}
      />

      <Section
        title="GET /wp/v2/posts  (artículos)"
        state={posts}
        render={(d) =>
          d.length ? <p>✓ {d.map((p) => p.title.rendered).join(' | ')}</p> : <p>✓ (sin artículos cargados)</p>
        }
      />

      <Section
        title="GET /gtc-sermones/v1/sermon/sermon-de-prueba-1"
        state={oneSermon}
        render={(d) => (
          <p>
            ✓ {d.title} — pasaje: {d.sermon_data?.passage} · media.audio:{' '}
            {d.sermon_data?.media?.audio || '—'} · media.video_youtube:{' '}
            {d.sermon_data?.media?.video_youtube || '—'}
          </p>
        )}
      />

      <Section
        title="GET /gtc-sermones/v1/series/serie-de-prueba-1/sermons"
        state={oneSeries}
        render={(d) => (
          <p>
            ✓ serie: {d.series?.name} · {d.sermons?.length} sermones
          </p>
        )}
      />

      <Section
        title="GET /wp/v2/predicadores?slug=predicador-de-prueba-1"
        state={onePreacher}
        render={(d) =>
          d ? (
            <p>
              ✓ {d.name} — {d.preacher_data?.role} — <code>{d.preacher_data?.image_url}</code>
            </p>
          ) : (
            <p>no encontrado</p>
          )
        }
      />
    </div>
  );
}
