"use client";

import { useState, useTransition } from "react";
import { formatPrice, formatRevenue } from "@/lib/utils";
import {
  updateListingStatus,
  toggleListingVerified,
  updateSellRequestStatus,
  markInquiryHandled,
  deleteSellRequest,
  updateSellRequestNote,
  updateSellRequestTags,
  deleteInquiry,
  updateInquiryNote,
} from "@/app/actions/admin";
import type { Listing, Inquiry, SellRequest, BlogPost } from "@/lib/supabase/types";
import AddListingModal from "./AddListingModal";
import BlogManager from "./BlogManager";
import {
  Plus,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Phone,
  Mail,
  Trash2,
  Save,
  Tag,
  FileText,
} from "lucide-react";

interface Props {
  listings: Listing[];
  inquiries: Inquiry[];
  sellRequests: SellRequest[];
  blogPosts: BlogPost[];
}

const TABS = [
  { label: "Oferty", key: "oferty" },
  { label: "Zapytania", key: "zapytania" },
  { label: "Zgłoszenia sprzedaży", key: "sprzedajacy" },
  { label: "Blog", key: "blog" },
];

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-50 text-blue-700 border-blue-200",
  reviewing: "bg-amber-50 text-amber-700 border-amber-200",
  listed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-red-50 text-red-600 border-red-200",
};

const STATUS_LABELS: Record<string, string> = {
  new: "Nowe",
  reviewing: "Weryfikacja",
  listed: "Wystawione",
  rejected: "Odrzucone",
};

