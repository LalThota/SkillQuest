import mongoose from 'mongoose';
import { env } from '../config/env';
import { Question } from '../models/Question';
import { connectDB } from '../config/db';

const SEED_DATA: any[] = [];

function createQuestion(text: string, correct: string, distractors: string[], category: string, topic: string, difficulty: 'easy' | 'medium' | 'hard') {
  const options = [correct, ...distractors];
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

const CATEGORIES = [
  {
    id: 'aptitude',
    topics: ['Percentages', 'Ratios', 'Time & Work', 'Profit & Loss', 'Averages', 'Ages', 'Speed & Distance', 'Simple & Compound Interest', 'Mixtures & Alligations'],
  },
  {
    id: 'reasoning',
    topics: ['Syllogisms', 'Blood Relations', 'Seating Arrangement', 'Coding-Decoding', 'Direction Sense', 'Number Series', 'Analogies', 'Odd One Out'],
  },
  {
    id: 'verbal',
    topics: ['Antonyms', 'Synonyms', 'Reading Comprehension', 'Fill in the Blanks', 'Sentence Correction', 'Para Jumbles', 'Idioms & Phrases'],
  },
  {
    id: 'coding',
    topics: ['Arrays', 'Strings', 'Sorting Concepts', 'Recursion Logic', 'Time Complexity MCQs', 'Output Prediction'],
  },
  {
    id: 'data_interpretation',
    topics: ['Bar Charts', 'Pie Charts', 'Line Graphs', 'Tables', 'Caselets', 'Mixed Graphs'],
  },
];

for (const cat of CATEGORIES) {
  for (const topic of cat.topics) {
    for (let i = 0; i < 20; i++) {
        const difficulty = i < 7 ? 'easy' : i < 14 ? 'medium' : 'hard';
        let text = `Sample question ${i+1} for ${topic}`;
        let correct = `Correct Answer for ${topic}`;
        let distractors = [`Wrong Option A`, `Wrong Option B`, `Wrong Option C`];

        // Give some variance so they don't look completely identical if math based
        if (cat.id === 'aptitude') {
            const v1 = Math.floor(Math.random()*100) + 1;
            const v2 = Math.floor(Math.random()*50) + 1;
            text = `If quantity A is ${v1} and quantity B is ${v2} in the context of ${topic}, what is the result?`;
            correct = `${v1 + v2}`;
            distractors = [`${Math.abs(v1 - v2)}`, `${v1 * 2}`, `${v2 + 10}`];
        } else if (cat.id === 'coding') {
            text = `What is the standard time complexity or behavior related to ${topic} scenario ${i+1}?`;
            correct = `O(n log n) or O(1)`;
            distractors = [`O(n^2)`, `O(2^n)`, `Undefined behavior`];
        } else if (cat.id === 'reasoning') {
            text = `Based on logic principles of ${topic}, if Statement A is true in scenario ${i+1}, what follows?`;
            correct = `Conclusion ${i+1} follows`;
            distractors = [`It is false`, `Cannot be determined`, `Both are false`];
        }

        SEED_DATA.push(createQuestion(text, correct, distractors, cat.id, topic, difficulty));
    }
  }
}

const runSeeder = async () => {
  try {
    await connectDB();
    console.log('Clearing existing questions...');
    await Question.deleteMany({});

    console.log(`Seeding ${SEED_DATA.length} unique questions...`);
    await Question.insertMany(SEED_DATA);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

runSeeder();
