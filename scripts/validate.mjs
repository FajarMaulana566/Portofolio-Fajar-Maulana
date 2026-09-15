import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=path.resolve(import.meta.dirname,'../dist');
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
const files=walk(root),pages=files.filter(f=>f.endsWith('.html'));
const titles=new Set();let images=0,links=0;
for(const file of pages){
 const html=fs.readFileSync(file,'utf8');
 assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length,1,file+' must have one h1');
 assert.equal((html.match(/<main(?:\s|>)/g)||[]).length,1,file+' must have one main');
 const title=html.match(/<title>(.*?)<\/title>/s)?.[1];assert(title);assert(!titles.has(title),'Duplicate title '+title);titles.add(title);
 for(const tag of ['name="description"','property="og:title"','property="og:description"','property="og:url"','rel="canonical"','lang="id"'])assert(html.includes(tag),file+' missing '+tag);
 assert(!html.includes('href="#/'),'Legacy hash navigation remains');
 for(const match of html.matchAll(/(?:href|src)="(\/[^"#]*)"/g)){
  const url=match[1].split('?')[0];const local=path.join(root,url)+(url.endsWith('/')?'index.html':'');assert(fs.existsSync(local),file+' missing '+local);links++;
 }
 for(const match of html.matchAll(/<img\b[^>]*>/g)){images++;for(const attr of ['alt=','width=','height=','decoding=','loading='])assert(match[0].includes(attr),file+' missing '+attr);}
}
const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');assert.equal((sitemap.match(/<url>/g)||[]).length,pages.length);
function lum(hex){const rgb=hex.replace('#','').match(/../g).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;}
function contrast(a,b){const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
const checks=[['dark text','#f3f5f5','#101111'],['dark muted','#a9b1b6','#191c1e'],['dark creative muted','#a9b1b6','#271d19'],['dark tech muted','#a9b1b6','#192432'],['dark orange','#ff936d','#271d19'],['dark blue','#91b8ff','#192432'],['dark button','#22130d','#ff936d'],['light text','#17212d','#f5f6f8'],['light muted','#53616d','#f5f6f8'],['light creative muted','#53616d','#fff0e9'],['light tech muted','#53616d','#eaf1ff'],['light orange','#a43a15','#fff0e9'],['light blue','#285bc0','#eaf1ff'],['light button','#ffffff','#993815']];
for(const [name,fg,bg] of checks){const ratio=contrast(fg,bg);assert(ratio>=4.5,name+' contrast '+ratio.toFixed(2));}
console.log(JSON.stringify({pages:pages.length,validLocalReferences:links,imageTags:images,contrastPairs:checks.length,minimumContrast:Number(Math.min(...checks.map(([,fg,bg])=>contrast(fg,bg))).toFixed(2)),browserJavaScriptBytes:files.filter(f=>f.endsWith('.js')).reduce((n,f)=>n+fs.statSync(f).size,0)},null,2));
