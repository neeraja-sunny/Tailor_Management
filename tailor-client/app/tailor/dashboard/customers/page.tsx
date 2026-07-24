"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AddCustomerModal from "@/components/customers/AddCustomerModal";
import { LayoutGrid, List, Search } from "lucide-react";

export default function SelectCustomerPage() {
  const router = useRouter();

  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"table" | "cards">("table");

  // Fetch customers
  const fetchCustomers = async () => {
    try {
      const res = await api.get("/api/customers");
      const nextCustomers = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.customers)
          ? res.data.customers
          : [];
      setCustomers(nextCustomers);
    } catch (err) {
      console.error("Error fetching customers", err);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const gotoOutfitSelection = (customerId: string) => {
    console.log("Selected Customer:", customerId);

    router.push(
      `/tailor/dashboard/orders/create/select-outfits?customerId=${customerId}`
    );
  };

  const normalizedSearch = search.trim().toLowerCase();
  const filteredCustomers = customers.filter((customer) =>
    [customer.name, customer.phone, customer.city, customer.state]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(normalizedSearch))
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Select Customer</h1>

        <button
          onClick={() => setOpenModal(true)}
          className="px-6 py-4 bg-blue-400 text-black font-semibold rounded-full border border-blue-700 hover:bg-blue-500 transition"
        >
          + Add Customer
        </button>

    
      </div>

      {/* Add Customer Modal */}
      {openModal && (
        <AddCustomerModal 
          close={() => setOpenModal(false)} 
          refresh={fetchCustomers}
        />
      )}

      {/* Loading */}
      {loading && <p>Loading customers...</p>}

      <label className="relative mb-6 block max-w-xl">
        <Search size={18} className="pointer-events-none absolute left-3 top-3.5 text-gray-400" />
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by customer name, phone, or location"
          className="h-11 w-full border border-gray-300 bg-white pl-10 pr-3 outline-none focus:border-emerald-600"
        />
      </label>

      <div className="mb-4 flex items-center justify-between"><p className="text-sm font-semibold text-gray-500">{filteredCustomers.length} customers</p><div className="flex border border-gray-300 bg-white p-1"><button onClick={() => setView("table")} className={`grid h-9 w-10 place-items-center ${view === "table" ? "bg-emerald-700 text-white" : "text-gray-500"}`} aria-label="Table view"><List size={18} /></button><button onClick={() => setView("cards")} className={`grid h-9 w-10 place-items-center ${view === "cards" ? "bg-emerald-700 text-white" : "text-gray-500"}`} aria-label="Card view"><LayoutGrid size={18} /></button></div></div>

      {view === "table" && !loading && <div className="overflow-x-auto border border-gray-200 bg-white"><table className="min-w-[800px] w-full text-left text-sm"><thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500"><tr><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Phone</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Location</th><th className="px-4 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-gray-100">{filteredCustomers.map((customer) => <tr key={customer._id} className="hover:bg-gray-50"><td className="px-4 py-4 font-bold text-gray-900">{customer.name || "—"}</td><td className="px-4 py-4">{customer.phone || "—"}</td><td className="px-4 py-4">{customer.email || "—"}</td><td className="px-4 py-4">{[customer.city, customer.state].filter(Boolean).join(", ") || "—"}</td><td className="px-4 py-4"><div className="flex justify-end gap-2"><Link href={`/tailor/dashboard/customers/${customer._id}`} className="border border-gray-300 px-3 py-2 font-semibold text-gray-700">View details</Link><button onClick={() => gotoOutfitSelection(customer._id)} className="bg-emerald-700 px-3 py-2 font-semibold text-white">New order</button></div></td></tr>)}</tbody></table></div>}

      {/* Customer List */}
      {view === "cards" && <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((c) => (
        <div
  key={c._id}
  className="p-4 rounded-xl bg-white shadow hover:shadow-md border-4 border-t-emerald-500"
>
  <h2 className="font-semibold text-xl mb-3">{c.name}</h2>
  <p className="text-md text-gray-700">{c.phone}</p>
  <p className="text-md text-gray-700">{c.city}, {c.state}</p>

  <div className="flex justify-between mt-4">
    
    <button
      onClick={() => gotoOutfitSelection(c._id)}
      className="px-4 py-2 bg-emerald-600 text-white rounded-md text-md font-semibold"
    >
      Select
    </button>

    <Link
      href={`/tailor/dashboard/customers/${c._id}`}
      className="px-4 py-2 bg-gray-200 rounded-md text-md font-semibold"
    >
      View Details
    </Link>

  </div>
</div>

        ))}

         {!loading && filteredCustomers.length === 0 && <p className="text-gray-600 font-semibold">No customers found.</p>}
      </div>}
    </div>
  );
}
