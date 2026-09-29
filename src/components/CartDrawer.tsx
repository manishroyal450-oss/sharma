import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  Tag, 
  Gift, 
  Check, 
  Clock, 
  MapPin, 
  Truck,
  MessageCircle,
  Printer,
  FileText
} from 'lucide-react';
import { CartItem, Order, UserAddress } from '../types/confectionery';
import { STORE_INFO } from '../data/confectioneryData';
import { InvoiceModal } from './InvoiceModal';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, weight: string, newQuantity: number) => void;
  onRemoveItem: (productId: string, weight: string) => void;
  onClearCart: () => void;
  userAddress: UserAddress;
  onPlaceOrder: (order: Order) => void;
  onOpenWhatsAppCheckout: (orderSummaryText: string) => void;
  onOpenProfile?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  userAddress,
  onPlaceOrder,
  onOpenWhatsAppCheckout,
  onOpenProfile,
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [isGiftWrap, setIsGiftWrap] = useState(false);
  const [giftNote, setGiftNote] = useState('');
  const [isOrderPlacedSuccess, setIsOrderPlacedSuccess] = useState(false);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  if (!isOpen) return null;

  // Calculations
  const rawSubtotal = items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const freeDeliveryThreshold = 499;
  const isFreeDelivery = rawSubtotal >= freeDeliveryThreshold;
  const deliveryFee = items.length === 0 ? 0 : (isFreeDelivery ? 0 : 50);
  const giftWrapFee = isGiftWrap ? 49 : 0;
  const finalTotal = Math.max(0, rawSubtotal + deliveryFee + giftWrapFee - appliedDiscount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    const code = couponCode.trim().toUpperCase();
    if (code === 'SWEET10') {
      const disc = Math.round(rawSubtotal * 0.10);
      setAppliedDiscount(disc);
      setCouponSuccess('SWEET10 applied! 10% instant discount.');
    } else if (code === 'FESTIVE150' && rawSubtotal >= 800) {
      setAppliedDiscount(150);
      setCouponSuccess('FESTIVE150 applied! ₹150 off on order.');
    } else {
      setCouponError('Invalid coupon code. Try SWEET10 or FESTIVE150 (above ₹800).');
    }
  };

  // Direct WhatsApp Ordering Handler (primary action requested by user)
  const handleWhatsAppOrder = () => {
    if (items.length === 0) return;

    const orderId = `SC-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder: Order = {
      id: orderId,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Order Confirmed',
      items: items.map(i => ({
        productId: i.product.id,
        name: i.product.name,
        image: i.product.image,
        weight: i.selectedWeight,
        unitPrice: i.unitPrice,
        quantity: i.quantity,
      })),
      subtotal: rawSubtotal,
      deliveryCharge: deliveryFee,
      discount: appliedDiscount,
      total: finalTotal,
      address: userAddress,
      paymentMethod: 'UPI / GPay / PhonePe',
      deliveryDate: 'Today (Express Dispatch from Chandpur)',
    };

    onPlaceOrder(newOrder);
    setLastPlacedOrder(newOrder);
    setIsOrderPlacedSuccess(true);

    // Format WhatsApp message with store address & customer address
    const summary = `*Sharma Confectioners - New Order Request*\n` +
      `--------------------------------\n` +
      `📍 *Shop:* ${STORE_INFO.address}\n` +
      `👤 *Customer Name:* ${userAddress.name}\n` +
      `📞 *Phone:* ${userAddress.phone}\n` +
      (userAddress.email ? `📧 *Email:* ${userAddress.email}\n` : '') +
      `🏠 *Delivery Address:* ${userAddress.street}, ${userAddress.city}, ${userAddress.state} - ${userAddress.pincode}\n\n` +
      `📦 *Items Ordered:*\n` +
      items.map((i, idx) => `${idx + 1}. ${i.product.name} (${i.selectedWeight}) x ${i.quantity} = ₹${i.unitPrice * i.quantity}`).join('\n') +
      (isGiftWrap ? `\n🎁 *Gift Wrap Note:* ${giftNote || 'Festive greetings'}` : '') +
      `\n\n--------------------------------\n` +
      `💵 *Subtotal:* ₹${rawSubtotal}\n` +
      (appliedDiscount > 0 ? `🏷️ *Discount:* -₹${appliedDiscount}\n` : '') +
      `🚚 *Delivery:* ${deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}\n` +
      `💰 *Total Net Amount:* ₹${finalTotal}\n` +
      `--------------------------------\n` +
      `Please confirm fresh batch availability and dispatch time. Thank you!`;

    onOpenWhatsAppCheckout(summary);
    onClearCart();
  };

  const handleOpenBill = () => {
    setIsInvoiceModalOpen(true);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
        <div className="w-full max-w-lg bg-stone-50 h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300 relative">
          
          {/* Header */}
          <div className="bg-[#131921] text-white p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold font-serif">
                {isOrderPlacedSuccess ? 'Order Placed · Sharma Confectioners' : 'Your Shopping Cart'}
              </h2>
              {!isOrderPlacedSuccess && (
                <span className="text-xs bg-amber-500 text-stone-950 font-bold px-2 py-0.5 rounded-full">
                  {items.reduce((acc, i) => acc + i.quantity, 0)} items
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Success Screen After WhatsApp Order */}
          {isOrderPlacedSuccess ? (
            <div className="p-6 overflow-y-auto flex-1 text-center space-y-5">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Order Sent via WhatsApp</span>
                <h3 className="text-2xl font-bold font-serif text-stone-900 mt-1">Thank you! Order Received</h3>
                <p className="text-xs text-stone-500 mt-1 font-mono">Invoice Ref: {lastPlacedOrder?.id}</p>
              </div>

              <div className="bg-white rounded-xl border border-stone-200 p-4 text-left text-xs space-y-2.5 shadow-sm">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <span className="text-stone-500 font-medium">Store Address:</span>
                  <span className="font-semibold text-stone-800 text-right">{STORE_INFO.street}, Chandpur (UP)</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <span className="text-stone-500 font-medium">Deliver To:</span>
                  <span className="font-semibold text-stone-800 text-right">{userAddress.name} ({userAddress.city})</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <span className="text-stone-500 font-medium">Estimated Delivery:</span>
                  <span className="font-bold text-emerald-700">Today by 8:00 PM</span>
                </div>
                <div className="flex items-center justify-between font-bold text-sm text-stone-900 pt-1">
                  <span>Total Bill Amount:</span>
                  <span className="text-amber-800 tabular-nums">₹{lastPlacedOrder?.total}</span>
                </div>
              </div>

              {/* Professional Bill Print Action */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-amber-700" />
                    <span>Official Tax Bill (Sharma Confectioners)</span>
                  </span>
                </div>
                <p className="text-[11px] text-stone-600">
                  Generate, print, or download your official GST & FSSAI compliant receipt bill.
                </p>
                <button
                  onClick={handleOpenBill}
                  className="w-full bg-stone-900 hover:bg-stone-800 text-white font-bold py-2.5 px-4 rounded-lg text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
                >
                  <Printer className="w-4 h-4 text-amber-400" />
                  <span>Print / Download PDF Bill</span>
                </button>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    setIsOrderPlacedSuccess(false);
                    onClose();
                  }}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold py-3 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Continue Shopping Sweets
                </button>
              </div>
            </div>
          ) : (
            /* Cart Items List */
            <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
              {/* Store & Customer Address Bar */}
              <div className="bg-white rounded-xl border border-stone-200 p-3 text-xs space-y-1.5 shadow-2xs">
                <div className="flex items-center justify-between font-bold text-stone-900 pb-1.5 border-b border-stone-100">
                  <span className="flex items-center gap-1 text-amber-800">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Sharma Confectioners, Chandpur</span>
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                    Station Rd Facility
                  </span>
                </div>
                <div className="flex items-start justify-between gap-2 pt-0.5">
                  <div className="text-[11px] text-stone-700 leading-snug">
                    <span className="text-stone-500 font-semibold block text-[10px] uppercase tracking-wider">
                      Delivering To Your Address:
                    </span>
                    <strong className="text-stone-950 font-bold text-xs">{userAddress.name}</strong>
                    <span className="text-stone-600 font-mono text-[11px]"> ({userAddress.phone})</span>
                    <div className="text-stone-600 mt-0.5 font-medium line-clamp-2">
                      {userAddress.street}, {userAddress.city} - {userAddress.pincode}
                    </div>
                  </div>
                  {onOpenProfile && (
                    <button
                      onClick={onOpenProfile}
                      className="text-[11px] font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 px-2.5 py-1 rounded-lg transition-colors cursor-pointer shrink-0 shadow-2xs"
                      title="Edit recipient name, contact number, or address"
                    >
                      Change
                    </button>
                  )}
                </div>
              </div>

              {/* Free Delivery Goal Bar */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs">
                {isFreeDelivery ? (
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>FREE Delivery across Chandpur & surrounding areas!</span>
                  </div>
                ) : (
                  <div>
                    <p className="text-stone-700">
                      Add <strong className="text-amber-800">₹{freeDeliveryThreshold - rawSubtotal}</strong> more for <strong>FREE Local Delivery</strong>
                    </p>
                    <div className="w-full h-1.5 bg-amber-200 rounded-full mt-2 overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, (rawSubtotal / freeDeliveryThreshold) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Empty Cart State */}
              {items.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <span className="text-4xl block">🍫</span>
                  <h3 className="font-bold text-stone-800 text-base">Your Confectionery Cart is empty</h3>
                  <p className="text-xs text-stone-500 max-w-xs mx-auto">
                    Browse our Belgian chocolates, Royal Indian sweets, and fresh bakery items in Chandpur to sweeten your cart!
                  </p>
                  <button
                    onClick={onClose}
                    className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold px-4 py-2 rounded-lg text-xs transition-colors cursor-pointer"
                  >
                    Explore Catalogue
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={`${item.product.id}-${item.selectedWeight}`}
                      className="bg-white rounded-xl border border-stone-200 p-3.5 shadow-xs"
                    >
                      <div className="flex flex-col justify-between gap-2">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-bold text-stone-900 text-sm">
                              {item.product.name}
                            </h4>
                            <button
                              onClick={() => onRemoveItem(item.product.id, item.selectedWeight)}
                              className="text-stone-400 hover:text-red-500 transition-colors cursor-pointer p-1"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs bg-amber-100 text-amber-900 font-semibold px-2 py-0.5 rounded">
                              Pack: {item.selectedWeight}
                            </span>
                            <span className="text-[11px] text-stone-500">
                              (₹{item.unitPrice} per unit)
                            </span>
                          </div>
                          <p className="text-sm font-bold text-stone-900 mt-1.5 tabular-nums">
                            Total: ₹{item.unitPrice * item.quantity}
                          </p>
                        </div>

                        {/* Quantity Stepper & Batch */}
                        <div className="flex items-center justify-between pt-1 border-t border-stone-100">
                          <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50">
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.selectedWeight, item.quantity - 1)}
                              className="p-1 px-2.5 text-stone-600 hover:bg-stone-200 cursor-pointer font-bold"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-3 text-xs font-bold tabular-nums min-w-[24px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.selectedWeight, item.quantity + 1)}
                              className="p-1 px-2.5 text-stone-600 hover:bg-stone-200 cursor-pointer font-bold"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <span className="text-[11px] text-emerald-700 font-semibold">
                            ✓ Fresh Local Preparation
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Gift Wrap & Custom Note Option */}
                  <div className="bg-white rounded-xl border border-stone-200 p-3 space-y-2">
                    <label className="flex items-center justify-between text-xs font-bold text-stone-800 cursor-pointer">
                      <span className="flex items-center gap-1.5">
                        <Gift className="w-4 h-4 text-amber-600" />
                        <span>Add Luxury Ribbon Gift Wrap & Card (+₹49)</span>
                      </span>
                      <input
                        type="checkbox"
                        checked={isGiftWrap}
                        onChange={(e) => setIsGiftWrap(e.target.checked)}
                        className="accent-amber-600 cursor-pointer"
                      />
                    </label>
                    {isGiftWrap && (
                      <input
                        type="text"
                        value={giftNote}
                        onChange={(e) => setGiftNote(e.target.value)}
                        placeholder="Write your greeting note (e.g. Best Wishes from Manish!)"
                        className="w-full text-xs border border-stone-300 rounded-lg p-2 outline-none focus:border-amber-500"
                      />
                    )}
                  </div>

                  {/* Coupon Code Accordion */}
                  <div className="bg-white rounded-xl border border-stone-200 p-3">
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="Promo Code (SWEET10)"
                          className="w-full pl-8 pr-2 py-1.5 text-xs uppercase border border-stone-300 rounded-lg outline-none font-mono"
                        />
                      </div>
                      <button
                        type="submit"
                        className="bg-stone-800 hover:bg-stone-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    </form>
                    {couponSuccess && <p className="text-[11px] text-emerald-700 font-semibold mt-1.5">{couponSuccess}</p>}
                    {couponError && <p className="text-[11px] text-red-600 mt-1.5">{couponError}</p>}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer Actions (WhatsApp Button + Print PDF Bill Button) */}
          {!isOrderPlacedSuccess && items.length > 0 && (
            <div className="bg-white border-t border-stone-200 p-4 space-y-3 shadow-lg">
              {/* Pricing breakdown */}
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex items-center justify-between">
                  <span>Subtotal ({items.reduce((acc, i) => acc + i.quantity, 0)} items):</span>
                  <span className="font-semibold text-stone-900 tabular-nums">₹{rawSubtotal}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex items-center justify-between text-red-600 font-semibold">
                    <span>Discount:</span>
                    <span className="tabular-nums">-₹{appliedDiscount}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span>Delivery Charge:</span>
                  <span className="font-semibold text-emerald-700">{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                </div>
                <div className="border-t border-stone-200 pt-1.5 flex items-center justify-between text-sm font-bold text-stone-900">
                  <span>Net Total:</span>
                  <span className="text-amber-800 tabular-nums text-base">₹{finalTotal}</span>
                </div>
              </div>

              {/* Action Buttons: WhatsApp Order (Primary) & Print PDF Bill */}
              <div className="space-y-2">
                {/* 1. Primary WhatsApp Button */}
                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full bg-[#25D366] hover:bg-[#20bd5a] active:bg-[#1caa4f] text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-xl"
                >
                  <MessageCircle className="w-5 h-5 fill-white text-white" />
                  <span>Order via WhatsApp (₹{finalTotal})</span>
                </button>

                {/* 2. Print / PDF Bill Button */}
                <button
                  onClick={handleOpenBill}
                  className="w-full bg-stone-900 hover:bg-stone-800 text-amber-300 hover:text-amber-200 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer border border-stone-700"
                >
                  <Printer className="w-4 h-4 text-amber-400" />
                  <span>Print / View Tax Bill (PDF)</span>
                </button>
              </div>

              <p className="text-[10px] text-stone-500 text-center">
                Dispatched directly from Sharma Confectioners, Station Rd, Chandpur
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Professional Tax Bill Modal */}
      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        order={lastPlacedOrder}
        cartItems={items}
        userAddress={userAddress}
        totalAmount={finalTotal}
        discountAmount={appliedDiscount}
        deliveryCharge={deliveryFee}
      />
    </>
  );
};
