"use client";

import { useState } from "react";

const nav = [
  ["Ana səhifə", "grid"], ["İstifadəçilər", "users"], ["Sifarişlər", "bag"],
  ["Məhsullar", "box"], ["Statistika", "chart"],
];

const transactions = [
  ["LM", "Leyla Məmmədova", "Yeni sifariş verdi", "+240 ₼", "5 dəq", "purple"],
  ["RA", "Rəşad Əliyev", "Ödəniş etdi", "+1,280 ₼", "18 dəq", "blue"],
  ["NH", "Nərmin Həsənova", "Məhsulu qaytardı", "-86 ₼", "42 dəq", "pink"],
  ["KR", "Kənan Rzayev", "Abunə oldu", "+32 ₼", "1 saat", "orange"],
] as const;

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
    bag: <><path d="M6 2h12l1 20H5L6 2z"/><path d="M9 6a3 3 0 0 1 6 0"/></>,
    box: <><path d="M21 16V8l-9-5-9 5v8l9 5 9-5z"/><path d="M3.3 7L12 12l8.7-5M12 22V12"/></>,
    chart: <><path d="M3 3v18h18"/><path d="M7 16l4-4 3 3 5-7"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
    more: <><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export default function Home() {
  const [active, setActive] = useState("Ana səhifə");
  const [period, setPeriod] = useState("Bu ay");

  return (
    <div className="admin-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark"><i/><i/><i/></div><b>nexora</b></div>
        <nav className="nav">
          <p>MENU</p>
          {nav.map(([label, icon]) => (
            <button key={label} className={active === label ? "nav-item active" : "nav-item"} onClick={() => setActive(label)}>
              <Icon name={icon}/><span>{label}</span>{label === "Sifarişlər" && <em>12</em>}
            </button>
          ))}
          <p className="management">İDARƏETMƏ</p>
          <button className="nav-item"><Icon name="users"/><span>Komanda</span></button>
          <button className="nav-item"><Icon name="box"/><span>Kampaniyalar</span></button>
        </nav>
        <div className="sidebar-bottom">
          <button className="nav-item"><Icon name="grid"/><span>Ayarlar</span></button>
          <div className="profile"><div className="avatar">AM</div><div><strong>Arzu Məmmədova</strong><small>Administrator</small></div><Icon name="more" size={18}/></div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <label className="search"><Icon name="search" size={18}/><input placeholder="Axtarış et..." /><kbd>⌘ K</kbd></label>
          <div className="top-actions"><button className="icon-button" aria-label="Bildirişlər"><Icon name="bell" size={19}/><i/></button><button className="primary"><b>+</b> Yeni sifariş</button></div>
        </header>

        <div className="content">
          <div className="heading">
            <div><p>İdarə paneli</p><h1>Xoş gəlmisiniz, Arzu</h1></div>
            <div className="period">{["Həftə","Bu ay","İl"].map(v => <button key={v} className={period === v ? "selected" : ""} onClick={() => setPeriod(v)}>{v}</button>)}</div>
          </div>

          <section className="stats">
            {[
              ["chart","purple","Ümumi gəlir","₼84,320","↗ 12.5%","up"],
              ["users","blue","İstifadəçilər","5,420","↗ 8.2%","up"],
              ["bag","orange","Sifarişlər","1,248","↗ 5.7%","up"],
              ["box","green","Konversiya","3.68%","↘ 1.2%","down"],
            ].map(([icon,color,label,value,change,type]) => (
              <article className="stat" key={label}><div className={`stat-icon ${color}`}><Icon name={icon}/></div><div className="stat-info"><span>{label}</span><strong>{value}</strong><small className={type}>{change}</small></div></article>
            ))}
          </section>

          <section className="middle">
            <article className="card chart-card">
              <div className="card-head"><div><h2>Gəlir analitikası</h2><p>Son 7 günlük performans</p></div><Icon name="more"/></div>
              <div className="chart-total"><strong>₼24,780</strong><span>+16.8%</span></div>
              <div className="chart">
                <div className="y"><span>30k</span><span>20k</span><span>10k</span><span>0</span></div>
                <div className="plot">
                  <div className="grid"><i/><i/><i/><i/></div>
                  <svg viewBox="0 0 700 170" preserveAspectRatio="none" aria-label="Gəlir qrafiki">
                    <defs><linearGradient id="fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7c3aed" stopOpacity=".16"/><stop offset="100%" stopColor="#7c3aed" stopOpacity=".02"/></linearGradient></defs>
                    <path className="area" d="M0 130 C60 122,78 102,118 112 C165 119,185 72,230 82 C275 92,300 65,348 72 C395 80,420 38,465 48 C515 58,535 25,580 36 C625 47,650 10,700 18 L700 170 L0 170 Z"/>
                    <path className="line" d="M0 130 C60 122,78 102,118 112 C165 119,185 72,230 82 C275 92,300 65,348 72 C395 80,420 38,465 48 C515 58,535 25,580 36 C625 47,650 10,700 18"/>
                    <circle cx="580" cy="36" r="5"/>
                  </svg>
                  <div className="x"><span>B.e</span><span>Ç.a</span><span>Ç.</span><span>C.a</span><span>C.</span><span>Ş.</span><span>B.</span></div>
                </div>
              </div>
            </article>

            <article className="card transactions">
              <div className="card-head"><div><h2>Son əməliyyatlar</h2><p>Aktivlik axını</p></div><Icon name="more"/></div>
              <div className="transaction-list">{transactions.map(([initial,name,action,amount,time,color]) => (
                <div className="transaction" key={name}><div className={`t-avatar ${color}`}>{initial}</div><div className="t-name"><strong>{name}</strong><span>{action}</span></div><div className="t-value"><strong className={amount.startsWith("-") ? "negative" : ""}>{amount}</strong><span>{time}</span></div></div>
              ))}</div>
              <button className="view-all">Hamısına bax <span>→</span></button>
            </article>
          </section>

          <section className="card products">
            <div className="card-head"><div><h2>Ən çox satılan məhsullar</h2><p>Ən yaxşı performans göstərənlər</p></div><button className="outline">Hamısını gör</button></div>
            <div className="product-list">
              {[
                ["Wireless Headphones","Elektronika","1,284","₼24,890",84,"#7c3aed","♪"],
                ["Smart Watch S9","Aksesuarlar","968","₼18,420",68,"#5c8ef2","◒"],
                ["Minimalist Lamp","Ev və yaşayış","742","₼12,760",54,"#f59e0b","◡"],
              ].map(([name,cat,sales,revenue,progress,color,mark], i) => (
                <div className="product" key={name as string}><span className="rank">0{i + 1}</span><div className="p-image" style={{"--c":color} as React.CSSProperties}><b>{mark}</b></div><div className="p-name"><strong>{name}</strong><span>{cat}</span></div><div className="progress"><i><b style={{width:`${progress}%`,background:color}}/></i></div><div className="p-sales"><strong>{sales}</strong><span>Satış</span></div><div className="p-revenue"><strong>{revenue}</strong><span>Gəlir</span></div></div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
