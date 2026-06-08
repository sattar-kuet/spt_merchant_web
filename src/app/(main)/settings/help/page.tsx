"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FiChevronDown,
  FiChevronUp,
  FiPackage,
  FiDollarSign,
  FiMapPin,
  FiCreditCard,
  FiMail,
  FiPhone,
  FiMessageCircle,
  FiPlayCircle,
  FiExternalLink,
  FiSearch,
  FiHelpCircle,
  FiBookOpen,
  FiHeadphones,
} from "react-icons/fi";

/* ─── FAQ Data ─── */
const faqCategories = [
  {
    title: "Getting Started",
    icon: <FiBookOpen size={18} />,
    items: [
      {
        q: "How do I create my first parcel?",
        a: 'Navigate to "All Parcels" from the sidebar and click the "Create Parcel" button. Fill in the recipient details, parcel type, weight, and delivery address. The system will automatically calculate the delivery fee for you.',
      },
      {
        q: "How does the fee calculation work?",
        a: "Fees are calculated based on parcel type, total weight, delivery speed, and the destination city/district. You can see a live fee breakdown while creating a parcel. COD (Cash on Delivery) charges are applied separately if applicable.",
      },
      {
        q: "What parcel types are supported?",
        a: "We support various parcel types including documents, small parcels, medium boxes, and large packages. Each type has different weight limits and pricing tiers. Select the appropriate type during parcel creation for accurate pricing.",
      },
    ],
  },
  {
    title: "Pickup & Delivery",
    icon: <FiMapPin size={18} />,
    items: [
      {
        q: "How do I set up a pickup point?",
        a: 'Go to Settings → Pick Up Point. Click "Add New Address" to register your shop or warehouse location. Our riders will collect parcels from these addresses.',
      },
      {
        q: "Can I have multiple pickup locations?",
        a: "Yes! You can add as many pickup points as you need. This is useful if you operate from multiple warehouses or shop locations. Each parcel can be assigned to a specific pickup point.",
      },
      {
        q: "How do I track my parcel status?",
        a: 'All your parcels and their current statuses are visible on the "All Parcels" page. You can filter by status (pending, in-transit, delivered, returned) and search by tracking ID or recipient name.',
      },
      {
        q: "What happens if a delivery fails?",
        a: "If delivery fails, the parcel will be marked for return. Our team will attempt re-delivery or return it to your registered pickup point. You can check the parcel details page for the latest status and any delivery notes.",
      },
    ],
  },
  {
    title: "Payments & Billing",
    icon: <FiCreditCard size={18} />,
    items: [
      {
        q: "How do I receive my COD payments?",
        a: "COD payments are settled to your configured payment channel. Go to Settings → Payment Information to set up your preferred mobile wallet (bKash, Nagad, etc.) or bank account for automatic settlements.",
      },
      {
        q: "When will I receive my payments?",
        a: "Payments are processed based on a settlement cycle. You can view your earnings, pending amounts, and payment history from the Dashboard and Reports sections.",
      },
      {
        q: "How do I add or change my payment method?",
        a: 'Navigate to Settings → Payment Information. Click "Add New" to register a new mobile wallet or bank account. You can have multiple payment channels and set any as active.',
      },
    ],
  },
  {
    title: "Account & Settings",
    icon: <FiHelpCircle size={18} />,
    items: [
      {
        q: "How do I update my profile?",
        a: "Go to Settings → Profile to view and update your account information. You can see your registered name, email, user ID, and group memberships.",
      },
      {
        q: "Can I use the dashboard on mobile?",
        a: "Yes! The merchant dashboard is fully responsive and works on smartphones and tablets. Access it through your mobile browser for on-the-go parcel management.",
      },
      {
        q: "How do I view reports and analytics?",
        a: 'Click on "Reports" in the sidebar to access detailed analytics about your deliveries, earnings, and performance metrics. You can filter data by date range and export reports.',
      },
    ],
  },
];

/* ─── Quick Action Links ─── */
const quickActions = [
  {
    title: "Create a Parcel",
    description: "Start shipping by creating your first parcel order",
    icon: <FiPackage size={22} />,
    href: "/parcels",
    gradient: "from-blue-500 to-indigo-600",
    bgLight: "bg-blue-50",
    textColor: "text-blue-600",
  },
  {
    title: "Fee Calculator",
    description: "Estimate delivery charges before creating a parcel",
    icon: <FiDollarSign size={22} />,
    href: "/parcels",
    gradient: "from-emerald-500 to-teal-600",
    bgLight: "bg-emerald-50",
    textColor: "text-emerald-600",
  },
  {
    title: "Pickup Points",
    description: "Add or manage your parcel collection locations",
    icon: <FiMapPin size={22} />,
    href: "/settings/pickup",
    gradient: "from-orange-500 to-amber-600",
    bgLight: "bg-orange-50",
    textColor: "text-orange-600",
  },
  {
    title: "Payment Setup",
    description: "Configure your payment channels for COD settlements",
    icon: <FiCreditCard size={22} />,
    href: "/settings/payment",
    gradient: "from-purple-500 to-violet-600",
    bgLight: "bg-purple-50",
    textColor: "text-purple-600",
  },
];

