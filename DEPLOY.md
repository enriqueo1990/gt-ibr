# Deploy a producción — gtc-ibr (Iglesia Bíblica Reformada)

| Pieza | Dominio | Dónde vive |
|---|---|---|
| Front (estático) | `iglesiabiblicareformada.com` | Cloudflare Pages |
| Backend (WordPress) | `cms.iglesiabiblicareformada.com` | DigitalOcean Droplet |
| Media | `media.iglesiabiblicareformada.com` | Cloudflare R2 (dominio custom) |

> En dev el front pega a `/api` (proxy de Vite). En prod **no hay proxy**: el front llama
> directo a `https://cms…/wp-json` (cross-origin) → por eso importan el `VITE_WP_API_URL` y el CORS.

Orden recomendado: **0 → 6**. No saltees el orden (cada fase depende de la anterior).

---

## Fase 0 — Dominio en Cloudflare (DNS)
1. Tener `iglesiabiblicareformada.com` registrado.
2. En Cloudflare: **Add a site** → `iglesiabiblicareformada.com` (plan Free alcanza).
3. Cloudflare te da 2 **nameservers**. Cambialos en tu registrador (donde compraste el dominio).
4. Esperar a que el dominio quede **Active** en Cloudflare (puede tardar minutos/horas).

> Todo (Pages, R2 custom domain, DNS de cms) se maneja desde Cloudflare, por eso esta fase va primera.

---

## Fase 1 — Droplet WordPress en DigitalOcean
1. **Create → Droplets → Marketplace → WordPress** (sobre Ubuntu).
2. Tamaño: para una iglesia alcanza el básico (1 GB / 1 vCPU, ~US$6–12/mes). Región cercana a la congregación.
3. Autenticación: subí una **SSH key** (recomendado) o password.
4. Crear y anotar la **IP pública** del droplet.
5. **DNS (Cloudflare):** agregá un registro **A** → `cms` → IP del droplet. Ponelo **DNS only (nube gris)** por ahora (para que Let's Encrypt del droplet emita el certificado sin interferencia del proxy).
6. **SSH al droplet** (`ssh root@IP`). La imagen de WordPress de DO corre un asistente la primera vez:
   - Te pide el **dominio**: `cms.iglesiabiblicareformada.com`
   - Email para **Let's Encrypt** → emite el SSL automático.
7. Verificá: `https://cms.iglesiabiblicareformada.com/wp-admin` carga con candado.

---

## Fase 2 — Migrar el sitio (Local → Droplet)
Opción simple (recomendada para no pelear con SSH/DB):
1. En el WP de **Local**, instalá **All-in-One WP Migration** (o Duplicator), exportá a archivo.
2. En el WP del **droplet**, instalá el mismo plugin e importá el archivo.
3. Confirmá que estén **activos**: `gtc-sermones`, `gtc-eventos`, `gtc-autores`, `gtc-ibr-medios`, `media-cloud-sync`.

Opción manual (si preferís WP-CLI): `wp db export` en Local → copiar `wp-content` → importar en el droplet → `wp search-replace 'gtc-ibr.local' 'cms.iglesiabiblicareformada.com'`.

Después de migrar:
4. **Ajustes → Enlaces permanentes → Guardar** (refresca rutas REST y el feed del podcast).
5. **media-cloud-sync:** reconfigurá las credenciales de **R2** (Account ID, Access Key, Secret, bucket). La media ya está en R2; esto es para que las nuevas subidas sigan yendo y las URLs resuelvan.
6. Verificá el REST: `https://cms.iglesiabiblicareformada.com/wp-json/gtc-sermones/v1/latest-sermons` devuelve JSON.

---

## Fase 3 — CORS en producción
El plugin ya soporta restringir el origen (código aplicado). En el droplet, editá **`wp-config.php`** y agregá (antes de `/* That's all, stop editing! */`):

```php
define( 'GTC_FRONT_ORIGIN', 'https://iglesiabiblicareformada.com' );
```

Sin esa constante el REST manda `Access-Control-Allow-Origin: *` (dev). Con ella, solo acepta al front de prod.

---

## Fase 4 — R2 con dominio custom
1. Cloudflare → **R2** → tu bucket → **Settings → Custom Domains** → agregar `media.iglesiabiblicareformada.com` (crea el DNS solo).
2. En **media-cloud-sync** (ajustes del plugin), seteá el **CDN / custom domain** = `https://media.iglesiabiblicareformada.com` para que las URLs usen ese dominio en vez de `pub-…r2.dev`.
3. (Si las URLs viejas quedaron guardadas en la DB, el plugin las reescribe en la salida; si no, un `search-replace` de `pub-…r2.dev` → `media.iglesiabiblicareformada.com`).

---

## Fase 5 — Front en Cloudflare Pages
1. Cloudflare → **Workers & Pages → Create → Pages → Connect to Git** → repo `enriqueo1990/gt-ibr`, branch `main`.
2. **Build settings:**
   - Framework preset: **Vite** (o None)
   - Build command: `npm run build`
   - Build output directory: `dist`
3. **Variables de entorno (Production):**
   - `VITE_WP_API_URL` = `https://cms.iglesiabiblicareformada.com/wp-json`
4. **Deploy**. El `public/_redirects` (ya en el repo) hace que el ruteo SPA funcione (recargar `/sermones` no da 404).
5. **Custom domain:** Pages → Custom domains → agregar `iglesiabiblicareformada.com` (y `www` → redirect). Cloudflare configura el DNS solo.

---

## Fase 6 — Verificación end-to-end
- [ ] `https://iglesiabiblicareformada.com` carga el sitio.
- [ ] Recargar directo `/sermones`, `/eventos`, una serie y un sermón → no da 404.
- [ ] Datos reales cargan (sermones/series/eventos). En DevTools → Network, las llamadas van a `cms…/wp-json` con **200** y header `Access-Control-Allow-Origin: https://iglesiabiblicareformada.com`.
- [ ] Sin errores de **CORS** en la consola.
- [ ] Imágenes cargan desde `media.iglesiabiblicareformada.com`.
- [ ] Audio del sermón y embed de YouTube funcionan (cargar 1–2 sermones con media real para probar de verdad).
- [ ] El feed del podcast `cms…/feed/sermones/` valida.

---

### Notas
- El cambio de CORS configurable conviene **backportearlo a `gtc-church-base`** (la misma línea) para que todas las iglesias futuras lo tengan.
- El backend (droplet) no se versiona; lo único «propio» fuera de la base es `gtc-ibr-medios`.
- `cms` se puede pasar a **proxied (nube naranja)** en Cloudflare más adelante para cachear/proteger, pero arrancá DNS-only para el SSL del droplet.
