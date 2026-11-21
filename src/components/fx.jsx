import {useEffect,useRef,useState} from 'react'

export const isFine=()=>typeof window!=='undefined'&&!!window.matchMedia&&window.matchMedia('(hover:hover) and (pointer:fine)').matches
export const isReduced=()=>typeof window!=='undefined'&&!!window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* Cursor spotlight on every .glass card (one global listener) */
export function useSpotlight(){
 useEffect(()=>{
  const on=e=>{const el=e.target&&e.target.closest&&e.target.closest('.glass');if(!el)return
   const r=el.getBoundingClientRect();el.style.setProperty('--x',(e.clientX-r.left)+'px');el.style.setProperty('--y',(e.clientY-r.top)+'px')}
  document.addEventListener('pointermove',on,{passive:true})
  return()=>{document.removeEventListener('pointermove',on)}
 },[])
}

/* Thin gold scroll-progress bar */
export function ScrollProgress(){
 const ref=useRef(null)
 useEffect(()=>{
  let raf=0
  const on=()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{const h=document.documentElement;const m=h.scrollHeight-h.clientHeight;if(ref.current)ref.current.style.transform='scaleX('+(m>0?Math.min(1,h.scrollTop/m):0)+')'})}
  window.addEventListener('scroll',on,{passive:true});window.addEventListener('resize',on)
  const ro=typeof ResizeObserver!=='undefined'?new ResizeObserver(on):null
  if(ro)ro.observe(document.body)
  on()
  return()=>{cancelAnimationFrame(raf);window.removeEventListener('scroll',on);window.removeEventListener('resize',on);if(ro)ro.disconnect()}
 },[])
 return <div className="fixed top-0 inset-x-0 h-[2px] z-[70] pointer-events-none"><div ref={ref} className="h-full bg-gradient-to-r from-gold-600 via-gold-300 to-rose-gold" style={{transform:'scaleX(0)',transformOrigin:'left'}}/></div>
}

/* Gold-dust constellation that reacts to pointer / touch */
export function ParticleField(){
 const cv=useRef(null)
 useEffect(()=>{
  const c=cv.current;if(!c)return
  const ctx=c.getContext('2d');if(!ctx)return
  const still=isReduced();const dpr=Math.min(window.devicePixelRatio||1,1.5)
  let w=0,h=0,P=[],raf=0,run=true;const ptr={x:-999,y:-999}
  const size=()=>{const nw=window.innerWidth;h=window.innerHeight
   c.width=nw*dpr;c.height=h*dpr;c.style.width=nw+'px';c.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0)
   if(nw!==w||!P.length){w=nw;const n=Math.round(Math.min(70,Math.max(24,w/16)))
    P=Array.from({length:n},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.18,vy:-.05-Math.random()*.2,r:.6+Math.random()*1.5,a:.25+Math.random()*.55}))}}
  const move=e=>{ptr.x=e.clientX;ptr.y=e.clientY}
  const leave=()=>{ptr.x=-999;ptr.y=-999}
  const draw=()=>{
   ctx.clearRect(0,0,w,h)
   for(const p of P){const dx=p.x-ptr.x,dy=p.y-ptr.y,d=Math.hypot(dx,dy)
    if(d<130&&d>0){const f=(130-d)/130;p.x+=dx/d*f*2.4;p.y+=dy/d*f*2.4}
    p.x+=p.vx;p.y+=p.vy;if(p.y<-10){p.y=h+10;p.x=Math.random()*w}if(p.x<-10)p.x=w+10;if(p.x>w+10)p.x=-10}
   ctx.lineWidth=.6
   for(let i=0;i<P.length;i++)for(let j=i+1;j<P.length;j++){const a=P[i],b=P[j],d=Math.hypot(a.x-b.x,a.y-b.y)
    if(d<110){ctx.strokeStyle='rgba(214,180,106,'+((1-d/110)*.17).toFixed(3)+')';ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}}
   for(const p of P){ctx.fillStyle='rgba(240,217,160,'+p.a.toFixed(2)+')';ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.283);ctx.fill()}}
  const loop=()=>{if(!run)return;draw();raf=requestAnimationFrame(loop)}
  const vis=()=>{run=!document.hidden;cancelAnimationFrame(raf);if(run&&!still)loop()}
  size();if(still)draw();else loop()
  window.addEventListener('resize',size);window.addEventListener('pointermove',move,{passive:true});window.addEventListener('pointerup',leave);document.addEventListener('visibilitychange',vis)
  return()=>{run=false;cancelAnimationFrame(raf);window.removeEventListener('resize',size);window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',leave);document.removeEventListener('visibilitychange',vis)}
 },[])
 return <canvas ref={cv} aria-hidden="true" className="fixed inset-0 -z-10 pointer-events-none"/>
}