/* ─── Accordion Item ─── */
function AccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`border rounded-xl transition-all duration-200 ${
        isOpen
          ? "border-primary/20 bg-primary/[0.02] shadow-sm"
          : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left cursor-pointer group"
        aria-expanded={isOpen}
      >
        <span
          className={`text-sm font-medium pr-4 transition-colors ${
            isOpen ? "text-primary" : "text-slate-700 group-hover:text-slate-900"
          }`}
        >
          {question}
        </span>
        <span
          className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${
            isOpen
              ? "bg-primary text-white rotate-0"
              : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
          }`}
        >
          {isOpen ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="px-4 pb-4 text-sm text-slate-600 leading-relaxed">
          {answer}
        </p>
      </div>
    </div>
  );
}

/* ─── Main Help Page ─── */
export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Filter FAQ items based on search
  const filteredCategories = faqCategories
    .map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (item) =>
          !searchQuery ||
          item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.a.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((cat) => cat.items.length > 0);

  return (
    <div className="p-4 sm:p-6 w-full">
      {/* ── Header ── */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white shadow-md shadow-primary/20">
            <FiHeadphones size={20} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">
              Help & Support
            </h1>
            <p className="text-sm text-slate-500">
              Find answers, learn how to use the platform, or contact us.
            </p>
          </div>
        </div>
      </div>

      {/* ── Search Bar ── */}
      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <FiSearch className="text-slate-400" size={18} />
        </div>
        <input
          id="help-search"
          type="text"
          placeholder="Search for help topics, e.g. &quot;parcel&quot;, &quot;payment&quot;, &quot;pickup&quot;..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all shadow-sm"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>

      {/* ── Quick Actions ── */}
      {!searchQuery && (
        <div className="mb-10">
          <h2 className="text-base font-semibold text-slate-800 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                href={action.href}
                className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:shadow-lg hover:border-slate-300 hover:-translate-y-0.5"
              >
                <div
                  className={`w-11 h-11 rounded-xl ${action.bgLight} ${action.textColor} flex items-center justify-center mb-3.5 transition-transform duration-200 group-hover:scale-110`}
                >
                  {action.icon}
                </div>
                <h3 className="text-sm font-semibold text-slate-800 mb-1 group-hover:text-primary transition-colors">
                  {action.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {action.description}
                </p>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400">
                  <FiExternalLink size={14} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── FAQ Sections ── */}
      <div className="mb-10">
        <h2 className="text-base font-semibold text-slate-800 mb-4">
          {searchQuery
            ? `Search results for "${searchQuery}"`
            : "Frequently Asked Questions"}
        </h2>

        {filteredCategories.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <FiSearch className="text-slate-400" size={22} />
            </div>
            <p className="text-sm font-medium text-slate-700 mb-1">
              No results found
            </p>
            <p className="text-xs text-slate-500">
              Try a different search term or browse the categories below.
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-4 text-sm text-primary hover:underline cursor-pointer"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredCategories.map((category) => (
              <div key={category.title}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-primary">{category.icon}</span>
                  <h3 className="text-sm font-semibold text-slate-700">
                    {category.title}
                  </h3>
                  <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                    {category.items.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {category.items.map((item, idx) => {
                    const key = `${category.title}-${idx}`;
                    return (
                      <AccordionItem
                        key={key}
                        question={item.q}
                        answer={item.a}
                        isOpen={!!openItems[key]}
                        onToggle={() => toggleItem(key)}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Video Tutorial + Contact Support ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        {/* Video Tutorial Card */}
        <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white">
          {/* Decorative circles */}
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/5" />
          <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-white/5" />

          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-4">
              <FiPlayCircle size={24} className="text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Video Tutorials</h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-5">
              Watch step-by-step video guides on how to create parcels, manage
              deliveries, and make the most of your merchant dashboard.
            </p>
            <a
              href="https://www.youtube.com/@SPTCourier"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white text-slate-900 text-sm font-medium hover:bg-slate-100 transition-colors"
            >
              <FiPlayCircle size={16} />
              Watch Tutorials
              <FiExternalLink size={13} className="ml-1 opacity-60" />
            </a>
          </div>
        </div>

        {/* Contact Support Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
            <FiMessageCircle size={22} className="text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Contact Support
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed mb-5">
            Can&apos;t find what you&apos;re looking for? Our support team is here to
            help you with any questions or issues.
          </p>

          <div className="space-y-3">
            <a
              href="tel:+8809613024365"
              className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all group"
            >
              <div className="w-9 h-9 rounded-lg bg-green-50 text-green-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <FiPhone size={16} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">Call Us</p>
                <p className="text-xs text-slate-500">+880 9613-024365</p>
              </div>
            </a>

            <a
              href="mailto:support@sptcourier.com"
              className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all group"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <FiMail size={16} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">Email</p>
                <p className="text-xs text-slate-500">
                  support@sptcourier.com
                </p>
              </div>
            </a>

            <a
              href="https://wa.me/8809613024365"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all group"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <FiMessageCircle size={16} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">WhatsApp</p>
                <p className="text-xs text-slate-500">Chat with us</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
