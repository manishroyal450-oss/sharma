import React from 'react';
import { 
  X, 
  MapPin, 
  Navigation, 
  Phone, 
  Clock, 
  ExternalLink, 
  MessageCircle, 
  Check, 
  Copy,
  Store,
  ShieldCheck
} from 'lucide-react';
import { STORE_INFO } from '../data/confectioneryData';

interface ShopLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShopLocationModal: React.FC<ShopLocationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(STORE_INFO.address)}`;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(STORE_INFO.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white text-stone-900 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden relative animate-in fade-in zoom-in-95 my-auto"
      >
        {/* Header */}
        <div className="bg-[#131921] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 font-bold flex items-center justify-center font-serif text-xl shadow">
              S
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg font-serif">
                Sharma Confectioners
              </h3>
              <p className="text-xs text-amber-300 flex items-center gap-1">
                <Store className="w-3.5 h-3.5" />
                <span>Main Sweet & Bakery Outlet</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Primary Shop Address Box */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider block">
                    Official Store Location
                  </span>
                  <p className="text-sm font-bold text-stone-900 leading-snug">
                    {STORE_INFO.address}
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs text-stone-600 pl-7">
              Near Station Road Railway Crossing, Chandpur, District Bijnor, Uttar Pradesh 246725
            </p>

            <div className="pl-7 pt-2 flex items-center gap-3">
              <button
                onClick={handleCopyAddress}
                className="text-xs font-semibold text-stone-700 hover:text-stone-900 flex items-center gap-1 cursor-pointer bg-white px-2.5 py-1 rounded border border-stone-200 shadow-2xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-500" />}
                <span>{copied ? 'Address Copied!' : 'Copy Full Address'}</span>
              </button>
              <span className="text-[11px] text-stone-500 font-mono">Plus Code: 47Q8+783</span>
            </div>
          </div>

          {/* Timings and Contact Details */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-stone-800">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Shop Timings</span>
              </div>
              <p className="text-stone-600 font-medium">8:00 AM – 10:00 PM</p>
              <p className="text-[10px] text-emerald-700 font-semibold">Open all 7 days</p>
            </div>

            <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-stone-800">
                <Phone className="w-4 h-4 text-amber-700" />
                <span>Phone / Orders</span>
              </div>
              <p className="text-stone-900 font-bold">{STORE_INFO.phone}</p>
              <p className="text-[10px] text-stone-500">Direct sweet counter line</p>
            </div>
          </div>

          {/* Freshness & Dispatch Promise */}
          <div className="flex items-center gap-2 text-xs text-stone-600 bg-stone-50 p-3 rounded-lg border border-stone-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Visit our shop for live fresh preparation or order directly via WhatsApp!</span>
          </div>

          {/* Action Buttons: Open in Google Maps, Call, WhatsApp */}
          <div className="space-y-2 pt-2 border-t border-stone-200">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
            >
              <Navigation className="w-4 h-4" />
              <span>Open in Google Maps (Get Directions)</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </a>

            <div className="grid grid-cols-2 gap-2">
              <a
                href={`tel:${STORE_INFO.phone}`}
                className="bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-stone-300"
              >
                <Phone className="w-3.5 h-3.5 text-stone-700" />
                <span>Call Store</span>
              </a>

              <a
                href={`https://wa.me/919876543210?text=${encodeURIComponent("Hello Sharma Confectioners! I want to visit your shop on Station Road, Chandpur.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-white" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
