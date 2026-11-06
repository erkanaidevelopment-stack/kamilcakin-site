// @ts-check
import { defineConfig } from 'astro/config';

// GitHub Pages'ta özel alan adı (kamilcakin.com) bağlıysa BASE_PATH boş kalır.
// Alan adı bağlanmadan önce site kullanici.github.io/depo-adi/ altında yayınlanır;
// yayın iş akışı bu durumda BASE_PATH ve SITE_URL değerlerini kendisi verir.
const site = process.env.SITE_URL || 'https://kamilcakin.com';
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  build: { format: 'directory' },
});
