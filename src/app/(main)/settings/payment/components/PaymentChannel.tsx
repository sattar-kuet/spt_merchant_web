"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '@/hooks/useAxiosSecure';
import PaymentDropdown from './PaymentDropdown';
import MobileInput from './MobileInput';
import BankInput from './BankInput';

type PaymentMethod = {
  id?: number;
  name: string;
  provider: string;
};

type BankDetails = {
  accountHolderName: string;
  branch: string;
  accountNumber: string;
  routingNumber: string;
};

type Props = {
  bankDetails: BankDetails;
  setBankDetails: React.Dispatch<React.SetStateAction<BankDetails>>;
  mobileNumber: string | undefined;
  setMobileNumber: React.Dispatch<React.SetStateAction<string | undefined>>;
  seletedPaymentMethod: PaymentMethod | null;
  setSeletedPaymentMethod: React.Dispatch<React.SetStateAction<PaymentMethod | null>>;
};

export default function PaymentChannel({
  bankDetails,
  setBankDetails,
  mobileNumber,
  setMobileNumber,
  seletedPaymentMethod,
  setSeletedPaymentMethod,
}: Props) {
    const axiosSecure = useAxiosSecure();

  const { data: providersData } = useQuery({
    queryKey: ['payment-providers'],
    queryFn: async () => {
      try {
        const resp = await axiosSecure.get('/payment-providers');
        return resp.data as { success: boolean; providers: any[] };
      } catch (e) {
        return { success: false, providers: [] } as any;
      }
    },
  });

  const paymentMethods: PaymentMethod[] = React.useMemo(() => {
    const list = providersData?.providers ?? [];
    return list
      .filter((p: any) => p?.active)
      .map((p: any) => ({
        id: p.id,
        name: String(p.name).charAt(0).toUpperCase() + String(p.name).slice(1),
        provider: p.provider_type ?? p.provider ?? 'unknown',
      }));
  }, [providersData]);

  return (
    <div className="mt-4">
      <div className="mt-3">
        <PaymentDropdown
          seletedPaymentMethod={seletedPaymentMethod}
          setSeletedPaymentMethod={setSeletedPaymentMethod}
          filteredMethods={paymentMethods}
        />
      </div>

      <div>
        <MobileInput
          seletedPaymentMethod={seletedPaymentMethod}
          mobileNumber={mobileNumber}
          setMobileNumber={setMobileNumber}
        />

        <BankInput
          seletedPaymentMethod={seletedPaymentMethod}
          bankDetails={bankDetails}
          setBankDetails={setBankDetails}
        />
      </div>
    </div>
  );
}
