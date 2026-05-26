import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Sparkles, Play, Lock, CheckCircle, FileText, ChevronRight, History, Award, BookOpen } from 'lucide-react';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, challenges, completedChallenges, completedExams } = useApp();

  // Guard: if not logged in, go back to landing page
  React.useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user) return null;

  // Statistics calculations
  const totalCompletedChallengesCount = completedChallenges.filter(cc => cc.user_id === user.id).length;
  const premiumActive = user.subscription_status === 'premium' || user.role === 'admin';
  const isPending = user.subscription_status === 'pending';

  const userExamAttempts = completedExams.filter(ce => ce.user_id === user.id);

  const getChallengeStatus = (id) => {
    return completedChallenges.some(cc => cc.user_id === user.id && cc.challenge_id === id);
  };

  const getChallengeScore = (id) => {
    const found = completedChallenges.find(cc => cc.user_id === user.id && cc.challenge_id === id);
    return found ? found.analysis_metadata?.score : null;
  };

  return (
    <div className="space-y-6 pb-6 animate-fade-in">
      {/* Welcome Card */}
      <div className="glass-card p-5 bg-gradient-to-br from-brand-purple-base/10 to-brand-navy-dark/40 border-brand-navy-light/40">
        <span className="text-[10px] text-brand-purple-light font-display font-bold uppercase tracking-widest">Sinfxonangiz</span>
        <h2 className="text-xl font-bold font-display mt-1 text-brand-neutral-white">
          Salom, {user.full_name}! 👋
        </h2>
        <p className="text-xs text-brand-neutral-textMuted mt-1 leading-relaxed">
          Bugun speaking mahoratingizni yaxshilash va qotib qolmasdan gapirish uchun qanday mashq qilamiz?
        </p>

        {/* Small stats badges */}
        <div className="flex gap-4 mt-4 border-t border-brand-navy-light/40 pt-3">
          <div className="flex items-center gap-1.5 text-xs">
            <BookOpen className="h-4 w-4 text-brand-purple-light" />
            <span className="text-brand-neutral-grayLight">Kunlik mashqlar: <strong>{totalCompletedChallengesCount} ta</strong></span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <Award className="h-4 w-4 text-brand-success" />
            <span className="text-brand-neutral-grayLight">Mock testlar: <strong>{userExamAttempts.length} ta</strong></span>
          </div>
        </div>
      </div>

      {/* Subscription Callout Banner */}
      {!premiumActive && (
        <div className="glass-card p-4 border-brand-purple-base/30 bg-brand-purple-glow flex flex-col justify-between items-start gap-3 relative overflow-hidden glass-card-hover">
          <div className="absolute top-0 right-0 px-2 py-0.5 bg-brand-gold-base/20 text-brand-gold-base rounded-bl-lg text-[9px] font-bold tracking-widest uppercase">
            Aksiya
          </div>
          <div>
            <h3 className="font-bold font-display text-sm text-brand-purple-light flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-brand-gold-base animate-pulse" /> Full CEFR Mock Testni oching
            </h3>
            <p className="text-[10px] text-brand-neutral-textMuted mt-1 leading-relaxed">
              {isPending 
                ? "To'lovingiz hozirda tekshirilmoqda. Admin tomonidan tasdiqlanishi bilan to'liq mock imtihonlari ochiladi." 
                : "Real vaqt chekloviga ega to'liq 4 qismli mock imtihonlar va unga qo'shimcha shaxsiy o'sish hisobotlarini oling."
              }
            </p>
          </div>
          <button
            onClick={() => navigate('/billing')}
            className="w-full btn-secondary py-1.5 text-xs font-bold"
          >
            {isPending ? "To'lov holatini ko'rish" : "Hozir premiumga o'tish"}
          </button>
        </div>
      )}

      {/* Daily Challenges Section */}
      <div>
        <h3 className="text-xs font-bold font-display uppercase tracking-wider text-brand-neutral-textMuted mb-3 flex items-center gap-1">
          <BookOpen className="h-3.5 w-3.5 text-brand-purple-light" /> Kunlik tuzilma mashqlari (Daily Challenges)
        </h3>

        <div className="space-y-3">
          {challenges.map((c) => {
            const isCompleted = getChallengeStatus(c.id);
            const score = getChallengeScore(c.id);

            return (
              <div 
                key={c.id} 
                className="glass-card glass-card-hover p-4 border-brand-navy-light/40 flex items-center justify-between"
              >
                <div className="space-y-1 pr-3 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold bg-brand-navy-light/60 text-brand-neutral-textMuted px-1.5 py-0.5 rounded border border-brand-navy-light/40">
                      {c.difficulty}
                    </span>
                    <span className="text-[11px] font-bold font-display text-brand-purple-light">
                      {c.topicUz}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold font-display text-brand-neutral-grayLight line-clamp-2">
                    {c.question}
                  </h4>
                  {isCompleted && score && (
                    <span className="inline-flex items-center gap-1 text-[9px] text-brand-success font-semibold mt-1">
                      <CheckCircle className="h-3 w-3" /> Natija: {score}%
                    </span>
                  )}
                </div>

                <button
                  onClick={() => navigate(`/challenge/${c.id}`)}
                  className={`h-9 w-9 rounded-xl flex items-center justify-center transition-all ${
                    isCompleted 
                      ? 'bg-brand-navy-light text-brand-neutral-grayLight hover:bg-brand-navy-light/80' 
                      : 'bg-brand-purple-base text-brand-neutral-white hover:bg-brand-purple-base/90 shadow-md shadow-purpleGlow'
                  }`}
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mock Exams Launcher Section */}
      <div>
        <h3 className="text-xs font-bold font-display uppercase tracking-wider text-brand-neutral-textMuted mb-3 flex items-center gap-1">
          <Award className="h-3.5 w-3.5 text-brand-gold-base" /> Premium CEFR Mock Imtihonlar
        </h3>

        <div className="glass-card p-5 border-brand-navy-light/40 relative overflow-hidden bg-brand-navy-dark/40 glass-card-hover">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-[10px] font-bold bg-brand-success/10 text-brand-success border border-brand-success/20 px-2 py-0.5 rounded-full uppercase">
                4-Qismli Test
              </span>
              <h4 className="text-sm font-bold font-display text-brand-neutral-white mt-2">
                CEFR Speaking Mock Test - Set A
              </h4>
              <p className="text-[10px] text-brand-neutral-textMuted mt-1 leading-relaxed">
                Personal short question, picture comparison, long topic discussion hamda debate qismlarini o'z ichiga olgan real imtihon simulyatsiyasi.
              </p>
            </div>
            
            {!premiumActive && (
              <div className="bg-brand-navy-base border border-brand-navy-light/40 rounded-lg p-2 text-brand-neutral-textMuted">
                <Lock className="h-4.5 w-4.5" />
              </div>
            )}
          </div>

          {premiumActive ? (
            <button
              onClick={() => navigate('/exam/lobby')}
              className="w-full btn-primary py-2 text-xs flex items-center justify-center gap-1.5 font-bold animate-pulse-slow"
            >
              Imtihon zaliga kirish <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={() => navigate('/billing')}
              className="w-full btn-secondary py-2 text-xs flex items-center justify-center gap-1.5 font-bold"
            >
              Premium sotib olib ochish <Lock className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Attempt History Section */}
      {userExamAttempts.length > 0 && (
        <div>
          <h3 className="text-xs font-bold font-display uppercase tracking-wider text-brand-neutral-textMuted mb-3 flex items-center gap-1">
            <History className="h-3.5 w-3.5 text-brand-purple-light" /> Mock imtihonlar tarixi
          </h3>

          <div className="space-y-2">
            {userExamAttempts.map((attempt) => (
              <div 
                key={attempt.id}
                onClick={() => navigate(`/exam/report/${attempt.id}`)}
                className="glass-card glass-card-hover p-3 border-brand-navy-light/40 flex items-center justify-between cursor-pointer text-xs"
              >
                <div className="space-y-0.5">
                  <h4 className="font-bold font-display text-brand-neutral-white">CEFR Test - Set A</h4>
                  <span className="text-[10px] text-brand-neutral-textMuted">
                    Topshirilgan sana: {new Date(attempt.completed_at).toLocaleDateString('uz-UZ')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-brand-gold-base bg-brand-gold-base/5 border border-brand-gold-base/10 rounded px-2 py-0.5 font-mono">
                    Level {attempt.target_score}
                  </span>
                  <ChevronRight className="h-4 w-4 text-brand-neutral-textMuted" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
