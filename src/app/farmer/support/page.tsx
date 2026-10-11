'use client';

import React, { useState } from 'react';
import { FarmerLayout } from '@/components/farmer/FarmerLayout';
import {
  HelpCircle,
  Phone,
  Mail,
  MessageSquare,
  FileText,
  ChevronDown,
  CheckCircle2,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FarmerSupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [submitted, setSubmitted] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const faqs = [
    {
      q: 'How does the KisanKart Escrow Payout work for farmers?',
      a: 'When a commercial buyer places an order, the purchase amount is deposited into an ICICI Escrow trust account. Once the consignment is weighed at the mandi or delivered to the buyer hub, the funds are instantly released to your linked UPI/Bank account.'
    },
    {
      q: 'What should I do if a buyer disputes the produce quality grade?',
      a: 'Our on-ground APMC quality inspectors verify each lot against NABL accredited standard guidelines. If a dispute occurs, an instant photo re-inspection is logged, and the fair price guarantee ensures payment for all graded produce delivered.'
    },
    {
      q: 'How do I request transport and cold logistics for my harvested lot?',
      a: 'Go to "Delivery" or click "Dispatch & Logistics" on your dashboard. When you mark an order as "Confirmed", a KisanKart carrier vehicle (Tata Ace / Eicher) is automatically routed to your farm gate.'
    },
    {
      q: 'How do I update my Soil Health Card and organic verification?',
      a: 'You can upload your latest KVK / Soil Testing Laboratory certificate in your Profile or via the Soil Health Card modal on your dashboard. Verified Grade A status boosts your buyer matching score by 35%.'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSubject('');
      setMessage('');
    }, 3000);
  };

  return (
    <FarmerLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Header */}
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <span>🤝</span>
            <span>Kisan Support & Mandi Helpdesk</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
            24/7 dedicated support for UP & North India farmer mandi dispatches and payments
          </p>
        </div>

        {/* 3 Contact Support Channels */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-2xs space-y-2">
            <div className="h-10 w-10 rounded-xl bg-amber-50 text-[#994200] flex items-center justify-center">
              <Phone className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-gray-900">Toll-Free Helpline</h4>
            <p className="text-xs text-gray-500">Toll-free across all districts</p>
            <a
              href="tel:18001801551"
              className="font-black text-[#994200] text-sm block pt-1 hover:underline"
            >
              1800-180-1551
            </a>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-2xs space-y-2">
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Mail className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-gray-900">Farmer Desk Email</h4>
            <p className="text-xs text-gray-500">Response within 2 hours</p>
            <a
              href="mailto:support@kishankart.in"
              className="font-bold text-blue-700 text-xs block pt-1 hover:underline"
            >
              support@kishankart.in
            </a>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-2xs space-y-2">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <MessageSquare className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-gray-900">Mandi Cluster Office</h4>
            <p className="text-xs text-gray-500">Physical Helpdesk Gate 2</p>
            <span className="font-bold text-emerald-800 text-xs block pt-1">
              Bakshi Ka Talab APMC
            </span>
          </div>
        </div>

        {/* FAQs Section */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200/90 shadow-2xs space-y-4">
          <h3 className="text-base font-bold text-gray-900">Frequently Asked Questions</h3>

          <div className="divide-y divide-gray-100">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;

              return (
                <div key={idx} className="py-3">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left font-bold text-xs text-gray-900 py-1"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-gray-400 transition-transform ${
                        isOpen ? 'rotate-180 text-[#994200]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <p className="text-xs text-gray-600 mt-2 leading-relaxed font-medium">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Support Ticket Form */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200/90 shadow-2xs space-y-4">
          <h3 className="text-base font-bold text-gray-900">Submit a Help Request or Order Dispute</h3>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Issue Subject</label>
              <input
                type="text"
                required
                placeholder="e.g. Weighbridge receipt mismatch on Order #KK-8421"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 font-semibold border border-gray-200 rounded-xl focus:outline-none focus:border-[#994200]"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Describe Details</label>
              <textarea
                rows={4}
                required
                placeholder="Explain the issue with order ID, date, or vehicle number..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 font-semibold border border-gray-200 rounded-xl focus:outline-none focus:border-[#994200]"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              {submitted ? (
                <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> Ticket #TK-9921 submitted! An agent will call you.
                </span>
              ) : <div />}

              <Button
                type="submit"
                className="bg-[#994200] hover:bg-[#7A3400] text-white text-xs font-bold rounded-xl"
              >
                <Send className="h-3.5 w-3.5 mr-1.5" />
                Submit Request
              </Button>
            </div>
          </form>
        </div>
      </div>
    </FarmerLayout>
  );
}
