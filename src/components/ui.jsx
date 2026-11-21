import {useEffect,useRef,useState} from 'react'
import {Link,NavLink,useLocation} from 'react-router-dom'
import {Heart,Menu,X,LayoutDashboard,TrendingUp,TrendingDown,Gem,MapPin,Phone,Mail,Home,LifeBuoy,Info,ArrowUpRight} from 'lucide-react'
import {useStore,inr,METALS} from '../store'
import {SHOP} from '../data'
import {Reveal,ParticleField,useTilt,Scramble} from './fx'

export {Reveal}

/* Static, cheap background: layered glows + gold-dust canvas */
export function Bg(){
 return <>
  <div aria-hidden="true" className="fixed inset-0 -z-20 bg-ink" style={{background:'radial-gradient(900px 600px at 85% -10%,rgba(15,61,51,.55),transparent 60%),radial-gradient(700px 500px at -10% 30%,rgba(214,180,106,.10),transparent 60%),radial-gradient(800px 600px at 50% 120%,rgba(217,138,123,.08),transparent 60%),#0a0c0f'}}/>
  <div aria-hidden="true" className="fixed -z-10 pointer-events-none w-[70vw] h-[70vw] max-w-[760px] max-h-[760px] -top-[20%] -left-[15%] rounded-full" style={{background:'radial-gradient(closest-side,rgba(214,180,106,.13),transparent)',animation:'aurora1 22s ease-in-out infinite'}}/>
  <div aria-hidden="true" className="fixed -z-10 pointer-events-none w-[70vw] h-[70vw] max-w-[760px] max-h-[760px] top-[30%] -right-[20%] rounded-full" style={{background:'radial-gradient(closest-side,rgba(15,110,90,.28),transparent)',animation:'aurora2 28s ease-in-out infinite'}}/>
  <ParticleField/>
 </>
}

const fallback="data:image/svg+xml;utf8,"+encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='800' height='800'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#12161b'/><stop offset='1' stop-color='#5a4521'/></linearGradient></defs><rect width='800' height='800' fill='url(#g)'/><path d='M400 250l110 110-110 190-110-190z' fill='none' stroke='#e2c47e' stroke-width='6'/></svg>`)
export function Img({src,alt,className=''}){
 const ref=useRef(null);const [ok,setOk]=useState(false)
 useEffect(()=>{if(ref.current&&ref.current.complete)setOk(true)},[src])
 return <img ref={ref} src={src||fallback} alt={alt} loading="lazy" decoding="async" onLoad={()=>setOk(true)} onError={e=>{e.currentTarget.onerror=null;e.currentTarget.src=fallback;setOk(true)}} className={className+' transition duration-700 '+(ok?'opacity-100 blur-0':'opacity-0 blur-md')}/>
}
export const Title=({children,sub})=><div className="mb-8 md:mb-10"><h2 className="font-display text-4xl md:text-5xl font-semibold gold-text leading-tight">{typeof children==='string'?<Scramble text={children}/>:children}</h2>{sub&&<p className="mt-3 text-white/60 max-w-xl text-sm md:text-base">{sub}</p>}</div>

function RateItem({k}){
 const {rates}=useStore();const v=rates[k];const prev=useRef(null);const [dir,setDir]=useState(0)
 useEffect(()=>{if(prev.current!==null&&Math.round(v)!==Math.round(prev.current))setDir(v>prev.current?1:-1);prev.current=v},[v])
 return <span className="inline-flex items-center gap-2 px-5 whitespace-nowrap">
  <span className="text-white/55">{METALS[k]}</span><b className="text-gold-300 tabular-nums">{inr(v)}</b><span className="text-white/35">/g</span>
  {dir===1&&<TrendingUp size={13} className="text-emerald-400"/>}{dir===-1&&<TrendingDown size={13} className="text-rose-400"/>}
 </span>
}
export function RateBar(){
 const {rates}=useStore();const keys=['gold24','gold22','gold18','silver']
 return <div className="border-b border-white/10 bg-black/50 backdrop-blur text-[11px] sm:text-xs h-8 flex items-center overflow-hidden">
  <span className="shrink-0 z-10 flex items-center gap-1.5 pl-3 pr-3 h-full bg-ink/90 text-gold-400 border-r border-white/10"><i className={'w-1.5 h-1.5 rounded-full '+(rates.source==='live'?'bg-emerald-400 animate-pulse':'bg-amber-400')}/>{rates.source==='live'?'LIVE':'SHOP'}</span>
  <div className="flex-1 overflow-hidden" style={{maskImage:'linear-gradient(90deg,transparent,#000 24px,#000 calc(100% - 24px),transparent)',WebkitMaskImage:'linear-gradient(90deg,transparent,#000 24px,#000 calc(100% - 24px),transparent)'}}>
   <div className="marq flex w-max">{[0,1,2,3].map(n=><div key={n} className="flex" aria-hidden={n>0}>{keys.map(k=><RateItem key={k} k={k}/>)}</div>)}</div></div>
 </div>
}

