"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AddCustomerModal from "@/components/customers/AddCustomerModal";
import { User2 } from "lucide-react";

export default function SelectCustomerPage() {
  const router = useRouter();

  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  // Fetch customers
  const fetchCustomers = async () => {
    try {
      const res = await api.get("/api/customers");
      setCustomers(res.data);
    } catch (err) {
      console.error("Error fetching customers", err);
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

  console.log("Customers data:", customers);

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

      {/* Customer List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers.map((c) => (
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

         {!loading && customers.length === 0 && <p className="text-gray-600 font-semibold">No customers found.</p>}
      </div>
    </div>
  );
}
