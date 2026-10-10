import React, { useState } from 'react';
import { Search, HelpCircle, MessageSquare, Shield, CheckCircle2, Send, ExternalLink } from 'lucide-react';

export const Help: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [ticketCategory, setTicketCategory] = useState('deposit_dispute');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDetails, setTicketDetails] = useState('');
  const [submittedTicketId, setSubmittedTicketId] = useState<string | null>(null);

  const faqs = [
    {
      category: 'Compatibility & Matching',
      q: 'How does RentMatch calculate compatibility scores?',
      a: 'The Mutual Merit compatibility engine evaluates practical rental criteria: monthly budget ceiling, target move-in dates, location corridors, layout specifications, and stated house rules (pets, WFH, quiet hours). We strictly prohibit ranking based on caste, religion, marital status, or protected demographic traits.'
    },
    {
      category: 'Compatibility & Matching',
      q: 'What is a Mutual Match?',
      a: 'A Mutual Match occurs only when both tenant and homeowner review each other\'s verified profiles and click Accept. Neither party is subjected to unsolicited phone calls, and contact details remain masked until both approve.'
    },
    {
      category: 'Deposits & Security',
      q: 'Why are RentMatch deposits capped at 2 to 3 months?',
      a: 'RentMatch adheres to the principles of the Union Model Tenancy Act (MTA), which caps residential deposits at 2 months. We believe locking up 10 months of life savings damages the urban economy and fosters avoidable rental disputes.'
    },
    {
      category: 'Deposits & Security',
      q: 'What is RentMatch Escrow?',
      a: 'RentMatch Escrow is an independent tripartite account protocol where security deposits are safeguarded and released within 7 banking days of vacating, contingent upon mutual digital handover inspection.'
    },
    {
      category: 'Safety & Disputes',
      q: 'What should I do if a broker demands an upfront viewing token?',
      a: 'Demand for viewing tokens is a direct violation of our Zero-Bidding Charter. Immediately report the listing via the "Report" button on the property page. Our Trust Desk investigates and suspends offending accounts within 24 hours.'
    }
  ];

  const filteredFaqs = faqs.filter(f => 
    f.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.a.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim()) return;

    const ref = 'TICK-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    setSubmittedTicketId(ref);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header & Search */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
          Support & Guidance
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-navy-900 tracking-tight">
          How Can We Help You?
        </h1>
        <p className="text-sm text-slate-600">
          Search frequently asked questions or submit an inquiry directly to the RentMatch Trust Desk.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto pt-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search FAQs (e.g. deposit refund, compatibility, bidding rules)..."
            className="w-full pl-11 pr-4 py-3 text-xs bg-white border border-slate-300 rounded-2xl shadow-card focus:ring-2 focus:ring-teal-500 outline-none text-navy-900"
          />
        </div>
      </div>

      {/* FAQs List */}
      <div className="max-w-3xl mx-auto space-y-4">
        <h2 className="text-base font-bold text-navy-900 mb-2">Knowledge Base Articles</h2>
        {filteredFaqs.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-200">
            No articles matched your search. You can submit a support ticket below.
          </div>
        ) : (
          filteredFaqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-2 text-xs">
              <span className="text-[10px] font-bold uppercase text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                {faq.category}
              </span>
              <h3 className="font-bold text-navy-900 text-sm">{faq.q}</h3>
              <p className="text-slate-600 leading-relaxed">{faq.a}</p>
            </div>
          ))
        )}
      </div>

      {/* Submit Ticket Banner */}
      <div className="max-w-3xl mx-auto bg-slate-900 rounded-3xl p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-modal">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-bold text-base">Need Human Review for a Tenancy Dispute?</h3>
          <p className="text-xs text-slate-400">
            Our Human Trust & Verification Arbiter reviews grievances within 24 hours.
          </p>
        </div>
        <button
          onClick={() => {
            setSubmittedTicketId(null);
            setTicketModalOpen(true);
          }}
          className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-navy-950 rounded-xl text-xs font-bold whitespace-nowrap shadow-sm"
        >
          Submit Support Ticket
        </button>
      </div>

      {/* TICKET MODAL */}
      {ticketModalOpen && (
        <div className="fixed inset-0 z-50 bg-navy-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-modal border border-slate-200 space-y-4">
            <h3 className="font-bold text-navy-900 text-base">Submit Grievance / Inquiry</h3>

            {submittedTicketId ? (
              <div className="py-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-navy-900 text-sm">Ticket Submitted Successfully</h4>
                <p className="text-xs text-slate-600">
                  Tracking ID: <strong className="font-mono text-navy-900">{submittedTicketId}</strong>
                </p>
                <p className="text-xs text-slate-500">
                  You will receive a notification and email update as soon as the Trust Officer reviews the matter.
                </p>
                <button
                  onClick={() => setTicketModalOpen(false)}
                  className="mt-2 px-5 py-2 bg-navy-900 text-white rounded-xl text-xs font-bold"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitTicket} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold mb-1 text-navy-800">Issue Category</label>
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="deposit_dispute">Security Deposit Refund Dispute</option>
                    <option value="broker_violation">Broker Extortion or Bidding Demand</option>
                    <option value="verification_help">Document Verification Assistance</option>
                    <option value="lease_guidance">Tenancy Agreement Review</option>
                    <option value="other">General Platform Support</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-navy-800">Subject</label>
                  <input
                    type="text"
                    required
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    placeholder="Brief description of the issue"
                    className="w-full p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-navy-800">Detailed Statement</label>
                  <textarea
                    rows={4}
                    required
                    value={ticketDetails}
                    onChange={(e) => setTicketDetails(e.target.value)}
                    placeholder="Provide property references, dates, and relevant details..."
                    className="w-full p-2.5 border border-slate-300 rounded-xl"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setTicketModalOpen(false)}
                    className="px-4 py-2 border rounded-xl font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-sm"
                  >
                    Submit Ticket
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
