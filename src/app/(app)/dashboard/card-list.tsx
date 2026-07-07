"use client";

import { useState, useRef } from "react";
import { createCardAction, deleteCardAction } from "./actions";

interface Card {
  id: string;
  name: string | null;
  company: string | null;
  jobTitle: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  website: string | null;
  notes: string | null;
  tags: string[];
  ocrConfidence: number | null;
  source: string;
  imageUrl: string | null;
  createdAt: Date;
}

export default function CardList({
  initialCards,
  plan,
}: {
  initialCards: Card[];
  plan: "free" | "pro" | "business";
}) {
  const [cards, setCards] = useState<Card[]>(initialCards);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const filtered = cards.filter((c) => {
    if (!search) return true;
    const blob = [c.name, c.company, c.jobTitle, c.email, c.phone, c.tags.join(" ")]
      .filter(Boolean).join(" ").toLowerCase();
    return blob.includes(search.toLowerCase());
  });

  // === OCR via Tesseract.js (瀏覽器端，零成本) ===
  async function handleOcr(file: File) {
    if (plan === "free") {
      const count = cards.length;
      if (count >= 30) {
        alert("已達免費版上限（30 張）。請升級到 Pro。");
        return;
      }
    }

    setOcrLoading(true);
    setOcrProgress(0);

    try {
      // 動態載入 Tesseract.js
      if (!(window as any).Tesseract) {
        await new Promise<void>((resolve, reject) => {
          const s = document.createElement("script");
          s.src = "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js";
          s.onload = () => resolve();
          s.onerror = () => reject(new Error("Tesseract CDN 載入失敗"));
          document.head.appendChild(s);
        });
      }

      const worker = await (window as any).Tesseract.createWorker("eng+chi_tra", 1, {
        logger: (m: any) => {
          if (m.status === "recognizing text") setOcrProgress(Math.round(m.progress * 100));
        },
      });

      const { data } = await worker.recognize(file);
      await worker.terminate();

      const rawText = data.text;
      const parsed = parseCardHeuristic(rawText);

      const fd = new FormData();
      if (parsed.name) fd.set("name", parsed.name);
      if (parsed.company) fd.set("company", parsed.company);
      if (parsed.jobTitle) fd.set("jobTitle", parsed.jobTitle);
      if (parsed.phone) fd.set("phone", parsed.phone);
      if (parsed.email) fd.set("email", parsed.email);
      fd.set("tags", JSON.stringify(["OCR"]));

      const result = await createCardAction(fd);
      setOcrLoading(false);
      setOcrProgress(0);
      if (result.error) { alert(result.error); return; }
      window.location.reload();
    } catch (e) {
      console.error(e);
      alert("OCR 失敗：" + (e as Error).message);
      setOcrLoading(false);
      setOcrProgress(0);
    }
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) handleOcr(f);
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`刪除「${name || "未命名"}」？`)) return;
    const fd = new FormData();
    fd.set("id", id);
    const result = await deleteCardAction(fd);
    if (result.error) {
      alert(result.error);
      return;
    }
    setCards(cards.filter((c) => c.id !== id));
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="card p-5">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 搜尋姓名、公司、Email、標籤..."
              className="input"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => cameraInputRef.current?.click()}
              disabled={ocrLoading}
              className="btn-primary text-sm"
            >
              {ocrLoading ? `OCR ${ocrProgress}%` : "📷 掃描名片"}
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={ocrLoading}
              className="btn-secondary text-sm"
            >
              上傳圖片
            </button>
            <button
              onClick={() => setShowCreate(true)}
              className="btn-secondary text-sm"
            >
              + 手動新增
            </button>
          </div>

          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={onFileChange}
            className="hidden"
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Cards Grid */}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-5xl mb-4">📇</div>
          <h3 className="font-semibold mb-2">{cards.length === 0 ? "還沒有任何名片" : "沒有符合搜尋的名片"}</h3>
          <p className="text-sm text-[var(--text-secondary)] mb-6">
            {cards.length === 0 ? "點「掃描名片」拍照或上傳圖片，AI 自動建立聯絡人" : "試試其他關鍵字"}
          </p>
          {cards.length === 0 && (
            <button onClick={() => cameraInputRef.current?.click()} className="btn-primary">
              📷 開始第一張
            </button>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((card) => (
            <CardItem
              key={card.id}
              card={card}
              onDelete={() => handleDelete(card.id, card.name ?? "")}
            />
          ))}
        </div>
      )}

      {/* Create modal */}
      {showCreate && (
        <CreateCardModal
          onClose={() => setShowCreate(false)}
          onSuccess={() => {
            setShowCreate(false);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}

function CardItem({ card, onDelete }: { card: Card; onDelete: () => void }) {
  const initials = (card.name ?? "?").slice(0, 1).toUpperCase();
  return (
    <div className="card p-5 hover:border-[var(--border-strong)] transition-colors">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0"
            style={{ background: "linear-gradient(135deg, var(--accent), var(--gold))" }}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <div className="font-semibold truncate">{card.name ?? "未命名"}</div>
            {card.company && (
              <div className="text-xs text-[var(--text-tertiary)] truncate">
                {card.company}
                {card.jobTitle ? ` · ${card.jobTitle}` : ""}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-1 text-sm text-[var(--text-secondary)]">
        {card.email && <div className="truncate">📧 {card.email}</div>}
        {card.phone && <div>📱 {card.phone}</div>}
        {card.website && <div className="truncate">🌐 {card.website}</div>}
      </div>

      {card.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {card.tags.map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 rounded text-xs"
              style={{ background: "var(--accent-soft)", color: "var(--accent-hover)" }}
            >
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-3 mt-4 pt-3 border-t border-[var(--border-subtle)]">
        <button
          onClick={onDelete}
          className="text-xs"
          style={{ color: "var(--danger)" }}
        >
          刪除
        </button>
      </div>
    </div>
  );
}

function CreateCardModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);

    const fd = new FormData(e.currentTarget);
    fd.set("tags", "[]");

    try {
      const result = await createCardAction(fd);
      if (result.error) {
        setError(result.error);
        setSubmitting(false);
        return;
      }
      onSuccess();
    } catch (e: any) {
      const msg = e?.message || "建立失敗";
      setError(msg);
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="card max-w-2xl w-full p-6"
        style={{ maxHeight: "90vh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-semibold mb-4">新增名片</h3>
        <form method="post" onSubmit={handleSubmit} className="space-y-3">
          <div className="grid md:grid-cols-2 gap-3">
            <Field label="姓名" name="name" />
            <Field label="公司" name="company" />
            <Field label="職稱" name="jobTitle" />
            <Field label="電話" name="phone" />
            <Field label="Email" name="email" type="email" />
            <Field label="網站" name="website" />
          </div>
          <Field label="地址" name="address" />
          <div>
            <label className="label">備註</label>
            <textarea name="notes" rows={3} className="textarea" />
          </div>

          {error && (
            <div
              className="text-sm px-3 py-2 rounded"
              style={{ color: "var(--danger)", background: "var(--danger-soft)" }}
            >
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-3">
            <button type="button" onClick={onClose} className="btn-secondary">
              取消
            </button>
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? "建立中..." : "新增"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
}: {
  label: string;
  name: string;
  type?: string;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <input type={type} name={name} className="input" />
    </div>
  );
}

// ============ 簡易名片解析啟發式 ============
function parseCardHeuristic(text: string): {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
} {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch?.[0];

  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{2,4}\)?[-.\s]?)?\d{3,4}[-.\s]?\d{3,4}/);
  const phone = phoneMatch?.[0];

  const nameCandidates = lines
    .filter((l) => l.length >= 2 && l.length <= 30 && !/[a-z]/.test(l))
    .slice(0, 3);
  const name = nameCandidates[0];

  const companyMatch = lines.find((l) =>
    /公司|有限公司|Co\.?|Ltd\.?|Inc\.?|Corp\.?|Corporation/i.test(l)
  );
  const company = companyMatch;

  const jobMatch = lines.find((l) =>
    /長|經理|工程師|總監|顧問|Manager|Engineer|Director|Designer|Architect|CEO|CTO|CMO|COO|CFO|Founder|President|VP/i.test(l)
  );
  const jobTitle = jobMatch;

  return { name, email, phone, company, jobTitle };
}