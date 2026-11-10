import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = name => JSON.parse(fs.readFileSync(path.join(root, 'data', `${name}.json`), 'utf8'));
const profile = read('profile');
const activities = read('activities');
const news = read('news');
const d = {
  main: profile.main,
  publications: read('publications'),
  educations: read('education'),
  experiences: read('experience'),
  students: read('students'),
  services: read('services'),
  teaching: read('teaching'),
  tools: profile.tools,
  academic: {
    interests: profile.interests,
    skills: profile.skills,
    references: profile.references,
    schools: activities.schools,
    talks: activities.talks,
    news: news.items || []
  },
  searchPlaceholder: profile.searchPlaceholder
};
const esc = value => String(value ?? '').replace(/[&<>"']/g, char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const txt = value => String(value ?? '').replace(/<br\s*\/?\s*>/ig,' · ').replace(/<[^>]*>/g,' ').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();
const link = (label,url) => url ? `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)}</a>` : esc(label);
const list = items => `<ul>${items.map(item=>`<li>${item}</li>`).join('')}</ul>`;
const section = (heading,items) => items.length ? `<section><h2>${esc(heading)}</h2>${list(items)}</section>` : '';
const pubs = d.publications.years.flatMap(y=>y.items.map(p=>({...p,group:y.label})));
const q = (p) => `<li><strong>${link(p.title,p.primaryLink)}</strong><div class="sub">${esc(txt(p.authors))}</div>${p.links?.filter(l=>l.url && l.url!==p.primaryLink).map(l=>`<small>${link(l.label,l.url)}</small>`).join(' · ')||''}</li>`;
const people = [...(d.students.currentStudents||[]),...(d.students.alumni||[])];
const page = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Academic Profile & Publications — ${esc(d.main.name)}</title><meta name="description" content="Research, publications, academic experience and reviewing activities of ${esc(d.main.name)} at the University of Mons."><link rel="canonical" href="https://amjadseyedi.github.io/academic-profile.html"><style>body{font-family:system-ui,-apple-system,sans-serif;line-height:1.65;color:#18243d;background:#fafbff;max-width:900px;margin:auto;padding:18px 24px}header{padding:25px 0}h1{margin-bottom:2px}h2{font-size:1.25rem;margin-top:30px;border-bottom:1px solid #dce0ea;padding-bottom:6px}a{color:#4439bd}li{margin:9px 0}main{background:white;border:1px solid #e9ecf3;padding:12px 26px 30px;border-radius:18px}.sub{font-size:.88rem;color:#4a5870}small{font-size:.78rem}nav{display:flex;gap:17px;flex-wrap:wrap}p{overflow-wrap:break-word}</style></head><body>
<header><a href="./">← Home</a><h1>${esc(d.main.name)}</h1><p>${esc(d.main.title)} · University of Mons, Belgium</p><nav><a href="cv/SeyediCV.pdf">CV (PDF)</a><a href="${esc(d.publications.scholarlUrl)}">Google Scholar</a><a href="mailto:${esc(d.main.email)}">Email</a></nav></header>
<main><h2>About</h2><p>${esc(txt(d.main.bio))}</p>
${section('Research interests',(d.academic.interests||[]).map(esc))}
${section('News & updates',(d.academic.news||[]).map(n=>`${esc(n.date)} — ${link(n.title,n.url)}. ${esc(n.description || '')}`))}
${section('Education',(d.educations.items||[]).map(e=>`<strong>${esc(e.degree)}</strong> — ${esc(e.institution)} (${esc(e.period)}). ${esc(txt(e.details))}`))}
${section('Experience',(d.experiences.items||[]).map(e=>`<strong>${esc(e.title)}</strong> — ${esc(e.institution)} (${esc(e.period)}). ${esc(txt(e.details))}`))}
${section('Students & research mentoring',people.map(s=>`${link(s.name,s.link)} — ${esc(s.degreeDuringMentorship || '')} during mentorship (${esc(s.years || '')}); ${esc(s.topic || '')}${s.currentPosition ? '; current position: ' + esc(s.currentPosition) : ''}`))}
${section('Teaching',(d.teaching.courses||[]).map(c=>`${esc(c.name)} — ${esc(c.period)}`))}
${section('Talks and presentations',(d.academic.talks||[]).map(r=>`${esc(r[0])} — ${esc(r[1])}: ${esc(r[2])}`))}
${section('Courses and schools',(d.academic.schools||[]).map(r=>`${esc(r[0])}: ${esc(r[1])} — ${esc(r[2])}`))}
${section('Journal reviewing',(d.services.journals||[]).map(esc))}
${section('Conference reviewing',(d.services.conferences||[]).map(esc))}
${section('Technical skills',(d.academic.skills||[]).map(esc))}
<section><h2>Publications and preprints (${pubs.length})</h2><ol>${pubs.map(q).join('')}</ol></section>
${section('Academic references',(d.academic.references||[]).map(r=>`${esc(r[0])} — ${esc(r[1])} · <a href="mailto:${esc(r[2])}">${esc(r[2])}</a>`))}
</main></body></html>`;
fs.writeFileSync(path.join(root,'academic-profile.html'),page,'utf8');
console.log(`Generated academic-profile.html with ${pubs.length} publications from nine data/*.json files`);
