import {HashRouter,Routes,Route,useLocation} from 'react-router-dom'
import {useEffect} from 'react'
import {StoreProvider} from './store'
import {Bg,Navbar,Footer} from './components/ui'
import {Home,Shop,Wishlist,About,Contact,Help} from './pages/Public'
import Dashboard from './pages/Dashboard'
function Top(){const {pathname}=useLocation();useEffect(()=>window.scrollTo(0,0),[pathname]);return null}
export default function App(){
 return <StoreProvider><HashRouter><Top/><Bg/>
  <Routes><Route path="/dashboard" element={<Dashboard/>}/>
   <Route path="*" element={<><Navbar/><main className="min-h-[70vh]"><Routes><Route path="/" element={<Home/>}/><Route path="/shop" element={<Shop/>}/><Route path="/wishlist" element={<Wishlist/>}/><Route path="/about" element={<About/>}/><Route path="/contact" element={<Contact/>}/><Route path="/help" element={<Help/>}/></Routes></main><Footer/></>}/></Routes>
 </HashRouter></StoreProvider>
}
