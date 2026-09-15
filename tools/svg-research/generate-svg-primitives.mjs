import fs from 'node:fs';
import path from 'node:path';
const project = 'C:\\Users\\iris\\Downloads\\Catalyst';
const out = path.join(project, 'public', 'generated', 'catalyst-svg-research-20260913-primitives');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
const svg = (body, title, view='0 0 48 48', w=48, h=48) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${view}" width="${w}" height="${h}" fill="none" color="#243634" stroke="currentColor" stroke-width="1.8" stroke-linecap="square" stroke-linejoin="miter"><title>${title}</title>${body}</svg>\n`;
const P = d => `<path d="${d}"/>`;
const R = (x,y,w,h,e='') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" ${e}/>`;
const C = (x,y,r,e='') => `<circle cx="${x}" cy="${y}" r="${r}" ${e}/>`;
const terminalNames = ['none','bar','square','open-square','diamond','open-diamond','circle','open-circle','chevron','fork','bracket','open-corner'];
function terminal(kind,x,y,dir=1){const s=dir; switch(kind){case'none':return'';case'bar':return P(`M${x} ${y-5}v10`);case'square':return R(x-2.5,y-2.5,5,5,'fill="currentColor" stroke="none"');case'open-square':return R(x-3,y-3,6,6);case'diamond':return `<path d="M${x} ${y-4}l4 4-4 4-4-4z" fill="currentColor" stroke="none"/>`;case'open-diamond':return P(`M${x} ${y-4}l4 4-4 4-4-4z`);case'circle':return C(x,y,3,'fill="currentColor" stroke="none"');case'open-circle':return C(x,y,3);case'chevron':return P(`M${x-4*s} ${y-5}l${5*s} 5-${5*s} 5`);case'fork':return P(`M${x} ${y}l${5*s} -6 M${x} ${y}l${5*s} 6`);case'bracket':return P(`M${x+3*s} ${y-6}h${-5*s}v12h${5*s}`);case'open-corner':return P(`M${x-3*s} ${y-4}h${4*s}v4`);default:return'';}}
const routers={straight:(a,b)=>P(`M${a} 24H${b}`),elbow:(a,b)=>P(`M${a} 24h10v-10h${b-a-20}v10h10`),step:(a,b)=>P(`M${a} 24h8v8h${b-a-16}v-8h8`),curve:(a,b)=>P(`M${a} 24C${a+10} 8 ${b-10} 40 ${b} 24`),arch:(a,b)=>P(`M${a} 24Q24 5 ${b} 24`),under:(a,b)=>P(`M${a} 24Q24 43 ${b} 24`)};

const assets=[];
function write(group,name,body,title=name,extra={}){const dir=path.join(out,group);fs.mkdirSync(dir,{recursive:true});const file=`${name}.svg`;fs.writeFileSync(path.join(dir,file),svg(body,title,extra.view||'0 0 48 48',extra.w||48,extra.h||48));assets.push({group,name,file:`${group}/${file}`});}
for(const [routerName,route] of Object.entries(routers)) for(const start of terminalNames) for(const end of terminalNames){
  const name=`${routerName}--${start}--${end}`;
  write('edges',name,terminal(start,7,24,1)+route(7,41)+terminal(end,41,24,-1),`edge ${routerName}: ${start} to ${end}`);
}
const junctionShapes={diamond:R(21.5,21.5,5,5,'transform="rotate(45 24 24)"')};
const topologies={threeLeft:P('M4 9h7l13 15 M4 24h20 M4 39h7l13-15'),twoLeft:P('M4 14h8l12 10 M4 34h8l12-10'),leftRight:P('M4 24h20 M24 24h20'),topBottom:P('M24 4v20 M24 24v20'),fanOut:P('M4 24h20 M24 24l14-14 M24 24l14 14'),fanIn:P('M10 10l14 14 M10 38l14-14 M24 24h18'),crossing:P('M5 12l38 24 M5 36l38-24'),offset:P('M4 30h14l6-6h20 M4 16h14l6 8')};
const outTerms=['none','bar','square','open-square','diamond','open-diamond','chevron','open-corner'];
for(const [jName,jBody] of Object.entries(junctionShapes)) for(const [tName,tBody] of Object.entries(topologies)) for(const term of outTerms){
  write('junctions',`${tName}--${jName}--${term}`,tBody+jBody+terminal(term,43,24,-1),`junction ${tName} ${jName} ${term}`);
}

