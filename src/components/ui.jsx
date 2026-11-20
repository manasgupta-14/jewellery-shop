import {useEffect,useRef,useMemo,useState} from 'react'
import {Link,NavLink} from 'react-router-dom'
import {Heart,Menu,X,LayoutDashboard,TrendingUp,Gem,MapPin,Phone,Mail} from 'lucide-react'
import {useStore,inr,METALS} from '../store'
import {SHOP} from '../data'

export function Bg(){
 const stars=useMemo(()=>Array.from({length:46},()=>({x:Math.random()*100,y:Math.random()*100,d:2+Math.random()*5,s:1+Math.random()*2.5})),[])
 return <div className="fixed inset-0 -z-10 overflow-hidden bg-ink">
  <div className="absolute -top-40 -left-32 w-[560px] h-[560px] rounded-full blur-[130px] opacity-60" style={{background:'radial-gradient(#5b1f7a,transparent 70%)',animation:'drift 18s ease-in-out infinite'}}/>
  <div className="absolute top-1/3 -right-40 w-[520px] h-[520px] rounded-full blur-[130px] opacity-40" style={{background:'radial-gradient(#d4a95a,transparent 70%)',animation:'drift 22s ease-in-out infinite reverse'}}/>
  <div className="absolute -bottom-40 left-1/4 w-[600px] h-[600px] rounded-full blur-[140px] opacity-40" style={{background:'radial-gradient(#0f6b5c,transparent 70%)',animation:'drift 26s ease-in-out infinite'}}/>
  {stars.map((s,i)=><i key={i} className="absolute rounded-full bg-gold-300" style={{left:s.x+'%',top:s.y+'%',width:s.s,height:s.s,animation:`twinkle ${s.d}s ease-in-out ${i%7*.6}s infinite`}}/>)}
  <div className="absolute inset-0" style={{background:'repeating-linear-gradient(115deg,transparent 0 120px,rgba(255,255,255,.012) 120px 121px)'}}/>
 </div>
}
export function Reveal({children,className='',delay=0}){
 const r=useRef();useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting){r.current.classList.add('in');o.disconnect()}},{threshold:.12});o.observe(r.current);return()=>o.disconnect()},[])
 return <div ref={r} className={'reveal '+className} style={{transitionDelay:delay+'ms'}}>{children}</div>
}
const fallback="data:image/svg+xml;utf8,"+encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='800' height='800'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#2a1240'/><stop offset='1' stop-color='#6b4a1d'/></linearGradient></defs><rect width='800' height='800' fill='url(#g)'/><path d='M400 250l110 110-110 190-110-190z' fill='none' stroke='#e8c987' stroke-width='6'/></svg>`)
export const Img=({src,alt,className=''})=><img src={src||fallback} alt={alt} loading="lazy" onError={e=>{e.currentTarget.onerror=null;e.currentTarget.src=fallback}} className={className}/>
export const Title=({children,sub})=><div className="mb-10"><h2 className="font-display text-4xl md:text-5xl font-semibold gold-text">{children}</h2>{sub&&<p className="mt-3 text-white/60 max-w-xl">{sub}</p>}</div>

