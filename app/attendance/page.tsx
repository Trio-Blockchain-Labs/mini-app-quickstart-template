"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import BottomNav from "../components/BottomNav";

type ActionType = "Giriş" | "Çıkış";

type AttendanceEntry = {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  action: ActionType;
  note?: string;
  timestamp: string;
};

const STORAGE_KEY = "attendance-entries";

const nowId = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `entry-${Date.now()}`);

const formatTime = (isoDate: string) =>
  new Intl.DateTimeFormat("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(isoDate));

const formatDate = (isoDate: string) =>
  new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(isoDate));

export default function AttendancePage() {
  const [entries, setEntries] = useState<AttendanceEntry[]>([]);
  const [filter, setFilter] = useState("");
  const [form, setForm] = useState({
    studentName: "",
    studentId: "",
    className: "",
    action: "Giriş" as ActionType,
    note: "",
  });

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (error) {
        console.warn("Kayıtlar okunamadı", error);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    }
  }, [entries]);

  const presentStudents = useMemo(() => {
    const latest = new Map<string, AttendanceEntry>();
    entries.forEach((entry) => {
      const previous = latest.get(entry.studentId);
      if (!previous || new Date(entry.timestamp) > new Date(previous.timestamp)) {
        latest.set(entry.studentId, entry);
      }
    });
    return Array.from(latest.values()).filter((entry) => entry.action === "Giriş");
  }, [entries]);

  const filteredEntries = useMemo(() => {
    const term = filter.trim().toLowerCase();
    if (!term) return entries;
    return entries.filter(
      (entry) =>
        entry.studentName.toLowerCase().includes(term) ||
        entry.studentId.toLowerCase().includes(term) ||
        entry.className.toLowerCase().includes(term)
    );
  }, [entries, filter]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.studentName || !form.studentId || !form.className) return;

    const newEntry: AttendanceEntry = {
      id: nowId(),
      ...form,
      timestamp: new Date().toISOString(),
    };

    setEntries((prev) => [newEntry, ...prev]);
    setForm((prev) => ({ ...prev, note: "", action: "Giriş" }));
  };

  const handleQuickExit = (studentId: string) => {
    const lastRecord = entries.find((entry) => entry.studentId === studentId);
    if (!lastRecord) return;

    const exitEntry: AttendanceEntry = {
      ...lastRecord,
      id: nowId(),
      action: "Çıkış",
      timestamp: new Date().toISOString(),
    };

    setEntries((prev) => [exitEntry, ...prev]);
  };

  const latestUpdate = entries[0]?.timestamp;

  return (
    <div className="min-h-screen bg-[#eef0f3] text-[#32353d] pb-24">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-6">
        <header className="flex flex-col gap-2">
          <p className="text-sm text-gray-500">Öğrenci giriş-çıkış takip ekranı</p>
          <h1 className="text-3xl font-bold">Kampüs Erişim Paneli</h1>
          {latestUpdate && <span className="text-xs text-gray-500">Son güncelleme: {formatDate(latestUpdate)}</span>}
        </header>

        <section className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">İçeride</p>
            <p className="text-3xl font-bold">{presentStudents.length}</p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Toplam kayıt</p>
            <p className="text-3xl font-bold">{entries.length}</p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Son hareket</p>
            <p className="text-lg font-semibold">{entries[0]?.action ?? "Henüz yok"}</p>
          </div>
        </section>

        <section className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4 pb-4">
            <div>
              <h2 className="text-xl font-semibold">Hızlı Kayıt</h2>
              <p className="text-sm text-gray-500">Anlık giriş / çıkış ekle</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-700">Öğrenci Adı</span>
              <input
                required
                value={form.studentName}
                onChange={(e) => setForm({ ...form, studentName: e.target.value })}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-[#0000ff] focus:bg-white"
                placeholder="Örn: Ayşe Yılmaz"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-700">Öğrenci No</span>
              <input
                required
                value={form.studentId}
                onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-[#0000ff] focus:bg-white"
                placeholder="Örn: 23451"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-700">Sınıf / Şube</span>
              <input
                required
                value={form.className}
                onChange={(e) => setForm({ ...form, className: e.target.value })}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-[#0000ff] focus:bg-white"
                placeholder="Örn: 10-B"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-700">İşlem</span>
              <select
                value={form.action}
                onChange={(e) => setForm({ ...form, action: e.target.value as ActionType })}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-[#0000ff] focus:bg-white"
              >
                <option value="Giriş">Giriş</option>
                <option value="Çıkış">Çıkış</option>
              </select>
            </label>

            <label className="flex flex-col gap-2 sm:col-span-2">
              <span className="text-sm font-medium text-gray-700">Not (opsiyonel)</span>
              <textarea
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                rows={2}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-[#0000ff] focus:bg-white"
                placeholder="Kısa açıklama ekleyin"
              />
            </label>

            <div className="sm:col-span-2 flex gap-3">
              <button
                type="submit"
                className="flex-1 rounded-lg bg-[#0000ff] px-4 py-3 text-sm font-semibold text-white shadow hover:bg-blue-700 transition-colors"
              >
                Kaydı Ekle
              </button>
              <button
                type="button"
                onClick={() => setForm({ studentName: "", studentId: "", className: "", action: "Giriş", note: "" })}
                className="rounded-lg border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50"
              >
                Temizle
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">İçeridekiler</h2>
              <p className="text-sm text-gray-500">Son işlem Giriş olan öğrenciler</p>
            </div>
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full sm:w-72 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-[#0000ff] focus:bg-white"
              placeholder="İsim, no veya sınıf ara..."
            />
          </div>

          {presentStudents.length === 0 ? (
            <p className="text-sm text-gray-500">Şu an içeride kayıtlı öğrenci yok.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {presentStudents
                .slice()
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .map((entry) => (
                  <div key={entry.id} className="flex flex-col gap-2 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold">{entry.studentName}</p>
                        <p className="text-xs text-gray-500">
                          {entry.className} • No: {entry.studentId}
                        </p>
                      </div>
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">İçeride</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Giriş: {formatTime(entry.timestamp)}</span>
                      <button
                        type="button"
                        onClick={() => handleQuickExit(entry.studentId)}
                        className="text-xs font-semibold text-[#0000ff] hover:underline"
                      >
                        Çıkış kaydet
                      </button>
                    </div>
                    {entry.note && <p className="text-xs text-gray-600">Not: {entry.note}</p>}
                  </div>
                ))}
            </div>
          )}
        </section>

        <section className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between pb-4">
            <div>
              <h2 className="text-xl font-semibold">Son hareketler</h2>
              <p className="text-sm text-gray-500">Yeni eklenen kayıtlar üstte</p>
            </div>
          </div>

          {filteredEntries.length === 0 ? (
            <p className="text-sm text-gray-500">Henüz kayıt bulunmuyor.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredEntries.map((entry) => (
                <div key={entry.id} className="flex flex-col gap-2 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">{entry.studentName}</span>
                      <span className="text-xs text-gray-500">
                        {entry.className} • No: {entry.studentId}
                      </span>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        entry.action === "Giriş" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {entry.action}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                    <span>{formatDate(entry.timestamp)}</span>
                    {entry.note && <span className="rounded-full bg-white px-2 py-1 text-[11px] text-gray-700">Not: {entry.note}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <BottomNav />
    </div>
  );
}

