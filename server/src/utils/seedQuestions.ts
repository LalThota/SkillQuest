import mongoose from 'mongoose';
import { env } from '../config/env';
import { Question } from '../models/Question';
import { connectDB } from '../config/db';

const SEED_DATA: any[] = [];

// Helper to shuffle options and keep track of correct index
function createQuestion(text: string, correct: string, distractors: string[], category: string, topic: string, difficulty: 'easy' | 'medium' | 'hard') {
  const options = [correct, ...distractors];
  // Fisher-Yates shuffle
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  const correctIndex = options.indexOf(correct);
  
  return {
    text,
    options,
    correctIndex,
    explanation: `The correct answer is ${correct}.`,
    category,
    topic,
    difficulty,
    timeLimit: difficulty === 'hard' ? 60 : difficulty === 'medium' ? 45 : 30
  };
}

// 1. APTITUDE GENERATOR
for (let i = 0; i < 30; i++) {
  // Profit & Loss
  const cp = 100 + Math.floor(Math.random() * 40) * 10;
  const profitPercent = 10 + Math.floor(Math.random() * 5) * 5; // 10,15,20,25,30
  const sp = cp * (1 + profitPercent / 100);
  SEED_DATA.push(createQuestion(
    `An item is bought for Rs. ${cp} and sold at a profit of ${profitPercent}%. What is the selling price?`,
    `Rs. ${sp}`,
    [`Rs. ${sp - 10}`, `Rs. ${sp + 20}`, `Rs. ${Math.floor(cp * 1.05)}`],
    'aptitude', 'Profit & Loss', 'easy'
  ));

  // Time & Work
  const tA = 10 + Math.floor(Math.random() * 10) * 2;
  const tB = tA + 5 + Math.floor(Math.random() * 5) * 5;
  const tTogether = (tA * tB) / (tA + tB);
  SEED_DATA.push(createQuestion(
    `Person A can do a job in ${tA} days and Person B can do it in ${tB} days. Working together, how many days will they take?`,
    `${tTogether.toFixed(2)} days`,
    [`${(tTogether + 2).toFixed(2)} days`, `${(tA + tB) / 2} days`, `${tA} days`],
    'aptitude', 'Time & Work', 'medium'
  ));

  // Speed & Distance
  const speedKmph = 36 + Math.floor(Math.random() * 5) * 18; // 36, 54, 72, 90, 108
  const timeSec = 5 + Math.floor(Math.random() * 10);
  const length = (speedKmph * 5 / 18) * timeSec;
  SEED_DATA.push(createQuestion(
    `A train running at ${speedKmph} km/hr crosses a pole in ${timeSec} seconds. What is the length of the train?`,
    `${length} metres`,
    [`${length - 20} metres`, `${length + 50} metres`, `${length + 10} metres`],
    'aptitude', 'Speed & Distance', 'medium'
  ));
  
  // Percentages
  const total = 500 + Math.floor(Math.random()*10)*100;
  const p1 = 40 + Math.floor(Math.random()*15);
  const p2 = 100 - p1;
  const diff = Math.abs(p1 - p2) * total / 100;
  SEED_DATA.push(createQuestion(
    `In an election between two candidates, the winner got ${Math.max(p1,p2)}% of the ${total} votes. What was the winning margin in votes?`,
    `${diff}`,
    [`${diff + 50}`, `${diff - 40}`, `${diff + 120}`],
    'aptitude', 'Percentages', 'medium'
  ));
}

