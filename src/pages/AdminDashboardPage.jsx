import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Check, X, ShieldAlert, Users, Award, Image, ArrowLeft } from 'lucide-react';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { user, payments, allUsers, approvePayment, rejectPayment, setUser } = useApp();

  const [rejectionReasons, setRejectionReasons] = useState({}); // { paymentId: text }
  const [activeReasonInput, setActiveReasonInput] = useState(null); // paymentId
  const [selectedImage, setSelectedImage] = useState(null); // base64/url to show in modal

  // Guard: Admin role check
  React.useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    if (user.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'admin') return null;

  const pendingPayments = payments.filter(p => p.status === 'pending');
  const otherPayments = payments.filter(p => p.status !== 'pending');

  const handleApprove = async (payId) => {
    if (window.confirm("Haqiqatan ham ushbu to'lovni tasdiqlamoqchisiz?")) {
      await approvePayment(payId);
    }
  };

  const handleRejectSubmit = async (payId) => {
    const reason = rejectionReasons[payId] || '';
    if (!reason.trim()) {
      alert("Iltimos, rad etish sababini yozing.");
      return;
    }
    await rejectPayment(payId, reason);
    setActiveReasonInput(null);
  };

  // Quick feature for testers: switch account mode instantly to check different flows
  const simulateUserRoleSwitch = (targetStatus) => {
    const updated = { ...user, subscription_status: targetStatus };
    setUser(updated);
    alert(`Profilingiz holati ${targetStatus} ga o'zgartirildi!`);
  };

  return (
    <div className="space-y-6 pb-6 animate-fade-in text-brand-neutral-white">
      {/* Title Header */}
      <div className="border-b border-brand-navy-light/40 pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-display flex items-center gap-1.5 text-brand-error">
            <ShieldAlert className="h-5 w-5" /> Admin Panel
          </h2>
          <p className="text-xs text-brand-neutral-textMuted">To'lov cheklarini tekshirish va a'zoliklarni boshqarish</p>
        </div>
      </div>

      {/* Simulator Tools for paired testing */}
      <div className="glass-card p-4 border-dashed border-brand-purple-base/30 bg-brand-purple-glow space-y-3 glass-card-hover">
        <h3 className="text-xs font-bold font-display uppercase tracking-wider text-brand-purple-light flex items-center gap-1">
          <ShieldCheck className="h-4 w-4" /> Ishlab chiquvchi testi simulyatori
        </h3>
        <p className="text-[10px] text-brand-neutral-textMuted leading-normal">
          Ushbu platformani tekshirishingizni osonlashtirish uchun o'z profilingiz holatini shu yerdan o'zgartirib ko'rishingiz mumkin:
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => simulateUserRoleSwitch('free')}
            className="flex-1 bg-brand-navy-light hover:bg-brand-navy-light/80 text-brand-neutral-grayLight font-semibold py-1.5 rounded text-[10px] border border-brand-navy-light/40 transition-colors"
          >
            FREE qilish
          </button>
          <button
            onClick={() => simulateUserRoleSwitch('pending')}
            className="flex-1 bg-brand-warning/10 hover:bg-brand-warning/20 text-brand-warning font-semibold py-1.5 rounded text-[10px] border border-brand-warning/20 transition-colors"
          >
            PENDING qilish
          </button>
          <button
            onClick={() => simulateUserRoleSwitch('premium')}
            className="flex-1 bg-brand-success/10 hover:bg-brand-success/20 text-brand-success font-semibold py-1.5 rounded text-[10px] border border-brand-success/20 transition-colors"
          >
            PREMIUM qilish
          </button>
        </div>
      </div>

      {/* Pending approvals section */}
      <div>
        <h3 className="text-xs font-bold font-display uppercase tracking-wider text-brand-neutral-textMuted mb-3 flex items-center gap-1.5">
          <Image className="h-4 w-4 text-brand-warning animate-pulse-slow" /> Kutilayotgan to'lovlar ({pendingPayments.length} ta)
        </h3>

        {pendingPayments.length === 0 ? (
          <div className="glass-card p-5 text-center text-xs text-brand-neutral-textMuted">
            Hozirda kutilayotgan to'lovlar yo'q.
          </div>
        ) : (
          <div className="space-y-4">
            {pendingPayments.map(p => (
              <div key={p.id} className="glass-card p-4 border-brand-navy-light/40 space-y-3.5 text-xs">
                {/* User Info */}
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold font-display text-brand-neutral-white">{p.user_name}</h4>
                    <span className="text-[10px] text-brand-neutral-textMuted">{p.user_email}</span>
                  </div>
                  <span className="text-[9px] text-brand-neutral-textMuted">
                    {new Date(p.created_at).toLocaleDateString('uz-UZ')}
                  </span>
                </div>

                {/* Receipt Screenshot */}
                <div 
                  onClick={() => setSelectedImage(p.receipt_url)}
                  className="relative h-32 bg-brand-navy-base border border-brand-navy-light/40 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <img src={p.receipt_url} alt="Kvitansiya" className="h-full w-full object-contain" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-[10px] font-bold text-brand-neutral-grayLight uppercase opacity-0 hover:opacity-100 transition-opacity">
                    Kattalashtirish
                  </div>
                </div>

                {/* Action buttons */}
                {activeReasonInput === p.id ? (
                  <div className="space-y-2 animate-scale-in">
                    <input
                      type="text"
                      placeholder="Rad etilish sababini kiriting..."
                      value={rejectionReasons[p.id] || ''}
                      onChange={(e) => setRejectionReasons({ ...rejectionReasons, [p.id]: e.target.value })}
                      className="w-full glass-input text-[11px] py-1.5"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRejectSubmit(p.id)}
                        className="flex-1 bg-brand-error hover:bg-brand-error/80 text-brand-neutral-white font-bold py-1.5 rounded text-[10px]"
                      >
                        Yuborish
                      </button>
                      <button
                        onClick={() => setActiveReasonInput(null)}
                        className="flex-1 bg-brand-navy-light hover:bg-brand-navy-light/80 text-brand-neutral-textMuted py-1.5 rounded text-[10px]"
                      >
                        Bekor qilish
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(p.id)}
                      className="flex-1 bg-brand-success hover:bg-brand-success/80 text-white font-bold py-2 rounded flex items-center justify-center gap-1 text-[10px]"
                    >
                      <Check className="h-3.5 w-3.5" /> Tasdiqlash
                    </button>
                    <button
                      onClick={() => setActiveReasonInput(p.id)}
                      className="flex-1 bg-brand-error/10 hover:bg-brand-error/20 text-brand-error font-bold py-2 rounded border border-brand-error/20 flex items-center justify-center gap-1 text-[10px]"
                    >
                      <X className="h-3.5 w-3.5" /> Rad etish
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Users Database list */}
      <div>
        <h3 className="text-xs font-bold font-display uppercase tracking-wider text-brand-neutral-textMuted mb-3 flex items-center gap-1.5">
          <Users className="h-4 w-4 text-brand-purple-light" /> Barcha foydalanuvchilar ({allUsers.length} ta)
        </h3>

        <div className="glass-card overflow-hidden border-brand-navy-light/40">
          <table className="w-full text-xs text-left">
            <thead className="bg-brand-navy-base border-b border-brand-navy-light/40 text-[10px] uppercase text-brand-neutral-textMuted font-bold">
              <tr>
                <th className="p-3">Foydalanuvchi</th>
                <th className="p-3 text-right">A'zolik</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-navy-light/20">
              {allUsers.map(u => (
                <tr key={u.id} className="hover:bg-brand-navy-light/10 transition-colors">
                  <td className="p-3">
                    <div className="font-bold text-brand-neutral-grayLight">{u.full_name}</div>
                    <div className="text-[10px] text-brand-neutral-textMuted">{u.email}</div>
                  </td>
                  <td className="p-3 text-right">
                    <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      u.subscription_status === 'premium'
                        ? 'bg-brand-success/10 text-brand-success border border-brand-success/20'
                        : u.subscription_status === 'pending'
                        ? 'bg-brand-warning/10 text-brand-warning border border-brand-warning/20'
                        : 'bg-brand-navy-light text-brand-neutral-textMuted'
                    }`}>
                      {u.subscription_status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Image Preview Modal Overlay */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-sm max-h-[80vh] w-full flex flex-col items-center">
            <img src={selectedImage} alt="Kvitansiya Zoom" className="w-full h-full object-contain rounded-xl" />
            <button
              onClick={() => setSelectedImage(null)}
              className="mt-4 bg-brand-navy-light text-brand-neutral-grayLight px-4 py-1.5 rounded-lg text-xs font-bold"
            >
              Yopish
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