const LINKS=[['/','Home'],['/shop','Shop'],['/about','About'],['/contact','Contact'],['/help','Help']]
export function Navbar(){
 const {wish}=useStore()
 return <header className="sticky top-0 z-40"><RateBar/>
  <nav className="backdrop-blur-xl bg-ink/65 border-b border-white/10"><div className="max-w-7xl mx-auto px-4 h-14 md:h-16 flex items-center gap-4">
   <Link to="/" className="flex items-center gap-2 min-w-0"><Gem className="text-gold-400 shrink-0" size={22}/><span className="font-display text-xl md:text-2xl font-bold gold-text truncate">{SHOP.name}</span></Link>
   <div className="hidden md:flex ml-auto items-center gap-1">{LINKS.map(([t,l])=><NavLink key={t} to={t} end={t==='/'} className={({isActive})=>'nav-link'+(isActive?' active':'')}>{l}</NavLink>)}</div>
   <Link to="/wishlist" aria-label="Wishlist" className="ml-auto md:ml-2 relative w-11 h-11 grid place-items-center rounded-full hover:bg-white/10 transition"><Heart size={20} className="text-rose-gold"/>{wish.length>0&&<b className="absolute top-1 right-1 bg-gold-400 text-ink text-[10px] w-4 h-4 rounded-full grid place-items-center">{wish.length}</b>}</Link>
  </div></nav></header>
}

/* Mobile bottom tab bar + "More" sheet */
export function BottomNav(){
 const [open,setOpen]=useState(false);const loc=useLocation()
 useEffect(()=>{setOpen(false)},[loc.pathname])
 useEffect(()=>{document.body.style.overflow=open?'hidden':'';return()=>{document.body.style.overflow=''}},[open])
 const tabs=[['/',Home,'Home'],['/shop',Gem,'Shop'],['/contact',MapPin,'Visit'],['/help',LifeBuoy,'Help']]
 return <>
  {open&&<div className="md:hidden fixed inset-0 z-50 bg-ink/95 backdrop-blur-2xl px-6 pt-6 flex flex-col" style={{animation:'fadeUp .3s both'}}>
   <div className="flex items-center justify-between"><span className="font-display text-2xl gold-text">{SHOP.name}</span><button onClick={()=>setOpen(false)} aria-label="Close menu" className="w-11 h-11 grid place-items-center rounded-full bg-white/10"><X/></button></div>
   <div className="mt-8 flex flex-col">{[['/about','About us',Info],['/wishlist','Wishlist',Heart],['/dashboard','Shop dashboard',LayoutDashboard]].map(([t,l,I],i)=><Link key={t} to={t} className="flex items-center gap-4 py-5 border-b border-white/10 font-display text-3xl" style={{animation:'rise .5s '+(i*80+80)+'ms both'}}><I size={22} className="text-gold-400"/>{l}<ArrowUpRight size={18} className="ml-auto text-white/30"/></Link>)}</div>
   <a href={'tel:'+SHOP.phone.replace(/\s/g,'')} className="btn btn-gold mt-8"><Phone size={16}/>Call the shop</a>
   <p className="mt-4 text-xs text-white/45 text-center">{SHOP.hours}</p></div>}
  <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 backdrop-blur-xl bg-ink/85 border-t border-white/10" style={{paddingBottom:'var(--safe-b)'}}>
   <div className="grid grid-cols-5 h-16">
    {tabs.map(([t,I,l])=><NavLink key={t} to={t} end={t==='/'} className={({isActive})=>'relative flex flex-col items-center justify-center gap-1 text-[11px] transition '+(isActive?'text-gold-300':'text-white/55')}>{({isActive})=><><I size={20}/>{l}{isActive&&<i className="absolute top-0 h-[2px] w-8 rounded-full bg-gold-400"/>}</>}</NavLink>)}
    <button onClick={()=>setOpen(true)} className="flex flex-col items-center justify-center gap-1 text-[11px] text-white/55"><Menu size={20}/>More</button>
   </div></nav></>
}