/* Scroll-reveal wrapper */
export function Reveal({children,className='',delay=0}){
 const r=useRef(null)
 useEffect(()=>{
  const el=r.current;if(!el)return
  if(typeof IntersectionObserver==='undefined'){el.classList.add('in');return}
  const o=new IntersectionObserver(([e])=>{if(e.isIntersecting){el.classList.add('in');o.disconnect()}},{threshold:.1})
  o.observe(el)
  return()=>{o.disconnect()}
 },[])
 return <div ref={r} className={'reveal '+className} style={{transitionDelay:delay+'ms'}}>{children}</div>
}

/* Number that counts up when visible and tweens when the value changes */
export function CountUp({to,prefix='',suffix='',dur=1300,format}){
 const ref=useRef(null);const cur=useRef(0);const seen=useRef(false);const [v,setV]=useState(0)
 const fmt=format||(n=>Math.round(n).toLocaleString('en-IN'))
 useEffect(()=>{
  const el=ref.current;if(!el)return
  let raf=0,io=null
  const run=()=>{const from=cur.current,t0=performance.now()
   const tick=t=>{const k=Math.min(1,(t-t0)/dur);const val=from+(to-from)*(1-Math.pow(1-k,3));cur.current=val;setV(val);if(k<1)raf=requestAnimationFrame(tick)}
   raf=requestAnimationFrame(tick)}
  if(isReduced()||typeof IntersectionObserver==='undefined'){cur.current=to;setV(to)}
  else if(seen.current)run()
  else{io=new IntersectionObserver(([e])=>{if(e.isIntersecting){seen.current=true;run();io.disconnect()}},{threshold:.3});io.observe(el)}
  return()=>{cancelAnimationFrame(raf);if(io)io.disconnect()}
 },[to,dur])
 return <span ref={ref} className="tabular-nums">{prefix}{fmt(v)}{suffix}</span>
}

/* 3D tilt for cards (mouse only; touch keeps native scrolling) */
export function useTilt(max=7){
 const ref=useRef(null)
 useEffect(()=>{
  const el=ref.current;if(!el||!isFine()||isReduced())return
  let raf=0
  const mv=e=>{const r=el.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5
   cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{el.style.transform='perspective(900px) rotateX('+(-y*max).toFixed(2)+'deg) rotateY('+(x*max).toFixed(2)+'deg) translateY(-4px)'})}
  const lv=()=>{cancelAnimationFrame(raf);el.style.transform=''}
  el.addEventListener('pointermove',mv);el.addEventListener('pointerleave',lv)
  return()=>{cancelAnimationFrame(raf);el.removeEventListener('pointermove',mv);el.removeEventListener('pointerleave',lv)}
 },[max])
 return ref
}

