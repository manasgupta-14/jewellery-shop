import {useState,useMemo} from 'react'
import {Link} from 'react-router-dom'
import {Search,ArrowRight,ShieldCheck,Sparkles,Scale,Heart,Send,Star,MapPin,Phone,Clock,Calculator} from 'lucide-react'
import {useStore,inr,METALS} from '../store'
import {SHOP} from '../data'
import {Reveal,Title,ProductCard} from '../components/ui'
import {Gem as GemFx,CountUp,useParallax} from '../components/fx'

const Words=({text,gold=false,delay=0})=>text.split(' ').map((w,i)=><span key={i} className="inline-block overflow-hidden align-bottom pb-[.08em]"><span className={'inline-block '+(gold?'gold-text':'')} style={{animation:'wordUp .9s cubic-bezier(.2,.7,.2,1) '+(delay+i*110)+'ms both'}}>{w}&nbsp;</span></span>)

function Estimator(){
 const {rates,cfg}=useStore();const [m,setM]=useState('gold22');const [w,setW]=useState(10);const [mk,setMk]=useState(12)
 const metal=w*rates[m],making=metal*mk/100,gst=(metal+making)*cfg.gst/100,total=metal+making+gst
 const pct=n=>total?(n/total*100).toFixed(1)+'%':'0%'
 const ps=(v,a,b)=>({'--p':((v-a)/(b-a)*100)+'%'})
 return <section className="max-w-7xl mx-auto px-4 mt-20 md:mt-24"><Reveal><div className="glass p-5 md:p-10 grid md:grid-cols-2 gap-8 md:gap-12">
  <div><div className="flex items-center gap-2 text-gold-400 text-sm mb-3"><Calculator size={18}/>Price estimator</div>
   <h2 className="font-display text-3xl md:text-5xl gold-text leading-tight">Know the price before you walk in.</h2>
   <p className="mt-3 text-white/60 text-sm md:text-base max-w-md">Move the sliders. The price follows today's live metal rate, the making charge and GST.</p>
   <div className="mt-6 flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">{Object.entries(METALS).map(([k,v])=><button key={k} onClick={()=>setM(k)} className={'chip '+(m===k?'on':'')}>{v}</button>)}</div></div>
  <div className="space-y-5">
   <div><div className="flex justify-between text-sm"><label htmlFor="wt" className="text-white/60">Weight</label><b className="text-gold-300 tabular-nums">{w} g</b></div><input id="wt" type="range" min="1" max="100" step="0.5" value={w} onChange={e=>setW(+e.target.value)} className="range" style={ps(w,1,100)}/></div>
   <div><div className="flex justify-between text-sm"><label htmlFor="mk" className="text-white/60">Making charge</label><b className="text-gold-300 tabular-nums">{mk}%</b></div><input id="mk" type="range" min="5" max="25" step="0.5" value={mk} onChange={e=>setMk(+e.target.value)} className="range" style={ps(mk,5,25)}/></div>
   <div className="pt-2"><div className="text-xs text-white/50">Estimated total</div><div className="font-display text-5xl md:text-6xl gold-text"><CountUp to={total} prefix="₹" dur={600}/></div></div>
   <div><div className="flex h-2.5 rounded-full overflow-hidden bg-white/10"><i className="bg-gold-500 transition-all duration-500" style={{width:pct(metal)}}/><i className="bg-rose-gold transition-all duration-500" style={{width:pct(making)}}/><i className="bg-emerald-400/80 transition-all duration-500" style={{width:pct(gst)}}/></div>
    <div className="mt-3 grid grid-cols-3 gap-2 text-[11px] sm:text-xs text-white/60"><span><i className="inline-block w-2 h-2 rounded-full bg-gold-500 mr-1.5"/>Metal<b className="block text-white/90 text-sm tabular-nums">{inr(metal)}</b></span><span><i className="inline-block w-2 h-2 rounded-full bg-rose-gold mr-1.5"/>Making<b className="block text-white/90 text-sm tabular-nums">{inr(making)}</b></span><span><i className="inline-block w-2 h-2 rounded-full bg-emerald-400/80 mr-1.5"/>GST {cfg.gst}%<b className="block text-white/90 text-sm tabular-nums">{inr(gst)}</b></span></div></div>
  </div></div></Reveal></section>
}

