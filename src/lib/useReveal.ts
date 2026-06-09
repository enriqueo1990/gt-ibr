import { useEffect } from 'react';

/** Reveal-on-scroll de site.js, robusto a contenido async.
 *  Registra los `.reveal` actuales Y los que aparecen después (datos del REST)
 *  vía MutationObserver, para que el contenido data-driven no quede en opacity:0. */
export function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('in');
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' }
    );

    let counter = 0;
    const register = (el: HTMLElement) => {
      if (el.dataset.revealReg) return;
      el.dataset.revealReg = '1';
      el.style.transitionDelay = `${(counter++ % 3) * 70}ms`;
      if (el.getBoundingClientRect().top < window.innerHeight * 0.95) {
        el.classList.add('in');
      } else {
        io.observe(el);
      }
    };

    const scan = () =>
      document.querySelectorAll<HTMLElement>('.reveal').forEach(register);

    scan();

    // Captar contenido renderizado después del mount (fetch async).
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });

    // Red de seguridad: revelar cualquier .reveal pendiente.
    const fallback = window.setTimeout(() => {
      document.querySelectorAll<HTMLElement>('.reveal').forEach((el) => {
        el.style.transition = 'none';
        el.classList.add('in');
      });
    }, 1600);

    return () => {
      io.disconnect();
      mo.disconnect();
      clearTimeout(fallback);
    };
  }, []);
}
