import {createContext,useContext,useEffect,useMemo,useState} from 'react'
import {SEED} from './data'
const Ctx=createContext()
export const useStore=()=>useContext(Ctx)
const load=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}}
export const inr=n=>'₹'+Math.round(n||0).toLocaleString('en-IN')
export const METALS={gold24:'Gold 24K',gold22:'Gold 22K',gold18:'Gold 18K',silver:'Silver 999'}
export function StoreProvider({children}){
 const [products,setProducts]=useState(()=>load('jw_products',SEED))
 const [wish,setWish]=useState(()=>load('jw_wish',[]))
 const [bills,setBills]=useState(()=>load('jw_bills',[]))
 const [reviews,setReviews]=useState(()=>load('jw_reviews',[]))
 const [tickets,setTickets]=useState(()=>load('jw_tickets',[]))
 const [cfg,setCfg]=useState(()=>load('jw_cfg',{premium:8,gst:3,mode:'auto',manual:{gold24:13000,silver:180}}))
 const [live,setLive]=useState(null)
 useEffect(()=>localStorage.setItem('jw_products',JSON.stringify(products)),[products])
 useEffect(()=>localStorage.setItem('jw_wish',JSON.stringify(wish)),[wish])
 useEffect(()=>localStorage.setItem('jw_bills',JSON.stringify(bills)),[bills])
 useEffect(()=>localStorage.setItem('jw_reviews',JSON.stringify(reviews)),[reviews])
 useEffect(()=>localStorage.setItem('jw_tickets',JSON.stringify(tickets)),[tickets])
 useEffect(()=>localStorage.setItem('jw_cfg',JSON.stringify(cfg)),[cfg])
 useEffect(()=>{let on=true
  const pull=async()=>{try{
   const j=u=>fetch(u).then(r=>r.json())
   const [g,s,fx]=await Promise.all([j('https://api.gold-api.com/price/XAU'),j('https://api.gold-api.com/price/XAG'),j('https://open.er-api.com/v6/latest/USD')])
   const r=fx.rates.INR; if(on&&g.price&&s.price&&r)setLive({gold:g.price/31.1035*r,silver:s.price/31.1035*r,at:Date.now()})
  }catch{}}
  pull();const t=setInterval(pull,300000);return()=>{on=false;clearInterval(t)}},[])
 const rates=useMemo(()=>{
  const k=1+cfg.premium/100, useLive=cfg.mode==='auto'&&live
  const g24=useLive?live.gold*k:cfg.manual.gold24, ag=useLive?live.silver*k:cfg.manual.silver
  return {gold24:g24,gold22:g24*22/24,gold18:g24*.75,silver:ag,source:useLive?'live':'manual',at:live?.at}},[cfg,live])
 const lineBase=(p,rt=rates)=>p.weight*rt[p.metal]*(1+p.making/100)
 const priceOf=(p,qty=1)=>lineBase(p)*(1+cfg.gst/100)*qty
 const toggleWish=id=>setWish(w=>w.includes(id)?w.filter(x=>x!==id):[...w,id])
 return <Ctx.Provider value={{products,setProducts,wish,toggleWish,bills,setBills,reviews,setReviews,tickets,setTickets,cfg,setCfg,rates,live,lineBase,priceOf}}>{children}</Ctx.Provider>
}
