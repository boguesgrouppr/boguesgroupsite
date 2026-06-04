"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import { supabase } from "@/lib/supabase";

interface Contact {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  company: string | null;
  inquiry_type: string | null;
  inquiry_tag: string | null;
  message: string;
  budget_range: string | null;
  interested_service: string | null;
  preferred_contact: string | null;
  meeting_request: boolean | null;
  website_url: string | null;
  media_kit_needed: boolean | null;
  partnership_type: string | null;
  source_url: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  submission_date: string | null;
  internal_status: string | null;
  created_at: string;
}

function ContactsContent() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  async function fetchContacts() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (err) {
      console.error("Failed to fetch contacts:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this contact submission?")) return;

    const { error } = await supabase.from("contacts").delete().eq("id", id);
    if (error) {
      alert("Failed to delete contact.");
      return;
    }
    setContacts((prev) => prev.filter((c) => c.id !== id));
  }

  const filtered = contacts.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.full_name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.inquiry_type || "").toLowerCase().includes(q)
    );
  });

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function truncate(text: string, max: number) {
    if (text.length <= max) return text;
    return text.slice(0, max) + "...";
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#075E8B]">Contact Submissions</h1>
        <p className="mt-1 text-gray-500">
          {loading ? "Loading..." : `${filtered.length} total submission${filtered.length !== 1 ? "s" : ""}`}
        </p>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name, email, or inquiry..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-[#075E8B] focus:outline-none focus:ring-1 focus:ring-[#075E8B]"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <svg
              className="h-8 w-8 animate-spin text-[#075E8B]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            {search ? "No contacts match your search." : "No contact submissions yet."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 font-medium text-gray-600">Name</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Email</th>
                  <th className="hidden px-4 py-3 font-medium text-gray-600 lg:table-cell">Inquiry</th>
                  <th className="hidden px-4 py-3 font-medium text-gray-600 md:table-cell">Phone</th>
                  <th className="hidden px-4 py-3 font-medium text-gray-600 lg:table-cell">Company</th>
                  <th className="hidden px-4 py-3 font-medium text-gray-600 xl:table-cell">Message</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Date</th>
                  <th className="px-4 py-3 font-medium text-gray-600"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((contact) => (
                  <tr key={contact.id} className="group">
                    <td colSpan={8} className="p-0">
                      {/* Main row */}
                      <div
                        className="flex cursor-pointer items-center border-b border-gray-100 transition-colors hover:bg-gray-50"
                        onClick={() =>
                          setExpandedId(expandedId === contact.id ? null : contact.id)
                        }
                      >
                        <div className="w-full overflow-x-auto">
                          <table className="w-full">
                            <tbody>
                              <tr>
                                <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                                  {contact.full_name}
                                </td>
                                <td className="px-4 py-3 text-gray-600">
                                  <a
                                    href={`mailto:${contact.email}`}
                                    className="text-[#075E8B] hover:underline"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {contact.email}
                                  </a>
                                </td>
                                <td className="hidden px-4 py-3 lg:table-cell">
                                  <div className="flex items-center gap-2">
                                    <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
                                      {contact.inquiry_type || "General Inquiry"}
                                    </span>
                                    {contact.inquiry_tag ? (
                                      <span className="rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-700">
                                        {contact.inquiry_tag}
                                      </span>
                                    ) : null}
                                  </div>
                                </td>
                                <td className="hidden px-4 py-3 text-gray-600 md:table-cell">
                                  {contact.phone || "-"}
                                </td>
                                <td className="hidden px-4 py-3 text-gray-600 lg:table-cell">
                                  {contact.company || "-"}
                                </td>
                                <td className="hidden px-4 py-3 text-gray-500 xl:table-cell">
                                  {truncate(contact.message, 80)}
                                </td>
                                <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">
                                  {formatDate(contact.submission_date || contact.created_at)}
                                </td>
                                <td className="px-4 py-3">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDelete(contact.id);
                                    }}
                                    className="rounded p-1 text-gray-400 opacity-0 transition-opacity hover:text-red-600 group-hover:opacity-100"
                                    title="Delete"
                                  >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                  </button>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Expanded message */}
                      {expandedId === contact.id && (
                        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                          <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-2">Full Message</p>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">{contact.message}</p>
                          <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-500">
                            {contact.phone && <span>Phone: {contact.phone}</span>}
                            {contact.company && <span>Company: {contact.company}</span>}
                            {contact.budget_range && <span>Budget: {contact.budget_range}</span>}
                            {contact.interested_service && (
                              <span>Interested Service: {contact.interested_service}</span>
                            )}
                            {contact.preferred_contact && (
                              <span>Preferred Contact: {contact.preferred_contact}</span>
                            )}
                            {contact.meeting_request ? <span>Meeting Requested: Yes</span> : null}
                            {contact.website_url ? (
                              <a
                                href={contact.website_url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[#075E8B] hover:underline"
                              >
                                Website URL
                              </a>
                            ) : null}
                            {contact.media_kit_needed ? <span>Media Kit Needed: Yes</span> : null}
                            {contact.partnership_type && (
                              <span>Partnership Type: {contact.partnership_type}</span>
                            )}
                            {contact.internal_status && <span>Status: {contact.internal_status}</span>}
                            {contact.source_url ? (
                              <a
                                href={contact.source_url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[#075E8B] hover:underline"
                              >
                                Source URL
                              </a>
                            ) : null}
                            {contact.utm_source ? <span>UTM Source: {contact.utm_source}</span> : null}
                            {contact.utm_medium ? <span>UTM Medium: {contact.utm_medium}</span> : null}
                            {contact.utm_campaign ? <span>UTM Campaign: {contact.utm_campaign}</span> : null}
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ContactsPage() {
  return (
    <ProtectedRoute>
      <ContactsContent />
    </ProtectedRoute>
  );
}
