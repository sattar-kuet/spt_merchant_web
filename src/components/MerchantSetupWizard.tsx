"use client";

import { useEffect, useMemo, useState } from "react";
import { MapPin, Wallet } from "lucide-react";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import usePickupPointData from "@/hooks/usePickupPointData";
import useParcelOptions from "@/hooks/useParcelOptions";
import PaymentChannel from "@/app/(main)/settings/payment/components/PaymentChannel";
import { Button } from "@/components/ui/Button";

type PaymentMethod = { id?: number; name: string; provider: string };

/**
 * Mandatory onboarding shown after a merchant's first login/registration:
 * one pickup point and one payment channel, both required before the app
 * unlocks. No dismiss/skip - if left incomplete, the same wizard reappears
 * on every subsequent login (see auth.py's _merchant_setup_complete, which
 * the backend recomputes from whether these records exist rather than a
 * one-shot flag, so re-login always reflects the true state). Resumes at
 * whichever step is still missing rather than restarting from scratch.
 */
export function MerchantSetupWizard() {
  const { user, markSetupComplete } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { pickupPoints, pickupPointsQuery, createPickupPoint } = usePickupPointData();

  const channelsQuery = useQuery({
    queryKey: ["payment-channels"],
    queryFn: async () => {
      const resp = await axiosSecure.get("/payment-channels");
      return (resp.data?.channels ?? []) as any[];
    },
    enabled: !!user && !user.force_password_change && !user.setup_complete,
  });

  const [step, setStep] = useState<1 | 2>(1);
  const [initialized, setInitialized] = useState(false);

  const hasPickup = (pickupPoints?.length ?? 0) > 0;
  const hasChannel = (channelsQuery.data?.length ?? 0) > 0;

  // Resume at whichever step is still missing, once we know.
  useEffect(() => {
    if (initialized) return;
    if (pickupPointsQuery.isLoading || channelsQuery.isLoading) return;
    setStep(hasPickup ? 2 : 1);
    setInitialized(true);
  }, [initialized, pickupPointsQuery.isLoading, channelsQuery.isLoading, hasPickup]);

  // If both turn out already present (e.g. completed in another tab),
  // unblock immediately instead of showing a step.
  useEffect(() => {
    if (initialized && hasPickup && hasChannel) {
      markSetupComplete();
    }
  }, [initialized, hasPickup, hasChannel, markSetupComplete]);

  const isOpen = !!user && !user.force_password_change && !user.setup_complete;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const loadingInitialData = !initialized;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center gap-2 mb-1">
          <StepDot active={step === 1} done={hasPickup} label="1" />
          <div className="flex-1 h-0.5 bg-slate-200" />
          <StepDot active={step === 2} done={hasChannel} label="2" />
        </div>

        {loadingInitialData ? (
          <div className="py-16 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : step === 1 ? (
          <PickupStep
            onCreated={() => {
              if (hasChannel) {
                markSetupComplete();
              } else {
                setStep(2);
              }
            }}
            createPickupPoint={createPickupPoint}
          />
        ) : (
          <PaymentStep
            axiosSecure={axiosSecure}
            onCreated={markSetupComplete}
          />
        )}
      </div>
    </div>
  );
}

function StepDot({ active, done, label }: { active: boolean; done: boolean; label: string }) {
  return (
    <div
      className={
        "w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-xs font-bold " +
        (done
          ? "bg-emerald-500 text-white"
          : active
          ? "bg-primary text-white"
          : "bg-slate-200 text-slate-500")
      }
    >
      {done ? "✓" : label}
    </div>
  );
}

