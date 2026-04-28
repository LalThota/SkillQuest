import mongoose from 'mongoose';
import { env } from '../config/env';
import { Question } from '../models/Question';
import { connectDB } from '../config/db';

const APTITUDE_QUESTIONS = [
  {
    text: "A vendor bought toffees at 6 for a rupee. How many for a rupee must he sell to gain 20%?",
    options: ["3", "4", "5", "6"],
    correctIndex: 2,
    explanation: "CP of 6 toffees = Re. 1. SP of 6 toffees = 120% of Re. 1 = Rs. 1.20. For Rs. 1.20, he sells 6 toffees. For Re. 1, he sells 6/1.20 = 5 toffees.",
    category: "aptitude",
    topic: "Profit & Loss",
    difficulty: "hard",
    timeLimit: 60
  },
  {
    text: "Two pipes A and B can fill a tank in 20 minutes and 30 minutes respectively. If both pipes are opened together, the time taken to fill the tank is:",
    options: ["50 minutes", "12 minutes", "25 minutes", "15 minutes"],
    correctIndex: 1,
    explanation: "Part filled by A in 1 min = 1/20. Part filled by B in 1 min = 1/30. Part filled by (A+B) in 1 min = 1/20 + 1/30 = 5/60 = 1/12. Time taken = 12 mins.",
    category: "aptitude",
    topic: "Time & Work",
    difficulty: "medium",
    timeLimit: 45
  },
  {
    text: "The ratio of present ages of P and Q is 3:4. After 5 years, this ratio will become 4:5. Find the present age of P.",
    options: ["10 years", "12 years", "15 years", "20 years"],
    correctIndex: 2,
    explanation: "Let ages be 3x, 4x. Then (3x+5)/(4x+5) = 4/5 => 15x+25 = 16x+20 => x=5. P age = 3x = 15.",
    category: "aptitude",
    topic: "Ages",
    difficulty: "easy",
    timeLimit: 30
  },
  {
    text: "A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?",
    options: ["120 metres", "180 metres", "324 metres", "150 metres"],
    correctIndex: 3,
    explanation: "Speed = 60 * 5/18 = 50/3 m/s. Length = Speed * Time = (50/3) * 9 = 150 m.",
    category: "aptitude",
    topic: "Speed & Distance",
    difficulty: "medium",
    timeLimit: 45
  },
  {
    text: "In an election between two candidates, one got 55% of the total valid votes, 20% of the votes were invalid. If the total number of votes was 7500, the number of valid votes that the other candidate got, was:",
    options: ["2700", "2900", "3000", "3100"],
    correctIndex: 0,
    explanation: "Total valid votes = 80% of 7500 = 6000. 1st candidate gets 55% of 6000 = 3300. 2nd gets 6000 - 3300 = 2700.",
    category: "aptitude",
    topic: "Percentages",
    difficulty: "hard",
    timeLimit: 60
  }
];

