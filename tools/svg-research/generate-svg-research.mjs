import fs from 'node:fs';
import path from 'node:path';

const project = 'C:\\Users\\iris\\Downloads\\Catalyst';
const out = path.join(project, 'public', 'generated', 'catalyst-svg-research-20260913-code-batch-b');
const variants = ['line'];
const categories = {
  analytical: `thought note source artifact artifact-version evidence observation claim judgment assumption hypothesis alternative question gap information-need indicator signpost trigger revision-condition entity person organization place event object actor concept inference warrant conclusion premise interpretation baseline deviation anomaly weak-signal warning assessment perspective dissent unknown disputed superseded stale retracted false unresolved aggregate cluster landmark scenario requirement finding cue signal fact estimate forecast thesis counterclaim rationale caveat`.split(' '),
  relations: `structural-child structural-sibling semantic-related supports contradicts depends-on assumes bears-on extracted-from quotes translates summarizes derived-from revised-from precedes follows causes enables inhibits owns works-for member-of located-at part-of about corroborates duplicates conflicts-with transforms-to references cites anchored-to observed-in challenges discriminates reconciles diverges-from same-origin independent-origin unknown-origin hidden-crossing collapsed-continuation trace-link source-use alternate-path confirms contests explains qualifies refines replaces supersedes attributed-to reported-by`.split(' '),
  operations: `trace transform junction divergence revision reconciliation probe watch scan inspect focus hoist collapse expand branch-left branch-right branch-both promote demote reorder-before reorder-after free-placement attach detach link unlink merge split group ungroup filter layer reveal hide pin unpin lock unlock compare align arrange auto-layout zoom-fit zoom-in zoom-out refocus isolate restore snapshot replay branch-new child-new sibling-new convert duplicate move copy cut paste`.split(' '),
  reader: `open-source source-link annotation annotations highlight underline strike outline comment tag bookmark copy capture crop region exact-anchor text-anchor image-anchor page-anchor selection next-hit previous-hit first-hit last-hit search find print export import rotate fullscreen spread thumbnail attachment form signature stamp redaction history source-settings page-up page-down fit-width fit-page actual-size hand-tool text-select area-select note-marker citation extract quote context return-to-source`.split(' '),
  structure: `map submap branch territory root child sibling left-side right-side free-node occurrence object-identity placement structural-path relation-overlay provenance-spine reader-analysis-boundary cluster folded-cluster working-set timeline matrix method layers picture projection overview working close inspect-scale focus-context local-tree radial-tree bifurcation convergence map-link branch-trunk branch-tip branch-junction branch-crossing hierarchy outline-tree horizontal-tree vertical-tree split-view source-pane analysis-pane inspector-pane marginalia legend`.split(' '),
  status: `confidence-high confidence-medium confidence-low confidence-unspecified likelihood-high likelihood-medium likelihood-low reliability-high reliability-medium reliability-low credibility-high credibility-medium credibility-low provenance-known provenance-unknown anchored unanchored changed review-required stale superseded retracted disputed warning-low warning-medium warning-high watch-active scan-new selected hovered focused keyboard-focus hidden generalized filtered collapsed incomplete unresolved synchronized offline local-only source-missing source-moved source-version-mismatch integrity-ok integrity-unknown integrity-failed independent corroborated uncorroborated diagnostic nondiagnostic provisional final draft active inactive`.split(' '),
  instrument: `home new open save save-as close commands search settings back forward undo redo delete add remove edit inspect map relation connect trace collapse expand layers timeline matrix method import export bookmark sort filter previous next first last zoom-in zoom-out fit arrange auto-layout side-left side-right reader-settings help info keyboard palette theme refresh sync history recent favorite star menu more grid list split-horizontal split-vertical panel-left panel-right panel-bottom maximize minimize reset copy cut paste attach detach print share download upload locate crosshair cursor hand pointer`.split(' ')
};

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
const hash = s => [...s].reduce((a, c) => ((a * 33) ^ c.charCodeAt(0)) >>> 0, 5381);
const xml = s => s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const p = d => `<path d="${d}"/>`;
const rect = (x,y,w,h,extra='') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" ${extra}/>`;
const circle = (cx,cy,r,extra='') => `<circle cx="${cx}" cy="${cy}" r="${r}" ${extra}/>`;
function analytical(name, h) {
  if (/source|artifact/.test(name)) return p('M8 4h15l6 6v22H8z M23 4v8h8 M5 11v16') + circle(5,19,2,'fill="currentColor" stroke="none"');
  if (/evidence|observation|finding|fact|cue|signal/.test(name)) return p('M7 7h18v22H7z M11 13h10 M11 18h12 M28 8v21 M28 15h4') + circle(32,15,2,'fill="currentColor" stroke="none"');
  if (/claim|judgment|thesis|counterclaim|conclusion/.test(name)) return p('M18 4l12 14-12 14L6 18z M11 18h14 M18 11v14') + circle(18,18,2.3,'fill="currentColor" stroke="none"');
  if (/assumption|caveat/.test(name)) return p('M8 5H5v26h3 M28 5h3v26h-3 M18 9l9 9-9 9-9-9z') + circle(18,18,2.2,'fill="currentColor" stroke="none"');
  if (/hypothesis|alternative|scenario|forecast|estimate/.test(name)) return p('M5 18h9 M14 18l4-4 4 4-4 4z M22 18h4l5-8 M26 18l5 8 M31 7v5 M31 24v5');
  if (/question|gap|information-need|requirement|unresolved/.test(name)) return p('M8 12c1-5 5-8 10-8 6 0 10 3 10 8 0 7-8 7-8 13 M8 12H4v12h4') + circle(20,31,1.8,'fill="currentColor" stroke="none"');
  if (/entity|person|organization|place|object|actor|concept/.test(name)) return rect(8,8,20,20) + p('M8 14H3 M8 22H3 M28 14h5 M28 22h5 M18 8V3 M18 28v5') + rect(14.5,14.5,7,7,'fill="currentColor" stroke="none"');
  if (/event|trigger|indicator|signpost/.test(name)) return p('M5 18h26 M18 5v26 M9 13v10 M27 13v10 M13 9h10 M13 27h10 M18 11l7 7-7 7-7-7z') + circle(18,18,2,'fill="currentColor" stroke="none"');
  if (/baseline|deviation|anomaly|weak-signal|warning/.test(name)) return p('M4 24h7l3-12 5 16 4-9 4 5h5 M4 30h28 M8 7h20') + circle(19,28,2,'fill="currentColor" stroke="none"');
  return p('M8 8h14l6 10-6 10H8 M8 12H4v12h4 M12 18h7l4-4 M19 18l4 4h5') + circle(19,18,2.2,'fill="currentColor" stroke="none"');
}

