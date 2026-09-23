import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  ShoppingBag, 
  ShieldCheck, 
  CheckCircle2, 
  UploadCloud, 
  Image as ImageIcon, 
  Trash2, 
  Building2, 
  Smartphone, 
  Store,
  Check,
  DoorClosed,
  AlertTriangle
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';

export default function CheckoutModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { cart, cartTotal, createOrder, storeStatus, branding } = useRestaurant();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [pickupNotes, setPickupNotes] = useState('');
  // Modo de pago: 'YAPPY_TRANSFER' o 'PAY_IN_STORE'
  const [paymentMode, setPaymentMode] = useState('YAPPY_TRANSFER');
  const [receiptImage, setReceiptImage] = useState(null);
  const [receiptFileName, setReceiptFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  const finalTotal = cartTotal;

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        setFormError('La foto o comprobante supera el límite de 8 MB.');
        return;
      }
      setReceiptFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptImage(reader.result);
        setFormError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveReceipt = () => {
    setReceiptImage(null);
    setReceiptFileName('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!storeStatus?.isOpen) {
      setFormError(
        storeStatus?.isForceClosed
          ? (branding?.closedMessage || 'El local está cerrado temporalmente y no está recibiendo pedidos.')
          : `El local está cerrado en este momento. Horario de atención: ${branding?.openingTime || '12:00'} a ${branding?.closingTime || '23:30'} hs.`
      );
      return;
    }

    if (!customerName.trim() || !customerPhone.trim()) {
      setFormError('Por favor ingresa tu nombre y número de teléfono.');
      return;
    }

    // Validar comprobante obligatorio si seleccionó Yappy o Transferencia
    if (paymentMode === 'YAPPY_TRANSFER' && !receiptImage) {
      setFormError('Por favor sube la foto o captura de tu comprobante de Yappy o transferencia.');
      return;
    }

    setFormError('');
    setIsSubmitting(true);

    // Simulate backend network latency
    setTimeout(() => {
      try {
        const newOrder = createOrder({
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          deliveryType: 'TAKEAWAY',
          address: 'Retiro en mostrador del local (Av. Corrientes 1240)' + (pickupNotes.trim() ? ` - Nota: ${pickupNotes.trim()}` : ''),
          paymentMethod: paymentMode,
          receiptImage: paymentMode === 'YAPPY_TRANSFER' ? receiptImage : null,
        });
        setIsSubmitting(false);
        onClose();
        navigate(`/seguimiento/${newOrder.id}`);
      } catch (err) {
        setIsSubmitting(false);
        setFormError(err.message || 'No se pudo crear el pedido porque el local se encuentra cerrado.');
      }
    }, 600);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200 cursor-pointer"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div>
            <h2 className="text-base font-black tracking-tight text-white m-0">
              Confirmar & Pagar Pedido
            </h2>
            <p className="text-xs text-slate-400">Total: ${finalTotal.toFixed(2)} • Retiro en Mostrador</p>
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
          {!storeStatus?.isOpen && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-800">
              <DoorClosed className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-bold text-rose-900">
                  {storeStatus?.isForceClosed ? 'Local cerrado temporalmente' : 'Local actualmente cerrado'}
                </p>
                <p className="text-[11px] text-rose-700 leading-tight">
                  {storeStatus?.reason || `Horario de atención: ${branding?.operatingDays || 'Lun - Dom'} de ${branding?.openingTime || '12:00'} a ${branding?.closingTime || '23:30'} hs.`}
                </p>
              </div>
            </div>
          )}

          {formError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {formError}
            </div>
          )}

          {/* Exclusive In-Store Pickup Banner */}
          <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 m-0">Modalidad: Retiro en el Local</h4>
                <p className="text-[11px] text-slate-600 mt-0.5">Av. Corrientes 1240 • Listo en aprox. 15 - 25 min</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300 shrink-0">
              Sin cargo
            </span>
          </div>

          {/* Customer Data */}
          <div className="space-y-2.5">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Tu Nombre Completo * (para llamarte al mostrador)
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
                Número de Teléfono / WhatsApp * (aviso de pedido listo)
              </label>
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Ej. +507 6988-5432"
                className="w-full text-xs sm:text-sm p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Nota adicional de retiro (opcional)
              </label>
              <input
                type="text"
                value={pickupNotes}
                onChange={(e) => setPickupNotes(e.target.value)}
                placeholder="Ej: Retira un familiar, llego en 20 minutos..."
                className="w-full text-xs sm:text-sm p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Modo de Pago Selector */}
          <div className="space-y-2 pt-1">
            <label className="text-xs font-black text-slate-900 block">Modo de Pago</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* Opción 1: Yappy o Transferencia */}
              <label
                onClick={() => setPaymentMode('YAPPY_TRANSFER')}
                className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                  paymentMode === 'YAPPY_TRANSFER'
                    ? 'border-amber-500 bg-amber-50/60 text-slate-900 font-bold ring-2 ring-amber-500/50 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-extrabold text-xs text-slate-900 leading-tight">Yappy o Transferencia</p>
                    <input
                      type="radio"
                      name="payment_mode"
                      checked={paymentMode === 'YAPPY_TRANSFER'}
                      onChange={() => setPaymentMode('YAPPY_TRANSFER')}
                      className="text-amber-600 focus:ring-amber-500 shrink-0"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 font-normal mt-0.5">Adjuntas captura del comprobante</p>
                </div>
              </label>

              {/* Opción 2: Pagar en el Local */}
              <label
                onClick={() => setPaymentMode('PAY_IN_STORE')}
                className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                  paymentMode === 'PAY_IN_STORE'
                    ? 'border-amber-500 bg-amber-50/60 text-slate-900 font-bold ring-2 ring-amber-500/50 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                  <Store className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-extrabold text-xs text-slate-900 leading-tight">Pagar en el Local</p>
                    <input
                      type="radio"
                      name="payment_mode"
                      checked={paymentMode === 'PAY_IN_STORE'}
                      onChange={() => setPaymentMode('PAY_IN_STORE')}
                      className="text-amber-600 focus:ring-amber-500 shrink-0"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 font-normal mt-0.5">Efectivo o tarjeta al retirar</p>
                </div>
              </label>
            </div>
          </div>

          {/* Cuadro condicional: Solo aparece si el modo es Yappy o Transferencia */}
          {paymentMode === 'YAPPY_TRANSFER' ? (
            <div className="p-4 bg-gradient-to-b from-blue-50/70 to-slate-50 border border-blue-200/90 rounded-2xl space-y-3 animate-in fade-in zoom-in-95 duration-200">
              {/* Account details for payment */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-blue-950">
                  <Smartphone className="w-4 h-4 text-blue-600" />
                  <span>Datos para realizar el pago (${finalTotal.toFixed(2)}):</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-blue-100 space-y-1 text-[11px] text-slate-700 shadow-2xs">
                  <p className="flex justify-between items-center">
                    <span className="font-semibold text-slate-900">Yappy:</span>
                    <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">6988-1234 (@burgercraft)</span>
                  </p>
                  <p className="flex justify-between items-center">
                    <span className="font-semibold text-slate-900">Banco General:</span>
                    <span className="font-mono text-slate-600">Cta Cte. 03-01-01-987654-3</span>
                  </p>
                  <p className="text-[10px] text-slate-400">Titular: Burger & Pizza Craft Co. S.A.</p>
                </div>
              </div>

              {/* Upload Box for Receipt Photo */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-900 flex items-center justify-between">
                  <span>Subir Foto del Comprobante *</span>
                  {receiptImage && (
                    <span className="text-emerald-700 text-[10px] font-bold flex items-center gap-1">
                      <Check className="w-3 h-3 stroke-[3]" /> Listo
                    </span>
                  )}
                </label>

                {!receiptImage ? (
                  <label className="border-2 border-dashed border-blue-300 hover:border-blue-500 bg-white rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-blue-50/40 group">
                    <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-bold text-slate-800 text-center">
                      Toca aquí para seleccionar o tomar foto
                    </p>
                    <p className="text-[10px] text-slate-500 text-center mt-0.5">
                      Captura de pantalla de Yappy o voucher de transferencia (JPG, PNG)
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="p-3 bg-white border border-emerald-200 rounded-2xl flex items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={receiptImage}
                        alt="Comprobante de pago"
                        className="w-14 h-14 object-cover rounded-xl border border-slate-200 shrink-0 bg-slate-100"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {receiptFileName || 'Comprobante_Yappy.jpg'}
                        </p>
                        <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Foto adjuntada con éxito
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleRemoveReceipt}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors shrink-0"
                      title="Quitar foto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Aviso cuando selecciona Pagar en el Local (No se muestra el cuadro de foto) */
            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-xs text-emerald-950 flex items-start gap-2.5 animate-in fade-in duration-150">
              <Store className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-emerald-900">Pagas en mostrador al retirar</p>
                <p className="text-[11px] text-emerald-800/80 mt-0.5 leading-relaxed">
                  No necesitas adjuntar ningún comprobante previo. Podrás abonar con efectivo o tarjeta cuando tu comida esté lista.
                </p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !storeStatus?.isOpen}
              className={`w-full font-black py-3.5 px-4 rounded-xl shadow-md text-sm flex items-center justify-center gap-2 transition-all ${
                !storeStatus?.isOpen
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed border border-slate-300'
                  : 'bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-slate-950 disabled:opacity-50'
              }`}
            >
              {isSubmitting ? (
                <span>Creando orden...</span>
              ) : !storeStatus?.isOpen ? (
                <>
                  <DoorClosed className="w-4 h-4" />
                  <span>Local Cerrado (No se reciben pedidos)</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirmar Pedido (${finalTotal.toFixed(2)})</span>
                </>
              )}
            </button>
            {!storeStatus?.isOpen && (
              <p className="text-[11px] text-rose-600 font-semibold text-center mt-2">
                {storeStatus?.reason || 'El local está fuera de su horario de atención y no puede procesar pedidos.'}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
