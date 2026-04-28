import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../lib/constants';
import { useQuizStore } from '../store/useQuizStore';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen, Clock, AlertCircle, CheckCircle, ChevronDown, ChevronUp, Lightbulb, Sparkles, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

type PracticeMode = 'learn' | 'exam' | 'weak';

/* =============== TOPIC CONCEPT DATA =============== */
const TOPIC_CONCEPTS: Record<string, { summary: string; formulas: string[]; tips: string[] }> = {
  // Aptitude
  'Percentages': { summary: 'A percentage is a fraction with denominator 100. X% means X out of 100.', formulas: ['X% of Y = (X × Y) / 100', 'Percentage change = (Change / Original) × 100', 'If price ↑ X%, to restore: decrease by (X/(100+X))×100 %'], tips: ['Convert fractions to percentages by multiplying by 100', 'Successive % changes: use the net effect formula'] },
  'Ratios': { summary: 'A ratio compares two quantities. a:b means for every a units of first, there are b of second.', formulas: ['If a:b = c:d, then a×d = b×c (cross multiply)', 'Dividing N in ratio a:b → parts = Na/(a+b), Nb/(a+b)'], tips: ['Always simplify ratios to lowest terms', 'Use LCM when comparing multiple ratios'] },
  'Time & Work': { summary: 'Work problems relate the rate of work to time taken to complete a task.', formulas: ['If A does work in x days → A\'s 1-day work = 1/x', 'A & B together: 1/x + 1/y = 1/T', 'Efficiency = Total work / Time'], tips: ['Assume total work = LCM of individual times', 'Pipes & cisterns follow the same logic'] },
  'Profit & Loss': { summary: 'Profit = SP - CP. Loss = CP - SP. Related to percentages.', formulas: ['Profit% = (Profit/CP) × 100', 'SP = CP × (1 + Profit%/100)', 'Discount% = (Discount/MP) × 100'], tips: ['Mark-up is on CP, Discount is on MP', 'If CP=SP, there is no profit or loss'] },
  'Averages': { summary: 'Average = Sum of all values / Number of values.', formulas: ['Average = ΣX / N', 'New avg when element added: (old_sum + new) / (N+1)', 'Weighted avg: Σ(value × weight) / Σweights'], tips: ['If one value changes, new avg = old avg ± change/N', 'In AP, average = middle term'] },
  'Ages': { summary: 'Age problems deal with relative ages at different time periods.', formulas: ['Present age of A = x, B = y', 'After t years: x+t, y+t', 'Ratio changes by adding/subtracting same years to both'], tips: ['Let present age be the variable', 'The difference between ages stays constant'] },
  'Speed & Distance': { summary: 'Distance = Speed × Time. These three are interconnected.', formulas: ['Speed = Distance / Time', 'Relative speed (same dir) = |S1 - S2|', 'Relative speed (opp dir) = S1 + S2', 'Average speed = 2S1×S2/(S1+S2) for equal distances'], tips: ['Convert km/h to m/s: multiply by 5/18', 'For trains: add length to distance when crossing'] },
  'Simple & Compound Interest': { summary: 'SI grows linearly, CI grows exponentially.', formulas: ['SI = PRT/100', 'CI = P(1 + R/100)^T - P', 'Amount = P + Interest'], tips: ['CI - SI for 2 years = P(R/100)²', 'For half-yearly: rate/2, time×2'] },
  'Mixtures & Alligations': { summary: 'Used to find the ratio in which ingredients are mixed.', formulas: ['Alligation: ratio = (d2-m)/(m-d1)', 'where d1, d2 are costs and m is mean price'], tips: ['Draw the alligation cross for quick solving', 'Serial dilution: use repeated alligation'] },
  // Reasoning
  'Syllogisms': { summary: 'Logical deductions from two given statements using Venn diagrams.', formulas: ['All A are B + All B are C → All A are C', 'Some A are B → Some B are A (converse)', 'No A are B → No B are A'], tips: ['Draw Venn diagrams for each statement', '"Some" means at least one — could be all'] },
  'Blood Relations': { summary: 'Determine family relationships from given clues.', formulas: ['Father\'s/Mother\'s father = Grandfather', 'Sister\'s husband = Brother-in-law', 'Father\'s brother = Uncle; Mother\'s brother = Maternal uncle'], tips: ['Draw a family tree from the clues', 'Identify gender keywords: he/she, son/daughter'] },
  'Coding-Decoding': { summary: 'A system where letters/numbers are substituted by a pattern.', formulas: ['Letter shift: A+1=B, B+2=D, etc.', 'Reverse coding: Z=A, Y=B', 'Position-based: A=1, B=2, ... Z=26'], tips: ['First identify the pattern from given examples', 'Check if shifts are constant or variable'] },
  'Number Series': { summary: 'Find the pattern and predict the next number in a sequence.', formulas: ['Common patterns: +n, ×n, n², n³, Fibonacci', 'Difference series: find differences between terms', 'Nested patterns: alternating operations'], tips: ['Calculate differences first', 'Check for squares, cubes, primes'] },
  // Verbal
  'Synonyms': { summary: 'Words with same or similar meanings.', formulas: [], tips: ['Read extensively to build vocabulary', 'Use root words to guess meanings', 'Context clues in sentences help narrow choices'] },
  'Antonyms': { summary: 'Words with opposite meanings.', formulas: [], tips: ['Learn words in pairs (hot/cold)', 'Prefixes like un-, in-, dis- often create antonyms', 'Degree matters: hot vs warm vs cold'] },
  'Reading Comprehension': { summary: 'Answer questions based on a given passage.', formulas: [], tips: ['Read the questions first, then the passage', 'Look for main idea, tone, and specific details', 'Eliminate obviously wrong options'] },
  // Coding
  'Arrays': { summary: 'A contiguous block of memory storing elements of the same type. Fundamental data structure.', formulas: ['Access: O(1)', 'Search: O(n) linear, O(log n) binary', 'Insert/Delete: O(n) worst case'], tips: ['Two-pointer technique for sorted arrays', 'Sliding window for subarray problems', 'Use prefix sums for range queries'] },
  'Strings': { summary: 'Sequence of characters. String operations are common in interviews.', formulas: ['Reversal: O(n)', 'Substring search: O(n×m) brute force, O(n) KMP', 'Anagram check: compare sorted or use frequency map'], tips: ['Most string problems can use hash maps', 'StringBuilder for concatenation in loops', 'Two pointers for palindrome checks'] },
  'Sorting Concepts': { summary: 'Arranging elements in order. Foundation for many algorithms.', formulas: ['Bubble/Selection/Insertion: O(n²)', 'Merge Sort: O(n log n), stable', 'Quick Sort: O(n log n) avg, O(n²) worst'], tips: ['Know when each sorting algorithm is best', 'Merge sort for linked lists', 'Counting sort for small ranges: O(n+k)'] },
  'Recursion Logic': { summary: 'A function that calls itself to solve smaller subproblems.', formulas: ['Base case + Recursive case', 'Stack space: O(depth)', 'T(n) = T(n-1) + O(1) → O(n)'], tips: ['Always define the base case first', 'Trace through small examples', 'Memoization turns recursion into DP'] },
  'Time Complexity MCQs': { summary: 'Analyze algorithm efficiency in terms of input size.', formulas: ['O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ)', 'Nested loops: multiply complexities', 'Binary search: O(log n)'], tips: ['Count the number of operations as function of n', 'Drop constants and lower-order terms', 'Best/Average/Worst cases may differ'] },
  'Output Prediction': { summary: 'Predict what a code snippet will print based on language rules.', formulas: [], tips: ['Trace variable values step by step', 'Watch for operator precedence', 'Understand pass-by-value vs pass-by-reference'] },
  // Data Interpretation
  'Bar Charts': { summary: 'Compare values across categories using rectangular bars.', formulas: ['% share = (category value / total) × 100', 'Growth rate = ((new-old)/old) × 100'], tips: ['Always check the scale/axis labels', 'Compare heights for quick comparison'] },
  'Pie Charts': { summary: 'Circular chart divided into sectors showing proportions.', formulas: ['Sector angle = (value / total) × 360°', 'Value = (angle / 360) × total'], tips: ['Central angles are proportional to values', 'Convert percentages to actual values for comparison'] },
  'Line Graphs': { summary: 'Show trends over time using connected data points.', formulas: ['Slope = (y2-y1)/(x2-x1) = rate of change'], tips: ['Steeper slope = faster change', 'Where lines cross = equal values'] },
  'Tables': { summary: 'Data organized in rows and columns for precise comparison.', formulas: ['Use row/column operations for totals, averages'], tips: ['Read headers carefully', 'Calculate required values step by step'] },
};

