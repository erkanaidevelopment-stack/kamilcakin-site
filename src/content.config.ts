import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const yayinda = z.boolean().default(true);
const sira = z.number().default(100);

const yazilar = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/yazilar' }),
  schema: z.object({
    baslik: z.string(),
    ozet: z.string().default(''),
    tarih: z.coerce.date().optional(),
    tur: z.string().default('Başyazı'),
    kategori: z.string().default(''),
    alinti: z.string().optional(),
    alintiKaynak: z.string().optional(),
    pdf: z.string().optional(),
    yayinda,
  }),
});

const yayinlar = defineCollection({
  loader: glob({ pattern: '**/*.yml', base: './src/content/yayinlar' }),
  schema: z.object({
    baslik: z.string(),
    yil: z.coerce.number(),
    kunye: z.string(),
    tur: z.string().default('Makale'),
    konu: z.string().default(''),
    ozet: z.string().optional(),
    pdf: z.string().optional(),
    baglanti: z.string().optional(),
    yayinda,
  }),
});

const kitaplar = defineCollection({
  loader: glob({ pattern: '**/*.yml', base: './src/content/kitaplar' }),
  schema: z.object({
    baslik: z.string(),
    yayinevi: z.string().default(''),
    yil: z.coerce.number().optional(),
    kapak: z.string().optional(),
    renk: z.string().default('bordo'),
    tanitim: z.string().optional(),
    baglanti: z.string().optional(),
    sira,
    yayinda,
  }),
});

const klasikler = defineCollection({
  loader: glob({ pattern: '**/*.yml', base: './src/content/klasikler' }),
  schema: z.object({
    baslik: z.string(),
    arapca: z.string(),
    sirtYazisi: z.string(),
    muellif: z.string(),
    vefat: z.string(),
    aciklama: z.string().default(''),
    renk: z.string().default('bordo'),
    oneCikan: z.boolean().default(false),
    sira,
    yayinda,
  }),
});

const videolar = defineCollection({
  loader: glob({ pattern: '**/*.yml', base: './src/content/videolar' }),
  schema: z.object({
    baslik: z.string(),
    youtube: z.string(),
    seri: z.string().default(''),
    aciklama: z.string().default(''),
    tarih: z.coerce.date().optional(),
    sira,
    yayinda,
  }),
});

const alanlar = defineCollection({
  loader: glob({ pattern: '**/*.yml', base: './src/content/alanlar' }),
  schema: z.object({
    baslik: z.string(),
    aciklama: z.string().default(''),
    sira,
    yayinda,
  }),
});

const sorular = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/sorular' }),
  schema: z.object({
    soru: z.string(),
    sira,
    yayinda,
  }),
});

const ayarlar = defineCollection({
  loader: glob({ pattern: '*.yml', base: './src/content/ayarlar' }),
  schema: z.record(z.string(), z.any()),
});

export const collections = { yazilar, yayinlar, kitaplar, klasikler, videolar, alanlar, sorular, ayarlar };