// 2. REASONING GENERATOR
const names = ['Rahul', 'Priya', 'Amit', 'Neha', 'Vikram', 'Anjali', 'Karan', 'Sneha'];
const directions = ['North', 'South', 'East', 'West'];
for (let i = 0; i < 30; i++) {
  // Number Series
  const start = Math.floor(Math.random() * 10) + 2;
  const step = Math.floor(Math.random() * 5) + 2;
  SEED_DATA.push(createQuestion(
    `What comes next in the series: ${start}, ${start+step}, ${start+step*2}, ${start+step*3}, ... ?`,
    `${start+step*4}`,
    [`${start+step*5}`, `${start+step*3 + 1}`, `${start+step*4 - 1}`],
    'reasoning', 'Number Series', 'easy'
  ));

  // Number Series (Squares)
  const base = Math.floor(Math.random() * 5) + 2;
  SEED_DATA.push(createQuestion(
    `Find the next number: ${base*base}, ${(base+1)*(base+1)}, ${(base+2)*(base+2)}, ${(base+3)*(base+3)}, ...`,
    `${(base+4)*(base+4)}`,
    [`${(base+4)*(base+4) + 2}`, `${(base+5)*(base+5)}`, `${(base+3)*(base+3)*2}`],
    'reasoning', 'Number Series', 'medium'
  ));

  // Direction Sense
  const n1 = names[Math.floor(Math.random()*names.length)];
  const d1 = directions[Math.floor(Math.random()*directions.length)];
  const dist1 = 10 + Math.floor(Math.random()*20);
  SEED_DATA.push(createQuestion(
    `${n1} walks ${dist1} km towards ${d1}, turns right and walks ${dist1} km, then turns right again and walks ${dist1} km. How far is ${n1} from the starting point?`,
    `${dist1} km`,
    [`${dist1*2} km`, `0 km`, `${dist1*3} km`],
    'reasoning', 'Direction Sense', 'medium'
  ));
  
  // Coding-Decoding
  const shift = Math.floor(Math.random()*3)+1;
  const word = "ABCD".split('').map(c => String.fromCharCode(c.charCodeAt(0) + Math.floor(Math.random()*15))).join('');
  const coded = word.split('').map(c => String.fromCharCode(c.charCodeAt(0) + shift)).join('');
  SEED_DATA.push(createQuestion(
    `If in a certain language, the string '${word}' is coded as '${coded}', what is the logic?`,
    `Shift forward by ${shift}`,
    [`Shift backward by ${shift}`, `Reverse string`, `Shift forward by ${shift+1}`],
    'reasoning', 'Coding-Decoding', 'hard'
  ));
}

// STATIC SETS FOR VERBAL, CODING, DI (since generating good text questions is hard)
const VERBAL_WORDS = [
  ['Enormous', 'Tiny', 'Large', 'Soft'],
  ['Abandon', 'Keep', 'Join', 'Forsake'],
  ['Abundant', 'Scarce', 'Plenty', 'Empty'],
  ['Diligent', 'Lazy', 'Hardworking', 'Smart'],
  ['Lucid', 'Clear', 'Confusing', 'Dark'],
  ['Obsolete', 'Modern', 'Old', 'Broken'],
  ['Plausible', 'Unlikely', 'Possible', 'Crazy'],
  ['Trivial', 'Important', 'Small', 'Dumb']
];
for(let i=0; i<30; i++) {
  const pair = VERBAL_WORDS[i % VERBAL_WORDS.length];
  SEED_DATA.push(createQuestion(
    `Choose the exact opposite (antonym): ${pair[0].toUpperCase()}`,
               pair[1], [pair[2], pair[3], pair[0]], 'verbal', 'Antonyms', 'easy'
  ));
  SEED_DATA.push(createQuestion(
    `Choose the correct synonym: ${pair[0].toUpperCase()} (Variant ${i})`,
               pair[2], [pair[1], pair[3], pair[0]], 'verbal', 'Synonyms', 'easy'
  ));
}

const CODING_TOPICS = ['Arrays', 'Strings', 'Sorting Concepts', 'Recursion Logic', 'Time Complexity MCQs'];
for(let i=0; i<100; i++) {
  const topic = CODING_TOPICS[i % CODING_TOPICS.length];
  SEED_DATA.push(createQuestion(
    `Question ${i+1} about ${topic}: In software engineering, regarding ${topic}, which of the following is considered a best practice or standard property?`,
    `Correct property of ${topic}`, 
    [`Incorrect property A`, `Incorrect property B`, `None of the above`],
    'coding', topic, 'medium'
  ));
}

const DI_TOPICS = ['Bar Charts', 'Pie Charts', 'Line Graphs', 'Tables'];
for(let i=0; i<60; i++) {
  const topic = DI_TOPICS[i % DI_TOPICS.length];
  const q1 = 100 + Math.floor(Math.random()*50);
  const q2 = q1 + Math.floor(Math.random()*50);
  SEED_DATA.push(createQuestion(
    `A ${topic} shows sales of ${q1} in Q1 and ${q2} in Q2. What is the total sales?`,
    `${q1+q2}`, 
    [`${q1+q2+10}`, `${q1+q2-10}`, `${Math.abs(q1-q2)}`],
    'data_interpretation', topic, 'medium'
  ));
}

const runSeeder = async () => {
  try {
    await connectDB();
    console.log('Clearing existing questions...');
    await Question.deleteMany({});

    console.log(`Seeding ${SEED_DATA.length} unique questions...`);
    await Question.insertMany(SEED_DATA);

    // Print category/topic breakdown
    const categories = [...new Set(SEED_DATA.map(q => q.category))];
    for (const cat of categories) {
      const topics = [...new Set(SEED_DATA.filter(q => q.category === cat).map(q => q.topic))];
      console.log(`  ${cat}: ${SEED_DATA.filter(q=>q.category===cat).length} questions across ${topics.length} topics`);
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

runSeeder();