/* ---------- Interactive faceted gem (hero) ---------- */
const PT={G0:[50,175],G1:[125,175],G2:[200,175],G3:[275,175],G4:[350,175],T0:[110,120],T1:[160,120],T2:[240,120],T3:[290,120],E:[200,350]}
const FACETS=[['G0','T0','G1'],['T0','T1','G1'],['G1','T1','G2'],['T1','T2','G2'],['G2','T2','G3'],['T2','T3','G3'],['G3','T3','G4'],['G0','G1','E'],['G1','G2','E'],['G2','G3','E'],['G3','G4','E']]
const COLORS=['#f6e7bd','#e8c987','#fbf1d3','#d6b46a','#f6e7bd','#e8c987','#d6b46a','#a88334','#c9a24b','#b8913f','#8d6b27']
const CEN=FACETS.map(f=>[f.reduce((a,k)=>a+PT[k][0],0)/f.length,f.reduce((a,k)=>a+PT[k][1],0)/f.length])
const SPARKS=[[110,120,0],[290,120,.9],[350,175,1.7],[50,175,2.4],[200,350,.5]]
export function Gem({className=''}){
 const wrap=useRef(null),tilt=useRef(null),glow=useRef(null),fs=useRef([]);const [fire,layer]=useBurst()
 useEffect(()=>{
  const root=wrap.current;if(!root)return
  const still=isReduced();const ptr={x:.5,y:.4,at:-9999};const cur={lx:200,ly:150,rx:0,ry:0};let raf=0,vis=true
  const cl=n=>Math.min(1,Math.max(0,n))
  const move=e=>{const r=root.getBoundingClientRect();ptr.x=(e.clientX-r.left)/r.width;ptr.y=(e.clientY-r.top)/r.height;ptr.at=performance.now()}
  const step=t=>{
   const idle=still||t-ptr.at>2500
   const tx=cl(idle?.5+Math.cos(t/1700)*.42:ptr.x),ty=cl(idle?.38+Math.sin(t/1300)*.28:ptr.y)
   cur.lx+=(tx*400-cur.lx)*.08;cur.ly+=(ty*400-cur.ly)*.08
   cur.rx+=((.5-ty)*16-cur.rx)*.08;cur.ry+=((tx-.5)*22-cur.ry)*.08
   if(tilt.current)tilt.current.style.transform='rotateX('+cur.rx.toFixed(2)+'deg) rotateY('+cur.ry.toFixed(2)+'deg)'
   if(glow.current){glow.current.setAttribute('cx',cur.lx.toFixed(1));glow.current.setAttribute('cy',cur.ly.toFixed(1))}
   fs.current.forEach((el,i)=>{if(!el)return;const d=Math.hypot(CEN[i][0]-cur.lx,CEN[i][1]-cur.ly);el.style.fillOpacity=(.3+.7*Math.max(0,1-d/240)).toFixed(3)})}
  const loop=t=>{if(vis)step(t);raf=requestAnimationFrame(loop)}
  step(0)
  let io=null
  if(!still){io=typeof IntersectionObserver!=='undefined'?new IntersectionObserver(([e])=>{vis=e.isIntersecting}):null;if(io)io.observe(root);window.addEventListener('pointermove',move,{passive:true});raf=requestAnimationFrame(loop)}
  return()=>{cancelAnimationFrame(raf);if(io)io.disconnect();window.removeEventListener('pointermove',move)}
 },[])
 return <div ref={wrap} onPointerDown={fire} className={'animate-[floaty_7s_ease-in-out_infinite] cursor-pointer '+className} style={{perspective:900,touchAction:'pan-y'}}>{layer}
  <div ref={tilt} className="w-full h-full" style={{transformStyle:'preserve-3d',willChange:'transform'}}>
   <svg viewBox="0 0 400 400" className="w-full h-full overflow-visible" role="img" aria-label="Faceted gold diamond that reacts to your cursor">
    <defs><radialGradient id="gemGl"><stop offset="0" stopColor="#fff" stopOpacity=".95"/><stop offset="1" stopColor="#fff" stopOpacity="0"/></radialGradient>
     <clipPath id="gemClip"><polygon points="50,175 110,120 290,120 350,175 200,350"/></clipPath>
     <filter id="gemBlur" filterUnits="userSpaceOnUse" x="-100" y="-100" width="600" height="600"><feGaussianBlur stdDeviation="16"/></filter></defs>
    <ellipse cx="200" cy="378" rx="120" ry="12" fill="#d6b46a" opacity=".3" filter="url(#gemBlur)"/>
    <polygon points="50,175 110,120 290,120 350,175 200,350" fill="#d6b46a" opacity=".18" filter="url(#gemBlur)"/>
    {FACETS.map((f,i)=><polygon key={i} ref={el=>{fs.current[i]=el}} points={f.map(k=>PT[k].join(',')).join(' ')} fill={COLORS[i]} stroke="rgba(255,255,255,.5)" strokeWidth="1" strokeLinejoin="round" style={{fillOpacity:.5}}/>)}
    <g clipPath="url(#gemClip)"><circle ref={glow} cx="200" cy="150" r="95" fill="url(#gemGl)" style={{mixBlendMode:'soft-light'}}/></g>
    {SPARKS.map(([x,y,d],i)=><g key={i} transform={'translate('+x+' '+y+')'}><path d="M0,-13 L2.6,-2.6 L13,0 L2.6,2.6 L0,13 L-2.6,2.6 L-13,0 L-2.6,-2.6Z" fill="#fff" style={{transformBox:'fill-box',transformOrigin:'center',animation:'twinkle 3.2s ease-in-out '+d+'s infinite',opacity:0}}/></g>)}
   </svg></div></div>
}

