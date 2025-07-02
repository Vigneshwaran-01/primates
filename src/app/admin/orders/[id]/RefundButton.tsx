"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RefundButton({ orderId }: { orderId: number }) {
  const [processing, setProcessing] = useState(false);
  const router = useRouter();

  const handleProcessRefund = async () => {
    setProcessing(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/process-refund`, { method: "POST" });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to process refund.");
      }
    } catch (e) {
      alert("Error processing refund.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <button
      className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
      disabled={processing}
      onClick={handleProcessRefund}
    >
      {processing ? "Processing..." : "Process Refund"}
    </button>
  );
} 