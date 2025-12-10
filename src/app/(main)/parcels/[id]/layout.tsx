import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Detail | Merchant Dashboard",
  description: "View detailed information about a specific order",
};

export default function OrderDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}