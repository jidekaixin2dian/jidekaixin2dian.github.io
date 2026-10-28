import { readFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import vm from 'node:vm';

const root = fileURLToPath(new URL('../', import.meta.url));
const context = { window: {} };
vm.runInNewContext(await readFile(path.join(root, 'projects.js'), 'utf8'), context);
const projects = context.window.PORTFOLIO_PROJECTS;
const errors = [], ids = new Set(), urls = new Set();
async function localAsset(ref, owner) {
  if (/^(?:[a-z]+:|#|\/\/)/i.test(ref)) return;
  const pathname = decodeURIComponent(ref.split(/[?#]/)[0]);
  if (!pathname) return;
  try { await access(path.resolve(root, pathname)); }
  catch { errors.push(`${owner}: missing local resource ${ref}`); }
}
for (const project of projects) {
  if (!/^[a-z]+$/.test(project.id) || ids.has(project.id)) errors.push(`Invalid/duplicate project ID: ${project.id}`);
  ids.add(project.id);
  for (const key of ['name', 'repo', 'role', 'category', 'tags', 'description', 'subtitle', 'problem', 'approach', 'result', 'boundary']) {
    if (typeof project[key] !== 'string' || !project[key].trim()) errors.push(`${project.id}: missing ${key}`);
  }
  if (project.image) {
    await localAsset(project.image, project.id);
    await localAsset(project.image.replace('.png', '-2x.webp'), project.id);
  }
  urls.add(`https://github.com/jidekaixin2dian/${project.repo}`);
  for (const [label, link] of project.links) {
    try {
      const url = new URL(link);
      if (!label || url.protocol !== 'https:') throw new Error();
      url.hash = '';
      urls.add(url.href);
    } catch { errors.push(`${project.id}: invalid link ${link}`); }
  }
}
for (const file of ['index.html', 'studio.html', 'journey.html']) {
  const source = await readFile(path.join(root, file), 'utf8');
  for (const match of source.matchAll(/(?:src|href)=["']([^"']+)["']/g)) await localAsset(match[1], file);
}
// Journey has its own narrative data; check those public destinations too.
const journey = await readFile(path.join(root, 'journey.js'), 'utf8');
for (const match of journey.matchAll(/https:\/\/github\.com\/[^'"\s<>]+/g)) urls.add(match[0]);

function githubEndpoint(link) {
  const url = new URL(link);
  if (url.hostname !== 'github.com') return null;
  const [owner, repo, kind, ref, ...rest] = url.pathname.split('/').filter(Boolean);
  const base = `https://api.github.com/repos/${owner}/${repo}`;
  if (!kind) return base;
  if (kind === 'blob') return `${base}/contents/${rest.join('/')}?ref=${encodeURIComponent(ref)}`;
  if (kind === 'pull') return `${base}/pulls/${ref}`;
  if (kind === 'releases') {
    if (ref === 'tag') return `${base}/releases/tags/${encodeURIComponent(rest.join('/'))}`;
    return ref === 'latest' ? `${base}/releases/latest` : `${base}/releases?per_page=1`;
  }
  return null;
}
if (process.argv.includes('--online')) {
  for (const url of urls) {
    const endpoint = githubEndpoint(url);
    const headers = { 'User-Agent': 'portfolio-link-check' };
    if (endpoint && process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    let failure;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await fetch(endpoint || url, { headers, signal: AbortSignal.timeout(20000) });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        if (endpoint?.includes('releases?') && !(await response.json()).length) throw new Error('No published releases');
        failure = null;
        break;
      } catch (error) { failure = error.message; }
    }
    if (failure) errors.push(`${url}: ${failure}`);
  }
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Checked ${projects.length} projects, local page resources and ${urls.size} external URLs${process.argv.includes('--online') ? ' (online)' : ' (syntax only; use --online to check destinations)'}.`);
}