function relation(name, h) {
  if (/structural/.test(name)) return p('M4 18h8l5-7h14 M12 18l5 7h14') + rect(3,16.5,3,3) + rect(29.5,9.5,3,3) + rect(29.5,23.5,3,3);
  const provenance = /from|quotes|translates|summarizes|derived|revised|reported|attributed|source|anchored|observed/.test(name);
  const conflict = /contradicts|conflicts|contests|challenges/.test(name);
  const positive = /supports|corroborates|confirms|explains|enables/.test(name);
  const line = provenance ? p('M4 8h7l3 3v17H4z M11 8v5h5 M16 20h14') : p('M5 18h24');
  const head = conflict ? p('M29 13v10 M25 14l8 8 M33 14l-8 8') : positive ? p('M25 14l5 4-5 4 M30 12v12') : p('M25 13l6 5-6 5');
  const mid = /depends|assumes|bears|qualifies|refines/.test(name) ? p('M17 14l4 4-4 4-4-4z') : circle(18,18,1.6,'fill="currentColor" stroke="none"');
  return line + head + mid;
}

function operation(name, h) {
  if (/trace|junction|divergence|reconciliation|probe|watch|scan/.test(name)) return p('M4 7h7l6 10 M4 18h13 M4 29h7l6-10 M19 18h5 M24 18l8-8 M24 18l8 8') + rect(15.6,16.6,3.4,3.4,'transform="rotate(45 17.3 18.3)"') + circle(32,10,1.7) + p('M30.5 24.5h3v3');
  if (/collapse|expand|hoist|focus|refocus|isolate/.test(name)) return p('M5 5v26 M5 11h8l5-5h6 M5 25h8l5 5h6 M11 18h18') + (/expand/.test(name) ? p('M23 13l5 5-5 5') : p('M17 13l-5 5 5 5'));
  if (/promote|demote|reorder|move/.test(name)) return p('M6 7h15 M6 14h15 M6 21h15 M6 28h15') + (/before|promote/.test(name) ? p('M28 28V8 M23 13l5-5 5 5') : p('M28 8v20 M23 23l5 5 5-5'));
  if (/zoom|fit|align|arrange|auto-layout/.test(name)) return p('M5 12V5h7 M24 5h7v7 M31 24v7h-7 M12 31H5v-7 M10 18h16 M18 10v16') + circle(18,18,2);
  if (/attach|detach|link|unlink|merge|split/.test(name)) return p('M4 18h9 M23 18h9 M13 18l5-5 5 5-5 5z') + (/detach|unlink|split/.test(name) ? p('M15 8l6 20 M21 8l-6 20') : circle(18,18,2,'fill="currentColor" stroke="none"'));
  return p('M5 18h9l5-6h12 M14 18l5 6h12') + rect(3.5,16.5,3,3) + circle(19,18,2,'fill="currentColor" stroke="none"');
}

