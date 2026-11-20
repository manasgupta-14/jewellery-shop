import {useState,useMemo} from 'react'
import {Link} from 'react-router-dom'
import {Search,ArrowRight,ShieldCheck,Sparkles,Scale,Heart,Send,Star,MapPin,Phone,Clock} from 'lucide-react'
import {useStore,inr} from '../store'
import {SHOP} from '../data'
import {Reveal,Title,ProductCard,Img} from '../components/ui'

export function Home(){
 const {products,rates}=useStore();const feat=products.slice(0,4)
 return <>
 <section className="max-w-7xl mx-auto px-4 pt-16 md:pt-24 grid md:grid-cols-2 gap-12 items-center min-h-[78vh]">
  <div style={{animation:'rise 1s both'}}>
   <h1 className="font-display text-6xl md:text-8xl font-semibold leading-[.95]">Jewellery that<br/><span className="gold-text">outlives trends.</span></h1>
   <p className="mt-6 text-lg text-white/65 max-w-lg">Hallmarked gold and silver, made in our own workshop. Every price follows today's market rate, so what you see is what you pay.</p>
   <div className="mt-8 flex flex-wrap gap-3"><Link to="/shop" className="btn btn-gold">Explore collection <ArrowRight size={16}/></Link><Link to="/dashboard" className="btn btn-ghost">Go to Dashboard</Link></div>
   <div className="mt-10 flex gap-8 text-sm text-white/60"><div><b className="block text-2xl text-gold-300 font-display">{inr(rates.gold22)}</b>Gold 22K / g today</div><div><b className="block text-2xl text-gold-300 font-display">{inr(rates.silver)}</b>Silver / g today</div></div>
  </div>
  <div className="relative h-[460px] md:h-[560px]" style={{animation:'rise 1.2s .2s both'}}>
   <div className="absolute inset-6 rounded-full border border-gold-400/20" style={{animation:'spinSlow 40s linear infinite'}}/>
   <div className="absolute inset-16 rounded-full border border-dashed border-rose-gold/20" style={{animation:'spinSlow 60s linear infinite reverse'}}/>
   <Img src={products[0]?.img} alt="Featured" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 md:w-80 aspect-[4/5] object-cover rounded-t-full rounded-b-3xl border border-gold-400/30 shadow-[0_40px_90px_-20px_rgba(212,169,90,.45)]"/>
   <Img src={products[2]?.img} alt="" className="absolute left-0 bottom-10 w-28 md:w-36 aspect-square object-cover rounded-2xl border border-white/15 animate-[drift_14s_ease-in-out_infinite]"/>
   <Img src={products[3]?.img} alt="" className="absolute right-0 top-10 w-28 md:w-36 aspect-square object-cover rounded-2xl border border-white/15 animate-[drift_17s_ease-in-out_infinite_reverse]"/>
  </div></section>
 <section className="max-w-7xl mx-auto px-4 mt-24 grid md:grid-cols-3 gap-5">
  {[[ShieldCheck,'BIS hallmarked','Every piece carries a hallmark you can verify.'],[Scale,'Live-rate pricing','Prices update with the gold and silver market, no hidden markups.'],[Sparkles,'Made to order','Custom sizes and designs from our own karigars.']].map(([I,t,d],i)=><Reveal key={t} delay={i*100}><div className="glass p-6 h-full"><I className="text-gold-400 mb-4"/><h3 className="font-display text-2xl">{t}</h3><p className="text-sm text-white/55 mt-1">{d}</p></div></Reveal>)}</section>
 <section className="max-w-7xl mx-auto px-4 mt-24"><Title sub="A few pieces our customers keep coming back for.">Featured this week</Title>
  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">{feat.map((p,i)=><ProductCard key={p.id} p={p} i={i}/>)}</div></section></>
}
export function Shop(){
 const {products,priceOf}=useStore();const [q,setQ]=useState('');const [m,setM]=useState('all');const [c,setC]=useState('all');const [s,setS]=useState('new')
 const cats=['all',...new Set(products.map(p=>p.cat))]
 const list=useMemo(()=>products.filter(p=>(m==='all'||p.metal.startsWith(m))&&(c==='all'||p.cat===c)&&p.name.toLowerCase().includes(q.toLowerCase())).sort((a,b)=>s==='lo'?priceOf(a)-priceOf(b):s==='hi'?priceOf(b)-priceOf(a):0),[products,q,m,c,s,priceOf])
 return <section className="max-w-7xl mx-auto px-4 pt-12"><Title sub="Prices are calculated from today's metal rate, weight and making charge.">Shop</Title>
  <div className="glass p-4 grid md:grid-cols-4 gap-3 mb-8">
   <div className="relative"><Search size={16} className="absolute left-3 top-3.5 text-white/40"/><input className="field pl-9" placeholder="Search jewellery" value={q} onChange={e=>setQ(e.target.value)}/></div>
   <select className="field" value={m} onChange={e=>setM(e.target.value)}><option value="all">All metals</option><option value="gold">Gold</option><option value="silver">Silver</option></select>
   <select className="field" value={c} onChange={e=>setC(e.target.value)}>{cats.map(x=><option key={x} value={x}>{x==='all'?'All categories':x}</option>)}</select>
   <select className="field" value={s} onChange={e=>setS(e.target.value)}><option value="new">Default order</option><option value="lo">Price: low to high</option><option value="hi">Price: high to low</option></select></div>
  {list.length?<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">{list.map((p,i)=><ProductCard key={p.id} p={p} i={i}/>)}</div>:<p className="text-white/50">No jewellery matches these filters. Clear a filter to see more.</p>}</section>
}
export function Wishlist(){
 const {products,wish}=useStore();const list=products.filter(p=>wish.includes(p.id))
 return <section className="max-w-7xl mx-auto px-4 pt-12"><Title sub="Pieces you've saved. Visit the shop with this list and we'll have them ready.">Your wishlist</Title>
  {list.length?<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">{list.map((p,i)=><ProductCard key={p.id} p={p} i={i}/>)}</div>:<div className="glass p-10 text-center"><Heart className="mx-auto text-rose-gold mb-3"/><p className="text-white/60">Nothing saved yet. Tap the heart on any piece to add it here.</p><Link to="/shop" className="btn btn-gold mt-5">Browse the shop</Link></div>}</section>
}
export const About=()=><section className="max-w-5xl mx-auto px-4 pt-12"><Title>About {SHOP.name}</Title>
 <div className="grid md:grid-cols-2 gap-8"><Reveal><p className="text-white/70 leading-relaxed text-lg">Since 1987 we have made gold and silver jewellery for weddings, festivals and everyday wear. Three generations of karigars work in our own workshop, and every piece is hallmarked before it reaches you.</p><p className="text-white/70 leading-relaxed text-lg mt-4">We price honestly: metal at today's rate, a clear making charge, and GST. No guesswork at the counter.</p></Reveal>
 <Reveal delay={150}><div className="grid grid-cols-2 gap-4">{[['37+','Years of trust'],['15,000+','Families served'],['100%','Hallmarked'],['3','Generations']].map(([a,b])=><div key={b} className="glass p-6"><b className="font-display text-4xl gold-text">{a}</b><div className="text-sm text-white/50 mt-1">{b}</div></div>)}</div></Reveal></div></section>

export function Contact(){
 const {reviews,setReviews}=useStore();const [f,setF]=useState({name:'',rating:5,text:''})
 const send=e=>{e.preventDefault();if(!f.name||!f.text)return;setReviews([{...f,at:new Date().toLocaleDateString('en-IN')},...reviews]);setF({name:'',rating:5,text:''})}
 return <section className="max-w-6xl mx-auto px-4 pt-12"><Title>Visit or write to us</Title>
  <div className="grid md:grid-cols-2 gap-8"><div className="glass p-6 space-y-4 text-white/75"><p className="flex gap-3"><MapPin className="text-gold-400 shrink-0"/>{SHOP.address}</p><p className="flex gap-3"><Phone className="text-gold-400"/>{SHOP.phone}</p><p className="flex gap-3"><Clock className="text-gold-400"/>{SHOP.hours}</p>
   <iframe title="map" className="w-full h-56 rounded-xl border-0 opacity-90" src={`https://maps.google.com/maps?q=${encodeURIComponent(SHOP.address)}&output=embed`}/></div>
   <form onSubmit={send} className="glass p-6 space-y-4"><h3 className="font-display text-2xl">Leave a review</h3>
    <div><label className="lbl">Your name</label><input className="field" value={f.name} onChange={e=>setF({...f,name:e.target.value})}/></div>
    <div><label className="lbl">Rating</label><div className="flex gap-1">{[1,2,3,4,5].map(n=><button type="button" key={n} onClick={()=>setF({...f,rating:n})}><Star className={n<=f.rating?'fill-gold-400 text-gold-400':'text-white/30'}/></button>)}</div></div>
    <div><label className="lbl">Your experience</label><textarea rows={3} className="field" value={f.text} onChange={e=>setF({...f,text:e.target.value})}/></div>
    <button className="btn btn-gold"><Send size={15}/>Post review</button></form></div>
  {reviews.length>0&&<div className="grid md:grid-cols-3 gap-4 mt-8">{reviews.map((r,i)=><div key={i} className="glass p-5"><div className="flex gap-0.5 mb-2">{Array.from({length:r.rating}).map((_,k)=><Star key={k} size={14} className="fill-gold-400 text-gold-400"/>)}</div><p className="text-sm text-white/70">{r.text}</p><p className="text-xs text-white/40 mt-3">{r.name} · {r.at}</p></div>)}</div>}</section>
}
export function Help(){
 const {setTickets,tickets}=useStore();const blank={name:'',phone:'',topic:'Order or price',msg:''};const [f,setF]=useState(blank);const [ok,setOk]=useState(false)
 const send=e=>{e.preventDefault();setTickets([{...f,at:new Date().toLocaleString('en-IN')},...tickets]);setF(blank);setOk(true)}
 return <section className="max-w-2xl mx-auto px-4 pt-12"><Title sub="Tell us what went wrong. The shop owner sees your request in the dashboard.">Help</Title>
  <form onSubmit={send} className="glass p-6 space-y-4"><div className="grid grid-cols-2 gap-4"><div><label className="lbl">Name</label><input required className="field" value={f.name} onChange={e=>setF({...f,name:e.target.value})}/></div><div><label className="lbl">Phone</label><input required className="field" value={f.phone} onChange={e=>setF({...f,phone:e.target.value})}/></div></div>
   <div><label className="lbl">Topic</label><select className="field" value={f.topic} onChange={e=>setF({...f,topic:e.target.value})}>{['Order or price','Repair or resize','Bill or hallmark','Website problem','Other'].map(x=><option key={x}>{x}</option>)}</select></div>
   <div><label className="lbl">What's the problem?</label><textarea required rows={4} className="field" value={f.msg} onChange={e=>setF({...f,msg:e.target.value})}/></div>
   <button className="btn btn-gold"><Send size={15}/>Submit request</button>{ok&&<p className="text-emerald-300 text-sm">Request submitted. We'll call you soon.</p>}</form></section>
}
