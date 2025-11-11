// generate-sitemap.js
const fs = require('fs');
const { SitemapStream, streamToPromise } = require('sitemap');
const { createGzip } = require('zlib');

const baseUrl = 'https://www.jbarquinha.com';

const staticRoutes = [
  '/',
  '/vehicles'
  // podes adicionar /about se existir
];

// Aqui devias obter os carIds dinamicamente do Firebase, mas por agora podemos simular:
const carRoutes = [
  '/car/jaguar-mk2',
  '/car/fiat-500',
  '/car/mercedes-380-sec'
  // Adiciona manualmente os carros que já estão online
];

const links = [...staticRoutes, ...carRoutes].map((url) => ({
  url,
  changefreq: 'weekly',
  priority: url === '/' ? 1.0 : 0.8,
}));

const sitemap = new SitemapStream({ hostname: baseUrl });
const writeStream = fs.createWriteStream('./public/sitemap.xml.gz');
sitemap.pipe(createGzip()).pipe(writeStream);

streamToPromise(sitemap).then(() => {
  console.log('✅ sitemap.xml.gz gerado com sucesso!');
});

links.forEach(link => sitemap.write(link));
sitemap.end();
