"use client";

import { useState } from "react";
import { formatPrice, formatRevenue } from "@/lib/utils";
import {
  updateListingStatus,
  toggleListingVerified,
  updateSellRequestStatus,
  markInquiryHandled,
} from "@/app/actions/admin";
import type { Listing, Inquiry, SellRequest } from "@/lib/supabase/types";
import AddListingModal from "./AddListingModal";
import { Plus, ExternalLink } from "lucide-react";

interface Props {
  listings: Listing[];
  inquiries: Inquiry[];
  sellRequests: SellRequest[];
}

const TABS = [
  { label: "Oferty", count: (p: Props) => p.listings.length },
  { label: "Zapytania", count: (p: Props) => p.inquiries.length },
  { label: "Zgłoszenia sprzedaży", count: (p: Props) => p.sellRequests.length },
];

export default function AdminTabs({ listings, inquiries, sellRequests }: Props) {
  const [activeTab, setActiveTab] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const props = { listings, inquiries, sellRequests };

  const thCls = "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-faint";
  const tdCls = "px-4 py-3";

  return (
    <>
      {/* Tab nav */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex gap-1 border-b border-edge w-full pb-0">
          {TABS.map((tab, i) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(i)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === i
                  ? "border-violet text-violet"
                  : "border-transparent text-ink-muted hover:text-ink"
              }`}
            >
              {tab.label}
              <span className={`rounded-full px-1.5 py-0.5 text-xs ${activeTab === i ? "bg-violet-lighter text-violet" : "bg-bg-section text-ink-faint"}`}>
                {tab.count(props)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Listings tab */}
      {activeTab === 0 && (
        <div>
          <div className="mb-4 flex justify-end">
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-violet text-sm !py-2 !px-4"
            >
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

      {/* Inquiries tab */}
      {activeTab === 1 && (
        <div className="overflow-x-auto rounded-xl border border-edge bg-white shadow-card">
          <table className="w-full text-sm">
            <thead className="border-b border-edge bg-bg-section">
              <tr>
                {["Kupujący", "Email", "Telefon", "Wiadomość", "Data", "Status"].map((h) => (
                  <th key={h} className={thCls}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-edge">
              {inquiries.map((inq) => (
                <tr key={inq.id} className={`hover:bg-bg-section transition-colors ${inq.handled ? "opacity-50" : ""}`}>
                  <td className={`${tdCls} font-medium text-ink`}>{inq.buyer_name}</td>
                  <td className={`${tdCls} text-ink-muted`}>{inq.buyer_email}</td>
                  <td className={`${tdCls} text-ink-muted`}>{inq.buyer_phone}</td>
                  <td className={`${tdCls} text-ink-muted max-w-[240px] truncate`}>{inq.message}</td>
                  <td className={`${tdCls} text-xs text-ink-faint whitespace-nowrap`}>
                    {new Date(inq.created_at).toLocaleDateString("pl-PL")}
                  </td>
                  <td className={tdCls}>
                    <button
                      onClick={() => markInquiryHandled(inq.id, !inq.handled)}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                        inq.handled
                          ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                          : "border border-edge text-ink-muted hover:bg-bg-section"
                      }`}
                    >
                      {inq.handled ? "✓ Obsłużone" : "Obsłuż"}
                    </button>
                  </td>
                </tr>
              ))}
              {inquiries.length === 0 && (
                <tr><td colSpan={6} className="py-10 text-center text-ink-muted">Brak zapytań</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Sell requests tab */}
      {activeTab === 2 && (
        <div className="overflow-x-auto rounded-xl border border-edge bg-white shadow-card">
          <table className="w-full text-sm">
            <thead className="border-b border-edge bg-bg-section">
              <tr>
                {["Imię", "Telefon", "Email", "Opis", "Status", "Data"].map((h) => (
                  <th key={h} className={thCls}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-edge">
              {sellRequests.map((req) => (
                <tr key={req.id} className="hover:bg-bg-section transition-colors">
                  <td className={`${tdCls} font-medium text-ink whitespace-nowrap`}>
                    {req.seller_name}
                  </td>
                  <td className={tdCls}>
                    {req.seller_phone ? (
                      <a
                        href={`tel:${req.seller_phone}`}
                        className="font-semibold text-violet hover:text-violet-hover transition-colors whitespace-nowrap"
                      >
                        {req.seller_phone}
                      </a>
                    ) : (
                      <span className="text-ink-faint">—</span>
                    )}
                  </td>
                  <td className={tdCls}>
                    {req.seller_email ? (
                      <a
                        href={`mailto:${req.seller_email}`}
                        className="text-ink-muted hover:text-violet transition-colors"
                      >
                        {req.seller_email}
                      </a>
                    ) : (
                      <span className="text-ink-faint">—</span>
                    )}
                  </td>
                  <td className={`${tdCls} text-ink-muted max-w-[220px]`}>
                    <span
                      className="block truncate"
                      title={req.description}
                    >
                      {req.description === "Brak opisu" ? (
                        <span className="text-ink-faint italic">Brak opisu</span>
                      ) : req.description}
                    </span>
                  </td>
                  <td className={tdCls}>
                    <select
                      value={req.status}
                      onChange={(e) => updateSellRequestStatus(req.id, e.target.value)}
                      className="w-auto text-xs py-1 px-2 rounded-md"
                    >
                      <option value="new">Nowe</option>
                      <option value="reviewing">W trakcie</option>
                      <option value="listed">Wystawione</option>
                      <option value="rejected">Odrzucone</option>
                    </select>
                  </td>
                  <td className={`${tdCls} text-xs text-ink-faint whitespace-nowrap`}>
                    {new Date(req.created_at).toLocaleDateString("pl-PL")}
                  </td>
                </tr>
              ))}
              {sellRequests.length === 0 && (
                <tr><td colSpan={6} className="py-10 text-center text-ink-muted">Brak zgłoszeń</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showAddModal && <AddListingModal onClose={() => setShowAddModal(false)} />}
    </>
  );
}