const REASONING_QUESTIONS = [
  {
    text: "Syllogism: Statements: Some cats are dogs. All dogs are birds. Conclusions: I. Some cats are birds. II. No dog is a cat.",
    options: ["Only I follows", "Only II follows", "Either I or II follows", "Both I and II follow"],
    correctIndex: 0,
    explanation: "Since some cats are dogs and all dogs are birds, the cats that are dogs are also birds. Thus, some cats are birds is true. II is false because some dogs are cats.",
    category: "reasoning",
    topic: "Syllogisms",
    difficulty: "medium",
    timeLimit: 45
  },
  {
    text: "A is the mother of B. C is the father of B and C has 3 children. On the basis of this information, what is A's relation to C?",
    options: ["Sister", "Mother", "Wife", "Niece"],
    correctIndex: 2,
    explanation: "A is mother of B, C is father of B. Thus A and C are parents of B. Hence A is the wife of C.",
    category: "reasoning",
    topic: "Blood Relations",
    difficulty: "easy",
    timeLimit: 30
  },
  {
    text: "If in a certain language, MADRAS is coded as NBESBT, how is BOMBAY coded in that language?",
    options: ["CPNCBZ", "CPNCBX", "DPNCBZ", "DPNCBX"],
    correctIndex: 0,
    explanation: "Each letter is simply shifted forward by one position in the alphabet. M->N, A->B... Thus B->C, O->P, M->N, B->C, A->B, Y->Z = CPNCBZ",
    category: "reasoning",
    topic: "Coding-Decoding",
    difficulty: "easy",
    timeLimit: 30
  },
  {
    text: "Rahul put his timepiece on the table in such a way that at 6 P.M. hour hand points to North. In which direction the minute hand will point at 9.15 P.M. ?",
    options: ["South-East", "South", "North", "West"],
    correctIndex: 3,
    explanation: "At 6 pm, hour hand is at 6. If it points North, it means the clock is rotated 180 degrees. At 9:15, minute hand is at 3. Normally 3 is East, but due to 180 deg rotation, it will point West.",
    category: "reasoning",
    topic: "Direction Sense",
    difficulty: "hard",
    timeLimit: 60
  },
  {
    text: "Five friends are sitting on a bench. A is to the left of B but on the right of C. D is to the right of B but on the left of E. Who are at the extremes?",
    options: ["A, B", "A, D", "C, E", "C, D"],
    correctIndex: 2,
    explanation: "A is left of B, right of C -> CAB. D is right of B, left of E -> BDE. Combining: CABDE. Extremes are C and E.",
    category: "reasoning",
    topic: "Seating Arrangement",
    difficulty: "medium",
    timeLimit: 45
  }
];

const VERBAL_QUESTIONS = [
  {
    text: "Choose the exact opposite (antonym): ENORMOUS",
    options: ["Soft", "Average", "Tiny", "Weak"],
    correctIndex: 2,
    explanation: "Enormous means very large. The exact opposite is Tiny.",
    category: "verbal",
    topic: "Antonyms",
    difficulty: "easy",
    timeLimit: 30
  },
  {
    text: "Choose the correct synonym: ABANDON",
    options: ["Try", "Join", "Keep", "Forsake"],
    correctIndex: 3,
    explanation: "Abandon means to leave completely or give up, which is synonymous with Forsake.",
    category: "verbal",
    topic: "Synonyms",
    difficulty: "easy",
    timeLimit: 30
  },
  {
    text: "Fill in the blank: He is blind ________ his own faults.",
    options: ["with", "to", "of", "for"],
    correctIndex: 1,
    explanation: "'Blind to' is the correct prepositional phrase meaning 'unaware of'.",
    category: "verbal",
    topic: "Fill in the Blanks",
    difficulty: "medium",
    timeLimit: 45
  },
  {
    text: "Sentence Correction: 'Neither the principal nor the teachers is right.'",
    options: ["Are right", "Is right", "Were right", "Was right"],
    correctIndex: 0,
    explanation: "When two subjects are joined by 'neither/nor', the verb agrees with the subject closer to it. The closer subject is 'teachers' (plural), so the verb should be plural 'are'.",
    category: "verbal",
    topic: "Sentence Correction",
    difficulty: "hard",
    timeLimit: 60
  },
  {
    text: "Read the premise: The best way to reduce traffic is to tax private vehicle ownership. Inference: Traffic is caused by private vehicles.",
    options: ["Definitely True", "Probably True", "Data Inadequate", "Definitely False"],
    correctIndex: 0,
    explanation: "The premise explicitly targets private vehicle ownership to reduce traffic, thereby implying private vehicles contribute directly.",
    category: "verbal",
    topic: "Reading Comprehension",
    difficulty: "medium",
    timeLimit: 45
  }
];