function PickupStep({
  onCreated,
  createPickupPoint,
}: {
  onCreated: () => void;
  createPickupPoint: ReturnType<typeof usePickupPointData>["createPickupPoint"];
}) {
  const [form, setForm] = useState({
    name: "",
    address: "",
    contact_name: "",
    phone: "",
    city_id: "",
    district_id: "",
  });
  const { districts = [], cities = [] } = useParcelOptions(form.district_id as any);

  function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    if (name === "district_id") {
      setForm((s) => ({ ...s, district_id: value, city_id: "" }));
    } else {
      setForm((s) => ({ ...s, [name]: value }));
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      ...form,
      city_id: form.city_id ? Number(form.city_id) : undefined,
      district_id: form.district_id ? Number(form.district_id) : undefined,
      active: true,
    };
    createPickupPoint.mutate(payload, {
      onSuccess: () => {
        Swal.fire({
          icon: "success",
          title: "Pickup point saved",
          toast: true,
          position: "top-end",
          timer: 1400,
          showConfirmButton: false,
        });
        onCreated();
      },
      onError: (err: any) => {
        Swal.fire({ icon: "error", title: "Failed", text: err?.message || "Failed to create pickup point" });
      },
    });
  }

  return (
    <>
      <div className="flex flex-col items-center text-center mb-4 mt-2">
        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
          <MapPin size={22} />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Add your pickup point</h2>
        <p className="text-sm text-slate-500 mt-1">
          Where should riders collect parcels from you?
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="block text-sm text-slate-600">Name</label>
          <input name="name" value={form.name} onChange={onChange} className="mt-1 w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm text-slate-600">Address</label>
          <input name="address" value={form.address} onChange={onChange} className="mt-1 w-full border rounded px-3 py-2" required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-slate-600">Contact Name</label>
            <input name="contact_name" value={form.contact_name} onChange={onChange} className="mt-1 w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm text-slate-600">Phone</label>
            <input name="phone" value={form.phone} onChange={onChange} className="mt-1 w-full border rounded px-3 py-2" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-slate-600">District</label>
            <select name="district_id" value={form.district_id} onChange={onChange} className="mt-1 w-full border rounded px-3 py-2">
              <option value="">Select district</option>
              {districts.map((d: any) => {
                const id = d.id ?? d.district_id ?? d._id ?? d.value;
                const label = d.name ?? d.title ?? d.district_name ?? d.label ?? String(id);
                return (
                  <option key={id} value={String(id)}>
                    {label}
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <label className="block text-sm text-slate-600">City</label>
            <select name="city_id" value={form.city_id} onChange={onChange} className="mt-1 w-full border rounded px-3 py-2" disabled={!form.district_id}>
              <option value="">Select city</option>
              {cities.map((c: any) => {
                const id = c.id ?? c.city_id ?? c._id ?? c.value;
                const label = c.name ?? c.title ?? c.city_name ?? c.label ?? String(id);
                return (
                  <option key={id} value={String(id)}>
                    {label}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <Button type="submit" className="w-full mt-2" disabled={createPickupPoint.isPending}>
          {createPickupPoint.isPending ? "Saving..." : "Save & Continue"}
        </Button>
      </form>
    </>
  );
}

function PaymentStep({
  axiosSecure,
  onCreated,
}: {
  axiosSecure: ReturnType<typeof useAxiosSecure>;
  onCreated: () => void;
}) {
  const [mobileNumber, setMobileNumber] = useState<string | undefined>(undefined);
  const [bankDetails, setBankDetails] = useState({
    accountHolderName: "",
    branch: "",
    accountNumber: "",
    routingNumber: "",
  });
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [saving, setSaving] = useState(false);

  const provider = String(selectedPaymentMethod?.provider ?? "").toLowerCase();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedPaymentMethod?.id) {
      Swal.fire({ icon: "warning", title: "Choose a payment method first" });
      return;
    }

    let payload: any = { provider_id: selectedPaymentMethod.id, active: true };
    if (provider.includes("bank")) {
      payload = {
        ...payload,
        account_name: bankDetails.accountHolderName || undefined,
        account_number: bankDetails.accountNumber || undefined,
        branch: bankDetails.branch || undefined,
        routing_no: bankDetails.routingNumber || undefined,
      };
    } else {
      payload = { ...payload, wallet_number: mobileNumber || undefined };
    }

    setSaving(true);
    try {
      const resp = await axiosSecure.post("/payment-channels", payload);
      if (!resp.data?.success) {
        throw new Error(resp.data?.message || "Failed to create payment channel");
      }
      Swal.fire({
        icon: "success",
        title: "Payment channel saved",
        toast: true,
        position: "top-end",
        timer: 1400,
        showConfirmButton: false,
      });
      onCreated();
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: err?.response?.data?.message || err?.message || "Failed to create payment channel",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="flex flex-col items-center text-center mb-4 mt-2">
        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
          <Wallet size={22} />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Add a payment channel</h2>
        <p className="text-sm text-slate-500 mt-1">
          Where should we send your parcel payouts?
        </p>
      </div>

      <form onSubmit={onSubmit}>
        <PaymentChannel
          bankDetails={bankDetails}
          setBankDetails={setBankDetails}
          mobileNumber={mobileNumber}
          setMobileNumber={setMobileNumber}
          seletedPaymentMethod={selectedPaymentMethod}
          setSeletedPaymentMethod={setSelectedPaymentMethod}
        />

        <Button type="submit" className="w-full mt-4" disabled={saving}>
          {saving ? "Saving..." : "Save & Finish"}
        </Button>
      </form>
    </>
  );
}
