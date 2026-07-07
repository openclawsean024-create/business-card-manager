"use client";

import { useState, useTransition, useRef } from "react";
import { createCardAction, deleteCardAction, updateCardAction } from "./actions";

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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [, startTransition] = useTransition();
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
      // @ts-expect-error - Tesseract loaded from CDN
      const Tesseract = window.Tesseract;
      if (!Tesseract) {
        // 動態載入
        await new Promise<void>((resolve, reject) => {
          const s = document.createElement("script");
          s.src = "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js";
          s.onload = () => resolve();
          s.onerror = () => reject(new Error("Tesseract CDN 載入失敗"));
          document.head.appendChild(s);
        });
      }

      // @ts-expect-error - dynamic load
      const worker = await window.Tesseract.createWorker("eng+chi_tra", 1, {
        logger: (m: any) => {
          if (m.status === "recognizing text") setOcrProgress(Math.round(m.progress * 100));
        },
      });

      const { data } = await worker.recognize(file);
      await worker.terminate();

      const rawText = data.text;
      const confidence = data.confidence / 100;

      // 簡易解析（中文 + 英文名片通用啟發式）
      const parsed = parseCardHeuristic(rawText);

      startTransition(async () => {
        await createCardAction({
          ...parsed,
          tags: ["OCR"],
        });
        setOcrLoading(false);
        setOcrProgress(0);
        // 重新整理頁面 — revalidatePath in server action
        window.location.reload();
      });
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

          <div className="flex gap-2">
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

          {/* 隱藏的 input */}
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
              onDelete={() => {
                if (confirm(`刪除「${card.name ?? "未命名"}」？`)) {
                  startTransition(async () => {
                    await deleteCardAction(card.id);
                    setCards(cards.filter(c => c.id !== card.id));
                  });
                }
              }}
              onEdit={() => setEditingId(card.id)}
            />
          ))}
        </div>
      )}

      {/* Create modal */}
      {showCreate && (
        <CreateCardModal
          onClose={() => setShowCreate(false)}
          onCreate={(data) => {
            startTransition(async () => {
              try {
                await createCardAction(data);
                setShowCreate(false);
                window.location.reload();
              } catch (e: any) {
                alert(e.message || "新增失敗");
              }
            });
          }}
        />
      )}
    </div>
  );
}

function CardItem({ card, onDelete, onEdit }: { card: Card; onDelete: () => void; onEdit: () => void }) {
  const initials = (card.name ?? "?").slice(0, 1).toUpperCase();
  return (
    <div className="card p-5 hover:border-[var(--border-strong)] transition-colors">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--gold)] flex items-center justify-center text-white font-semibold flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <div className="font-semibold truncate">{card.name ?? "未命名"}</div>
            {card.company && <div className="text-xs text-[var(--text-tertiary)] truncate">{card.company} · {card.jobTitle}</div>}
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
            <span key={t} className="px-2 py-0.5 rounded text-xs bg-[var(--accent-soft)] text-[var(--accent-hover)]">
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-2 mt-4 pt-3 border-t border-[var(--border-subtle)]">
        <button onClick={onEdit} className="text-xs text-[var(--text-secondary)] hover:text-[var(--accent-hover)]">編輯</button>
        <button onClick={onDelete} className="text-xs text-[var(--danger)] hover:underline">刪除</button>
      </div>
    </div>
  );
}

function CreateCardModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (data: any) => void;
}) {
  const [data, setData] = useState({
    name: "",
    company: "",
    jobTitle: "",
    phone: "",
    email: "",
    address: "",
    website: "",
    notes: "",
    tags: [] as string[],
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="card max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl font-semibold mb-4">新增名片</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onCreate(data);
          }}
          className="space-y-3"
        >
          <div className="grid md:grid-cols-2 gap-3">
            <Field label="姓名" v={data.name} onChange={(v) => setData({ ...data, name: v })} />
            <Field label="公司" v={data.company} onChange={(v) => setData({ ...data, company: v })} />
            <Field label="職稱" v={data.jobTitle} onChange={(v) => setData({ ...data, jobTitle: v })} />
            <Field label="電話" v={data.phone} onChange={(v) => setData({ ...data, phone: v })} />
            <Field label="Email" v={data.email} onChange={(v) => setData({ ...data, email: v })} />
            <Field label="網站" v={data.website} onChange={(v) => setData({ ...data, website: v })} />
          </div>
          <Field label="地址" v={data.address} onChange={(v) => setData({ ...data, address: v })} />
          <div>
            <label className="block text-sm font-medium mb-1.5">備註</label>
            <textarea
              value={data.notes}
              onChange={(e) => setData({ ...data, notes: e.target.value })}
              rows={3}
              className="input"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button type="button" onClick={onClose} className="btn-secondary">取消</button>
            <button type="submit" className="btn-primary">新增</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, v, onChange }: { label: string; v: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      <input
        type="text"
        value={v}
        onChange={(e) => onChange(e.target.value)}
        className="input"
      />
    </div>
  );
}

// ============ 簡易名片解析啟發式 ============
// 不依賴雲端 LLM，免費、隱私、永遠可用
function parseCardHeuristic(text: string): {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
} {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

  // Email regex
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch?.[0];

  // Phone regex (含台灣 +886、03-、手機 09xx)
  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{2,4}\)?[-.\s]?)?\d{3,4}[-.\s]?\d{3,4}/);
  const phone = phoneMatch?.[0];

  // 找姓名 — 通常是前 1-3 行，最長不超過 30 字
  const nameCandidates = lines
    .filter(l => l.length >= 2 && l.length <= 30 && !/[a-z]/.test(l))  // 排除全英文
    .slice(0, 3);
  const name = nameCandidates[0];

  // 找公司 — 通常包含「有限公司」「公司」「Co., Ltd」「Inc」「Corp」或英文開頭
  const companyMatch = lines.find(l =>
    /公司|有限公司|Co\.?|Ltd\.?|Inc\.?|Corp\.?|Corporation/i.test(l)
  );
  const company = companyMatch;

  // 找職稱 — 通常含「長」「經理」「工程師」「Manager」「Engineer」「CEO」「CTO」「Director」「Designer」「Architect」
  const jobMatch = lines.find(l =>
    /長|經理|工程師|總監|顧問|Manager|Engineer|Director|Designer|Architect|CEO|CTO|CMO|COO|CFO|Founder|President|VP/i.test(l)
  );
  const jobTitle = jobMatch;

  return { name, email, phone, company, jobTitle };
}