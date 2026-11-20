import {useState,useMemo} from 'react'
import {Link} from 'react-router-dom'
import {Package,Receipt,TrendingUp,ArrowLeft,Plus,Trash2,Pencil,Printer,Upload,Save,Gem,Inbox} from 'lucide-react'
import {useStore,inr,METALS} from '../store'
import {SHOP} from '../data'
import {Img} from '../components/ui'

const TABS=[['overview','Overview',Inbox],['products','Products',Package],['billing','Billing',Receipt],['rates','Rates',TrendingUp]]
export default function Dashboard(){
 const [t,setT]=useState('billing')
 return <div className="min-h-screen max-w-7xl mx-auto px-4 py-6">
  <div className="flex flex-wrap items-center gap-4 mb-6"><Gem className="text-gold-400"/><h1 className="font-display text-3xl gold-text">{SHOP.name} Dashboard</h1><Link to="/" className="btn btn-ghost ml-auto"><ArrowLeft size={15}/>Back to shop</Link></div>
  <div className="flex gap-2 mb-6 overflow-x-auto">{TABS.map(([k,l,I])=><button key={k} onClick={()=>setT(k)} className={'btn whitespace-nowrap '+(t===k?'btn-gold':'btn-ghost')}><I size={15}/>{l}</button>)}</div>
  {t==='overview'&&<Overview/>}{t==='products'&&<Products/>}{t==='billing'&&<Billing/>}{t==='rates'&&<Rates/>}</div>
}
function Overview(){
 const {products,bills,tickets,reviews}=useStore();const sales=bills.reduce((a,b)=>a+b.total,0)
 return <div className="space-y-6"><div className="grid grid-cols-2 md:grid-cols-4 gap-4">{[['Products',products.length],['Bills',bills.length],['Total sales',inr(sales)],['Reviews',reviews.length]].map(([a,b])=><div key={a} className="glass p-5"><div className="text-sm text-white/50">{a}</div><div className="font-display text-3xl text-gold-300">{b}</div></div>)}</div>
  <div className="glass p-5"><h3 className="font-display text-2xl mb-3">Help requests</h3>{tickets.length?tickets.map((x,i)=><div key={i} className="py-3 border-t border-white/10 text-sm"><b>{x.name}</b> · {x.phone} · <span className="text-gold-300">{x.topic}</span><p className="text-white/60">{x.msg}</p><span className="text-xs text-white/30">{x.at}</span></div>):<p className="text-white/50 text-sm">No requests yet.</p>}</div></div>
}
function Products(){
 const {products,setProducts}=useStore();const blank={name:'',cat:'',metal:'gold22',weight:'',making:10,img:''};const [f,setF]=useState(blank);const [eid,setEid]=useState(null)
 const up=e=>{const fl=e.target.files[0];if(!fl)return;const r=new FileReader();r.onload=()=>setF(x=>({...x,img:r.result}));r.readAsDataURL(fl)}
 const save=e=>{e.preventDefault();const p={...f,weight:+f.weight,making:+f.making}
  setProducts(eid?products.map(x=>x.id===eid?{...p,id:eid}:x):[{...p,id:'p'+Date.now()},...products]);setF(blank);setEid(null)}
 return <div className="grid lg:grid-cols-3 gap-6">
  <form onSubmit={save} className="glass p-5 space-y-3 h-fit"><h3 className="font-display text-2xl">{eid?'Update product':'Add new product'}</h3>
   <div><label className="lbl">Name</label><input required className="field" value={f.name} onChange={e=>setF({...f,name:e.target.value})}/></div>
   <div className="grid grid-cols-2 gap-3"><div><label className="lbl">Category</label><input required className="field" placeholder="Ring, Chain…" value={f.cat} onChange={e=>setF({...f,cat:e.target.value})}/></div>
    <div><label className="lbl">Metal</label><select className="field" value={f.metal} onChange={e=>setF({...f,metal:e.target.value})}>{Object.entries(METALS).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></div>
    <div><label className="lbl">Weight (grams)</label><input required type="number" step="0.01" className="field" value={f.weight} onChange={e=>setF({...f,weight:e.target.value})}/></div>
    <div><label className="lbl">Making charge %</label><input required type="number" step="0.1" className="field" value={f.making} onChange={e=>setF({...f,making:e.target.value})}/></div></div>
   <div><label className="lbl">Photo (upload or paste link)</label><label className="btn btn-ghost w-full cursor-pointer"><Upload size={15}/>Upload photo<input type="file" accept="image/*" hidden onChange={up}/></label><input className="field mt-2" placeholder="https://…" value={f.img.startsWith('data:')?'':f.img} onChange={e=>setF({...f,img:e.target.value})}/>{f.img&&<Img src={f.img} alt="" className="mt-2 h-28 rounded-xl object-cover"/>}</div>
   <button className="btn btn-gold w-full">{eid?<><Save size={15}/>Save changes</>:<><Plus size={15}/>Add product</>}</button>{eid&&<button type="button" className="btn btn-ghost w-full" onClick={()=>{setF(blank);setEid(null)}}>Cancel</button>}</form>
  <div className="lg:col-span-2 space-y-3">{products.map(p=><div key={p.id} className="glass p-3 flex items-center gap-4"><Img src={p.img} alt="" className="w-16 h-16 rounded-xl object-cover"/><div className="flex-1 min-w-0"><div className="font-medium truncate">{p.name}</div><div className="text-xs text-white/50">{p.cat} · {METALS[p.metal]} · {p.weight} g · making {p.making}%</div></div>
   <button className="p-2 hover:text-gold-300" onClick={()=>{setF({...p});setEid(p.id);window.scrollTo({top:0,behavior:'smooth'})}}><Pencil size={17}/></button>
   <button className="p-2 hover:text-red-400" onClick={()=>confirm('Delete '+p.name+'?')&&setProducts(products.filter(x=>x.id!==p.id))}><Trash2 size={17}/></button></div>)}</div></div>
}
function Billing(){
 const {products,rates,cfg,bills,setBills,lineBase}=useStore()
 const [items,setItems]=useState([]);const [cust,setCust]=useState({name:'',phone:''});const [manual,setManual]=useState(false)
 const [ov,setOv]=useState({});const [dm,setDm]=useState('%');const [dv,setDv]=useState(0);const [pick,setPick]=useState('');const [view,setView]=useState(null)
 const R=useMemo(()=>{const r={...rates};if(manual)for(const k in ov)if(ov[k]!=='')r[k]=+ov[k];return r},[rates,manual,ov])
 const lines=items.map(it=>{const p=products.find(x=>x.id===it.id);return {name:p.name,metal:p.metal,weight:p.weight,making:p.making,qty:it.qty,rate:R[p.metal],amount:lineBase(p,R)*it.qty}})
 const sub=lines.reduce((a,l)=>a+l.amount,0);const disc=Math.min(sub,dm==='%'?sub*(+dv||0)/100:+dv||0);const gst=(sub-disc)*cfg.gst/100;const total=sub-disc+gst
 const live={no:'Preview',date:new Date().toLocaleDateString('en-IN'),cust,lines,sub,disc,discLabel:dm==='%'?dv+'%':inr(dv),gstPct:cfg.gst,gst,total}
 const save=()=>{if(!lines.length)return;const b={...live,no:'INV-'+String(bills.length+1001)};setBills([b,...bills]);setView(b);setTimeout(()=>window.print(),150);setItems([]);setCust({name:'',phone:''});setDv(0)}
 return <div className="grid lg:grid-cols-2 gap-6"><div className="space-y-4">
  <div className="glass p-5 space-y-3"><h3 className="font-display text-2xl">New bill</h3>
   <div className="grid grid-cols-2 gap-3"><input className="field" placeholder="Customer name" value={cust.name} onChange={e=>setCust({...cust,name:e.target.value})}/><input className="field" placeholder="Phone" value={cust.phone} onChange={e=>setCust({...cust,phone:e.target.value})}/></div>
   <div className="flex gap-2"><select className="field" value={pick} onChange={e=>setPick(e.target.value)}><option value="">Select product…</option>{products.map(p=><option key={p.id} value={p.id}>{p.name} ({p.weight} g)</option>)}</select><button className="btn btn-gold" onClick={()=>{if(pick&&!items.find(i=>i.id===pick))setItems([...items,{id:pick,qty:1}]);setPick('')}}><Plus size={15}/></button></div>
   {lines.map((l,i)=><div key={i} className="flex items-center gap-3 text-sm border-t border-white/10 pt-3"><div className="flex-1"><div>{l.name}</div><div className="text-xs text-white/40">{l.weight} g × {inr(l.rate)} + {l.making}% making</div></div>
    <input type="number" min="1" className="field !w-16 !py-2" value={l.qty} onChange={e=>setItems(items.map((x,k)=>k===i?{...x,qty:Math.max(1,+e.target.value)}:x))}/><b className="w-24 text-right text-gold-300">{inr(l.amount)}</b><button onClick={()=>setItems(items.filter((_,k)=>k!==i))}><Trash2 size={16} className="text-white/40 hover:text-red-400"/></button></div>)}</div>
  <div className="glass p-5 space-y-3"><div className="flex items-center justify-between"><h4 className="font-medium">Metal rate per gram</h4><label className="text-sm flex items-center gap-2"><input type="checkbox" checked={manual} onChange={e=>setManual(e.target.checked)}/>Enter manually</label></div>
   <div className="grid grid-cols-2 gap-3">{Object.keys(METALS).map(k=><div key={k}><label className="lbl">{METALS[k]} <span className="text-white/30">(market {inr(rates[k])})</span></label><input type="number" disabled={!manual} className="field disabled:opacity-50" placeholder={Math.round(rates[k])} value={manual?(ov[k]??''):Math.round(rates[k])} onChange={e=>setOv({...ov,[k]:e.target.value})}/></div>)}</div>
   <div className="flex gap-2 items-end"><div className="flex-1"><label className="lbl">Discount</label><input type="number" min="0" className="field" value={dv} onChange={e=>setDv(e.target.value)}/></div><select className="field !w-24" value={dm} onChange={e=>setDm(e.target.value)}><option>%</option><option>₹</option></select></div>
   <button className="btn btn-gold w-full" onClick={save} disabled={!lines.length}><Printer size={16}/>Save & print bill</button></div></div>
  <div><Invoice b={view||live}/>{view&&<button className="btn btn-ghost mt-3" onClick={()=>setView(null)}>Back to live preview</button>}
   {bills.length>0&&<div className="glass p-4 mt-4"><h4 className="mb-2 font-medium">Past bills</h4>{bills.slice(0,8).map(b=><button key={b.no} onClick={()=>setView(b)} className="w-full flex justify-between text-sm py-2 border-t border-white/10 hover:text-gold-300"><span>{b.no} · {b.cust.name||'Walk-in'} · {b.date}</span><b>{inr(b.total)}</b></button>)}</div>}</div></div>
}
function Invoice({b}){
 return <div className="invoice bg-white text-neutral-800 rounded-2xl p-6 text-sm shadow-2xl"><div className="flex justify-between border-b pb-3"><div><div className="font-display text-2xl font-bold text-amber-700">{SHOP.name}</div><div className="text-xs">{SHOP.address}</div><div className="text-xs">GSTIN {SHOP.gstin} · {SHOP.phone}</div></div><div className="text-right"><b>{b.no}</b><div className="text-xs">{b.date}</div></div></div>
  <div className="py-3 text-xs">Billed to: <b>{b.cust.name||'Walk-in customer'}</b> {b.cust.phone}</div>
  <table className="w-full text-xs"><thead><tr className="border-b text-left"><th className="py-1">Item</th><th>Wt (g)</th><th>Rate</th><th>Mk%</th><th>Qty</th><th className="text-right">Amount</th></tr></thead><tbody>{b.lines.map((l,i)=><tr key={i} className="border-b"><td className="py-1">{l.name}<div className="text-[10px] text-neutral-500">{METALS[l.metal]}</div></td><td>{l.weight}</td><td>{inr(l.rate)}</td><td>{l.making}</td><td>{l.qty}</td><td className="text-right">{inr(l.amount)}</td></tr>)}</tbody></table>
  <div className="mt-3 ml-auto w-56 space-y-1 text-xs"><div className="flex justify-between"><span>Subtotal</span><span>{inr(b.sub)}</span></div>{b.disc>0&&<div className="flex justify-between text-emerald-700"><span>Discount ({b.discLabel})</span><span>− {inr(b.disc)}</span></div>}<div className="flex justify-between"><span>GST {b.gstPct}%</span><span>{inr(b.gst)}</span></div><div className="flex justify-between border-t pt-1 text-base font-bold"><span>Total</span><span>{inr(b.total)}</span></div></div>
  <p className="mt-6 text-[10px] text-neutral-500">Thank you for shopping with us. Goods once sold are exchangeable at the prevailing rate.</p></div>
}
function Rates(){
 const {cfg,setCfg,rates,live}=useStore()
 return <div className="glass p-6 max-w-xl space-y-4"><h3 className="font-display text-2xl">Rate settings</h3>
  <div className="flex gap-2">{[['auto','Live market rate'],['manual','Fixed shop rate']].map(([k,l])=><button key={k} onClick={()=>setCfg({...cfg,mode:k})} className={'btn flex-1 '+(cfg.mode===k?'btn-gold':'btn-ghost')}>{l}</button>)}</div>
  <p className="text-sm text-white/50">{live?'Live rates connected.':'Live rates not reachable right now, so the shop rate below is used.'} Showing: {rates.source==='live'?'live market':'shop rate'}.</p>
  <div className="grid grid-cols-2 gap-3"><div><label className="lbl">Local premium % (duty etc.) on live rate</label><input type="number" className="field" value={cfg.premium} onChange={e=>setCfg({...cfg,premium:+e.target.value})}/></div><div><label className="lbl">GST %</label><input type="number" className="field" value={cfg.gst} onChange={e=>setCfg({...cfg,gst:+e.target.value})}/></div>
   <div><label className="lbl">Shop rate: Gold 24K / g</label><input type="number" className="field" value={cfg.manual.gold24} onChange={e=>setCfg({...cfg,manual:{...cfg.manual,gold24:+e.target.value}})}/></div><div><label className="lbl">Shop rate: Silver / g</label><input type="number" className="field" value={cfg.manual.silver} onChange={e=>setCfg({...cfg,manual:{...cfg.manual,silver:+e.target.value}})}/></div></div></div>
}