const defaultConcept = { summary: 'Practice questions on this topic to build mastery.', formulas: [], tips: ['Break problems into smaller steps', 'Practice daily for consistency', 'Review incorrect answers to learn patterns'] };

export default function TopicPracticePage() {
  const { cat, topic } = useParams<{ cat: string; topic: string }>();
  const navigate = useNavigate();
  const category = CATEGORIES.find(c => c.id === cat);
  const decodedTopic = topic ? decodeURIComponent(topic) : '';
  const startTopicPractice = useQuizStore(s => s.startTopicPractice);

  const [mode, setMode] = useState<PracticeMode>('learn');
  const [questionCount, setQuestionCount] = useState(15);
  const [showConcept, setShowConcept] = useState(true);
  const [isStarting, setIsStarting] = useState(false);

  if (!category) return <div className="min-h-screen bg-brand-navy flex items-center justify-center text-white">Category not found</div>;

  const concept = TOPIC_CONCEPTS[decodedTopic] || defaultConcept;

  const handleStart = async () => {
    setIsStarting(true);
    try {
      await startTopicPractice(category.id, decodedTopic, questionCount, mode);
      navigate('/quiz');
    } catch (err) {
      toast.error('Failed to load questions. Try again.');
      setIsStarting(false);
    }
  };

  const modes: { key: PracticeMode; label: string; desc: string; icon: React.ReactNode; color: string; gradient: string }[] = [
    { key: 'learn', label: 'Learn Mode', desc: 'Untimed • See explanation after each answer • +5 XP per correct', icon: <BookOpen className="w-5 h-5" />, color: '#2dd4bf', gradient: 'from-teal-500/20 to-teal-600/5' },
    { key: 'exam', label: 'Exam Mode', desc: 'Timed (45s/question) • Full XP rewards • Final review', icon: <Clock className="w-5 h-5" />, color: '#7C3AED', gradient: 'from-violet-500/20 to-violet-600/5' },
    { key: 'weak', label: 'Weak Focus', desc: 'Only your previously wrong answers • Targeted practice', icon: <AlertCircle className="w-5 h-5" />, color: '#ef4444', gradient: 'from-red-500/20 to-red-600/5' },
  ];

  return (
    <div className="min-h-screen bg-brand-navy text-white p-4 md:p-8 font-inter">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.button
          onClick={() => navigate(`/categories/${category.id}/mode`)}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to {category.label}
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-2"
        >
          <div className="text-4xl w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `${category.color}15`, border: `1px solid ${category.color}30` }}>
            {category.icon}
          </div>
          <div>
            <h1 className="text-2xl font-space font-bold">{decodedTopic}</h1>
            <p className="text-gray-400 text-sm flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: category.color }} />
              {category.label}
            </p>
          </div>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800/40 rounded-xl p-4 my-6 border border-gray-700/50 flex items-center justify-between backdrop-blur-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${category.color}20` }}>
              <CheckCircle className="w-5 h-5" style={{ color: category.color }} />
            </div>
            <div>
              <span className="text-sm text-gray-400">Your accuracy</span>
              <span className="ml-2 font-bold" style={{ color: category.color }}>—%</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-gray-500 text-sm">0 Qs practiced</span>
          </div>
        </motion.div>

        {/* === CONCEPT CARD === */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-gray-800/40 rounded-2xl border border-gray-700/50 mb-6 overflow-hidden backdrop-blur-sm"
        >
          <button
            onClick={() => setShowConcept(!showConcept)}
            className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-800/60 transition-colors"
          >
            <h3 className="text-base font-semibold flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-400" /> Concept & Formulas — {decodedTopic}
            </h3>
            {showConcept ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </button>

          <AnimatePresence>
            {showConcept && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5 space-y-4">
                  <div className="bg-gray-900/60 rounded-xl p-4 border border-gray-700/30">
                    <p className="text-gray-300 text-sm leading-relaxed">{concept.summary}</p>
                  </div>

                  {concept.formulas.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-teal-400 mb-2">📐 Key Formulas</h4>
                      <div className="space-y-2">
                        {concept.formulas.map((f, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-gray-900/60 rounded-lg px-4 py-2.5 flex items-start gap-3 border border-gray-700/30"
                          >
                            <span className="text-teal-500 font-mono text-xs mt-0.5 font-bold shrink-0">{i + 1}.</span>
                            <code className="text-sm text-gray-200 font-mono break-words">{f}</code>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-semibold text-yellow-400 mb-2">💡 Pro Tips</h4>
                    <ul className="space-y-1.5">
                      {concept.tips.map((t, i) => (
                        <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                          <span className="text-yellow-500 mt-0.5">•</span> {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* === MODE SELECTION === */}
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Choose Practice Mode</h3>
        <div className="space-y-3 mb-6">
          {modes.map((m, i) => (
            <motion.button
              key={m.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setMode(m.key)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left relative overflow-hidden ${
                mode === m.key
                  ? 'bg-gray-800/60 border-opacity-60'
                  : 'bg-gray-800/30 border-gray-700/40 hover:border-gray-600'
              }`}
              style={{ borderColor: mode === m.key ? m.color : undefined }}
            >
              {/* Active glow */}
              {mode === m.key && (
                <motion.div
                  layoutId="modeGlow"
                  className={`absolute inset-0 bg-gradient-to-r ${m.gradient} pointer-events-none`}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <div className="relative z-10 flex items-center gap-4 w-full">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors`} style={{ borderColor: mode === m.key ? m.color : '#4b5563' }}>
                  {mode === m.key && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: m.color }}
                    />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span style={{ color: m.color }}>{m.icon}</span>
                    <span className="font-medium">{m.label}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{m.desc}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Question Count */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="flex items-center justify-between bg-gray-800/30 rounded-xl p-4 border border-gray-700/40 mb-8 backdrop-blur-sm"
        >
          <span className="text-sm text-gray-400">Number of Questions</span>
          <div className="flex items-center gap-2">
            {[5, 10, 15, 20].map(n => (
              <motion.button
                key={n}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setQuestionCount(n)}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  questionCount === n
                    ? 'text-white shadow-md'
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
                style={questionCount === n ? { backgroundColor: category.color, boxShadow: `0 4px 15px ${category.color}40` } : undefined}
              >
                {n}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Start Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleStart}
          disabled={isStarting}
          className="w-full py-4 rounded-xl font-bold text-lg transition-all relative overflow-hidden text-white disabled:opacity-60 group"
          style={{
            background: `linear-gradient(135deg, ${category.color}, #2dd4bf)`,
            boxShadow: `0 0 30px ${category.color}40`,
          }}
        >
          <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isStarting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                START PRACTICE — {questionCount} Questions
                <Zap className="w-4 h-4" />
              </>
            )}
          </span>
        </motion.button>
      </div>
    </div>
  );
}