/* Magnetic buttons + tap ripple (delegated, one listener each) */
export function useMagnet(){
 useEffect(()=>{
  const fine=isFine()&&!isReduced();let cur=null
  const mv=e=>{if(!fine)return;const el=e.target&&e.target.closest&&e.target.closest('.btn');if(cur&&cur!==el){cur.style.translate=''}cur=el||null
   if(!el)return;const r=el.getBoundingClientRect();el.style.translate=((e.clientX-r.left-r.width/2)*.18).toFixed(1)+'px '+((e.clientY-r.top-r.height/2)*.28).toFixed(1)+'px'}
  const lv=()=>{if(cur){cur.style.translate='';cur=null}}
  const down=e=>{const el=e.target&&e.target.closest&&e.target.closest('.btn');if(!el||isReduced())return
   const r=el.getBoundingClientRect(),d=Math.max(r.width,r.height)*2,i=document.createElement('i')
   i.className='ripple';i.style.cssText='width:'+d+'px;height:'+d+'px;left:'+(e.clientX-r.left-d/2)+'px;top:'+(e.clientY-r.top-d/2)+'px'
   el.appendChild(i);i.addEventListener('animationend',()=>{i.remove()})}
  document.addEventListener('pointermove',mv,{passive:true});document.addEventListener('pointerleave',lv);document.addEventListener('pointerdown',down,{passive:true})
  return()=>{document.removeEventListener('pointermove',mv);document.removeEventListener('pointerleave',lv);document.removeEventListener('pointerdown',down)}
 },[])
}

