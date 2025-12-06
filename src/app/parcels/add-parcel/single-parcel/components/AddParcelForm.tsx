"use client";

import React, { useState } from "react";
import AddHeader from "./AddHeader";
import CustomerInformation from "./CustomerInformation";
import ParcelDetails from "./ParcelDetails";
import FinancialInfo from "./FinancialInfo";
import OrderSummary from "./OrderSummary";

const AddParcelForm: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [weight, setWeight] = useState("");
  const [parcelType, setParcelType] = useState("");
  const [codAmount, setCodAmount] = useState("");

  const codNumber = parseFloat(codAmount) || 0;

  return (
    <div className="p-12 w-full">
      <AddHeader />

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
          <CustomerInformation
            fullName={fullName}
            setFullName={setFullName}
            phone={phone}
            setPhone={setPhone}
            address={address}
            setAddress={setAddress}
          />

          <ParcelDetails
            weight={weight}
            setWeight={setWeight}
            parcelType={parcelType}
            setParcelType={setParcelType}
          />

          <FinancialInfo codAmount={codAmount} setCodAmount={setCodAmount} />
        </div>

        <div className="lg:col-span-1">
          <OrderSummary codAmount={codNumber} />
        </div>
      </div>
    </div>
  );
};

export default AddParcelForm;
