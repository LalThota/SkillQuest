import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizStore } from '../store/useQuizStore';
import { motion } from 'framer-motion';
import { Award, Zap, AlertCircle, RefreshCw, Home } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ResultPage() {
  const result = useQuizStore(state => state.result);
  const resetQuiz = useQuizStore(state => state.resetQuiz);
  const navigate = useNavigate();

  useEffect(() => {
    if (!result) {
      navigate('/dashboard');
    } else {
      if (result.levelUp?.leveledUp) {
        toast.custom((t) => (
          <div className="bg-brand-gold text-brand-navy p-4 rounded-lg shadow-xl flex items-center gap-4 border-2 border-yellow-300">
             <div className="text-3xl">🎉</div>
             <div>
               <h3 className="font-bold font-space">Level Up!</h3>
               <p className="text-sm">You reached Level {result.levelUp.newLevel} ({result.levelUp.title})</p>
             </div>
          </div>
        ), { duration: 5000 });
      }

      if (result.newBadges?.length > 0) {
        result.newBadges.forEach((badge: any, i: number) => {
          setTimeout(() => {
            toast.custom((t) => (
               <div className="bg-[#111827] text-white border border-brand-violet p-4 rounded-lg shadow-xl flex items-center gap-4">
                 <div className="text-3xl">{badge.icon}</div>
                 <div>
                   <h3 className="font-bold text-brand-violet">Achievement Unlocked!</h3>
                   <p className="text-sm font-medium">{badge.name}</p>
                   <p className="text-xs text-gray-400">{badge.description}</p>
                 </div>
               </div>
            ));
          }, (i + 1) * 1500);
        });
      }
    }
  }, [result, navigate]);

  if (!result) return null;

  return (
    <div className="min-h-screen bg-brand-navy text-white p-4 md:p-8 font-inter">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-800/40 rounded-3xl p-8 text-center border top-0 border-brand-violet/30"
        >
          <div className="inline-flex justify-center items-center w-24 h-24 rounded-full bg-brand-violet/20 border-4 border-brand-violet mb-6">
            <span className="text-3xl font-space font-bold">{result.accuracy}%</span>
          </div>
          <h1 className="text-3xl font-space font-bold mb-2">Quiz Completed!</h1>
          <p className="text-gray-400">You scored {result.score} out of {result.total}</p>

          <div className="flex justify-center gap-6 mt-8">
             <div className="bg-gray-900/50 p-4 rounded-2xl min-w-[120px] border border-gray-700">
               <Zap className="w-8 h-8 text-brand-gold mx-auto mb-2" />
               <div className="text-2xl font-bold font-space text-brand-gold">+{result.xpEarned}</div>
               <div className="text-xs text-gray-400 uppercase tracking-wide mt-1">XP Earned</div>
             </div>
             
             {result.streak?.streakMaintained && (
               <div className="bg-gray-900/50 p-4 rounded-2xl min-w-[120px] border border-gray-700">
                 <Award className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                 <div className="text-2xl font-bold font-space">{result.streak.newStreak}</div>
                 <div className="text-xs text-gray-400 uppercase tracking-wide mt-1">Day Streak</div>
               </div>
             )}
          </div>
        </motion.div>

        <div className="space-y-4">
          <h2 className="text-xl font-space font-bold px-2">Question Review</h2>
          {result.questions.map((q: any, i: number) => (
            <div key={q.questionId} className={`p-6 rounded-xl border ${q.isCorrect ? 'bg-brand-emerald/10 border-brand-emerald/30' : 'bg-brand-crimson/10 border-brand-crimson/30'}`}>
               <div className="flex items-start gap-4">
                 <div className="mt-1">
                   {q.isCorrect ? (
                     <div className="w-6 h-6 rounded-full bg-brand-emerald flex items-center justify-center text-white font-bold text-sm">✓</div>
                   ) : (
                     <div className="w-6 h-6 rounded-full bg-brand-crimson flex items-center justify-center text-white font-bold text-sm">✗</div>
                   )}
                 </div>
                 <div>
                   <p className="font-medium text-lg mb-4">{parseInt(q.timeTaken) === 0 ? '[Skipped]' : ''} {q.text}</p>
                   
                   <div className="space-y-2 mb-4 text-sm">
                     {q.options.map((opt: string, idx: number) => {
                       const isSelected = q.selectedIndex === idx;
                       const isActualCorrect = q.correctIndex === idx;
                       
                       let style = "bg-gray-900/50 border-gray-700 text-gray-400";
                       if (isActualCorrect) style = "bg-brand-emerald/20 border-brand-emerald text-brand-emerald";
                       else if (isSelected && !isActualCorrect) style = "bg-brand-crimson/20 border-brand-crimson text-brand-crimson";

                       return (
                         <div key={idx} className={`px-4 py-2 rounded-lg border ${style}`}>
                           {String.fromCharCode(65+idx)}. {opt}
                         </div>
                       )
                     })}
                   </div>

                   <div className="bg-gray-900/60 p-4 rounded-lg mt-4 border border-gray-700/50">
                     <p className="text-sm">
                       <span className="text-brand-violet font-bold mr-2">Explanation:</span>
                       <span className="text-gray-300">{q.explanation}</span>
                     </p>
                   </div>
                 </div>
               </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4 pb-12">
           <button 
             onClick={() => { resetQuiz(); navigate('/dashboard'); }}
             className="flex-1 bg-gray-800 hover:bg-gray-700 py-4 rounded-xl flex items-center justify-center gap-2 font-medium transition-colors"
           >
             <Home className="w-5 h-5" /> Dashboard
           </button>
           <button 
             onClick={() => { resetQuiz(); navigate('/quiz?mode=quick'); }}
             className="flex-1 bg-brand-violet hover:bg-violet-700 py-4 rounded-xl flex items-center justify-center gap-2 font-medium shadow-[0_0_15px_rgba(124,58,237,0.4)] transition-colors text-white"
           >
             <RefreshCw className="w-5 h-5" /> Practice Again
           </button>
        </div>

      </div>
    </div>
  );
}