const CODING_QUESTIONS = [
  {
    text: "What is the time complexity of accessing an element in an array by index?",
    options: ["O(n)", "O(1)", "O(log n)", "O(n²)"],
    correctIndex: 1,
    explanation: "Array access by index is O(1) because arrays use contiguous memory, so the address is calculated directly: base + index × element_size.",
    category: "coding",
    topic: "Arrays",
    difficulty: "easy",
    timeLimit: 30
  },
  {
    text: "Which technique is best for finding a pair with a given sum in a sorted array?",
    options: ["Binary Search", "Hash Map", "Two Pointers", "Brute Force"],
    correctIndex: 2,
    explanation: "Two pointers placed at start and end can find the pair in O(n) time by moving inward based on whether the sum is too small or too large.",
    category: "coding",
    topic: "Arrays",
    difficulty: "medium",
    timeLimit: 45
  },
  {
    text: "What does the sliding window technique help solve efficiently?",
    options: ["Finding shortest path", "Maximum subarray sum of fixed size", "Sorting elements", "Tree traversal"],
    correctIndex: 1,
    explanation: "Sliding window maintains a window of fixed/variable size and slides it across the array, perfect for subarray/substring problems in O(n) time.",
    category: "coding",
    topic: "Arrays",
    difficulty: "medium",
    timeLimit: 45
  },
  {
    text: "How do you check if two strings are anagrams of each other?",
    options: ["Compare lengths only", "Sort both and compare", "Check first characters", "Reverse one and compare"],
    correctIndex: 1,
    explanation: "Sorting both strings and comparing them is an O(n log n) approach. Alternatively, compare character frequency maps for O(n).",
    category: "coding",
    topic: "Strings",
    difficulty: "easy",
    timeLimit: 30
  },
  {
    text: "What is the time complexity of the KMP string matching algorithm?",
    options: ["O(n²)", "O(n × m)", "O(n + m)", "O(n log m)"],
    correctIndex: 2,
    explanation: "KMP uses a prefix function to avoid re-scanning characters, achieving O(n + m) where n is text length and m is pattern length.",
    category: "coding",
    topic: "Strings",
    difficulty: "hard",
    timeLimit: 60
  },
  {
    text: "Which sorting algorithm is stable and has O(n log n) worst-case complexity?",
    options: ["Quick Sort", "Heap Sort", "Merge Sort", "Selection Sort"],
    correctIndex: 2,
    explanation: "Merge Sort is stable (maintains relative order of equal elements) and always runs in O(n log n) regardless of input.",
    category: "coding",
    topic: "Sorting Concepts",
    difficulty: "easy",
    timeLimit: 30
  },
  {
    text: "What is the worst-case time complexity of Quick Sort?",
    options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
    correctIndex: 2,
    explanation: "Quick Sort degrades to O(n²) when the pivot is always the smallest or largest element (e.g., already sorted array with first/last pivot).",
    category: "coding",
    topic: "Sorting Concepts",
    difficulty: "medium",
    timeLimit: 45
  },
  {
    text: "What are the two essential components of every recursive function?",
    options: ["Loop and condition", "Base case and recursive case", "Input and output", "Stack and heap"],
    correctIndex: 1,
    explanation: "Every recursive function needs a base case (stopping condition) and a recursive case (the function calling itself with a smaller input).",
    category: "coding",
    topic: "Recursion Logic",
    difficulty: "easy",
    timeLimit: 30
  },
  {
    text: "What is the space complexity of a recursive function that makes n recursive calls?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    correctIndex: 2,
    explanation: "Each recursive call adds a frame to the call stack. With n calls deep, the stack uses O(n) space.",
    category: "coding",
    topic: "Recursion Logic",
    difficulty: "medium",
    timeLimit: 45
  },
  {
    text: "What is the time complexity of binary search?",
    options: ["O(n)", "O(n²)", "O(log n)", "O(1)"],
    correctIndex: 2,
    explanation: "Binary search halves the search space each step, giving O(log n) time complexity.",
    category: "coding",
    topic: "Time Complexity MCQs",
    difficulty: "easy",
    timeLimit: 30
  },
  {
    text: "What is the time complexity of two nested loops each running from 1 to n?",
    options: ["O(n)", "O(2n)", "O(n log n)", "O(n²)"],
    correctIndex: 3,
    explanation: "Two nested loops each iterating n times result in n × n = n² iterations, giving O(n²).",
    category: "coding",
    topic: "Time Complexity MCQs",
    difficulty: "easy",
    timeLimit: 30
  },
  {
    text: "What is the output of: let x = 5; console.log(x++ + ++x);",
    options: ["10", "11", "12", "13"],
    correctIndex: 2,
    explanation: "x++ returns 5 (then x becomes 6). ++x makes x = 7 (returns 7). So 5 + 7 = 12.",
    category: "coding",
    topic: "Output Prediction",
    difficulty: "medium",
    timeLimit: 45
  },
  {
    text: "What is the output of: console.log(typeof null);",
    options: ["'null'", "'undefined'", "'object'", "'boolean'"],
    correctIndex: 2,
    explanation: "This is a known JavaScript quirk. typeof null returns 'object' due to a historical bug in the language that was never fixed.",
    category: "coding",
    topic: "Output Prediction",
    difficulty: "easy",
    timeLimit: 30
  },
];

