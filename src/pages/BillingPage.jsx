import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Sparkles, CreditCard, UploadCloud, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';

export default function BillingPage() {
  const navigate = useNavigate();
  const { user, submitPayment, payments } = useApp();

  const [receiptBase64, setReceiptBase64] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  // Find active payment status
  const userPayments = payments.filter(p => p.user_id === user?.id);
  const activePendingPayment = userPayments.find(p => p.status === 'pending');
  const rejectedPayment = userPayments.find(p => p.status === 'rejected');

  React.useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user) return null;

  const premiumActive = user.subscription_status === 'premium' || user.role === 'admin';

  // Handle receipt selection
  const handleFileChange = (e) => {
    setErrorMsg('');
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Faqat rasm formatidagi cheklarni yuklashingiz mumkin!');
      return;
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      setErrorMsg('Rasm hajmi 2MB dan kam bo\'lishi shart!');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setReceiptBase64(reader.result);
    };
    reader.onerror = () => {
      setErrorMsg('Rasmni o\'qishda xatolik.');
    };
    reader.readAsDataURL(file);
  };

  const handleUploadSubmit = async () => {
    if (!receiptBase64) {
      setErrorMsg('Iltimos, avval chek rasmini yuklang.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await submitPayment(receiptBase64);
      if (res.success) {
        setSuccess(true);
        setReceiptBase64('');
      } else {
        setErrorMsg(res.error || 'Yuklashda xatolik.');
      }
    } catch (e) {
      setErrorMsg(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-6 animate-fade-in text-brand-neutral-white">
      {/* Page Title */}
      <div className="border-b border-brand-navy-light/40 pb-3">
        <h2 className="text-xl font-bold font-display text-brand-neutral-white">Premium A'zolik</h2>
        <p className="text-xs text-brand-neutral-textMuted">Mock imtihonlarni ochish va tayyorgarlikni tezlashtirish</p>
      </div>

      {premiumActive ? (
        /* PRO ACTIVE DISPLAY */
        <div className="glass-card p-6 border-brand-success/20 bg-brand-success/5 text-center space-y-4">
          <ShieldCheck className="h-14 w-14 text-brand-success mx-auto animate-pulse-slow" />
          <div className="space-y-1">
            <h3 className="font-bold font-display text-lg text-brand-neutral-white">Premium Hisob Faol!</h3>
            <p className="text-xs text-brand-neutral-textMuted">Barcha CEFR mock imtihonlari va to'liq tahliliy hisobotlarga ruxsat berilgan.</p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary w-full py-2.5 text-xs font-bold animate-pulse-slow"
          >
            Dashboardga qaytish
          </button>
        </div>
      ) : activePendingPayment ? (
        /* PENDING DISPLAY */
        <div className="glass-card p-6 border-brand-warning/20 bg-brand-warning/5 text-center space-y-4">
          <AlertTriangle className="h-14 w-14 text-brand-warning mx-auto animate-pulse" />
          <div className="space-y-1">
            <h3 className="font-bold font-display text-lg text-brand-neutral-white">Chek tekshirilmoqda</h3>
            <p className="text-xs text-brand-neutral-textMuted leading-relaxed px-4">
              To'lov chekingiz adminlarimiz tomonidan tekshirilmoqda. Tasdiqlanishi bilan profilingiz premiumga o'tadi (odatda 15-20 daqiqa).
            </p>
          </div>
          <div className="text-[10px] text-brand-neutral-textMuted">
            Yuborilgan sana: {new Date(activePendingPayment.created_at).toLocaleTimeString('uz-UZ')}
          </div>
        </div>
      ) : (
        /* BILLING INSTRUCTIONS & UPLOAD CARD */
        <>
          {/* Plan details */}
          <div className="glass-card p-5 border-brand-purple-base/20 bg-brand-purple-glow relative overflow-hidden glass-card-hover">
            <div className="absolute top-0 right-0 px-2 py-0.5 bg-brand-gold-base/25 text-brand-gold-base rounded-bl-lg text-[9px] font-bold tracking-widest uppercase font-display">
              Ommabop
            </div>
            <Sparkles className="h-7 w-7 text-brand-gold-base mb-2 animate-glow-pulse" />
            <h3 className="font-bold font-display text-base text-brand-neutral-grayLight">CEFR Premium Mock Paketi</h3>
            <div className="flex items-baseline gap-1 mt-2 mb-3">
              <span className="text-2xl font-extrabold font-mono text-brand-neutral-white">49 000 UZS</span>
              <span className="text-xs text-brand-neutral-textMuted">/ 30 kun</span>
            </div>

            <ul className="text-xs text-brand-neutral-grayLight space-y-2 border-t border-brand-navy-light/40 pt-3">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-brand-purple-light shrink-0" />
                <span>To'liq 4-qismli CEFR Speaking Mock Testlari</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-brand-purple-light shrink-0" />
                <span>O'z ovozingizni yozuvlarini qayta tinglash</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-brand-purple-light shrink-0" />
                <span>Heuristic ball hisoblash & Recovery Plan</span>
              </li>
            </ul>
          </div>

          {/* Payment execution steps */}
          <div className="glass-card p-4 border-brand-navy-light/40 space-y-4">
            <h3 className="text-xs font-bold font-display uppercase tracking-wider text-brand-neutral-textMuted border-b border-brand-navy-light/40 pb-2">
              Manual to'lov qilish tartibi
            </h3>

            <div className="space-y-3.5 text-xs">
              <div className="flex gap-3">
                <span className="h-5 w-5 bg-brand-navy-light text-brand-neutral-textMuted rounded-full flex items-center justify-center shrink-0 font-bold">1</span>
                <p className="text-brand-neutral-grayLight leading-relaxed">
                  Quyidagi Humo yoki Uzcard kartasiga <strong>49 000 UZS</strong> o'tkazing:
                  <code className="block bg-brand-navy-base p-2 rounded-lg border border-brand-navy-light/40 font-mono text-brand-neutral-grayLight mt-1.5 select-all">
                    8600 1404 9999 8888
                  </code>
                  <span className="text-[10px] text-brand-neutral-textMuted mt-0.5 block">Qabul qiluvchi: Speakora MChJ</span>
                </p>
              </div>

              <div className="flex gap-3">
                <span className="h-5 w-5 bg-brand-navy-light text-brand-neutral-textMuted rounded-full flex items-center justify-center shrink-0 font-bold">2</span>
                <p className="text-brand-neutral-grayLight leading-relaxed">
                  O'tkazma muvaffaqiyatli amalga oshganidan so'ng, to'lov kvitansiyasini (chek) rasm yoki skrinshot ko'rinishida saqlab oling.
                </p>
              </div>

              <div className="flex gap-3">
                <span className="h-5 w-5 bg-brand-navy-light text-brand-neutral-textMuted rounded-full flex items-center justify-center shrink-0 font-bold">3</span>
                <p className="text-brand-neutral-grayLight leading-relaxed">
                  Quyidagi panel orqali chek rasmini yuklang va yuboring.
                </p>
              </div>
            </div>
          </div>

          {/* Upload card */}
          <div className="glass-card p-5 border-brand-navy-light/40 text-center space-y-4">
            <h3 className="text-xs font-bold font-display uppercase tracking-wider text-brand-neutral-textMuted border-b border-brand-navy-light/40 pb-2 text-left">
              Chekni yuborish
            </h3>

            {rejectedPayment && (
              <div className="bg-brand-error/10 border border-brand-error/30 text-brand-error text-xs rounded-xl p-3 flex items-start gap-2 text-left">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <div>
                  <strong>To'lovingiz rad etildi:</strong>
                  <p className="text-[10px] text-brand-neutral-textMuted mt-0.5">{rejectedPayment.rejection_reason || "Chek noto'g'ri yuklandi."}</p>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="bg-brand-error/10 border border-brand-error/30 text-brand-error text-xs rounded-xl p-2.5 animate-scale-in">
                {errorMsg}
              </div>
            )}

            {success && (
              <div className="bg-brand-success/10 border border-brand-success/30 text-brand-success text-xs rounded-xl p-2.5 flex items-center justify-center gap-1.5 animate-scale-in">
                <CheckCircle className="h-4 w-4" /> Chek muvaffaqiyatli yuborildi!
              </div>
            )}

            {receiptBase64 ? (
              <div className="relative rounded-xl border border-brand-navy-light/40 overflow-hidden bg-brand-navy-base p-2 max-w-[200px] mx-auto animate-scale-in">
                <img src={receiptBase64} alt="Check Preview" className="h-28 w-full object-contain rounded" />
                <button 
                  onClick={() => setReceiptBase64('')}
                  className="absolute top-1 right-1 bg-brand-error text-brand-neutral-white rounded-full p-1 hover:bg-brand-error/80"
                >
                  ✕
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-brand-navy-light/40 hover:border-brand-purple-base/50 rounded-xl p-6 cursor-pointer bg-brand-navy-dark/30 transition-colors">
                <UploadCloud className="h-8 w-8 text-brand-neutral-textMuted mb-2" />
                <span className="text-xs font-semibold text-brand-neutral-textMuted">Rasm yuklash</span>
                <span className="text-[9px] text-brand-neutral-textMuted mt-1">PNG, JPG, JPEG formats (Max 2MB)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}

            <button
              onClick={handleUploadSubmit}
              disabled={submitting || !receiptBase64}
              className={`w-full btn-primary py-2.5 text-xs flex items-center justify-center gap-1 font-bold ${
                submitting || !receiptBase64 ? 'opacity-40 cursor-not-allowed' : ''
              }`}
            >
              {submitting ? 'Yuborilmoqda...' : 'Tasdiqlash uchun yuborish'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