export function Home(){
 const {products,rates}=useStore();const feat=products.slice(0,4);const par=useParallax(.14)
 return <>
 <section className="max-w-7xl mx-auto px-4 pt-8 md:pt-16 overflow-x-clip grid md:grid-cols-2 gap-6 md:gap-12 items-center md:min-h-[78vh]">
  <div>
   <p className="text-gold-400 text-sm mb-4" style={{animation:'fadeUp .8s both'}}>{SHOP.tag}</p>
   <h1 className="font-display text-[3.4rem] sm:text-7xl md:text-7xl lg:text-8xl font-semibold leading-[.95]"><Words text="Jewellery that"/><br/><Words text="outlives trends." gold delay={300}/></h1>
   <p className="mt-5 md:mt-6 text-base md:text-lg text-white/65 max-w-lg" style={{animation:'fadeUp .9s .7s both'}}>Hallmarked gold and silver, made in our own workshop. Every price follows today's market rate, so what you see is what you pay.</p>
   <div className="mt-7 flex flex-wrap gap-3" style={{animation:'fadeUp .9s .9s both'}}><Link to="/shop" className="btn btn-gold flex-1 sm:flex-none">Explore collection <ArrowRight size={16}/></Link><Link to="/dashboard" className="btn btn-ghost flex-1 sm:flex-none">Go to Dashboard</Link></div>
   <div className="mt-8 md:mt-10 grid grid-cols-2 gap-4 max-w-sm text-xs sm:text-sm text-white/60" style={{animation:'fadeUp .9s 1.1s both'}}><div className="glass p-4"><b className="block text-2xl text-gold-300 font-display"><CountUp to={rates.gold22} prefix="₹"/></b>Gold 22K / g today</div><div className="glass p-4"><b className="block text-2xl text-gold-300 font-display"><CountUp to={rates.silver} prefix="₹"/></b>Silver / g today</div></div>
  </div>
  <div ref={par} className="relative mx-auto w-full max-w-[420px] aspect-square"><div className="absolute inset-0" style={{animation:'rise 1.2s .2s both'}}>
   <div className="absolute inset-0 rounded-full border border-gold-400/20" style={{animation:'spinSlow 40s linear infinite'}}><i className="absolute -top-1 left-1/2 w-2 h-2 rounded-full bg-gold-300 shadow-[0_0_14px_3px_rgba(240,217,160,.7)]"/></div>
   <div className="absolute inset-8 rounded-full border border-dashed border-rose-gold/25" style={{animation:'spinSlow 60s linear infinite reverse'}}/>
   <GemFx className="absolute inset-[12%]"/>
   <div className="absolute left-0 bottom-[8%] glass !rounded-xl px-3 py-2 text-xs animate-[floaty_6s_ease-in-out_infinite]"><span className="text-white/50">Gold 22K</span><b className="block text-gold-300 tabular-nums">{inr(rates.gold22)}/g</b></div>
   <div className="absolute right-0 top-[10%] glass !rounded-xl px-3 py-2 text-xs animate-[floaty_8s_ease-in-out_infinite_reverse]"><span className="text-white/50">BIS hallmark</span><b className="block text-gold-300">100% verified</b></div>
  </div></div></section>
 <div className="mt-14 md:mt-20 overflow-hidden border-y border-white/10 py-4" aria-hidden="true"><div className="marq-slow flex w-max font-display text-4xl md:text-6xl">{[0,1].map(n=><div key={n} className="flex shrink-0">{['Hallmarked','Since 1987','Live rates','Made to order','Gold & Silver'].map((t,i)=><span key={t} className="flex items-center gap-8 px-8"><span className={i%2?'gold-text':'outline-text'}>{t}</span><i className="w-2 h-2 rotate-45 bg-gold-500"/></span>)}</div>)}</div></div>
 <section className="max-w-7xl mx-auto px-4 mt-16 md:mt-24 grid md:grid-cols-3 gap-4 md:gap-5">
  {[[ShieldCheck,'BIS hallmarked','Every piece carries a hallmark you can verify.'],[Scale,'Live-rate pricing','Prices update with the gold and silver market, no hidden markups.'],[Sparkles,'Made to order','Custom sizes and designs from our own karigars.']].map(([I,t,d],i)=><Reveal key={t} delay={i*100} className="h-full"><div className="glass p-5 md:p-6 h-full flex md:block gap-4 items-start"><I className="text-gold-400 md:mb-4 shrink-0"/><div><h3 className="font-display text-2xl">{t}</h3><p className="text-sm text-white/55 mt-1">{d}</p></div></div></Reveal>)}</section>
 <section className="max-w-7xl mx-auto px-4 mt-16 md:mt-24"><div className="flex items-end justify-between gap-4"><Title sub="A few pieces our customers keep coming back for.">Featured this week</Title><Link to="/shop" className="hidden sm:inline-flex btn btn-ghost mb-10">View all <ArrowRight size={15}/></Link></div>
  <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-4 px-4 pb-2 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 sm:overflow-visible">{feat.map((p,i)=><ProductCard key={p.id} p={p} i={i} reveal={false} className="shrink-0 w-[68vw] max-w-[280px] snap-start sm:w-auto sm:max-w-none"/>)}</div></section>
 <Estimator/>
 </>
}