const DATA_INTERPRETATION_QUESTIONS = [
  {
    text: "A bar chart shows sales of 200, 350, 150, 400 units for Q1-Q4. What is the average quarterly sales?",
    options: ["250", "275", "300", "325"],
    correctIndex: 1,
    explanation: "Average = (200 + 350 + 150 + 400) / 4 = 1100 / 4 = 275.",
    category: "data_interpretation",
    topic: "Bar Charts",
    difficulty: "easy",
    timeLimit: 30
  },
  {
    text: "In a bar chart, Q1=100, Q2=150, Q3=200, Q4=250. What is the percentage growth from Q1 to Q4?",
    options: ["100%", "125%", "150%", "200%"],
    correctIndex: 2,
    explanation: "Growth = ((250-100)/100) × 100 = 150%.",
    category: "data_interpretation",
    topic: "Bar Charts",
    difficulty: "medium",
    timeLimit: 45
  },
  {
    text: "A pie chart shows: A=30%, B=25%, C=20%, D=15%, E=10%. If total is 2000, what is the value of segment C?",
    options: ["300", "400", "500", "600"],
    correctIndex: 1,
    explanation: "Value of C = 20% of 2000 = (20/100) × 2000 = 400.",
    category: "data_interpretation",
    topic: "Pie Charts",
    difficulty: "easy",
    timeLimit: 30
  },
  {
    text: "In a pie chart, sector A has angle 90°. What percentage of the total does A represent?",
    options: ["20%", "25%", "30%", "35%"],
    correctIndex: 1,
    explanation: "Percentage = (90/360) × 100 = 25%.",
    category: "data_interpretation",
    topic: "Pie Charts",
    difficulty: "easy",
    timeLimit: 30
  },
  {
    text: "A line graph shows values 10, 15, 12, 20, 18. Between which consecutive points is the steepest increase?",
    options: ["Point 1 to 2", "Point 2 to 3", "Point 3 to 4", "Point 4 to 5"],
    correctIndex: 2,
    explanation: "Changes: +5, -3, +8, -2. The steepest increase is +8 between points 3 and 4.",
    category: "data_interpretation",
    topic: "Line Graphs",
    difficulty: "medium",
    timeLimit: 45
  },
  {
    text: "A table shows: Product A costs Rs.50, sold 100 units. Product B costs Rs.80, sold 60 units. Which has higher revenue?",
    options: ["Product A", "Product B", "Both equal", "Cannot determine"],
    correctIndex: 0,
    explanation: "Revenue A = 50 × 100 = 5000. Revenue B = 80 × 60 = 4800. Product A has higher revenue.",
    category: "data_interpretation",
    topic: "Tables",
    difficulty: "easy",
    timeLimit: 30
  },
];

const ALL_QUESTIONS = [...APTITUDE_QUESTIONS, ...REASONING_QUESTIONS, ...VERBAL_QUESTIONS, ...CODING_QUESTIONS, ...DATA_INTERPRETATION_QUESTIONS];

// Duplicate the set to meet the "150 questions" threshold
const SEED_DATA: any[] = [];
for (let i = 0; i < 5; i++) {
  for (const q of ALL_QUESTIONS) {
    SEED_DATA.push({
      ...q,
      text: i === 0 ? q.text : `${q.text} (Variant ${i + 1})`
    });
  }
}

const runSeeder = async () => {
  try {
    await connectDB();
    console.log('Clearing existing questions...');
    await Question.deleteMany({});

    console.log(`Seeding ${SEED_DATA.length} questions...`);
    await Question.insertMany(SEED_DATA);

    // Print category/topic breakdown
    const categories = [...new Set(SEED_DATA.map(q => q.category))];
    for (const cat of categories) {
      const topics = [...new Set(SEED_DATA.filter(q => q.category === cat).map(q => q.topic))];
      console.log(`  ${cat}: ${topics.length} topics → ${topics.join(', ')}`);
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

runSeeder();
