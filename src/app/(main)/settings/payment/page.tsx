"use client";

import React, { useState } from 'react';
import PaymentChannel from './components/PaymentChannel';
import Swal from 'sweetalert2';
import useAxiosSecure from '@/hooks/useAxiosSecure';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function PaymentPage() {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [mobileNumber, setMobileNumber] = useState<string | undefined>(undefined);
  const [bankDetails, setBankDetails] = useState({
    accountHolderName: '',
    branch: '',
    accountNumber: '',
    routingNumber: '',
  });
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<any | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // fetch existing payment channels to show at top
  const { data: channelsData, isLoading: channelsLoading } = useQuery({
    queryKey: ['payment-channels'],
    queryFn: async () => {
      try {
        const resp = await axiosSecure.get('/payment-channels');
        return resp.data as { success: boolean; channels: any[] };
      } catch (e) {
        return { success: false, channels: [] } as any;
      }
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      const resp = await axiosSecure.post('/payment-channels', payload);
      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-channels'] });
    },
  });

  const onSave = async () => {
    // build provider-specific payloads expected by backend
    let payload: any = {};
    const provider = String(selectedPaymentMethod?.provider ?? '').toLowerCase();
    const providerId = selectedPaymentMethod?.id ?? null;

    if (provider.includes('bank')) {
      payload = {
        provider_id: providerId,
        account_name: bankDetails.accountHolderName || undefined,
        account_number: bankDetails.accountNumber || undefined,
        branch: bankDetails.branch || undefined,
        routing_no: bankDetails.routingNumber || undefined,
        active: true,
      };
    } else if (provider.includes('mobile')) {
      payload = {
        provider_id: providerId,
        wallet_number: mobileNumber || undefined,
        active: true,
      };
    } else {
      // fallback: generic payload
      payload = {
        provider_id: providerId,
        method: selectedPaymentMethod?.name ?? null,
        provider: selectedPaymentMethod?.provider ?? null,
        mobile: mobileNumber ?? null,
        bank: bankDetails,
        active: true,
      };
    }

    if (showAddForm) {
      try {
        await createMutation.mutateAsync(payload);
        Swal.fire({
          icon: 'success',
          title: 'Created',
          text: 'Payment channel created',
          toast: true,
          position: 'top-end',
          timer: 1500,
          showConfirmButton: false,
        });
        // reset form
        setShowAddForm(false);
        setSelectedPaymentMethod(null);
        setMobileNumber(undefined);
        setBankDetails({ accountHolderName: '', branch: '', accountNumber: '', routingNumber: '' });
      } catch (err: any) {
        console.error('Create payment channel failed', err);
        Swal.fire({ icon: 'error', title: 'Failed', text: err?.message || 'Failed to create payment channel' });
      }
    } else {
      // No-op: currently nothing to save when not adding a new channel
      Swal.fire({ icon: 'info', title: 'Note', text: 'Toggle "Add New Payment Channel" to create a channel.' });
    }
  };

  const channels = channelsData?.channels ?? [];
  console.log(channels);

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Payment Information</h1>

        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-medium mb-3">Saved Payment Channels</h3>
            {channelsLoading ? (
              <div className="text-sm text-slate-500">Loading...</div>
            ) : channels.length ? (
              <div className="grid grid-cols-1 gap-3">
                {channels.map((c: any) => {
                  const key = c.id ?? c.provider_id ?? c._id ?? JSON.stringify(c);
                  const title = c.provider_name ?? c.method ?? c.name ?? c.provider ?? 'Unknown';
                  const providerLabel = c.provider ?? c.provider_name ?? '';
                  const mobileNumber = c.wallet_number ?? c.mobile ?? c.wallet ?? null;
                  const bankObj = c.bank ?? (c.account_number || c.account_name ? {
                    accountNumber: c.account_number ?? c.accountNumber,
                    accountName: c.account_name ?? c.accountName,
                    branch: c.branch,
                    routingNo: c.routing_no ?? c.routingNo,
                  } : null);

                  return (
                    <div key={key} className="border rounded p-3 flex justify-between items-center">
                      <div>
                        <div className="font-medium">{title}</div>
                        {providerLabel && <div className="text-sm text-slate-500">{providerLabel}</div>}
                        {mobileNumber && <div className="text-sm mt-1">{mobileNumber}</div>}
                        {bankObj && (
                          <div className="text-sm mt-1">{bankObj.accountNumber ? `...${String(bankObj.accountNumber).slice(-4)}` : ''}</div>
                        )}
                      </div>
                      <div className="text-sm text-slate-500">{c.active ? 'Active' : 'Inactive'}</div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-sm text-slate-500">No saved payment channels</div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Add New Payment Channel</h3>
              <button onClick={() => setShowAddForm((s) => !s)} className="text-sm text-primary hover:underline">
                {showAddForm ? 'Cancel' : 'Add New'}
              </button>
            </div>

            {showAddForm && (
              <div className="mt-4">
                <p className="text-sm text-slate-600 mb-3">Choose a provider and fill the required details below.</p>

                <PaymentChannel
                  bankDetails={bankDetails}
                  setBankDetails={setBankDetails}
                  mobileNumber={mobileNumber}
                  setMobileNumber={setMobileNumber}
                  seletedPaymentMethod={selectedPaymentMethod}
                  setSeletedPaymentMethod={setSelectedPaymentMethod}
                />

                <div className="mt-6 flex justify-end">
                  <button onClick={onSave} disabled={createMutation.isPending} className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary/90 transition-colors">
                    {createMutation.isPending ? 'Saving...' : 'Save Channel'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
