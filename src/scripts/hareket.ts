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

  // Ana sayfa fotoğrafı: pencereden gelen ışık rastgele yön ve şiddet değiştirir.
  // Hüzmeler yalnızca havada görünür; ışığa dönük yüzler aydınlanır, öbür yüzler kararır, masadaki gölgeler kayar.
  if (sahne) {
    const huzmeler = [...sahne.querySelectorAll<HTMLElement>('.isik-pus .h')];
    const isiklar = [...sahne.querySelectorAll<HTMLElement>('[data-nesne-isik]')];
    const golgeliler = [...sahne.querySelectorAll<HTMLElement>('[data-nesne-golge]')];
    const masaGolgeleri = [...sahne.querySelectorAll<HTMLElement>('[data-golge]')];
    // Işığın genel durumu: kaynak açısı ve şiddeti; her hüzmenin de kendi küçük titreşimi var
    const kaynak = { aci: 0, guc: 0.8, bulut: 1 };
    // Ara sıra güneşin önünden bulut geçer: bütün ışık kısa süre kararır, sonra geri gelir
    const bulutGecir = () => gsap.timeline({ delay: rastgele(3, 7), onComplete: bulutGecir })
      .to(kaynak, { bulut: rastgele(0.25, 0.55), duration: rastgele(0.9, 1.6), ease: 'sine.inOut' })
      .to(kaynak, { bulut: 1, duration: rastgele(1.2, 2.2), ease: 'sine.inOut' }, `+=${rastgele(0.2, 0.9)}`);
    bulutGecir();
    const kaynakDegis = () => gsap.to(kaynak, { aci: rastgele(-22, 22), guc: rastgele(0.35, 1), duration: rastgele(1.8, 3.4), ease: 'sine.inOut', onComplete: kaynakDegis });
    kaynakDegis();
    const titresim = huzmeler.map((h) => ({ a: 0, x: 0, s: 1, o: Number(h.dataset.op ?? 0.5) }));
    const titret = (i: number) => {
      const temelOp = Number(huzmeler[i].dataset.op ?? 0.5);
      gsap.to(titresim[i], { a: rastgele(-9, 9), x: rastgele(-45, 45), s: rastgele(0.6, 1.6), o: temelOp * (Math.random() < 0.35 ? rastgele(0.05, 0.3) : rastgele(0.9, 1.9)), duration: rastgele(1.2, 2.8), ease: 'sine.inOut', onComplete: () => titret(i) });
    };
    huzmeler.forEach((_, i) => titret(i));

    const RAD = 180 / Math.PI;
    gsap.ticker.add(() => {
      const W = sahne.offsetWidth, H = sahne.offsetHeight;
      if (!W || !H) return;
      // Hüzmeleri yerleştir
      huzmeler.forEach((h, i) => {
        const t = titresim[i];
        gsap.set(h, { rotation: Number(h.dataset.aci) + kaynak.aci + t.a, x: t.x, scaleX: t.s, opacity: Math.min(1, t.o * (0.55 + kaynak.guc * 0.6)) * kaynak.bulut, transformOrigin: '50% 0%' });
      });
      // Her nesneye ne kadar ışık düştüğünü hüzmelerin açısından hesapla
      const ox = W * 0.5, oy = H * 0.12;
      const isikMiktari = isiklar.map((el) => {
        const dx = (Number(el.dataset.x) / 100) * W - ox, dy = (Number(el.dataset.y) / 100) * H - oy;
        const uzaklik = Math.hypot(dx, dy) || 1;
        let toplam = 0;
        huzmeler.forEach((h, i) => {
          const t = titresim[i];
          const hedefAci = -Math.atan2(dx - t.x, dy) * RAD;
          const aci = Number(h.dataset.aci) + kaynak.aci + t.a;
          const yari = Math.max(4, Math.atan(((Number(h.dataset.gen) || 80) * t.s) / 2 / uzaklik) * RAD * 1.6);
          const f = (aci - hedefAci) / yari;
          toplam += t.o * Math.exp(-f * f);
        });
        return Math.min(1, toplam * 1.4 * (0.5 + kaynak.guc * 0.6)) * kaynak.bulut;
      });
      isiklar.forEach((el, j) => { el.style.opacity = String(isikMiktari[j] * 0.6); });
      golgeliler.forEach((el, j) => { el.style.opacity = String((1 - isikMiktari[j]) * 0.45); });
      // Masadaki gölgeler ışığın tersine kayar, ışık güçlendikçe belirginleşir
      masaGolgeleri.forEach((el) => {
        const n = Number(el.dataset.nesne);
        const egim = Number(el.dataset.egim) - kaynak.aci * 2.4;
        el.style.transform = `skewX(${egim}deg) scaleY(${0.8 + kaynak.guc * 0.6})`;
        el.style.opacity = String(0.2 + kaynak.guc * 0.35 + (isikMiktari[n] ?? 0) * 0.25);
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
