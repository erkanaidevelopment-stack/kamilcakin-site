import { getCollection, getEntry } from 'astro:content';

const BASE = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : import.meta.env.BASE_URL + '/';

/** Site içi bağlantı ya da /uploads/... gibi dosya yolu için alt dizini (base) ekler. */
export function u(path = '/'): string {
  if (!path) return BASE;
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;
  return BASE + path.replace(/^\/+/, '');
}

export async function ayar<T = Record<string, any>>(id: 'site' | 'anasayfa' | 'hakkinda'): Promise<T> {
  const e = await getEntry('ayarlar', id);
  return (e?.data ?? {}) as T;
}

type Coll = 'yazilar' | 'yayinlar' | 'kitaplar' | 'klasikler' | 'videolar' | 'alanlar' | 'sorular';

/** Yalnızca yayında olan kayıtlar; sıra alanı varsa ona, yoksa verilen düzene göre. */
export async function yayindakiler<C extends Coll>(c: C) {
  const all = await getCollection(c, (e: any) => e.data.yayinda !== false);
  return all;
}

export async function siraliYayindakiler<C extends 'kitaplar' | 'klasikler' | 'videolar' | 'alanlar' | 'sorular'>(c: C) {
  const all: any[] = await yayindakiler(c);
  return all.sort((a, b) => (a.data.sira ?? 100) - (b.data.sira ?? 100) || String(a.id).localeCompare(String(b.id), 'tr'));
}

export async function yazilarSirali() {
  const all = await yayindakiler('yazilar');
  return all.sort((a, b) => (b.data.tarih?.getTime() ?? 0) - (a.data.tarih?.getTime() ?? 0));
}

export async function yayinlarSirali() {
  const all = await yayindakiler('yayinlar');
  return all.sort((a, b) => b.data.yil - a.data.yil || a.data.baslik.localeCompare(b.data.baslik, 'tr'));
}

const AYLAR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
export function tarihYaz(d: Date): string {
  return `${d.getUTCDate()} ${AYLAR[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function okumaSuresi(metin: string): number {
  const kelime = metin.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(kelime / 200));
}

/** YouTube adresinden video kimliğini çıkarır (watch, youtu.be, shorts, embed). */
export function youtubeId(url: string): string | null {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/|\/live\/)([A-Za-z0-9_-]{11})/);
  if (m) return m[1];
  if (/^[A-Za-z0-9_-]{11}$/.test(url.trim())) return url.trim();
  return null;
}

export const RENKLER: Record<string, { ana: string; koyu: string; ic: string }> = {
  bordo: { ana: '#7E2329', koyu: '#3A0F12', ic: '#140608' },
  lacivert: { ana: '#28406B', koyu: '#0E1A33', ic: '#050A16' },
  yesil: { ana: '#22533C', koyu: '#0C2018', ic: '#04100A' },
  kahve: { ana: '#714826', koyu: '#2A190B', ic: '#120A04' },
  murdum: { ana: '#5A1E3A', koyu: '#24091A', ic: '#12040C' },
};
export function renk(ad: string) {
  return RENKLER[ad] ?? RENKLER.bordo;
}
