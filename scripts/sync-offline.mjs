#!/usr/bin/env node
// Refresh the embedded offline snapshot from the nine modular JSON files.
import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve(import.meta.dirname, '..');
const sections = ['profile','publications','education','experience','students','services','teaching','activities','news'];
const data = Object.fromEntries(sections.map(name => [name, JSON.parse(fs.readFileSync(path.join(root,'data',name+'.json'),'utf8'))]));
const p = path.join(root, 'index.html');
let html = fs.readFileSync(p,'utf8');
const json = JSON.stringify(data).replace(/</g,'\\u003c');
const regex = /(<script type="application\/json" id="site-data-fallback">)[\s\S]*?(<\/script>)/;
if (!regex.test(html)) throw Error('Could not locate the embedded fallback data');
html = html.replace(regex, (_,start,end) => start + json + end);
fs.writeFileSync(p,html);
console.log('Updated offline snapshot in index.html');