function reader(name, h) {
  const page = p('M7 4h15l7 7v21H7z M22 4v9h9');
  if (/highlight|underline|strike|outline|comment|tag|bookmark|annotation/.test(name)) return page + p('M11 17h13 M11 21h11 M11 25h9') + (/highlight/.test(name) ? rect(10,19,15,5,'fill="currentColor" opacity=".18"') : /comment/.test(name) ? p('M23 22h9v7h-5l-3 3v-3h-1z') : /bookmark/.test(name) ? p('M12 4v10l3-2 3 2V4') : circle(11,17,1.6,'fill="currentColor" stroke="none"'));
  if (/anchor|region|crop|selection|capture|extract|quote/.test(name)) return page + p('M11 16h12v8H11z M4 14v12 M2 16h4 M2 24h4') + circle(4,20,1.8,'fill="currentColor" stroke="none"');
  if (/search|find|hit/.test(name)) return page + circle(17,19,5) + p('M20.5 22.5l6 6 M14 19h6');
  if (/zoom|fit|actual|fullscreen|spread|thumbnail/.test(name)) return page + p('M11 16v-3h3 M22 13h3v3 M25 24v3h-3 M14 27h-3v-3');
  if (/open-source|source-link|return-to-source|citation/.test(name)) return page + p('M3 19h10 M9 15l4 4-4 4 M20 25h12 M28 21l4 4-4 4');
  return page + p('M11 17h13 M11 22h10 M11 27h12');
}

function structure(name, h) {
  if (/split-view|pane|boundary|spine/.test(name)) return rect(4,5,28,26) + p('M17 5v26 M20 5v26 M7 10h7 M23 10h6 M7 15h7 M23 15h6');
  if (/timeline/.test(name)) return p('M4 18h28 M8 13v10 M18 8v20 M28 13v10') + circle(8,18,2,'fill="currentColor" stroke="none"') + circle(18,18,2,'fill="currentColor" stroke="none"') + circle(28,18,2,'fill="currentColor" stroke="none"');
  if (/matrix/.test(name)) return rect(5,5,26,26) + p('M5 13h26 M5 22h26 M13 5v26 M22 5v26') + rect(14,14,7,7,'fill="currentColor" opacity=".18"');
  if (/cluster|territory|working-set|picture|projection|map/.test(name)) return p('M5 11l5-6h16l5 6v14l-5 6H10l-5-6z M10 18h7l4-6h10 M17 18l4 6h10') + circle(17,18,2,'fill="currentColor" stroke="none"');
  return p('M5 5v26 M5 10h9l5-5h11 M5 18h11l5 0h9 M5 26h9l5 5h11') + rect(28,3.5,3,3) + rect(28,16.5,3,3) + rect(28,29.5,3,3);
}