export default function AdminTabs({ listings, inquiries, sellRequests, blogPosts }: Props) {
  const [activeTab, setActiveTab] = useState("oferty");
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedSell, setExpandedSell] = useState<string | null>(null);
  const [expandedInq, setExpandedInq] = useState<string | null>(null);

  // Local edit state for sell request notes & tags
  const [sellNotes, setSellNotes] = useState<Record<string, string>>({});
  const [sellTags, setSellTags] = useState<Record<string, string>>({});

  // Local edit state for inquiry notes
  const [inqNotes, setInqNotes] = useState<Record<string, string>>({});

  const [isPending, startTransition] = useTransition();

  const thCls = "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-faint";
  const tdCls = "px-4 py-3";

  const tabCounts: Record<string, number> = {
    oferty: listings.length,
    zapytania: inquiries.length,
    sprzedajacy: sellRequests.length,
    blog: blogPosts.length,
  };

  // ── helpers ──────────────────────────────────────

  function getSellNote(req: SellRequest) {
    return sellNotes[req.id] ?? req.notes ?? "";
  }

  function getSellTags(req: SellRequest) {
    if (req.id in sellTags) return sellTags[req.id];
    return req.admin_tags?.join(", ") ?? "";
  }

  function getInqNote(inq: Inquiry) {
    return inqNotes[inq.id] ?? inq.notes ?? "";
  }

  function handleSellNoteBlur(req: SellRequest) {
    const note = getSellNote(req);
    startTransition(() => updateSellRequestNote(req.id, note));
  }

  function handleSellTagsSave(req: SellRequest) {
    const raw = getSellTags(req);
    const tags = raw.split(",").map((t) => t.trim()).filter(Boolean);
    startTransition(() => updateSellRequestTags(req.id, tags));
  }

  function handleDeleteSell(req: SellRequest) {
    if (!confirm(`Usunąć zgłoszenie od "${req.seller_name}"?`)) return;
    startTransition(() => deleteSellRequest(req.id));
  }

  function handleInqNoteBlur(inq: Inquiry) {
    const note = getInqNote(inq);
    startTransition(() => updateInquiryNote(inq.id, note));
  }

  function handleDeleteInq(inq: Inquiry) {
    if (!confirm(`Usunąć zapytanie od "${inq.buyer_name}"?`)) return;
    startTransition(() => deleteInquiry(inq.id));
  }

  // ── render ───────────────────────────────────────

  return (
    <>
      {/* Tab nav */}
      <div className="mb-5 flex gap-0 border-b border-edge overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${
              activeTab === tab.key
                ? "border-violet text-violet"
                : "border-transparent text-ink-muted hover:text-ink"
            }`}
          >
            {tab.label}
            <span
              className={`rounded-full px-1.5 py-0.5 text-xs ${
                activeTab === tab.key ? "bg-violet-lighter text-violet" : "bg-bg-section text-ink-faint"
              }`}
            >
              {tabCounts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      {/* ── OFERTY ──────────────────────────────── */}
      {activeTab === "oferty" && (
        <div>
          <div className="mb-4 flex justify-end">
            <button onClick={() => setShowAddModal(true)} className="btn-violet text-sm !py-2 !px-4">
              <Plus size={16} />
              Dodaj ofertę
            </button>
          </div>
          <div className="overflow-x-auto rounded-xl border border-edge bg-white shadow-card">
            <table className="w-full text-sm">
              <thead className="border-b border-edge bg-bg-section">
                <tr>
                  {["Tytuł", "Cena", "Przychód", "Status", "Zweryfikowany", "Podgląd"].map((h) => (
                    <th key={h} className={thCls}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-edge">
                {listings.map((l) => (
                  <tr key={l.id} className="hover:bg-bg-section transition-colors">
                    <td className={tdCls}>
                      <div className="font-medium text-ink truncate max-w-[200px]">{l.title}</div>
                      <div className="text-xs text-ink-faint mt-0.5">{l.category} · {l.platform}</div>
                    </td>
                    <td className={`${tdCls} font-semibold text-violet`}>{formatPrice(l.asking_price)}</td>
                    <td className={`${tdCls} text-ink-muted`}>{formatRevenue(l.monthly_revenue)}</td>
                    <td className={tdCls}>
                      <select
                        value={l.status}
                        onChange={(e) => updateListingStatus(l.id, e.target.value)}
                        className="w-auto text-xs py-1 px-2 rounded-md"
                      >
                        <option value="active">Aktywny</option>
                        <option value="pending">Oczekujący</option>
                        <option value="sold">Sprzedany</option>
                      </select>
                    </td>
                    <td className={tdCls}>
                      <button
                        onClick={() => toggleListingVerified(l.id, !l.verified)}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                          l.verified
                            ? "bg-violet-lighter text-violet hover:bg-violet/20"
                            : "border border-edge text-ink-muted hover:bg-bg-section"
                        }`}
                      >
                        {l.verified ? "✓ Tak" : "Nie"}
                      </button>
                    </td>
                    <td className={tdCls}>
                      <a
                        href={`/oferty/${l.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-xs font-medium text-violet hover:text-violet-hover"
                      >
                        <ExternalLink size={12} />
                        Otwórz
                      </a>
                    </td>
                  </tr>
                ))}
                {listings.length === 0 && (
                  <tr><td colSpan={6} className="py-10 text-center text-ink-muted">Brak ofert</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── ZAPYTANIA ───────────────────────────── */}
      {activeTab === "zapytania" && (
        <div className="space-y-3">
          {inquiries.length === 0 && (
            <div className="rounded-xl border border-edge bg-white py-14 text-center text-ink-muted shadow-card">
              Brak zapytań
            </div>
          )}
          {inquiries.map((inq) => {
            const isExpanded = expandedInq === inq.id;
            return (
              <div
                key={inq.id}
                className={`rounded-xl border border-edge bg-white shadow-card overflow-hidden transition-shadow hover:shadow-card-hover ${inq.handled ? "opacity-60" : ""}`}
              >
                {/* Collapsed row */}
                <div className="flex items-center gap-4 px-5 py-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-semibold text-ink">{inq.buyer_name}</span>
                      {inq.handled ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          ✓ Obsłużone
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                          Nowe
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-0.5 text-xs text-ink-muted mt-1">
                      {inq.buyer_email && (
                        <span className="flex items-center gap-1 truncate">
                          <Mail size={10} className="text-violet flex-shrink-0" />
                          <span className="truncate">{inq.buyer_email}</span>
                        </span>
                      )}
                      {inq.buyer_phone && (
                        <span className="flex items-center gap-1">
                          <Phone size={10} className="text-violet" />
                          {inq.buyer_phone}
                        </span>
                      )}
                      <span className="text-ink-faint">
                        {new Date(inq.created_at).toLocaleDateString("pl-PL")}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => markInquiryHandled(inq.id, !inq.handled)}
                      disabled={isPending}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-40 ${
                        inq.handled
                          ? "bg-bg-section border border-edge text-ink-muted hover:bg-bg-section"
                          : "bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                      }`}
                    >
                      {inq.handled ? "Cofnij" : "Obsłuż"}
                    </button>
                    <button
                      onClick={() => setExpandedInq(isExpanded ? null : inq.id)}
                      className="flex items-center gap-1 rounded-lg border border-edge px-3 py-1.5 text-xs font-medium text-ink-muted hover:bg-bg-section transition-colors"
                    >
                      {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                      {isExpanded ? "Ukryj" : "Szczegóły"}
                    </button>
                    <button
                      onClick={() => handleDeleteInq(inq)}
                      disabled={isPending}
                      title="Usuń"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-edge text-ink-muted hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors disabled:opacity-40"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="border-t border-edge bg-bg-section px-5 py-4 space-y-4">
                    {/* Message */}
                    <div>
                      <p className="text-xs text-ink-faint mb-1 font-semibold uppercase tracking-wider">Wiadomość</p>
                      <p className="text-sm text-ink-muted leading-relaxed whitespace-pre-wrap">{inq.message}</p>
                    </div>

                    {/* Contact links */}
                    <div className="flex flex-wrap gap-4 text-sm border-t border-edge pt-3">
                      {inq.buyer_email && (
                        <a
                          href={`mailto:${inq.buyer_email}`}
                          className="flex items-center gap-1.5 font-medium text-violet hover:underline"
                        >
                          <Mail size={13} /> {inq.buyer_email}
                        </a>
                      )}
                      {inq.buyer_phone && (
                        <a
                          href={`tel:${inq.buyer_phone}`}
                          className="flex items-center gap-1.5 font-medium text-violet hover:underline"
                        >
                          <Phone size={13} /> {inq.buyer_phone}
                        </a>
                      )}
                    </div>

                    {/* Notes */}
                    <div className="border-t border-edge pt-3">
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-ink-faint uppercase tracking-wider mb-1.5">
                        <FileText size={11} /> Notatka admina
                      </label>
                      <textarea
                        rows={3}
                        value={getInqNote(inq)}
                        onChange={(e) => setInqNotes((prev) => ({ ...prev, [inq.id]: e.target.value }))}
                        onBlur={() => handleInqNoteBlur(inq)}
                        placeholder="Notatka wewnętrzna (zapisuje się automatycznie po opuszczeniu pola)…"
                        className="resize-none text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── ZGŁOSZENIA SPRZEDAŻY ─────────────────── */}
      {activeTab === "sprzedajacy" && (
        <div className="space-y-3">
          {sellRequests.length === 0 && (
            <div className="rounded-xl border border-edge bg-white py-14 text-center text-ink-muted shadow-card">
              Brak zgłoszeń sprzedaży
            </div>
          )}
          {sellRequests.map((req) => {
            const isExpanded = expandedSell === req.id;
            return (
              <div
                key={req.id}
                className="rounded-xl border border-edge bg-white shadow-card overflow-hidden transition-shadow hover:shadow-card-hover"
              >
                {/* Collapsed row */}
                <div className="flex items-center gap-4 px-5 py-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-semibold text-ink">{req.seller_name}</span>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${
                          STATUS_COLORS[req.status] ?? "bg-bg-section text-ink-faint border-edge"
                        }`}
                      >
                        {STATUS_LABELS[req.status] ?? req.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-0.5 text-xs text-ink-muted mt-1">
                      {req.seller_phone && (
                        <span className="flex items-center gap-1">
                          <Phone size={10} className="text-violet" />
                          {req.seller_phone}
                        </span>
                      )}
                      {req.seller_email && (
                        <span className="flex items-center gap-1 truncate">
                          <Mail size={10} className="text-violet flex-shrink-0" />
                          <span className="truncate">{req.seller_email}</span>
                        </span>
                      )}
                      <span className="text-ink-faint">
                        {new Date(req.created_at).toLocaleDateString("pl-PL")}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {req.status === "new" && (
                      <button
                        onClick={() => updateSellRequestStatus(req.id, "reviewing")}
                        className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-100 transition-colors whitespace-nowrap"
                      >
                        Rozpocznij
                      </button>
                    )}
                    {req.status === "reviewing" && (
                      <>
                        <button
                          onClick={() => updateSellRequestStatus(req.id, "listed")}
                          className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors"
                        >
                          Wystaw
                        </button>
                        <button
                          onClick={() => updateSellRequestStatus(req.id, "rejected")}
                          className="rounded-lg bg-red-50 border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors"
                        >
                          Odrzuć
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setExpandedSell(isExpanded ? null : req.id)}
                      className="flex items-center gap-1 rounded-lg border border-edge px-3 py-1.5 text-xs font-medium text-ink-muted hover:bg-bg-section transition-colors"
                    >
                      {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                      {isExpanded ? "Ukryj" : "Szczegóły"}
                    </button>
                    <button
                      onClick={() => handleDeleteSell(req)}
                      disabled={isPending}
                      title="Usuń zgłoszenie"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-edge text-ink-muted hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors disabled:opacity-40"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="border-t border-edge bg-bg-section px-5 py-4 space-y-4">
                    {/* Stats grid */}
                    <div className="grid sm:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-ink-faint mb-0.5">Platforma</p>
                        <p className="font-medium text-ink">{req.platform || "—"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-ink-faint mb-0.5">Przychód / mies.</p>
                        <p className="font-semibold text-emerald-700">
                          {req.monthly_revenue > 0
                            ? req.monthly_revenue.toLocaleString("pl-PL") + " zł"
                            : "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-ink-faint mb-0.5">Oczekiwana cena</p>
                        <p className="font-semibold text-violet">
                          {req.asking_price > 0
                            ? req.asking_price.toLocaleString("pl-PL") + " zł"
                            : "—"}
                        </p>
                      </div>
                    </div>

                    {req.description && req.description !== "Brak opisu" && (
                      <div>
                        <p className="text-xs text-ink-faint mb-1 font-semibold uppercase tracking-wider">Opis sklepu</p>
                        <p className="text-sm text-ink-muted leading-relaxed">{req.description}</p>
                      </div>
                    )}

                    {/* Contact */}
                    <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-edge text-sm">
                      <div>
                        <p className="text-xs text-ink-faint mb-1 font-semibold uppercase tracking-wider">Kontakt</p>
                        {req.seller_phone && (
                          <a
                            href={`tel:${req.seller_phone}`}
                            className="flex items-center gap-1.5 font-semibold text-violet hover:underline"
                          >
                            <Phone size={12} /> {req.seller_phone}
                          </a>
                        )}
                        {req.seller_email && (
                          <a
                            href={`mailto:${req.seller_email}`}
                            className="flex items-center gap-1.5 text-ink-muted hover:text-violet transition-colors mt-0.5"
                          >
                            <Mail size={12} /> {req.seller_email}
                          </a>
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-ink-faint mb-1 font-semibold uppercase tracking-wider">Data zgłoszenia</p>
                        <p className="text-ink-muted">
                          {new Date(req.created_at).toLocaleString("pl-PL")}
                        </p>
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="border-t border-edge pt-3">
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-ink-faint uppercase tracking-wider mb-1.5">
                        <FileText size={11} /> Notatka admina
                      </label>
                      <textarea
                        rows={3}
                        value={getSellNote(req)}
                        onChange={(e) => setSellNotes((prev) => ({ ...prev, [req.id]: e.target.value }))}
                        onBlur={() => handleSellNoteBlur(req)}
                        placeholder="Notatka wewnętrzna (zapisuje się automatycznie po opuszczeniu pola)…"
                        className="resize-none text-sm"
                      />
                    </div>

                    {/* Tags */}
                    <div className="border-t border-edge pt-3">
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-ink-faint uppercase tracking-wider mb-1.5">
                        <Tag size={11} /> Tagi admina
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={getSellTags(req)}
                          onChange={(e) => setSellTags((prev) => ({ ...prev, [req.id]: e.target.value }))}
                          placeholder="priorytet, do-kontaktu, vip…"
                          className="flex-1 text-sm"
                        />
                        <button
                          onClick={() => handleSellTagsSave(req)}
                          disabled={isPending}
                          className="flex items-center gap-1.5 rounded-lg bg-violet-lighter text-violet px-3 py-2 text-xs font-semibold hover:bg-violet/15 transition-colors disabled:opacity-40"
                        >
                          <Save size={12} /> Zapisz
                        </button>
                      </div>
                      {/* Display saved tags */}
                      {(() => {
                        const tags = getSellTags(req).split(",").map((t) => t.trim()).filter(Boolean);
                        return tags.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-xs px-2 py-0.5 rounded-full bg-violet-lighter text-violet font-medium"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        ) : null;
                      })()}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── BLOG ────────────────────────────────── */}
      {activeTab === "blog" && <BlogManager posts={blogPosts} />}

      {showAddModal && <AddListingModal onClose={() => setShowAddModal(false)} />}
    </>
  );
}
