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
  const sahne = document.querySelector<HTMLElement>('[data-sahne]');
  if (sahne) {
    gsap.fromTo(sahne, { scale: 1.08, opacity: 0 }, { scale: 1, opacity: 1, duration: 2.2, ease: 'power2.out' });
    gsap.to(sahne, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: sahne.parentElement, start: 'top top', end: 'bottom top', scrub: true } });
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

  // Işık hüzmeleri: her biri kendi hızında, rastgele salınır, kayar ve parlayıp söner
  kok.classList.add('hareketli');
  const rastgele = gsap.utils.random;
  const salin = (el: HTMLElement, temel: number, genis: boolean) => {
    gsap.to(el, {
      rotation: temel + rastgele(-7, 7),
      x: rastgele(genis ? -70 : -30, genis ? 70 : 30),
      scaleX: rastgele(0.6, 1.5),
      opacity: rastgele(0.3, 1),
      duration: rastgele(3.5, 8),
      ease: 'sine.inOut',
      onComplete: () => salin(el, temel, genis),
    });
  };
  document.querySelectorAll<HTMLElement>('.isik .h').forEach((el) => {
    const temel = Number(el.dataset.aci ?? 0);
    gsap.set(el, { rotation: temel, transformOrigin: '50% 0%' });
    gsap.delayedCall(rastgele(0, 2), () => salin(el, temel, true));
  });

  // Ana sayfa fotoğrafı: pencereden düşen hüzmeler salınır; üzerinden geçtikleri nesneleri aydınlatır
  if (sahne) {
    const pus = [...sahne.querySelectorAll<HTMLElement>('.isik-pus .h')];
    const vurgu = [...sahne.querySelectorAll<HTMLElement>('.isik-vurgu .h')];
    const hedefler = [...sahne.querySelectorAll<HTMLElement>('[data-hedef]')];
    const salinSahne = (i: number, temel: number) => {
      // Aynı rastgele değerler hem havadaki ışığa hem nesne üzerindeki aydınlığa uygulanır
      gsap.to([pus[i], vurgu[i]], {
        rotation: temel + rastgele(-12, 12),
        x: rastgele(-25, 25),
        scaleX: rastgele(0.7, 1.4),
        opacity: rastgele(0.25, 1),
        duration: rastgele(3, 7),
        ease: 'sine.inOut',
        onComplete: () => salinSahne(i, temel),
      });
    };
    pus.forEach((el, i) => {
      const temel = Number(el.dataset.aci ?? 0);
      gsap.set([el, vurgu[i]], { rotation: temel, transformOrigin: '50% 0%' });
      gsap.delayedCall(rastgele(0, 1.5), () => salinSahne(i, temel));
    });

    // Bir hüzme bir nesnenin üzerinden geçerken o nesne parlar; ışık ayrılınca söner
    const RAD = 180 / Math.PI;
    const hedefParla = hedefler.map((h) => gsap.quickTo(h, 'opacity', { duration: 0.6, ease: 'power2.out' }));
    gsap.ticker.add(() => {
      const W = sahne.offsetWidth, H = sahne.offsetHeight;
      if (!W || !H) return;
      const ox = W * 0.5, oy = H * 0.12;
      hedefler.forEach((h, j) => {
        const tx = (Number(h.dataset.x) / 100) * W, ty = (Number(h.dataset.y) / 100) * H;
        let isik = 0;
        pus.forEach((b) => {
          const bx = Number(gsap.getProperty(b, 'x'));
          const dx = tx - ox - bx, dy = ty - oy;
          const uzaklik = Math.hypot(dx, dy) || 1;
          const hedefAci = -Math.atan2(dx, dy) * RAD;
          const aci = Number(gsap.getProperty(b, 'rotation'));
          const yari = Math.max(2.5, Math.atan(((Number(b.dataset.gen) || 80) * Number(gsap.getProperty(b, 'scaleX'))) / 2 / uzaklik) * RAD);
          const fark = (aci - hedefAci) / yari;
          isik += Number(gsap.getProperty(b, 'opacity')) * Math.exp(-fark * fark);
        });
        hedefParla[j](Math.min(1, isik * 1.1));
      });
    });
  }

  // Toz zerrecikleri: ışığın içinde rastgele yönlere süzülür ve parıldar
  const suzul = (el: HTMLElement) => {
    gsap.to(el, {
      x: `+=${rastgele(-40, 40)}`,
      y: `+=${rastgele(-35, 25)}`,
      opacity: rastgele(0.15, 1),
      scale: rastgele(0.6, 1.6),
      duration: rastgele(3, 7),
      ease: 'sine.inOut',
      onComplete: () => {
        // çok uzaklaşan zerreyi yumuşakça başlangıç noktasına yakın tut
        const x = Number(gsap.getProperty(el, 'x')); const y = Number(gsap.getProperty(el, 'y'));
        if (Math.abs(x) > 90 || Math.abs(y) > 90) gsap.to(el, { x: 0, y: 0, opacity: 0, duration: 2.5, onComplete: () => suzul(el) });
        else suzul(el);
      },
    });
  };
  document.querySelectorAll<HTMLElement>('.zerre').forEach((el) => gsap.delayedCall(rastgele(0, 3), () => suzul(el)));

  // Kaydırdıkça beliren öğeler
  gsap.utils.toArray<HTMLElement>('[data-belir]').forEach((el) => {
    gsap.fromTo(el, { opacity: 0, y: 28 }, {
      opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });

  ilerlemeGuncelle();
}
