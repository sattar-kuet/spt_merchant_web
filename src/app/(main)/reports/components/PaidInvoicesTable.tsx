"use client";

import { Fragment, useState } from "react";
import {
  useTransactionsData,
  useTransactionDetails,
  type TransactionBill,
} from "@/hooks/useTransactionsData";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
  Receipt,
  CalendarDays,
  ChevronDown,
  Package,
  AlertTriangle,
} from "lucide-react";

const StatTile = ({
  label,
  value,
  emphasis = false,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) => (
  <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-tight">{label}</p>
    <p className={cn("text-base font-bold tabular-nums", emphasis ? "text-primary" : "text-slate-800")}>
      {value}
    </p>
  </div>
);

const InvoiceDetails = ({ billId }: { billId: number }) => {
  const { bill, breakdown, loading, error } = useTransactionDetails(billId);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center gap-2 text-sm text-slate-500">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
        Loading breakdown...
      </div>
    );
  }

  if (error) {
    return <p className="p-4 text-sm text-red-600">{error}</p>;
  }

  if (!bill) return null;

  return (
    <div className="p-4 sm:p-5 bg-gradient-to-br from-slate-50 to-violet-50/30 border-t border-slate-200">
      <div className="grid grid-cols-3 gap-3 mb-4">
        <StatTile label="COD Collected" value={`৳${bill.cod_collected.toLocaleString()}`} />
        <StatTile label="Charges" value={`৳${bill.charge.toLocaleString()}`} />
        <StatTile label="Net Paid" value={`৳${bill.net_amount.toLocaleString()}`} emphasis />
      </div>

      {bill.adjustment !== 0 && (
        <div className="mb-4 flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
          <AlertTriangle size={15} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">
              ৳{Math.abs(bill.adjustment).toLocaleString()}{" "}
              {bill.adjustment > 0 ? "added to" : "deducted from"} this settlement, not
              attributable to a single parcel below.
            </p>
            {bill.notes.map((note, i) => (
              <p key={i} className="mt-1 text-amber-700">{note}</p>
            ))}
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] text-slate-500 bg-slate-50 uppercase tracking-tight">
              <th className="py-2.5 px-3">Parcel</th>
              <th className="py-2.5 px-3">COD Collected</th>
              <th className="py-2.5 px-3">Charges</th>
              <th className="py-2.5 px-3 text-right">Net Amount</th>
            </tr>
          </thead>
          <tbody>
            {breakdown.length > 0 ? (
              breakdown.map((row) => (
                <tr key={row.parcel.id} className="border-t border-slate-100">
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2 font-medium text-slate-700">
                      <Package size={13} className="text-slate-400" />
                      {row.parcel.name}
                    </div>
                  </td>
                  <td className="py-2.5 px-3 tabular-nums text-slate-600">৳{row.cod_collected.toLocaleString()}</td>
                  <td className="py-2.5 px-3">
                    <div className="tabular-nums text-slate-600">৳{row.total_charges.toLocaleString()}</div>
                    {row.charges.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {row.charges.map((c) => (
                          <span
                            key={c.id}
                            className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500"
                          >
                            {c.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-right font-semibold tabular-nums text-slate-800">
                    ৳{row.net_amount.toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-6 text-center text-slate-500">
                  No parcels linked to this invoice.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const PaidInvoicesTable = () => {
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const { bills, hasMore, loading, error } = useTransactionsData(page, 10);

  const toggleExpand = (bill: TransactionBill) => {
    setExpandedId((current) => (current === bill.id ? null : bill.id));
  };

  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-slate-500">Loading paid invoices...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  const totalPaidThisPage = bills.reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
      {bills.length > 0 && (
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 bg-gradient-to-r from-violet-50/60 to-fuchsia-50/40 border-b border-slate-100">
          <p className="text-xs text-slate-500">
            <span className="font-semibold text-slate-700">{bills.length}</span> invoice
            {bills.length !== 1 ? "s" : ""} on this page
          </p>
          <p className="text-sm">
            <span className="text-xs text-slate-500 mr-1">Total paid:</span>
            <span className="font-bold text-primary tabular-nums">
              ৳{totalPaidThisPage.toLocaleString()}
            </span>
          </p>
        </div>
      )}

      <table className="w-full text-sm">
        <thead className="bg-slate-50">
          <tr className="text-left text-[11px] text-slate-500 uppercase tracking-tight">
            <th className="p-4">Invoice</th>
            <th className="p-4">Date</th>
            <th className="p-4 text-right">Amount Paid</th>
            <th className="p-4 w-10"></th>
          </tr>
        </thead>
        <tbody>
          {bills.length > 0 ? (
            bills.map((bill) => {
              const isOpen = expandedId === bill.id;
              return (
                <Fragment key={bill.id}>
                  <tr
                    className={cn(
                      "border-t cursor-pointer transition-colors",
                      isOpen ? "bg-violet-50/40" : "hover:bg-slate-50"
                    )}
                    onClick={() => toggleExpand(bill)}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center shrink-0">
                          <Receipt size={15} />
                        </div>
                        <span className="font-medium text-slate-800">{bill.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <CalendarDays size={13} className="text-slate-400" />
                        {bill.date ?? "-"}
                      </div>
                    </td>
                    <td className="p-4 text-right font-semibold text-primary tabular-nums">
                      ৳{bill.amount.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <ChevronDown
                        size={16}
                        className={cn(
                          "text-slate-400 transition-transform mx-auto",
                          isOpen && "rotate-180 text-primary"
                        )}
                      />
                    </td>
                  </tr>
                  {isOpen && (
                    <tr>
                      <td colSpan={4} className="p-0">
                        <InvoiceDetails billId={bill.id} />
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })
          ) : (
            <tr>
              <td colSpan={4} className="p-10 text-center text-slate-500">
                <Receipt size={28} className="mx-auto mb-2 text-slate-300" />
                No paid invoices yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {(page > 1 || hasMore) && (
        <div className="flex items-center justify-between p-4 border-t border-slate-100 text-sm text-slate-600">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <span className="text-slate-500">Page {page}</span>
          <Button
            variant="outline"
            size="sm"
            disabled={!hasMore}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default PaidInvoicesTable;