function status(name, h) {
  const frame = p('M8 5H5v26h3 M28 5h3v26h-3');
  if (/confidence|likelihood|reliability|credibility/.test(name)) {
    const level = /high/.test(name) ? 3 : /medium/.test(name) ? 2 : /low/.test(name) ? 1 : 0;
    return frame + [0,1,2].map((i) => rect(11 + i*5, 25-i*6, 3, 6+i*6, i < level ? 'fill="currentColor" stroke="none"' : '')).join('');
  }
  if (/warning/.test(name)) return frame + p('M18 8l11 20H7z M18 13v8') + circle(18,25,1.8,'fill="currentColor" stroke="none"');
  if (/selected|hovered|focused|keyboard-focus/.test(name)) return p('M5 12V5h7 M24 5h7v7 M31 24v7h-7 M12 31H5v-7') + rect(11,11,14,14) + circle(18,18,2,'fill="currentColor" stroke="none"');
  if (/hidden|generalized|filtered|collapsed/.test(name)) return frame + p('M9 18h18 M13 14l-4 4 4 4 M23 14l4 4-4 4') + p('M11 27l14-18');
  if (/source-missing|source-moved|version-mismatch|integrity-failed/.test(name)) return frame + p('M10 8h12l5 5v15H10z M22 8v6h6 M13 25l10-10 M13 15l10 10');
  if (/anchored|provenance|integrity-ok|synchronized|independent|corroborated/.test(name)) return frame + p('M10 18h6l4-4 6 6 M20 14l5-5') + circle(20,14,2,'fill="currentColor" stroke="none"');
  return frame + p('M11 11h14v14H11z M14 18h8') + circle(18,18,2,'fill="currentColor" stroke="none"');
}

function instrument(name, h) {
  if (/search|locate|crosshair/.test(name)) return circle(15,15,8) + p('M21 21l9 9 M11 15h8 M15 11v8');
  if (/home/.test(name)) return p('M5 18L18 6l13 12 M9 16v15h18V16 M15 31v-9h6v9');
  if (/save|download|upload|import|export/.test(name)) return p('M7 5h19l5 5v21H7z M11 5v9h12V5 M12 26h12') + (/upload|export/.test(name) ? p('M18 23V12 M14 16l4-4 4 4') : p('M18 12v11 M14 19l4 4 4-4'));
  if (/back|previous|first|undo/.test(name)) return p('M28 10H14V5L5 14l9 9v-5h10 M10 14h18');
  if (/forward|next|last|redo/.test(name)) return p('M8 10h14V5l9 9-9 9v-5H12 M8 14h18');
  if (/settings|palette|theme/.test(name)) return p('M5 9h26 M5 18h26 M5 27h26') + rect(11,6.5,4,5) + rect(22,15.5,4,5) + rect(14,24.5,4,5);
  if (/grid|matrix/.test(name)) return rect(6,6,24,24) + p('M6 14h24 M6 22h24 M14 6v24 M22 6v24');
  if (/split|panel/.test(name)) return rect(5,6,26,24) + (/vertical|left|right/.test(name) ? p('M17 6v24') : p('M5 18h26'));
  if (/zoom|fit|maximize|minimize/.test(name)) return p('M6 12V6h6 M24 6h6v6 M30 24v6h-6 M12 30H6v-6') + (/minimize|zoom-out/.test(name) ? p('M12 18h12') : p('M12 18h12 M18 12v12'));
  return p('M6 8h24 M6 18h24 M6 28h24') + rect(5,6.5,3,3) + rect(5,16.5,3,3) + rect(5,26.5,3,3);
}

const drawers = { analytical, relations: relation, operations: operation, reader, structure, status, instrument };
function variantMarks(variant, h) {
  if (variant === 'open') return p('M3 8V3h5 M28 3h5v5 M33 28v5h-5 M8 33H3v-5');
  if (variant === 'dense') return p('M3 4h7 M26 4h7 M3 32h7 M26 32h7') + circle(33,18,1.4,'fill="currentColor" stroke="none"');
  if (variant === 'indexed') return p('M3 8v20 M1 11h4 M1 18h4 M1 25h4') + rect(31,4,2,8,'fill="currentColor" stroke="none"');
  return '';
}
function iconBody(category, name, variant) { const h = hash(category + ':' + name); return drawers[category](name, h) + variantMarks(variant, h); }

