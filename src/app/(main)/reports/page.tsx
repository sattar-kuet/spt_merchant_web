import PaidInvoicesTable from "./components/PaidInvoicesTable";

const ReportsPage = () => {
  return (
    <div className="p-4 sm:p-5 w-full">
      <div>
        <p className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
          Invoices
        </p>
        <p className="text-sm text-slate-500 mt-1">
          Invoices that have been paid to you, with a per-parcel breakdown.
        </p>
      </div>

      <div className="mt-4 sm:mt-6">
        <PaidInvoicesTable />
      </div>
    </div>
  );
};

export default ReportsPage;