export function Shop(){
 const {products,priceOf}=useStore();const [q,setQ]=useState('');const [m,setM]=useState('all');const [c,setC]=useState('all');const [s,setS]=useState('new')
 const cats=['all',...new Set(products.map(p=>p.cat))]
 const list=useMemo(()=>products.filter(p=>(m==='all'||p.metal.startsWith(m))&&(c==='all'||p.cat===c)&&p.name.toLowerCase().includes(q.toLowerCase())).sort((a,b)=>s==='lo'?priceOf(a)-priceOf(b):s==='hi'?priceOf(b)-priceOf(a):0),[products,q,m,c,s,priceOf])
 return <section className="max-w-7xl mx-auto px-4 pt-8 md:pt-12"><Title sub="Prices are calculated from today's metal rate, weight and making charge.">Shop</Title>
  <div className="mb-5 space-y-3">
   <div className="grid md:grid-cols-[1fr_auto] gap-3">
    <div className="relative"><Search size={16} className="absolute left-3.5 top-3.5 text-white/40"/><input className="field pl-10" placeholder="Search jewellery" value={q} onChange={e=>setQ(e.target.value)} aria-label="Search jewellery"/></div>
    <div className="grid grid-cols-2 gap-3 md:w-[26rem]"><select className="field" value={m} onChange={e=>setM(e.target.value)} aria-label="Metal"><option value="all">All metals</option><option value="gold">Gold</option><option value="silver">Silver</option></select>
     <select className="field" value={s} onChange={e=>setS(e.target.value)} aria-label="Sort"><option value="new">Default order</option><option value="lo">Price: low to high</option><option value="hi">Price: high to low</option></select></div></div>
   <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap">{cats.map(x=><button key={x} onClick={()=>setC(x)} className={'chip '+(c===x?'on':'')}>{x==='all'?'All':x}</button>)}</div></div>
  <p className="text-xs text-white/45 mb-4">{list.length} {list.length===1?'piece':'pieces'}</p>
  {list.length?<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">{list.map((p,i)=><ProductCard key={p.id} p={p} i={i}/>)}</div>:<div className="glass p-8 text-center text-white/55">No jewellery matches these filters. Clear a filter to see more.</div>}</section>
}
export function Wishlist(){
 const {products,wish}=useStore();const list=products.filter(p=>wish.includes(p.id))
 return <section className="max-w-7xl mx-auto px-4 pt-8 md:pt-12"><Title sub="Pieces you've saved. Visit the shop with this list and we'll have them ready.">Your wishlist</Title>
  {list.length?<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">{list.map((p,i)=><ProductCard key={p.id} p={p} i={i}/>)}</div>:<div className="glass p-10 text-center"><Heart className="mx-auto text-rose-gold mb-3"/><p className="text-white/60">Nothing saved yet. Tap the heart on any piece to add it here.</p><Link to="/shop" className="btn btn-gold mt-5">Browse the shop</Link></div>}</section>
}
export const About=()=><section className="max-w-5xl mx-auto px-4 pt-8 md:pt-12"><Title>About {SHOP.name}</Title>
 <div className="grid md:grid-cols-2 gap-8"><Reveal><p className="text-white/70 leading-relaxed text-base md:text-lg">Since 1987 we have made gold and silver jewellery for weddings, festivals and everyday wear. Three generations of karigars work in our own workshop, and every piece is hallmarked before it reaches you.</p><p className="text-white/70 leading-relaxed text-base md:text-lg mt-4">We price honestly: metal at today's rate, a clear making charge, and GST. No guesswork at the counter.</p></Reveal>
 <Reveal delay={150}><div className="grid grid-cols-2 gap-3 md:gap-4">{[[37,'+','Years of trust'],[15000,'+','Families served'],[100,'%','Hallmarked'],[3,'','Generations']].map(([a,x,b])=><div key={b} className="glass p-5 md:p-6"><b className="font-display text-4xl gold-text"><CountUp to={a} suffix={x}/></b><div className="text-sm text-white/50 mt-1">{b}</div></div>)}</div></Reveal></div></section>

export function Contact(){
 const {reviews,setReviews}=useStore();const [f,setF]=useState({name:'',rating:5,text:''})
 const send=e=>{e.preventDefault();if(!f.name||!f.text)return;setReviews([{...f,at:new Date().toLocaleDateString('en-IN')},...reviews]);setF({name:'',rating:5,text:''})}
 return <section className="max-w-6xl mx-auto px-4 pt-8 md:pt-12"><Title>Visit or write to us</Title>
  <div className="grid md:grid-cols-2 gap-5 md:gap-8"><div className="glass p-5 md:p-6 space-y-4 text-white/75"><p className="flex gap-3"><MapPin className="text-gold-400 shrink-0"/>{SHOP.address}</p><a href={'tel:'+SHOP.phone.replace(/\s/g,'')} className="flex gap-3 py-1"><Phone className="text-gold-400"/>{SHOP.phone}</a><p className="flex gap-3"><Clock className="text-gold-400 shrink-0"/>{SHOP.hours}</p>
   <iframe title="Shop location map" loading="lazy" className="w-full h-56 rounded-xl border-0 opacity-90" src={`https://maps.google.com/maps?q=${encodeURIComponent(SHOP.address)}&output=embed`}/></div>
   <form onSubmit={send} className="glass p-5 md:p-6 space-y-4"><h3 className="font-display text-2xl">Leave a review</h3>
    <div><label className="lbl" htmlFor="rn">Your name</label><input id="rn" className="field" value={f.name} onChange={e=>setF({...f,name:e.target.value})}/></div>
    <div><span className="lbl">Rating</span><div className="flex gap-1">{[1,2,3,4,5].map(n=><button type="button" key={n} aria-label={n+' star'} className="w-11 h-11 grid place-items-center" onClick={()=>setF({...f,rating:n})}><Star className={n<=f.rating?'fill-gold-400 text-gold-400':'text-white/30'}/></button>)}</div></div>
    <div><label className="lbl" htmlFor="rt">Your experience</label><textarea id="rt" rows={3} className="field" value={f.text} onChange={e=>setF({...f,text:e.target.value})}/></div>
    <button className="btn btn-gold w-full sm:w-auto"><Send size={15}/>Post review</button></form></div>
  {reviews.length>0&&<div className="grid md:grid-cols-3 gap-4 mt-8">{reviews.map((r,i)=><div key={i} className="glass p-5"><div className="flex gap-0.5 mb-2">{Array.from({length:r.rating}).map((_,k)=><Star key={k} size={14} className="fill-gold-400 text-gold-400"/>)}</div><p className="text-sm text-white/70">{r.text}</p><p className="text-xs text-white/40 mt-3">{r.name} · {r.at}</p></div>)}</div>}</section>
}
export function Help(){
 const {setTickets,tickets}=useStore();const blank={name:'',phone:'',topic:'Order or price',msg:''};const [f,setF]=useState(blank);const [ok,setOk]=useState(false)
 const send=e=>{e.preventDefault();setTickets([{...f,at:new Date().toLocaleString('en-IN')},...tickets]);setF(blank);setOk(true)}
 return <section className="max-w-2xl mx-auto px-4 pt-8 md:pt-12"><Title sub="Tell us what went wrong. The shop owner sees your request in the dashboard.">Help</Title>
  <form onSubmit={send} className="glass p-5 md:p-6 space-y-4"><div className="grid sm:grid-cols-2 gap-4"><div><label className="lbl" htmlFor="hn">Name</label><input id="hn" required className="field" value={f.name} onChange={e=>setF({...f,name:e.target.value})}/></div><div><label className="lbl" htmlFor="hp">Phone</label><input id="hp" required type="tel" inputMode="tel" className="field" value={f.phone} onChange={e=>setF({...f,phone:e.target.value})}/></div></div>
   <div><label className="lbl" htmlFor="ht">Topic</label><select id="ht" className="field" value={f.topic} onChange={e=>setF({...f,topic:e.target.value})}>{['Order or price','Repair or resize','Bill or hallmark','Website problem','Other'].map(x=><option key={x}>{x}</option>)}</select></div>
   <div><label className="lbl" htmlFor="hm">What's the problem?</label><textarea id="hm" required rows={4} className="field" value={f.msg} onChange={e=>setF({...f,msg:e.target.value})}/></div>
   <button className="btn btn-gold w-full sm:w-auto"><Send size={15}/>Submit request</button>{ok&&<p className="text-emerald-300 text-sm" role="status">Request submitted. We'll call you soon.</p>}</form></section>
}
