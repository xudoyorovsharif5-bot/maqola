import Link from "next/link";
import { Clock3, Eye, Search } from "lucide-react";
import "../../app/globals.css";

const items = [
 ["Bog‘cha yoshidagi bolalarda allergiya belgilarini aniqlash","Pediatriya","photo-1576091160399-112ba8d25d1d"],
 ["Tish salomatligini kuzatishda sun’iy intellekt","Stomatologiya","photo-1609840114035-3c981b782dfe"],
 ["Sog‘lom ovqatlanish: 7 qoidaga asoslangan reja","Ovqatlanish","photo-1498837167922-ddd27525d352"],
 ["Yurak-qon tomir xavflarini kamaytirish yo‘llari","Yurak","photo-1505751172876-fa1923c5c528"],
 ["Nevrolog: uyqu rejimini yaxshilash qanday boshlanadi","Nevrologiya","photo-1541781774459-bb2af2f05b55"],
 ["Tibbiyotda yangi diagnostika texnologiyalari","Texnologiya","photo-1559757175-0eb30cd8c063"],
];
export default function NewsPage() {
 return <main><div className="inner-header"><header className="site-header"><div className="header-main shell"><Link href="/" className="brand"><span className="brand-mark">+/</span><span className="brand-name">MEDIAN</span></Link></div></header></div>
 <section className="page-hero"><div className="shell"><div className="breadcrumbs">Bosh sahifa / Yangiliklar</div><h1>Tibbiyot yangiliklari</h1><p>O‘zbekiston va dunyo sog‘liqni saqlash sohasidagi dolzarb xabarlar</p></div></section>
 <div className="shell"><div className="archive-toolbar"><div className="filter-pills"><button className="active">Hammasi</button><button>Sog‘liq</button><button>Kasalliklar</button><button>Texnologiya</button><button>Pediatriya</button></div><label><Search width={16}/><input aria-label="Qidiruv" placeholder="Yangiliklarda qidirish"/></label></div>
 <div className="archive-grid">{items.map(([title,cat,id],i)=><Link href="/news/ma-ruza" className="archive-card" key={title}><img src={`https://images.unsplash.com/${id}?auto=format&fit=crop&w=700&q=80`} alt={title}/><div><span className="category-text">{cat}</span><h2>{title}</h2><p><Clock3 width={12}/> {i+1} soat oldin &nbsp; <Eye width={12}/> {10+i*3},2 ming</p></div></Link>)}</div>
 <nav className="pagination" aria-label="Sahifalash"><a className="active" href="#">1</a><a href="#">2</a><a href="#">3</a><a href="#">›</a></nav></div></main>;
}
