// Add new work here — drop files in img/ or vid/ and add a line.
const PHOTOS=[
 {src:'img/photo4.jpg',title:'Through the Arch',tag:'Heritage'},
 {src:'img/photo1.jpg',title:'Tower of Tiles',tag:'Heritage'},
 {src:'img/photo5.jpg',title:'Tile & Calligraphy',tag:'Heritage'},
 {src:'img/photo2.jpg',title:'Passage of Light',tag:'Heritage'},
 {src:'img/photo3.jpg',title:'The Doorway',tag:'Heritage'},
];
const REELS=[
 {src:'vid/reel2.mp4',poster:'img/poster2.jpg',title:'Nikah Vibes',tag:'Wedding'},
 {src:'vid/reel4.mp4',poster:'img/poster4.jpg',title:'Mehndi Vibes',tag:'Mehndi'},
 {src:'vid/reel3.mp4',poster:'img/poster3.jpg',title:'Wedding Car Decor',tag:'Wedding'},
 {src:'vid/reel1.mp4',poster:'img/poster1.jpg',title:'Gulabi Bagh, Sketched',tag:'Heritage'},
];
const $=(s,r=document)=>r.querySelector(s);

// aperture loader
const blades=$('#blades');
for(let i=0;i<6;i++){const p=document.createElementNS('http://www.w3.org/2000/svg','polygon');
 p.setAttribute('points','50,50 96,38 78,12');p.style.transform=`rotate(${i*60}deg)`;p.style.transformOrigin='50px 50px';
 p.style.setProperty('--r',i*60);blades.appendChild(p)}
addEventListener('load',()=>setTimeout(()=>{$('#loader').classList.add('done');document.body.classList.add('ready');
 document.querySelectorAll('.hero .reveal').forEach((e,i)=>setTimeout(()=>e.classList.add('in'),500+i*150))},900));
setTimeout(()=>{$('#loader').classList.add('done');document.body.classList.add('ready')},4000);

// gallery
$('#gallery').innerHTML=PHOTOS.map((p,i)=>`<figure class="shot reveal" data-i="${i}"><img src="${p.src}" alt="${p.title}" loading="lazy"><figcaption><b>${p.title}</b><span>${p.tag}</span></figcaption></figure>`).join('');
// reels
$('#reelGrid').innerHTML=REELS.map((r,i)=>`<div class="reel reveal" data-i="${i}"><video src="${r.src}" poster="${r.poster}" muted loop playsinline preload="none"></video><div class="meta"><span class="play">▶</span><div><h3>${r.title}</h3><small>${r.tag}</small></div></div></div>`).join('');
document.querySelectorAll('.reel').forEach(el=>{const v=$('video',el);
 el.addEventListener('mouseenter',()=>v.play().catch(()=>{}));
 el.addEventListener('mouseleave',()=>{v.pause();v.currentTime=0})});

// reveal on scroll
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);
 if(e.target.querySelector('[data-count]'))e.target.querySelectorAll('[data-count]').forEach(count)}}),{threshold:.15});
document.querySelectorAll('.reveal').forEach(e=>{if(!e.closest('.hero'))io.observe(e)});
function count(el){const n=+el.dataset.count;let i=0;const t=setInterval(()=>{el.textContent=++i;if(i>=n)clearInterval(t)},350)}

// nav + clock + year
const nav=$('#nav');addEventListener('scroll',()=>nav.classList.toggle('solid',scrollY>60),{passive:true});
const hb=$('.hero-bg');addEventListener('scroll',()=>{if(scrollY<innerHeight)hb.style.translate=`0 ${scrollY*.25}px`},{passive:true});
const clk=$('#clock');let s=0;setInterval(()=>{s++;const f=n=>String(n).padStart(2,'0');clk.textContent=`${f(s/3600|0)}:${f(s/60%60|0)}:${f(s%60)}`},1000);
$('#yr').textContent=new Date().getFullYear();

// cursor
const cur=$('.cursor');let cx=0,cy=0,tx=0,ty=0;
addEventListener('mousemove',e=>{tx=e.clientX;ty=e.clientY;cur.classList.add('on')});
(function loop(){cx+=(tx-cx)*.18;cy+=(ty-cy)*.18;cur.style.transform=`translate(${cx}px,${cy}px)`;requestAnimationFrame(loop)})();
document.addEventListener('mouseover',e=>cur.classList.toggle('big',!!e.target.closest('a,button,.shot,.reel')));

// lightbox (photos + reels together)
const items=[...PHOTOS.map(p=>({...p,type:'img'})),...REELS.map(r=>({...r,type:'video'}))];
const lb=$('#lightbox'),stage=$('#lbStage'),cap=$('#lbCap');let idx=0;
function show(i){idx=(i+items.length)%items.length;const it=items[idx];
 stage.innerHTML=it.type==='img'?`<img src="${it.src}" alt="${it.title}">`:`<video src="${it.src}" poster="${it.poster}" controls autoplay playsinline></video>`;
 cap.textContent=it.title;lb.hidden=false;document.body.style.overflow='hidden'}
function close(){lb.hidden=true;stage.innerHTML='';document.body.style.overflow=''}
document.addEventListener('click',e=>{
 const s=e.target.closest('.shot'),r=e.target.closest('.reel');
 if(s)show(+s.dataset.i);else if(r)show(PHOTOS.length+ +r.dataset.i)});
$('.lb-close').onclick=close;$('.prev').onclick=()=>show(idx-1);$('.next').onclick=()=>show(idx+1);
lb.addEventListener('click',e=>{if(e.target===lb||e.target===stage)close()});
addEventListener('keydown',e=>{if(lb.hidden)return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')show(idx-1);if(e.key==='ArrowRight')show(idx+1)});
let tx0=0;lb.addEventListener('touchstart',e=>tx0=e.touches[0].clientX,{passive:true});
lb.addEventListener('touchend',e=>{const d=e.changedTouches[0].clientX-tx0;if(Math.abs(d)>60)show(idx+(d<0?1:-1))});
