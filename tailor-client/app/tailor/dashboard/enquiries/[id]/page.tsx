"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, CalendarDays, Check, MessageSquareText, Phone, UserRound } from "lucide-react";
import api from "@/lib/axios";

type Enquiry = {
  _id: string;
  name: string;
  phone?: string;
  note?: string;
  status: "new" | "contacted" | "converted";
  createdAt: string;
};

export default function EnquiryDetailsPage() {
  const params = useParams<{ id: string }>();
  const [enquiry, setEnquiry] = useState<Enquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!params?.id) return;
    api.get(`/api/enquiries/${params.id}`)
      .then((response) => setEnquiry(response.data.enquiry))
      .catch((requestError) => setError(requestError.response?.data?.message || "Unable to load enquiry details."))
      .finally(() => setLoading(false));
  }, [params?.id]);

  const markContacted = async () => {
    if (!enquiry) return;
    setUpdating(true);
    try {
      const response = await api.patch(`/api/enquiries/${enquiry._id}/status`, { status: "contacted" });
      setEnquiry(response.data.enquiry);
    } catch (requestError: any) {
      setError(requestError.response?.data?.message || "Unable to update enquiry.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="p-8 text-sm text-gray-500">Loading enquiry...</div>;
  if (error && !enquiry) return <div className="p-8"><p className="text-sm text-red-700">{error}</p><Link href="/tailor/dashboard" className="mt-4 inline-flex text-sm font-semibold text-emerald-700">Back to dashboard</Link></div>;
  if (!enquiry) return null;

  return (
    <main className="mx-auto max-w-4xl space-y-6 p-4 sm:p-6 lg:p-8">
      <Link href="/tailor/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-emerald-700">
        <ArrowLeft size={18} /> Back to enquiries
      </Link>

      <header className="flex flex-col gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Detailed enquiry</p>
          <h1 className="mt-2 text-2xl font-bold text-gray-900">{enquiry.name}</h1>
          <p className="mt-1 text-sm text-gray-500">Review the request and contact the customer directly.</p>
        </div>
        <span className={`w-fit px-3 py-1.5 text-xs font-semibold capitalize ${enquiry.status === "new" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>
          {enquiry.status}
        </span>
      </header>

      {error && <p role="alert" className="border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr]">
        <section className="border border-gray-200 bg-white p-5">
          <h2 className="flex items-center gap-2 text-base font-bold text-gray-900"><UserRound size={18} className="text-emerald-700" /> Customer</h2>
          <dl className="mt-4 space-y-5">
            <div>
              <dt className="text-xs font-medium text-gray-500">Name</dt>
              <dd className="mt-1 text-sm font-semibold text-gray-900">{enquiry.name}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500">Phone</dt>
              <dd className="mt-1 text-sm font-semibold text-gray-900">{enquiry.phone || "Not provided"}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500">Received</dt>
              <dd className="mt-1 flex items-center gap-2 text-sm text-gray-900"><CalendarDays size={16} className="text-gray-400" />{new Date(enquiry.createdAt).toLocaleString("en-IN", { day: "numeric", month: "long", year: "numeric", hour: "numeric", minute: "2-digit" })}</dd>
            </div>
          </dl>
        </section>

        <section className="border border-gray-200 bg-white p-5">
          <h2 className="flex items-center gap-2 text-base font-bold text-gray-900"><MessageSquareText size={18} className="text-emerald-700" /> Customer request</h2>
          <p className="mt-4 min-h-32 whitespace-pre-wrap text-sm leading-7 text-gray-800">{enquiry.note || "No enquiry details were added."}</p>
        </section>
      </div>

      <section className="flex flex-col gap-3 border border-gray-200 bg-gray-50 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-bold text-gray-900">Respond to this enquiry</h2>
          <p className="mt-1 text-sm text-gray-500">Call the customer, then mark the enquiry as contacted.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {enquiry.phone && <a href={`tel:${enquiry.phone}`} className="inline-flex items-center gap-2 border border-emerald-700 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"><Phone size={16} /> Call customer</a>}
          {enquiry.status === "new" && <button type="button" onClick={markContacted} disabled={updating} className="inline-flex items-center gap-2 bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"><Check size={16} />{updating ? "Updating..." : "Mark contacted"}</button>}
        </div>
      </section>
    </main>
  );
}
