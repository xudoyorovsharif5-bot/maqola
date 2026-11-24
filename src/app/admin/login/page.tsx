"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
      }),
    });
    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Kirish amalga oshmadi.");
      setLoading(false);
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={submit}>
        <div className="brand login-brand">
          <span className="brand-mark">+/</span>
          <span className="brand-name">MEDIAN</span>
        </div>
        <h1>Admin panelga kirish</h1>
        <p>Avtorizatsiya talab qilinadi.</p>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="username" required />
        <label htmlFor="password">Parol</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required />
        {error && <div className="login-error">{error}</div>}
        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? "Tekshirilmoqda..." : "Kirish"}
        </button>
      </form>
    </main>
  );
}
