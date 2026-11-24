import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/admin-session";
import {
  FileText, Image as ImageIcon, LayoutDashboard, Settings, ShieldCheck,
  Tags, Users, Video,
} from "lucide-react";

export const instant = false;

export default async function Admin() {
  const cookieStore = await cookies();
  const session = verifyAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
  if (!session) redirect("/admin/login");

  const prisma = new PrismaClient();
  let user;
  try {
    user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { name: true, role: true },
    });
  } finally {
    await prisma.$disconnect();
  }
  if (!user || user.role !== session.role || !["SUPER_ADMIN", "ADMIN", "EDITOR", "AUTHOR", "MEDICAL_EXPERT"].includes(user.role)) {
    redirect("/admin/login");
  }

  const nav = [
    [LayoutDashboard, "Boshqaruv", true],
    [FileText, "Maqolalar", false],
    [FileText, "Yangiliklar", false],
    [ShieldCheck, "Kasalliklar ensiklopediyasi", false],
    [Users, "Mutaxassislar", false],
    [Video, "Videolar", false],
    [Tags, "Kategoriya va teglar", false],
    [ImageIcon, "Media kutubxonasi", false],
    [Settings, "Sozlamalar", false],
  ] as const;

  const rows = [
    ["Yurak salomatligi bo‘yicha 10 qoida", "24 182", "Nashr"],
    ["Uyqu sifatini yaxshilash", "18 704", "Nashr"],
    ["Bolalarda allergiya belgilarini aniqlash", "12 991", "Tekshiruv"],
  ];

  return (
    <main className="admin-layout">
      <aside className="admin-sidebar">
        <Link href="/" className="brand">
          <span className="brand-mark">+/</span>
          <span className="brand-name">MEDIAN</span>
        </Link>
        <nav className="admin-nav">
          {nav.map(([Icon, label, active]) => (
            <Link href="/admin" className={active ? "active" : ""} key={label}>
              <Icon /><span>{label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <section className="admin-main">
        <header className="admin-top">
          <button className="icon-btn" aria-label="Bildirishnoma">◉</button>
          <div className="expert-mini" style={{ height: "68px", border: 0, width: "155px" }}>
            <div className="avatar">{user.name.slice(0, 2).toUpperCase()}</div>
            <div><h4>{user.name}</h4><p>{user.role}</p></div>
          </div>
          <form action="/api/admin/logout" method="post">
            <button type="submit" className="icon-btn" aria-label="Chiqish" title="Chiqish">↪</button>
          </form>
        </header>

        <div className="admin-content">
          <div className="admin-title">
            <h1>Boshqaruv paneli</h1>
            <button className="primary-btn">+ Yangi maqola</button>
          </div>

          <div className="stats-grid">
            {[["Bugungi tashrif", "2 418", "+12%"], ["Jami maqolalar", "186", "+8"], ["Jami yangiliklar", "94", "+3"], ["Nashr kutilmoqda", "7", "2 ta bugun"]].map(([a, b, c]) => (
              <div className="stat-card" key={a}>
                <span>{a}</span><strong>{b}</strong><small>{c}</small>
              </div>
            ))}
          </div>

          <div className="admin-panels">
            <div className="admin-panel">
              <h3>Eng ko‘p o‘qilgan maqolalar</h3>
              <table className="admin-table">
                <thead><tr><th>Maqola</th><th>Ko‘rishlar</th><th>Holat</th></tr></thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row[0]}>
                      {row.map((value, index) => (
                        <td key={value}>
                          {index === 2 ? <span className={`status ${value === "Tekshiruv" ? "review" : ""}`}>{value}</span> : value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="admin-panel">
              <h3>Oylik o‘sish</h3>
              <div style={{ height: "210px", display: "flex", alignItems: "flex-end", gap: "12px", padding: "20px 10px" }}>
                {[42,58,47,72,64,88,76,94,81,105,92,118].map((height, index) => (
                  <div
                    key={index}
                    title={`${height}`}
                    style={{
                      flex: 1,
                      height: `${height}px`,
                      maxHeight: "165px",
                      background: index === 11 ? "#176aa4" : "#cfe0e9",
                      borderRadius: "3px 3px 0 0",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
