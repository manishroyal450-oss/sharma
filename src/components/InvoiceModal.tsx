import React, { useRef } from 'react';
import { Printer, Download, X, MessageCircle, CheckCircle, ShieldCheck } from 'lucide-react';
import { CartItem, Order, UserAddress } from '../types/confectionery';
import { STORE_INFO } from '../data/confectioneryData';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  order?: Order | null;
  cartItems?: CartItem[];
  userAddress: UserAddress;
  totalAmount: number;
  discountAmount?: number;
  deliveryCharge?: number;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  order,
  cartItems,
  userAddress,
  totalAmount,
  discountAmount = 0,
  deliveryCharge = 0,
}) => {
  const invoiceRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const invoiceNo = order?.id || `SC-INV-${Math.floor(100000 + Math.random() * 900000)}`;
  const invoiceDate = order?.date || new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const invoiceTime = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Extract items from order or current cart
  const items = order
    ? order.items.map(i => ({
        name: i.name,
        weight: i.weight,
        unitPrice: i.unitPrice,
        quantity: i.quantity,
        total: i.unitPrice * i.quantity,
      }))
    : (cartItems || []).map(i => ({
        name: i.product.name,
        weight: i.selectedWeight,
        unitPrice: i.unitPrice,
        quantity: i.quantity,
        total: i.unitPrice * i.quantity,
      }));

  const subtotal = items.reduce((acc, it) => acc + it.total, 0);
  const netPayable = order ? order.total : totalAmount;

  const handlePrint = () => {
    window.print();
  };

  const handleShareOnWhatsApp = () => {
    const text = `*Sharma Confectioners - Tax Invoice (${invoiceNo})*\n` +
      `Date: ${invoiceDate}\n` +
      `Customer: ${userAddress.name}\n` +
      `Address: ${userAddress.street}, ${userAddress.city}, ${userAddress.state} - ${userAddress.pincode}\n\n` +
      `*Items:*\n` +
      items.map((it, idx) => `${idx + 1}. ${it.name} (${it.weight}) x ${it.quantity} = ₹${it.total}`).join('\n') +
      `\n\n*Net Amount:* ₹${netPayable}\n` +
      `Shop Address: ${STORE_INFO.address}\n` +
      `Thank you for choosing Sharma Confectioners!`;
    const url = `https://wa.me/919876543210?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white text-stone-900 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[96vh] overflow-y-auto relative animate-in fade-in zoom-in-95 my-auto flex flex-col"
      >
        {/* Modal Top Bar (Hidden in Print) */}
        <div className="bg-[#131921] text-white px-5 py-3.5 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span className="font-bold font-serif text-sm sm:text-base">
              Sharma Confectioners · Official Invoice
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={handleShareOnWhatsApp}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-white p-1 rounded-md transition-colors cursor-pointer ml-2"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div ref={invoiceRef} className="p-6 sm:p-10 text-stone-900 font-sans print:p-0 print:m-0 space-y-6">
          
          {/* Invoice Header */}
          <div className="border-b-2 border-stone-800 pb-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className="w-9 h-9 rounded-lg bg-stone-900 text-amber-400 font-serif font-black flex items-center justify-center text-xl shadow-xs">
                  S
                </div>
                <h1 className="text-2xl sm:text-3xl font-black font-serif tracking-tight text-stone-900">
                  SHARMA CONFECTIONERS
                </h1>
              </div>
              <p className="text-xs font-semibold text-amber-800 uppercase tracking-widest">
                {STORE_INFO.tagline}
              </p>
              <p className="text-xs text-stone-700 font-medium mt-1">
                📍 {STORE_INFO.address}
              </p>
              <p className="text-xs text-stone-600">
                Phone: {STORE_INFO.phone} · Email: {STORE_INFO.email}
              </p>
              <p className="text-[11px] text-stone-500 font-mono mt-0.5">
                {STORE_INFO.fssai} | {STORE_INFO.gstin}
              </p>
            </div>

            <div className="text-left sm:text-right space-y-1 sm:shrink-0 bg-stone-50 sm:bg-transparent p-3 sm:p-0 rounded-lg">
              <span className="inline-block bg-stone-900 text-amber-400 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded">
                RETAIL TAX INVOICE
              </span>
              <p className="text-sm font-bold font-mono text-stone-900">
                Invoice No: {invoiceNo}
              </p>
              <p className="text-xs text-stone-600">
                Date: <strong className="text-stone-800">{invoiceDate}</strong> ({invoiceTime})
              </p>
              <p className="text-xs text-stone-600">
                Order Type: <strong className="text-emerald-700">WhatsApp Verified Order</strong>
              </p>
            </div>
          </div>

          {/* Billed To / Customer Details */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="font-bold uppercase tracking-wider text-stone-500 text-[10px] block mb-1">
                Billed & Delivered To:
              </span>
              <p className="text-sm font-bold text-stone-900">{userAddress.name}</p>
              <p className="text-stone-700 font-medium mt-0.5 leading-relaxed">
                {userAddress.street}
              </p>
              <p className="text-stone-700 font-medium">
                {userAddress.city}, {userAddress.state} - {userAddress.pincode}
              </p>
              <p className="text-stone-600 mt-1">
                Mobile: <strong className="text-stone-900">{userAddress.phone}</strong>
                {userAddress.email && <span className="block text-stone-500 text-[11px]">Email: {userAddress.email}</span>}
              </p>
            </div>

            <div className="sm:border-l sm:border-stone-200 sm:pl-4 space-y-1">
              <span className="font-bold uppercase tracking-wider text-stone-500 text-[10px] block mb-1">
                Fulfilment & Purity Guarantee:
              </span>
              <p className="text-stone-700">
                Dispatch Location: <strong>Station Rd, Chandpur (UP)</strong>
              </p>
              <p className="text-stone-700">
                Packaging: <strong>Temperature Insulated Thermal Gel Pack</strong>
              </p>
              <p className="text-emerald-700 font-semibold flex items-center gap-1 mt-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>100% Pure Desi Ghee & Belgian Cacao Certified</span>
              </p>
            </div>
          </div>

          {/* Itemized Invoice Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-stone-200 rounded-lg overflow-hidden">
              <thead className="bg-stone-900 text-white font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-2.5 px-3 w-10 text-center">#</th>
                  <th className="py-2.5 px-3">Confectionery Item</th>
                  <th className="py-2.5 px-3">Size / Pack</th>
                  <th className="py-2.5 px-3 text-right">Rate (₹)</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {items.map((it, idx) => (
                  <tr key={idx} className="hover:bg-stone-50">
                    <td className="py-2.5 px-3 text-center font-mono text-stone-500">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-semibold text-stone-900">
                      {it.name}
                    </td>
                    <td className="py-2.5 px-3 text-stone-600">{it.weight}</td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-stone-700">
                      ₹{it.unitPrice}
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold font-mono">{it.quantity}</td>
                    <td className="py-2.5 px-3 text-right font-bold tabular-nums text-stone-900">
                      ₹{it.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Calculation & Summary Grid */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-2">
            {/* Left: Notes & Banking Info */}
            <div className="text-xs text-stone-500 space-y-1.5 max-w-sm">
              <p className="font-bold text-stone-700 uppercase tracking-wide text-[10px]">
                Terms & Conditions:
              </p>
              <p>• All confections prepared fresh daily in Chandpur facility.</p>
              <p>• Store chocolates in cool condition (18°C–22°C).</p>
              <p>• For queries or custom wedding/bulk boxes, contact: +91 98765 43210.</p>
            </div>

            {/* Right: Totals Box */}
            <div className="w-full sm:w-64 bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs space-y-2">
              <div className="flex justify-between text-stone-600">
                <span>Items Subtotal:</span>
                <span className="font-semibold tabular-nums text-stone-800">₹{subtotal}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-red-600 font-semibold">
                  <span>Special Discount:</span>
                  <span className="tabular-nums">-₹{discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between text-stone-600">
                <span>Delivery & Insulated Pack:</span>
                <span className="font-semibold text-emerald-700">
                  {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                </span>
              </div>
              <div className="border-t-2 border-stone-800 pt-2 flex justify-between font-black text-base text-stone-900">
                <span>Total Net Bill:</span>
                <span className="text-amber-800 tabular-nums">₹{netPayable}</span>
              </div>
            </div>
          </div>

          {/* Signatures & Seal */}
          <div className="pt-8 border-t border-stone-200 flex items-end justify-between text-xs">
            <div className="text-stone-400 text-[11px]">
              <p>Computer generated invoice issued by</p>
              <p className="font-bold text-stone-700">Sharma Confectioners, Chandpur (U.P.)</p>
            </div>

            <div className="text-center space-y-1">
              <div className="h-10 flex items-center justify-center font-serif italic text-amber-900 text-sm">
                Sharma Confectioners
              </div>
              <p className="font-bold text-stone-800 border-t border-stone-400 pt-1 px-4">
                Authorized Signatory
              </p>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions (Hidden in Print) */}
        <div className="bg-stone-50 border-t border-stone-200 px-6 py-3 flex items-center justify-between text-xs print:hidden">
          <span className="text-stone-500">
            Address: 47Q8+783, Station Rd, Chandpur, UP 246725
          </span>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="bg-stone-900 hover:bg-stone-800 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print Bill</span>
            </button>
            <button
              onClick={onClose}
              className="border border-stone-300 hover:bg-stone-100 text-stone-700 font-semibold py-2 px-4 rounded-lg cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