/* Glowing cursor ring that follows the mouse and grows on interactive things */
export function Cursor(){
 const dot=useRef(null),ring=useRef(null)
 useEffect(()=>{
  if(!isFine()||isReduced())return
  let x=-100,y=-100,rx=-100,ry=-100,raf=0,big=false
  const mv=e=>{x=e.clientX;y=e.clientY;const t=e.target&&e.target.closest&&e.target.closest('a,button,input,select,textarea,label,[role=button]');big=!!t}
  const loop=()=>{rx+=(x-rx)*.16;ry+=(y-ry)*.16
   if(dot.current)dot.current.style.transform='translate('+x+'px,'+y+'px)'
   if(ring.current)ring.current.style.transform='translate('+rx+'px,'+ry+'px) scale('+(big?1.9:1)+')'
   raf=requestAnimationFrame(loop)}
  window.addEventListener('pointermove',mv,{passive:true});raf=requestAnimationFrame(loop)
  return()=>{cancelAnimationFrame(raf);window.removeEventListener('pointermove',mv)}
 },[])
 if(!isFine())return null
 return <><div ref={ring} aria-hidden="true" className="hidden md:block fixed top-0 left-0 z-[90] pointer-events-none -ml-5 -mt-5 w-10 h-10 rounded-full border border-gold-400/60 transition-[scale,background] duration-200" style={{transform:'translate(-100px,-100px)',boxShadow:'0 0 24px rgba(214,180,106,.25)'}}/>
  <div ref={dot} aria-hidden="true" className="hidden md:block fixed top-0 left-0 z-[90] pointer-events-none -ml-[3px] -mt-[3px] w-1.5 h-1.5 rounded-full bg-gold-300" style={{transform:'translate(-100px,-100px)'}}/></>
}

/* Text that scrambles into place when it scrolls into view */
const GL='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
export function Scramble({text,className=''}){
 const ref=useRef(null)
 useEffect(()=>{
  const el=ref.current;if(!el)return
  el.textContent=text
  if(isReduced()||typeof IntersectionObserver==='undefined')return
  let raf=0
  const run=()=>{const t0=performance.now(),dur=900+text.length*30
   const tick=t=>{const k=Math.min(1,(t-t0)/dur);let o=''
    for(let i=0;i<text.length;i++){const c=text[i];o+=c===' '||i<k*text.length?c:GL[Math.floor(Math.random()*GL.length)]}
    el.textContent=o;if(k<1)raf=requestAnimationFrame(tick);else el.textContent=text}
   raf=requestAnimationFrame(tick)}
  const io=new IntersectionObserver(([e])=>{if(e.isIntersecting){io.disconnect();run()}},{threshold:.4})
  io.observe(el)
  return()=>{io.disconnect();cancelAnimationFrame(raf)}
 },[text])
 return <span ref={ref} className={className}>{text}</span>
}

/* Scroll parallax: moves an element at a fraction of scroll speed */
export function useParallax(speed=.12){
 const ref=useRef(null)
 useEffect(()=>{
  if(isReduced())return
  let raf=0
  const on=()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{if(ref.current)ref.current.style.transform='translate3d(0,'+(Math.min(window.scrollY,900)*speed).toFixed(1)+'px,0)'})}
  window.addEventListener('scroll',on,{passive:true})
  return()=>{cancelAnimationFrame(raf);window.removeEventListener('scroll',on)}
 },[speed])
 return ref
}

/* Sparkle burst when the gem is tapped / clicked */
export function useBurst(){
 const [b,setB]=useState([])
 const fire=(e)=>{const r=e.currentTarget.getBoundingClientRect();const x=e.clientX-r.left,y=e.clientY-r.top;const id=Date.now()+Math.random()
  const items=Array.from({length:16},(_,i)=>{const a=i/16*6.283+Math.random()*.4,d=50+Math.random()*90;return{k:id+'-'+i,x,y,dx:Math.cos(a)*d,dy:Math.sin(a)*d,s:4+Math.random()*7}})
  setB(v=>[...v,...items]);setTimeout(()=>{setB(v=>v.filter(o=>!String(o.k).startsWith(String(id))))},1000)}
 const layer=<div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-visible">{b.map(o=><i key={o.k} className="absolute rounded-full bg-gold-300" style={{left:o.x,top:o.y,width:o.s,height:o.s,'--dx':o.dx+'px','--dy':o.dy+'px',boxShadow:'0 0 12px 2px rgba(240,217,160,.8)',animation:'burst .9s cubic-bezier(.1,.7,.3,1) forwards'}}/>)}</div>
 return [fire,layer]
}
