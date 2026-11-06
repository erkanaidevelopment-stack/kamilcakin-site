import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

const azHareket = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const kok = document.documentElement;

/* ---------- Menü (mobil) ---------- */
const menu = document.getElementById('ana-menu');
const acDugme = document.querySelector<HTMLButtonElement>('.ust > .kap > .menu-ac');
const kapatDugme = document.querySelector<HTMLButtonElement>('.menu-kapat');
const menuyuAyarla = (acik: boolean) => {
  menu?.classList.toggle('acik', acik);
  acDugme?.setAttribute('aria-expanded', String(acik));
  document.body.style.overflow = acik ? 'hidden' : '';
  if (acik) kapatDugme?.focus(); else acDugme?.focus({ preventScroll: true });
};
acDugme?.addEventListener('click', () => menuyuAyarla(true));
kapatDugme?.addEventListener('click', () => menuyuAyarla(false));
menu?.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => menu.classList.contains('acik') && menuyuAyarla(false)));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu?.classList.contains('acik')) menuyuAyarla(false); });

/* ---------- Atıf kopyalama ---------- */
document.addEventListener('click', async (e) => {
  const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-kopyala]');
  if (!btn) return;
  const eski = btn.textContent;
  try {
    await navigator.clipboard.writeText(btn.dataset.kopyala ?? '');
    btn.textContent = 'Kopyalandı';
  } catch {
    btn.textContent = 'Kopyalanamadı';
  }
  setTimeout(() => { btn.textContent = eski; }, 1800);
});

/* ---------- Okuma ilerlemesi ---------- */
const ilerleme = document.querySelector<HTMLElement>('[data-ilerleme]');
const metin = document.querySelector<HTMLElement>('.metin');
const ilerlemeYuzde = document.querySelector<HTMLElement>('[data-ilerleme-yazi]');
const ilerlemeGuncelle = () => {
  if (!ilerleme || !metin) return;
  const r = metin.getBoundingClientRect();
  const toplam = r.height - window.innerHeight * 0.6;
  const oran = Math.min(1, Math.max(0, -r.top / Math.max(1, toplam)));
  ilerleme.style.width = `${Math.round(oran * 100)}%`;
  if (ilerlemeYuzde) ilerlemeYuzde.textContent = `%${Math.round(oran * 100)} okundu`;
};

/* ---------- Animasyonlar ---------- */
if (azHareket) {
  kok.classList.add('belir-hazir');
  window.addEventListener('scroll', ilerlemeGuncelle, { passive: true });
  ilerlemeGuncelle();
} else {
  gsap.registerPlugin(ScrollTrigger);

  // Yumuşak kaydırma
  const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  lenis.on('scroll', () => { ScrollTrigger.update(); ilerlemeGuncelle(); });
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const hedef = a.getAttribute('href');
      if (!hedef || hedef === '#') return;
      const el = document.querySelector(hedef);
      if (el) { e.preventDefault(); lenis.scrollTo(el as HTMLElement, { offset: -20 }); }
    });
  });

  // Üst bölüm: başlık öğeleri sırayla belirir
  const giris = gsap.utils.toArray<HTMLElement>('[data-giris]');
  if (giris.length) {
    gsap.fromTo(giris, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', stagger: 0.12, delay: 0.15 });
  }
  const gorsel = document.querySelector<HTMLElement>('[data-paralaks] img');
  if (gorsel) {
    gsap.fromTo(gorsel, { scale: 1.08, opacity: 0 }, { scale: 1, opacity: 1, duration: 2.2, ease: 'power2.out' });
    gsap.to(gorsel, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: gorsel, start: 'top top', end: 'bottom top', scrub: true } });
  }

  // Sayılar yukarı doğru sayar
  document.querySelectorAll<HTMLElement>('[data-say]').forEach((el) => {
    const m = (el.dataset.say ?? '').match(/^(\d+)(.*)$/);
    if (!m) return;
    const hedef = Number(m[1]);
    const ek = m[2];
    const o = { v: 0 };
    gsap.to(o, { v: hedef, duration: 1.8, delay: 0.8, ease: 'power2.out', onUpdate: () => { el.textContent = `${Math.round(o.v)}${ek}`; } });
  });

  // Kaydırdıkça beliren öğeler
  gsap.utils.toArray<HTMLElement>('[data-belir]').forEach((el) => {
    gsap.fromTo(el, { opacity: 0, y: 28 }, {
      opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });

  ilerlemeGuncelle();
}