function renderIcon(category, name, variant) {
  const title = xml(`Catalyst research: ${category} / ${name} / ${variant}`);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" width="36" height="36" fill="none" color="#243634" stroke="currentColor" stroke-width="1.7" stroke-linecap="square" stroke-linejoin="miter"><title>${title}</title><g vector-effect="non-scaling-stroke">${iconBody(category, name, variant)}</g></svg>\n`;
}

const manifest = [];
for (const [category, names] of Object.entries(categories)) {
  const dir = path.join(out, category);
  fs.mkdirSync(dir, { recursive: true });
  for (const name of names) for (const variant of variants) {
    const filename = `${name}--${variant}.svg`;
    fs.writeFileSync(path.join(dir, filename), renderIcon(category, name, variant));
    manifest.push({ category, name, variant, file: `${category}/${filename}` });
  }
}

function contactSheet(category, names) {
  const cols = 8, cellW = 150, cellH = 68, rows = Math.ceil(names.length / cols);
  const cells = names.map((name, i) => {
    const x = (i % cols) * cellW, y = Math.floor(i / cols) * cellH;
    return `<g transform="translate(${x} ${y})"><g transform="translate(8 7) scale(1.05)">${iconBody(category, name, 'line')}</g><text x="52" y="30" fill="#d9e3e1" font-size="11" font-family="ui-monospace,monospace">${xml(name)}</text><text x="52" y="46" fill="#7f9995" font-size="9" font-family="ui-monospace,monospace">${xml(category)}</text></g>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${cols*cellW}" height="${rows*cellH}" viewBox="0 0 ${cols*cellW} ${rows*cellH}" color="#b9d4cf" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter"><rect width="100%" height="100%" fill="#101716" stroke="none"/>${cells}</svg>\n`;
}
for (const [category, names] of Object.entries(categories)) fs.writeFileSync(path.join(out, `contact-${category}.svg`), contactSheet(category, names));

const allNames = Object.entries(categories).flatMap(([category, names]) => names.map(name => ({ category, name })));
const htmlCards = manifest.map(m => `<figure><img src="${m.file}" alt="${xml(m.name)} ${m.variant}"><figcaption><b>${xml(m.name)}</b><span>${m.category} · ${m.variant}</span></figcaption></figure>`).join('');
const html = `<!doctype html><meta charset="utf-8"><title>Catalyst coded SVG research batch</title><style>body{margin:24px;background:#101716;color:#d9e3e1;font:12px system-ui}h1{font:600 22px system-ui}p{color:#8fa7a3}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px}figure{margin:0;padding:12px;border:1px solid #263b38;background:#151f1e}img{width:48px;height:48px;background:#e7eceb;padding:8px}figcaption{display:grid;gap:3px;margin-top:8px}span{color:#77918d;font:10px ui-monospace,monospace}</style><h1>Catalyst coded SVG research batch</h1><p>${manifest.length} SVGs. Experimental, duplicative by design; not a production symbol contract.</p><div class="grid">${htmlCards}</div>`;
fs.writeFileSync(path.join(out, 'index.html'), html);
fs.writeFileSync(path.join(out, 'manifest.json'), JSON.stringify({ generatedAt: new Date().toISOString(), variants, categories, count: manifest.length, assets: manifest }, null, 2));

const readme = `# Catalyst coded SVG research batch\n\nGenerated by \`tools/svg-research/generate-svg-research.mjs\`.\n\nThis corpus is intentionally broad and duplicative. It is a research library, not a frozen product icon set.\n\n- ${Object.values(categories).reduce((n, a) => n + a.length, 0)} named concepts\n- ${variants.length} variants per concept\n- ${manifest.length} standalone SVG files\n- ${Object.keys(categories).length} category contact sheets\n- browser gallery in \`index.html\`\n\nThe drawings follow the current Catalyst research constraints: monochrome-readable geometry, square/mitered instrument character, explicit terminals/junctions, and separation of analytical notation from ordinary chrome.\n`;
fs.writeFileSync(path.join(out, 'README.md'), readme);
console.log(JSON.stringify({ out, concepts: allNames.length, variants: variants.length, svgAssets: manifest.length, contactSheets: Object.keys(categories).length }, null, 2));