export function RateBar(){
 const {rates}=useStore()
 return <div className="border-b border-white/10 bg-black/40 backdrop-blur text-xs">
  <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center gap-x-6 gap-y-1">
   <span className="flex items-center gap-1.5 text-gold-400"><TrendingUp size={14}/>Today's rate / gram</span>
   {['gold24','gold22','gold18','silver'].map(k=><span key={k} className="text-white/80">{METALS[k]} <b className="text-gold-300">{inr(rates[k])}</b></span>)}
   <span className="ml-auto flex items-center gap-1.5 text-white/40"><i className={'w-1.5 h-1.5 rounded-full '+(rates.source==='live'?'bg-emerald-400 animate-pulse':'bg-amber-400')}/>{rates.source==='live'?'Live market':'Shop rate'}</span>
  </div></div>
}
export function Navbar(){
 const [o,setO]=useState(false);const {wish}=useStore()
 const links=[['/','Home'],['/shop','Shop'],['/about','About'],['/contact','Contact'],['/help','Help']]
 const cls=({isActive})=>'px-3 py-2 text-sm transition '+(isActive?'text-gold-300':'text-white/70 hover:text-white')
 return <header className="sticky top-0 z-40"><RateBar/>
  <nav className="backdrop-blur-xl bg-ink/60 border-b border-white/10"><div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-6">
   <Link to="/" className="flex items-center gap-2"><Gem className="text-gold-400" size={22}/><span className="font-display text-2xl font-bold gold-text">{SHOP.name}</span></Link>
   <div className="hidden md:flex ml-auto items-center gap-1">{links.map(([t,l])=><NavLink key={t} to={t} className={cls}>{l}</NavLink>)}</div>
   <Link to="/wishlist" className="ml-auto md:ml-2 relative p-2 rounded-full hover:bg-white/10"><Heart size={20} className="text-rose-gold"/>{wish.length>0&&<b className="absolute -top-0.5 -right-0.5 bg-gold-400 text-ink text-[10px] w-4 h-4 rounded-full grid place-items-center">{wish.length}</b>}</Link>
   <button className="md:hidden p-2" onClick={()=>setO(!o)}>{o?<X/>:<Menu/>}</button>
  </div>
  {o&&<div className="md:hidden px-4 pb-4 flex flex-col">{links.map(([t,l])=><NavLink key={t} to={t} onClick={()=>setO(false)} className={cls}>{l}</NavLink>)}</div>}
 </nav></header>
}
export const Footer=()=><footer className="border-t border-white/10 mt-24 bg-black/30"><div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-8 text-sm text-white/60">
 <div><div className="font-display text-2xl gold-text mb-2">{SHOP.name}</div><p>{SHOP.tag}. Hallmarked jewellery, priced fairly at today's market rate.</p></div>
 <div className="space-y-2"><p className="flex gap-2"><MapPin size={16} className="shrink-0 text-gold-400"/>{SHOP.address}</p><p className="flex gap-2"><Phone size={16} className="text-gold-400"/>{SHOP.phone}</p><p className="flex gap-2"><Mail size={16} className="text-gold-400"/>{SHOP.email}</p></div>
 <div className="md:text-right"><Link to="/dashboard" className="btn btn-ghost"><LayoutDashboard size={16}/>Go to Dashboard</Link></div></div></footer>

export function ProductCard({p,i=0}){
 const {wish,toggleWish,priceOf}=useStore();const [q,setQ]=useState(1);const liked=wish.includes(p.id)
 return <Reveal delay={i%4*80}><div className="group glass overflow-hidden hover:border-gold-400/40 transition duration-500 hover:-translate-y-1">
  <div className="relative aspect-square overflow-hidden"><Img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700"/>
   <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent"/>
   <button onClick={()=>toggleWish(p.id)} aria-label="Wishlist" className="absolute top-3 right-3 w-10 h-10 grid place-items-center rounded-full bg-black/40 backdrop-blur hover:scale-110 transition"><Heart size={18} className={liked?'fill-rose-gold text-rose-gold':'text-white'}/></button>
   <span className="absolute bottom-3 left-3 text-[11px] px-2.5 py-1 rounded-full bg-black/50 backdrop-blur text-gold-300">{METALS[p.metal]} · {p.weight} g</span></div>
  <div className="p-5"><h3 className="font-display text-2xl leading-tight">{p.name}</h3>
   <div className="mt-3 flex items-end justify-between"><div><div className="text-2xl font-bold text-gold-300">{inr(priceOf(p,q))}</div><div className="text-[11px] text-white/40">{q===1?'for 1 piece':`for ${q} pieces`} · incl. making & GST</div></div>
    <div className="flex items-center rounded-full border border-white/15"><button className="w-8 h-8" onClick={()=>setQ(Math.max(1,q-1))}>−</button><span className="w-6 text-center text-sm">{q}</span><button className="w-8 h-8" onClick={()=>setQ(q+1)}>+</button></div></div>
   <div className="mt-3 pt-3 border-t border-white/10 text-xs text-white/50 flex gap-4">{[1,2,3].map(n=><span key={n}>{n} pc <b className="text-white/80">{inr(priceOf(p,n))}</b></span>)}</div>
  </div></div></Reveal>
}
