"use client";

import { useEffect, useState } from "react";
import { Pencil, Save, Trash2, UserRoundPlus, X } from "lucide-react";
import api from "@/lib/axios";

const commonSkills = ["cutting", "stitching", "embroidery", "finishing", "alteration"];

type StaffMember = {
  _id: string;
  email: string;
  fullName?: string;
  phone?: string;
  staffSkills: string[];
  weeklyOrderLimit: number;
  monthlyOrderLimit: number;
  weeklyAssigned: number;
  monthlyAssigned: number;
};

const normalize = (staff: any): StaffMember => ({
  ...staff,
  staffSkills: staff.staffSkills || [],
  weeklyOrderLimit: staff.weeklyOrderLimit || 10,
  monthlyOrderLimit: staff.monthlyOrderLimit || 40,
  weeklyAssigned: staff.weeklyAssigned || 0,
  monthlyAssigned: staff.monthlyAssigned || 0,
});

export default function StaffPage() {
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [skills, setSkills] = useState<string[]>(["stitching"]);
  const [customSkill, setCustomSkill] = useState("");
  const [weeklyLimit, setWeeklyLimit] = useState(10);
  const [monthlyLimit, setMonthlyLimit] = useState(40);
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState("");
  const [editingId, setEditingId] = useState("");
  const [staffToDelete, setStaffToDelete] = useState<StaffMember | null>(null);

  const fetchStaff = async () => {
    try {
      const response = await api.get("/api/staff/get");
      setStaffList((response.data.staff || []).map(normalize));
    } catch {
      alert("Failed to fetch staff");
    }
  };

  useEffect(() => { fetchStaff(); }, []);

  const toggleSkill = (skill: string) => {
    setSkills((current) => current.includes(skill) ? current.filter((value) => value !== skill) : [...current, skill]);
  };

  const addCustomSkill = () => {
    const value = customSkill.trim().toLowerCase();
    if (value && !skills.includes(value)) setSkills((current) => [...current, value]);
    setCustomSkill("");
  };

  const handleAddStaff = async () => {
    if (!email.trim()) return alert("Email required");
    try {
      setLoading(true);
      await api.post("/api/staff/add", {
        email, name, phone, staffSkills: skills,
        weeklyOrderLimit: weeklyLimit, monthlyOrderLimit: monthlyLimit,
      });
      setEmail(""); setName(""); setPhone(""); setSkills(["stitching"]);
      setWeeklyLimit(10); setMonthlyLimit(40);
      await fetchStaff();
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to add staff");
    } finally { setLoading(false); }
  };

  const updateLocal = (id: string, patch: Partial<StaffMember>) => {
    setStaffList((current) => current.map((staff) => staff._id === id ? { ...staff, ...patch } : staff));
  };

  const saveStaff = async (staff: StaffMember) => {
    try {
      setSavingId(staff._id);
      await api.patch(`/api/staff/${staff._id}`, {
        fullName: staff.fullName,
        phone: staff.phone,
        staffSkills: staff.staffSkills,
        weeklyOrderLimit: staff.weeklyOrderLimit,
        monthlyOrderLimit: staff.monthlyOrderLimit,
      });
      await fetchStaff();
    } catch (error: any) {
      const isMissingRoute = error.response?.status === 404 && typeof error.response?.data === "string";
      alert(isMissingRoute ? "The API server is still running old code. Restart tailor-api, then save again." : (error.response?.data?.message || "Failed to update staff"));
    } finally { setSavingId(""); }
  };

  const deleteStaff = async () => {
    if (!staffToDelete) return;
    try {
      await api.delete(`/api/staff/${staffToDelete._id}`);
      setStaffToDelete(null);
      await fetchStaff();
    } catch (error: any) { alert(error.response?.data?.message || "Failed to remove staff"); }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 pb-4 pt-8 sm:px-6 sm:pb-6 sm:pt-10 lg:px-8 lg:pb-8 lg:pt-12">
      <header>
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-700">Team workload</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">Staff management</h1>
        <p className="mt-2 text-gray-600">Set each person&apos;s skills and capacity, then distribute every outfit fairly.</p>
      </header>

      <section className="border border-gray-200 bg-white p-5 sm:p-6">
        <div className="flex items-center gap-3"><UserRoundPlus className="text-emerald-700" /><h2 className="text-xl font-bold">Add staff member</h2></div>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <label className="text-sm font-semibold text-gray-700">Name<input value={name} onChange={(e) => setName(e.target.value)} className="mt-2 h-11 w-full border border-gray-300 px-3 font-normal" placeholder="Staff name" /></label>
          <label className="text-sm font-semibold text-gray-700">Email<input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 h-11 w-full border border-gray-300 px-3 font-normal" placeholder="name@example.com" /></label>
          <label className="text-sm font-semibold text-gray-700">Phone<input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-2 h-11 w-full border border-gray-300 px-3 font-normal" placeholder="Phone number" /></label>
        </div>
        <div className="mt-5">
          <p className="text-sm font-semibold text-gray-700">Roles and skills</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {commonSkills.map((skill) => <button type="button" key={skill} onClick={() => toggleSkill(skill)} className={`border px-3 py-2 text-sm font-semibold capitalize ${skills.includes(skill) ? "border-emerald-700 bg-emerald-700 text-white" : "border-gray-300 text-gray-600"}`}>{skill}</button>)}
          </div>
          <div className="mt-3 flex max-w-md"><input value={customSkill} onChange={(e) => setCustomSkill(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomSkill(); } }} className="h-10 flex-1 border border-gray-300 px-3" placeholder="Type another role" /><button type="button" onClick={addCustomSkill} className="bg-gray-900 px-4 text-sm font-semibold text-white">Add</button></div>
          <div className="mt-3 flex flex-wrap gap-2">{skills.filter((skill) => !commonSkills.includes(skill)).map((skill) => <button type="button" key={skill} onClick={() => toggleSkill(skill)} className="bg-emerald-50 px-3 py-1.5 text-sm font-semibold capitalize text-emerald-800">{skill} ×</button>)}</div>
        </div>
        <div className="mt-5 grid max-w-md grid-cols-2 gap-4">
          <label className="text-sm font-semibold text-gray-700">Weekly capacity<input type="number" min="1" value={weeklyLimit} onChange={(e) => setWeeklyLimit(Number(e.target.value))} className="mt-2 h-11 w-full border border-gray-300 px-3 font-normal" /></label>
          <label className="text-sm font-semibold text-gray-700">Monthly capacity<input type="number" min="1" value={monthlyLimit} onChange={(e) => setMonthlyLimit(Number(e.target.value))} className="mt-2 h-11 w-full border border-gray-300 px-3 font-normal" /></label>
        </div>
        <button onClick={handleAddStaff} disabled={loading} className="mt-5 bg-emerald-700 px-5 py-3 font-semibold text-white disabled:opacity-50">{loading ? "Adding..." : "Add staff"}</button>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between"><div><h2 className="text-xl font-bold text-gray-900">Workload this period</h2><p className="mt-1 text-sm text-gray-500">Counts update whenever work is assigned to an outfit.</p></div><span className="text-sm font-semibold text-gray-500">{staffList.length} staff</span></div>
        {staffList.length > 0 && <div className="mb-6 overflow-x-auto border border-gray-200 bg-white"><table className="min-w-[850px] w-full text-left text-sm"><thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500"><tr><th className="px-4 py-3">Staff</th><th className="px-4 py-3">Phone</th><th className="px-4 py-3">Roles</th><th className="px-4 py-3">This week</th><th className="px-4 py-3">This month</th><th className="px-4 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-gray-100">{staffList.map((staff) => <tr key={staff._id} className="hover:bg-gray-50"><td className="px-4 py-4"><p className="font-bold text-gray-900">{staff.fullName || "Staff name"}</p><p className="mt-1 text-xs text-gray-500">{staff.email}</p></td><td className="px-4 py-4">{staff.phone || "—"}</td><td className="px-4 py-4 capitalize">{staff.staffSkills.join(", ") || "General"}</td><td className="px-4 py-4 font-semibold">{staff.weeklyAssigned} / {staff.weeklyOrderLimit}</td><td className="px-4 py-4 font-semibold">{staff.monthlyAssigned} / {staff.monthlyOrderLimit}</td><td className="px-4 py-4"><div className="flex justify-end gap-2"><button onClick={() => { setEditingId(staff._id); document.getElementById(`staff-${staff._id}`)?.scrollIntoView({ behavior: "smooth", block: "center" }); }} className="border border-emerald-700 px-3 py-2 font-semibold text-emerald-700">Edit</button><button onClick={() => setStaffToDelete(staff)} className="border border-red-200 px-3 py-2 font-semibold text-red-600">Delete</button></div></td></tr>)}</tbody></table></div>}
        {staffList.length === 0 ? <div className="border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">No staff added yet.</div> : <div className="grid gap-4 lg:grid-cols-2">{staffList.map((staff) => {
          const weeklyPercent = Math.min((staff.weeklyAssigned / staff.weeklyOrderLimit) * 100, 100);
          const monthlyPercent = Math.min((staff.monthlyAssigned / staff.monthlyOrderLimit) * 100, 100);
          const editing = editingId === staff._id;
          return <article id={`staff-${staff._id}`} key={staff._id} className="scroll-mt-24 border border-gray-200 bg-white p-5">
            <div className="flex items-start justify-between gap-4"><div className="min-w-0 flex-1"><input disabled={!editing} value={staff.fullName || ""} onChange={(e) => updateLocal(staff._id, { fullName: e.target.value })} className={`w-full p-0 text-lg font-bold text-gray-900 outline-none ${editing ? "border-b border-emerald-600" : "border-0 bg-transparent"}`} placeholder="Staff name" /><p className="mt-1 truncate text-sm text-gray-500">{staff.email}</p></div><div className="flex gap-2">{editing ? <button onClick={() => { setEditingId(""); fetchStaff(); }} className="text-gray-500" aria-label="Cancel editing"><X size={19} /></button> : <button onClick={() => setEditingId(staff._id)} className="text-emerald-700" aria-label={`Edit ${staff.email}`}><Pencil size={19} /></button>}<button onClick={() => setStaffToDelete(staff)} className="text-red-600" aria-label={`Remove ${staff.email}`}><Trash2 size={19} /></button></div></div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm"><div><p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Email</p><p className="mt-1 truncate font-medium text-gray-700">{staff.email}</p></div><label><span className="text-xs font-semibold uppercase tracking-wide text-gray-400">Phone</span><input disabled={!editing} value={staff.phone || ""} onChange={(e) => updateLocal(staff._id, { phone: e.target.value })} className={`mt-1 w-full font-medium text-gray-700 outline-none ${editing ? "border-b border-emerald-600" : "border-0 bg-transparent"}`} placeholder="Not added" /></label></div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-gray-400">Roles and skills</p>
            <div className="mt-2 flex flex-wrap gap-2">{commonSkills.map((skill) => { const active = staff.staffSkills.includes(skill); return <button disabled={!editing} type="button" key={skill} onClick={() => updateLocal(staff._id, { staffSkills: active ? staff.staffSkills.filter((value) => value !== skill) : [...staff.staffSkills, skill] })} className={`border px-2.5 py-1.5 text-xs font-semibold capitalize disabled:cursor-default ${active ? "border-emerald-700 bg-emerald-50 text-emerald-800" : "border-gray-200 text-gray-400"}`}>{skill}</button>; })}</div>
            <input disabled={!editing} value={staff.staffSkills.filter((skill) => !commonSkills.includes(skill)).join(", ")} onChange={(e) => updateLocal(staff._id, { staffSkills: [...staff.staffSkills.filter((skill) => commonSkills.includes(skill)), ...e.target.value.split(",").map((value) => value.trim().toLowerCase()).filter(Boolean)] })} className="mt-3 h-9 w-full border border-gray-200 px-3 text-sm disabled:bg-gray-50" placeholder="Custom roles, separated by commas" />
            <div className="mt-5 grid grid-cols-2 gap-4">
              <Capacity disabled={!editing} label="This week" assigned={staff.weeklyAssigned} limit={staff.weeklyOrderLimit} percent={weeklyPercent} onLimit={(value) => updateLocal(staff._id, { weeklyOrderLimit: value })} />
              <Capacity disabled={!editing} label="This month" assigned={staff.monthlyAssigned} limit={staff.monthlyOrderLimit} percent={monthlyPercent} onLimit={(value) => updateLocal(staff._id, { monthlyOrderLimit: value })} />
            </div>
            {editing && <button onClick={async () => { await saveStaff(staff); setEditingId(""); }} disabled={savingId === staff._id} className="mt-5 inline-flex items-center gap-2 bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"><Save size={16} />{savingId === staff._id ? "Saving..." : "Save changes"}</button>}
          </article>;
        })}</div>}
      </section>

      {staffToDelete && <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"><div className="w-full max-w-md bg-white p-6"><h2 className="text-xl font-bold">Remove staff member?</h2><p className="mt-3 text-gray-600">Remove <strong>{staffToDelete.fullName || staffToDelete.email}</strong> from this boutique?</p><div className="mt-6 flex justify-end gap-3"><button onClick={() => setStaffToDelete(null)} className="border border-gray-300 px-4 py-2">Cancel</button><button onClick={deleteStaff} className="bg-red-600 px-4 py-2 text-white">Remove</button></div></div></div>}
    </div>
  );
}

function Capacity({ label, assigned, limit, percent, onLimit, disabled }: { label: string; assigned: number; limit: number; percent: number; onLimit: (value: number) => void; disabled?: boolean }) {
  return <div><div className="flex items-center justify-between text-xs"><span className="font-semibold text-gray-600">{label}</span><span className="font-bold text-gray-900">{assigned} / <input disabled={disabled} aria-label={`${label} capacity`} type="number" min="1" value={limit} onChange={(e) => onLimit(Math.max(Number(e.target.value), 1))} className="w-10 border-b border-gray-300 bg-transparent text-center outline-none disabled:border-transparent" /></span></div><div className="mt-2 h-2 bg-gray-100"><div className={`h-full ${percent >= 100 ? "bg-red-500" : percent >= 75 ? "bg-amber-500" : "bg-emerald-600"}`} style={{ width: `${percent}%` }} /></div></div>;
}
