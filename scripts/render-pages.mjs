import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createViews} from '../src/views.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=async name=>JSON.parse(await fs.readFile(path.join(root,'content',name+'.json'),'utf8'));
const profile=await read('profile'), socials=await read('socials'), tools=await read('skills');
const projects=(await Promise.all(['photography','editing','design','web','robotics','office'].map(read))).flat();
if(new Set(projects.map(p=>p.id)).size!==projects.length) throw new Error('Project IDs must be unique');
for(const p of projects) {
  if(!/^[a-z0-9-]+$/.test(p.id)) {
    console.log('ID bermasalah:', JSON.stringify(p.id));
    throw new Error('Use URL-safe project IDs');
  }
}
const views=createViews({...profile,...socials,tools,projects});
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const titles={home:profile.name+' | Creative & Technology Portfolio',creative:'Jasa Media & Kreatif | '+profile.name,tech:'Teknologi, Programming & IoT | '+profile.name,about:'Tentang Saya | '+profile.name,skills:'Skill & Tools | '+profile.name,contact:'Kontak | '+profile.name};
const descriptions={home:'Portofolio Mochamad Fajar Maulana: fotografi, editing, desain grafis, web programming, robotika, dan Microsoft Office.',creative:'Jelajahi portofolio fotografi, editing foto, dan desain grafis Mochamad Fajar Maulana.',tech:'Web programming, Microsoft Office, dan proyek UAS IoT Activity Tracking System berbasis ESP32, RFID, dashboard web, serta Telegram.',about:'Kenali Mochamad Fajar Maulana, mahasiswa Teknik Komputer di Politeknik LP3I Cirebon yang mengeksplorasi kreativitas dan teknologi.',skills:'Perangkat kreatif dan teknologi: Lightroom, Photoshop, Illustrator, CorelDRAW, Canva, VS Code, Office, dan Arduino IDE.',contact:'Diskusikan kebutuhan jasa media kreatif, web programming, robotika, atau Microsoft Office dengan Mochamad Fajar Maulana.'};
const routes=Object.keys(titles).map(route=>({route,url:route==='home'?'/':'/'+route+'/',title:titles[route],description:descriptions[route]}));
for(const project of projects)routes.push({route:project.path,url:'/proyek/'+project.id+'/',title:project.title+' | '+profile.name,description:project.description,project});
const icon="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%23111111'/%3E%3Ctext x='6' y='24' font-size='24' fill='%23ff8058'%3EF%3C/text%3E%3C/svg%3E";
for(const item of routes){
 const url=profile.siteUrl+item.url;
 const html=`<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(item.title)}</title><meta name="description" content="${esc(item.description)}"><meta name="color-scheme" content="dark light"><meta name="theme-color" content="#101111"><link rel="canonical" href="${url}"><meta property="og:type" content="website"><meta property="og:locale" content="id_ID"><meta property="og:site_name" content="Mochamad Fajar Maulana"><meta property="og:title" content="${esc(item.title)}"><meta property="og:description" content="${esc(item.description)}"><meta property="og:url" content="${url}"><meta name="twitter:card" content="summary"><meta name="twitter:title" content="${esc(item.title)}"><meta name="twitter:description" content="${esc(item.description)}"><link rel="icon" href="${icon}"><script>(function(){try{var t=localStorage.getItem('fajar-theme');document.documentElement.dataset.theme=t==='light'||t==='dark'?t:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');}catch(e){document.documentElement.dataset.theme=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}})();</script><link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="/enhancements.css"><link rel="stylesheet" href="/student-contact.css"><script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@type':'Person',name:profile.name,url:profile.siteUrl,jobTitle:'Mahasiswa Teknik Komputer',affiliation:{'@type':'EducationalOrganization',name:profile.education.institution},knowsAbout:['Fotografi','Editing','Desain Grafis','Web Programming','Robotika','Microsoft Office']})}</script></head><body><div id="app" data-route="${item.route}">${views.render(item.route,item.project)}</div><script type="module" src="/app.js"></script></body></html>`;
 const dir=path.join(root,'dist',item.url);await fs.mkdir(dir,{recursive:true});await fs.writeFile(path.join(dir,'index.html'),html);
}
await fs.mkdir(path.join(root,'dist/data'),{recursive:true});
await fs.writeFile(path.join(root,'dist/data/socials.json'),JSON.stringify(socials));
await fs.writeFile(path.join(root,'dist/sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+routes.map(r=>'<url><loc>'+esc(profile.siteUrl+r.url)+'</loc></url>').join('')+'</urlset>');
await fs.writeFile(path.join(root,'dist/robots.txt'),'User-agent: *\nAllow: /\nSitemap: '+profile.siteUrl+'/sitemap.xml\n');
console.log('Rendered '+routes.length+' semantic static pages, metadata, sitemap, and robots.txt.');