export const Footer=()=><footer className="border-t border-white/10 mt-20 bg-black/30"><div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-8 text-sm text-white/60">
 <div><div className="font-display text-2xl gold-text mb-2">{SHOP.name}</div><p>{SHOP.tag}. Hallmarked jewellery, priced fairly at today's market rate.</p></div>
 <div className="space-y-3"><p className="flex gap-2"><MapPin size={16} className="shrink-0 mt-0.5 text-gold-400"/>{SHOP.address}</p><a href={'tel:'+SHOP.phone.replace(/\s/g,'')} className="flex gap-2 py-1"><Phone size={16} className="text-gold-400"/>{SHOP.phone}</a><a href={'mailto:'+SHOP.email} className="flex gap-2 py-1 break-all"><Mail size={16} className="shrink-0 text-gold-400"/>{SHOP.email}</a></div>
 <div className="md:text-right"><Link to="/dashboard" className="btn btn-ghost"><LayoutDashboard size={16}/>Go to Dashboard</Link></div></div>
 <p className="text-center text-xs text-white/30 pb-6">© {new Date().getFullYear()} {SHOP.name}. All rights reserved.</p></footer>

export function ProductCard({p,i=0,reveal=true,className='h-full'}){
 const {wish,toggleWish,priceOf}=useStore();const [q,setQ]=useState(1);const liked=wish.includes(p.id);const tilt=useTilt(7)
 const card=<div ref={tilt} className="tilt group glass overflow-hidden h-full hover:border-gold-400/40 transition-colors duration-500">
  <div className="relative aspect-square overflow-hidden shimmer"><Img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
   <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent pointer-events-none"/>
   <button onClick={()=>toggleWish(p.id)} aria-label={liked?'Remove from wishlist':'Add to wishlist'} aria-pressed={liked} className="absolute top-2 right-2 w-11 h-11 grid place-items-center rounded-full bg-black/45 backdrop-blur active:scale-90 transition"><Heart key={String(liked)} size={18} className={(liked?'fill-rose-gold text-rose-gold animate-[pop_.4s]':'text-white')}/></button>
   <span className="absolute bottom-2 left-2 text-[10px] sm:text-[11px] px-2.5 py-1 rounded-full bg-black/55 backdrop-blur text-gold-300">{METALS[p.metal]} · {p.weight} g</span></div>
  <div className="p-3.5 sm:p-5"><h3 className="font-display text-lg sm:text-2xl leading-tight min-h-[2.5rem] sm:min-h-0">{p.name}</h3>
   <div className="mt-2 sm:mt-3 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2"><div><div className="text-lg sm:text-2xl font-bold text-gold-300 tabular-nums">{inr(priceOf(p,q))}</div><div className="text-[10px] sm:text-[11px] text-white/45">{q===1?'1 piece':q+' pieces'} · incl. making & GST</div></div>
    <div className="flex items-center self-start rounded-full border border-white/15"><button aria-label="Fewer" className="w-9 h-9 text-lg" onClick={()=>setQ(Math.max(1,q-1))}>−</button><span className="w-6 text-center text-sm tabular-nums">{q}</span><button aria-label="More" className="w-9 h-9 text-lg" onClick={()=>setQ(q+1)}>+</button></div></div>
   <div className="hidden sm:flex mt-3 pt-3 border-t border-white/10 text-xs text-white/50 gap-4">{[1,2,3].map(n=><span key={n}>{n} pc <b className="text-white/80">{inr(priceOf(p,n))}</b></span>)}</div>
  </div></div>
 return reveal?<Reveal delay={i%4*80} className={className}>{card}</Reveal>:<div className={className}>{card}</div>
}
