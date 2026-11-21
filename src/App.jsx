import {HashRouter,Routes,Route,Outlet,useLocation} from 'react-router-dom'
import {useEffect,useState} from 'react'
import {StoreProvider} from './store'
import {Bg,Navbar,BottomNav,Footer} from './components/ui'
import {ScrollProgress,useSpotlight,useMagnet,Cursor,isReduced} from './components/fx'
import {Home,Shop,Wishlist,About,Contact,Help} from './pages/Public'
import Dashboard from './pages/Dashboard'

function Top(){
 const {pathname}=useLocation()
 useEffect(()=>{window.scrollTo({top:0,left:0,behavior:'instant'})},[pathname])
 return null
}

/* One-time intro: the gem outline draws itself, then the site opens */
function Intro(){
 const [show,setShow]=useState(()=>{try{return !isReduced()&&!sessionStorage.getItem('jw_intro')}catch{return false}})
 useEffect(()=>{
  if(!show)return
  const t=setTimeout(()=>{setShow(false);try{sessionStorage.setItem('jw_intro','1')}catch{}},1500)
  return()=>{clearTimeout(t)}
 },[show])
 if(!show)return null
 return <div className="fixed inset-0 z-[100] grid place-items-center bg-ink" style={{animation:'introOut .5s 1s forwards'}} aria-hidden="true">
  <div className="text-center"><svg viewBox="0 0 400 400" className="w-32 h-32 mx-auto overflow-visible"><polygon points="50,175 110,120 290,120 350,175 200,350" pathLength="1" fill="none" stroke="#e2c47e" strokeWidth="5" strokeLinejoin="round" style={{strokeDasharray:1,strokeDashoffset:1,animation:'draw 1.1s ease-out forwards'}}/><path d="M50 175H350M110 120L200 350L290 120M200 175" pathLength="1" fill="none" stroke="#d6b46a" strokeWidth="3" strokeOpacity=".7" style={{strokeDasharray:1,strokeDashoffset:1,animation:'draw 1.1s .2s ease-out forwards'}}/></svg>
   <div className="font-display text-3xl gold-text mt-5" style={{animation:'fadeUp .7s .5s both'}}>Aurelia Jewellers</div></div></div>
}

function Layout(){
 const {pathname}=useLocation();useSpotlight();useMagnet()
 return <>
  <ScrollProgress/><Cursor/><Navbar/>
  <i key={'s'+pathname} className="fixed top-0 left-0 right-0 h-[3px] z-[65] bg-gradient-to-r from-gold-600 via-gold-300 to-rose-gold pointer-events-none" style={{animation:'sweep .8s cubic-bezier(.7,0,.3,1) both'}}/>
  <main key={pathname} className="page min-h-[70vh]"><Outlet/></main>
  <Footer/><div className="h-16 md:hidden" style={{paddingBottom:'var(--safe-b)'}}/><BottomNav/>
 </>
}

export default function App(){
 return <StoreProvider><HashRouter future={{v7_startTransition:true,v7_relativeSplatPath:true}}><Top/><Bg/><Intro/>
  <Routes><Route path="/dashboard" element={<Dashboard/>}/>
   <Route element={<Layout/>}><Route index element={<Home/>}/><Route path="shop" element={<Shop/>}/><Route path="wishlist" element={<Wishlist/>}/><Route path="about" element={<About/>}/><Route path="contact" element={<Contact/>}/><Route path="help" element={<Help/>}/><Route path="*" element={<Home/>}/></Route>
  </Routes></HashRouter></StoreProvider>
}
