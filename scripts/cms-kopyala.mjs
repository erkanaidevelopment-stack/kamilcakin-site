// Yönetim panelinin (Sveltia CMS) dosyasını public/admin klasörüne kopyalar,
// böylece panel dış bir sunucuya bağlı olmadan sitenin içinden açılır.
import { copyFileSync, mkdirSync } from 'node:fs';

const kaynak = 'node_modules/@sveltia/cms/dist/sveltia-cms.js';
mkdirSync('public/admin', { recursive: true });
copyFileSync(kaynak, 'public/admin/sveltia-cms.js');
console.log('Yönetim paneli dosyası kopyalandı.');
