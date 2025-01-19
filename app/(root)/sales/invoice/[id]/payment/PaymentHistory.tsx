import React, { useEffect, useState } from "react";
import { getPayments } from "@/lib/actions/payment.action";
import { format } from "date-fns";
import "../invoice.css";

interface Payment {
  _id: string;
  referenceNo: string;
  customer: any;
  creditAmount: number;
  paymentDate: string;
  description?: string;
  paidAmount: number;
  balance: number;
  paidBy: "Cash" | "ABA Bank" | "ACLEDA Bank" | "Others";
  paymentStatus: "pending" | "credit" | "completed";
}

interface PaymentHistoryProps {
  invoiceId: string;
  onClose: () => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("km-KH", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace(/\./g, ","); // Replace dot with comma
};

const PaymentHistory: React.FC<PaymentHistoryProps> = ({
  invoiceId,
  onClose,
}) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const { data, success, error } = await getPayments({
          sale: invoiceId,
          page: 1,
          pageSize: 10,
          query: "",
          filter: "",
        });
        if (success) {
          if (data && data.payment) {
            setPayments(
              data.payment.map((payment: any) => ({
                ...payment,
                paymentDate: new Date(payment.paymentDate).toISOString(),
              }))
            );
          } else {
            setError("No payment data found");
          }
        } else {
          setError(error ? error.message : "An unknown error occurred");
        }
      } catch (err) {
        console.log(err);
        setError("Failed to fetch payments");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [invoiceId]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-3/4 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-2xl text-gray-500 hover:text-gray-700"
          aria-label="Close modal"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-6">Payment History</h2>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="loader">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border-collapse border border-gray-200 rounded-md shadow-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-4 border-b border-gray-200 text-left font-medium text-gray-600 uppercase">
                    Ref
                  </th>
                  <th className="py-3 px-4 border-b border-gray-200 text-left font-medium text-gray-600 uppercase">
                    Customer
                  </th>
                  <th className="py-3 px-4 border-b border-gray-200 text-left font-medium text-gray-600 uppercase">
                    Payment Date
                  </th>
                  <th className="py-3 px-4 border-b border-gray-200 text-left font-medium text-gray-600 uppercase">
                    Credit Amount
                  </th>
                  <th className="py-3 px-4 border-b border-gray-200 text-left font-medium text-gray-600 uppercase">
                    Paid Amount
                  </th>
                  <th className="py-3 px-4 border-b border-gray-200 text-left font-medium text-gray-600 uppercase">
                    Balance
                  </th>
                  <th className="py-3 px-4 border-b border-gray-200 text-left font-medium text-gray-600 uppercase">
                    Description
                  </th>
                  <th className="py-3 px-4 border-b border-gray-200 text-left font-medium text-gray-600 uppercase">
                    Paid By
                  </th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-3 px-4 text-center text-gray-700"
                    >
                      No data available
                    </td>
                  </tr>
                ) : (
                  payments.map((payment, index) => (
                    <tr
                      key={payment._id}
                      className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition duration-150`}
                    >
                      <td className="py-3 px-4 border-b border-gray-200 text-gray-700">
                        {payment.referenceNo}
                      </td>
                      <td className="py-3 px-4 border-b border-gray-200 text-gray-700">
                        {payment.customer?.name || "N/A"}
                      </td>
                      <td className="py-3 px-4 border-b border-gray-200 text-gray-700">
                        {format(
                          new Date(payment.paymentDate),
                          "yyyy-MM-dd hh:mm:ss "
                        ) || "N/A"}
                      </td>
                      <td className="py-3 px-4 border-b border-gray-200 text-gray-700">
                        ${formatCurrency(payment.creditAmount)}
                      </td>
                      <td className="py-3 px-4 border-b border-gray-200 text-gray-700">
                        ${formatCurrency(payment.paidAmount)}
                      </td>
                      <td className="py-3 px-4 border-b border-gray-200 text-gray-700">
                        ${formatCurrency(payment.balance)}
                      </td>
                      <td className="py-3 px-4 border-b border-gray-200 text-gray-700">
                        {payment.description || "N/A"}
                      </td>
                      <td className="py-3 px-4 border-b border-gray-200 text-gray-700">
                        {payment.paidBy}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;
