import React, { useState } from 'react';
import { X, CreditCard, Banknote, QrCode, Bike, ShoppingBag, UtensilsCrossed, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';

export default function CheckoutModal({ isOpen, onClose }) {
  const { cart, cartTotal, createOrder } = useRestaurant();

  const [deliveryType, setDeliveryType] = useState('DELIVERY');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('ONLINE_CARD');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  const deliveryFee = deliveryType === 'DELIVERY' ? 2.50 : 0;
  const finalTotal = cartTotal + deliveryFee;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      setFormError('Por favor ingresa tu nombre y número de teléfono.');
      return;
    }
    if (deliveryType === 'DELIVERY' && !address.trim()) {
      setFormError('Por favor especifica tu dirección completa de entrega.');
      return;
    }

    setFormError('');
    setIsSubmitting(true);

    // Simulate backend network latency
    setTimeout(() => {
      createOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        deliveryType,
        address: deliveryType === 'DELIVERY' ? address.trim() : (deliveryType === 'TAKEAWAY' ? 'Retiro en mostrador' : address.trim() || 'Mesa #1'),
        paymentMethod,
      });
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div>
            <h2 className="text-base font-black tracking-tight text-white m-0">
              Confirmar & Pagar Pedido
            </h2>
            <p className="text-xs text-slate-400">Total: ${finalTotal.toFixed(2)}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {formError}
            </div>
          )}

          {/* Delivery Type Option */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Tipo de Entrega</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDeliveryType('DELIVERY')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium transition-all ${
                  deliveryType === 'DELIVERY'
                    ? 'border-amber-500 bg-amber-50/50 text-slate-900 font-bold shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Bike className="w-4 h-4 text-amber-600 mb-1" />
                <span>Delivery (+$2.50)</span>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryType('TAKEAWAY')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium transition-all ${
                  deliveryType === 'TAKEAWAY'
                    ? 'border-amber-500 bg-amber-50/50 text-slate-900 font-bold shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <ShoppingBag className="w-4 h-4 text-amber-600 mb-1" />
                <span>Para Retirar</span>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryType('DINE_IN')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium transition-all ${
                  deliveryType === 'DINE_IN'
                    ? 'border-amber-500 bg-amber-50/50 text-slate-900 font-bold shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <UtensilsCrossed className="w-4 h-4 text-amber-600 mb-1" />
                <span>En Salón / Mesa</span>
              </button>
            </div>
          </div>

          {/* Customer Data */}
          <div className="space-y-2.5">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Tu Nombre Completo *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Ej. Lucas Silva"
                className="w-full text-xs sm:text-sm p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Número de Teléfono / WhatsApp *
              </label>
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Ej. +54 9 11 9876-5432"
                className="w-full text-xs sm:text-sm p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {deliveryType === 'DELIVERY'
                  ? 'Dirección de Entrega (Calle, Número, Depto) *'
                  : deliveryType === 'DINE_IN'
                  ? 'Número de Mesa (opcional)'
                  : 'Punto de retiro'}
              </label>
              <input
                type="text"
                disabled={deliveryType === 'TAKEAWAY'}
                value={deliveryType === 'TAKEAWAY' ? 'Retiro en mostrador del local' : address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={
                  deliveryType === 'DELIVERY'
                    ? 'Ej: Av. Santa Fe 3400 3B (Timbre B)'
                    : 'Ej: Mesa 7'
                }
                className="w-full text-xs sm:text-sm p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-slate-100 disabled:text-slate-500"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-bold text-slate-700 block">Método de Pago</label>
            <div className="space-y-2">
              <label
                onClick={() => setPaymentMethod('ONLINE_CARD')}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'ONLINE_CARD'
                    ? 'border-amber-500 bg-amber-50/50 text-slate-900 font-semibold ring-1 ring-amber-500'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5 text-xs">
                  <CreditCard className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    <p className="font-bold text-slate-900 leading-tight">Tarjeta Débito / Crédito</p>
                    <p className="text-[11px] text-slate-500">Pago inmediato (Estado: Pagado)</p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'ONLINE_CARD'}
                  onChange={() => setPaymentMethod('ONLINE_CARD')}
                  className="text-amber-600 focus:ring-amber-500"
                />
              </label>

              <label
                onClick={() => setPaymentMethod('CASH_ON_DELIVERY')}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'CASH_ON_DELIVERY'
                    ? 'border-amber-500 bg-amber-50/50 text-slate-900 font-semibold ring-1 ring-amber-500'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5 text-xs">
                  <Banknote className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-bold text-slate-900 leading-tight">Efectivo contra Entrega</p>
                    <p className="text-[11px] text-slate-500">Pagas al recibir (Estado: Pendiente)</p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'CASH_ON_DELIVERY'}
                  onChange={() => setPaymentMethod('CASH_ON_DELIVERY')}
                  className="text-amber-600 focus:ring-amber-500"
                />
              </label>

              <label
                onClick={() => setPaymentMethod('BANK_TRANSFER')}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'BANK_TRANSFER'
                    ? 'border-amber-500 bg-amber-50/50 text-slate-900 font-semibold ring-1 ring-amber-500'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5 text-xs">
                  <QrCode className="w-4 h-4 text-blue-600 shrink-0" />
                  <div>
                    <p className="font-bold text-slate-900 leading-tight">Transferencia / QR Alias</p>
                    <p className="text-[11px] text-slate-500">Envío de comprobante por WhatsApp</p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'BANK_TRANSFER'}
                  onChange={() => setPaymentMethod('BANK_TRANSFER')}
                  className="text-amber-600 focus:ring-amber-500"
                />
              </label>
            </div>
          </div>

          {/* Architecture info callout */}
          <div className="p-3 bg-slate-100 rounded-xl text-[11px] text-slate-600 flex items-start gap-2 leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Arquitectura desacoplada:</strong> Al confirmar, la cocina recibe el pedido inmediatamente en estado <em>Recibido</em>, mientras el estado de pago opera de manera independiente.
            </span>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-slate-950 font-black py-3.5 px-4 rounded-xl shadow-md text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Creando orden...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirmar Pedido (${finalTotal.toFixed(2)})</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