const markPatterns={classic:P('M4 9h9l9 15 M4 24h18 M4 39h9l9-15 M26 24h7 M33 24l11-11 M33 24l11 11'),wide:P('M4 7h7l13 17 M4 24h20 M4 41h7l13-17 M28 24h5 M33 24l11-14 M33 24l11 14'),tight:P('M6 13h10l7 11 M6 24h17 M6 35h10l7-11 M27 24h7 M34 24l8-8 M34 24l8 8'),singleStem:P('M4 8h8l12 16 M4 24h20 M4 40h8l12-16 M24 24h10 M34 24l9-12 M34 24l9 12'),asymmetric:P('M4 10h11l8 14 M4 24h19 M4 38h7l12-14 M27 24h6 M33 24l11-16 M33 24l11 9'),forkHeavy:P('M4 11h10l9 13 M4 24h19 M4 37h10l9-13 M27 24h5 M32 24l12-16 M32 24h12 M32 24l12 16')};
const pairSets=[['bar','open-corner'],['square','open-square'],['diamond','open-diamond'],['circle','open-circle'],['bar','chevron'],['open-square','fork']];
for(const [pName,pBody] of Object.entries(markPatterns)) for(const [jName,jBody] of Object.entries(junctionShapes)) for(const [left,right] of pairSets) for(const weight of [1.2,1.6,2]){
  const body=`<g stroke-width="${weight}">${pBody}${jBody}${terminal(left,4,24,1)}${terminal(right,44,13,-1)}${terminal(right,44,35,-1)}</g>`;
  write('marks',`${pName}--${jName}--${left}-${right}--w${String(weight).replace('.','')}`,body,`Catalyst mark ${pName} ${jName} ${left}/${right} weight ${weight}`);
}
const coreNames=`source evidence claim assumption hypothesis question entity event thought gap indicator warning trace junction divergence probe watch scan revision reconciliation map branch child sibling relation support contradict provenance anchor annotation highlight comment tag bookmark search inspect focus collapse expand timeline matrix layers source-link open-source selection working-set occurrence placement`.split(' ');
function miniBody(name,profile){
  const open=profile==='open'?P('M3 8V3h5 M28 3h5v5 M33 28v5h-5 M8 33H3v-5'):'';
  if(/source|annotation|highlight|comment|bookmark|open-source/.test(name))return P('M8 4h15l5 5v23H8z M23 4v7h7 M12 17h12 M12 22h10')+open;
  if(/claim|assumption|hypothesis|question|gap|warning/.test(name))return P('M18 4l12 14-12 14L6 18z M11 18h14')+(profile==='compact'?C(18,18,2.4,'fill="currentColor" stroke="none"'):P('M18 11v14'))+open;
  if(/entity|event|occurrence|placement/.test(name))return R(8,8,20,20)+P('M8 18H3 M28 18h5 M18 8V3 M18 28v5')+C(18,18,2.2,'fill="currentColor" stroke="none"')+open;
  if(/trace|junction|divergence|probe|watch|scan|relation|support|contradict|provenance/.test(name))return P('M4 8h8l6 10 M4 18h14 M4 28h8l6-10 M21 18h5 M26 18l7-7 M26 18l7 7')+C(18,18,2,'fill="currentColor" stroke="none"')+open;
  return P('M5 5v26 M5 11h9l5-5h12 M5 18h14l5 0h7 M5 25h9l5 5h12')+open;
}
for(const name of coreNames) for(const size of [16,20,24]) for(const profile of ['crisp','compact']){
  write('reductions',`${name}--${size}px--${profile}`,miniBody(name,profile),`${name} ${size}px ${profile}`,{w:size,h:size});
}

for(const term of terminalNames){write('terminals',`${term}--left`,P('M8 24h32')+terminal(term,8,24,1),`${term} terminal left`);write('terminals',`${term}--right`,P('M8 24h32')+terminal(term,40,24,-1),`${term} terminal right`);}
const counts=assets.reduce((o,a)=>(o[a.group]=(o[a.group]||0)+1,o),{});
fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify({generatedAt:new Date().toISOString(),count:assets.length,counts,assets},null,2));
const cards=assets.map(a=>`<figure data-group="${a.group}"><img src="${a.file}" alt="${a.name}"><figcaption><b>${a.name}</b><span>${a.group}</span></figcaption></figure>`).join('');
fs.writeFileSync(path.join(out,'index.html'),`<!doctype html><meta charset="utf-8"><title>Catalyst SVG primitive research</title><style>body{margin:20px;background:#101716;color:#d9e3e1;font:12px system-ui}p{color:#8fa7a3}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:7px}figure{margin:0;padding:10px;border:1px solid #29403c;background:#151f1e;min-width:0}img{width:64px;height:64px;padding:6px;background:#eef2f1}figcaption{display:grid;gap:2px;overflow-wrap:anywhere}span{color:#78928e;font:10px ui-monospace,monospace}</style><h1>Catalyst SVG primitive research</h1><p>${assets.length} coded SVG experiments across edge terminals, routers, junctions, Catalyst marks, and reduced-size symbols.</p><div class="grid">${cards}</div>`);
fs.writeFileSync(path.join(out,'README.md'),`# Catalyst SVG primitive research\n\nCombinatorial coded research generated by \`tools/svg-research/generate-svg-primitives.mjs\`.\n\nTotal SVGs: **${assets.length}**\n\n${Object.entries(counts).map(([k,v])=>`- ${k}: ${v}`).join('\n')}\n\nThese are candidates and stress-test material, not frozen semantic assignments. The edge matrix intentionally includes treatments that Catalyst may later reject; the point is to compare them systematically before fixing the grammar.\n`);
console.log(JSON.stringify({out,count:assets.length,counts},null,2));
