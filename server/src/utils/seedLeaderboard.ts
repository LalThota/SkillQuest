import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { env } from '../config/env';
import { User } from '../models/User';
import { connectDB } from '../config/db';

const SAMPLE_USERS = [
  {
    username: 'NeonBlade',
    email: 'neonblade@demo.com',
    avatar: '🐉',
    xp: 12450,
    level: 9,
    streak: { current: 42, longest: 42, lastActiveDate: new Date() },
    totalQuizzes: 187,
    totalCorrect: 1496,
    totalQuestions: 1870,
    categoryStats: {
      aptitude: { attempted: 650, correct: 546, avgTime: 22 },
      reasoning: { attempted: 620, correct: 502, avgTime: 28 },
      verbal: { attempted: 600, correct: 448, avgTime: 18 },
    }
  },
  {
    username: 'QuantumAce',
    email: 'quantumace@demo.com',
    avatar: '⚡',
    xp: 10820,
    level: 8,
    streak: { current: 28, longest: 35, lastActiveDate: new Date() },
    totalQuizzes: 162,
    totalCorrect: 1280,
    totalQuestions: 1620,
    categoryStats: {
      aptitude: { attempted: 580, correct: 480, avgTime: 24 },
      reasoning: { attempted: 540, correct: 420, avgTime: 30 },
      verbal: { attempted: 500, correct: 380, avgTime: 20 },
    }
  },
  {
    username: 'ZeroGravity',
    email: 'zerogravity@demo.com',
    avatar: '🚀',
    xp: 9540,
    level: 7,
    streak: { current: 15, longest: 22, lastActiveDate: new Date() },
    totalQuizzes: 143,
    totalCorrect: 1100,
    totalQuestions: 1430,
    categoryStats: {
      aptitude: { attempted: 500, correct: 400, avgTime: 26 },
      reasoning: { attempted: 480, correct: 370, avgTime: 32 },
      verbal: { attempted: 450, correct: 330, avgTime: 22 },
    }
  },
  {
    username: 'CyberNinja',
    email: 'cyberninja@demo.com',
    avatar: '🥷',
    xp: 8200,
    level: 7,
    streak: { current: 10, longest: 18, lastActiveDate: new Date() },
    totalQuizzes: 128,
    totalCorrect: 960,
    totalQuestions: 1280,
    categoryStats: {
      aptitude: { attempted: 450, correct: 350, avgTime: 28 },
      reasoning: { attempted: 430, correct: 320, avgTime: 34 },
      verbal: { attempted: 400, correct: 290, avgTime: 24 },
    }
  },
  {
    username: 'PixelStorm',
    email: 'pixelstorm@demo.com',
    avatar: '🌊',
    xp: 7100,
    level: 6,
    streak: { current: 21, longest: 21, lastActiveDate: new Date() },
    totalQuizzes: 110,
    totalCorrect: 820,
    totalQuestions: 1100,
    categoryStats: {
      aptitude: { attempted: 400, correct: 300, avgTime: 30 },
      reasoning: { attempted: 380, correct: 280, avgTime: 36 },
      verbal: { attempted: 320, correct: 240, avgTime: 26 },
    }
  },
  {
    username: 'VortexMind',
    email: 'vortexmind@demo.com',
    avatar: '🧠',
    xp: 5800,
    level: 5,
    streak: { current: 7, longest: 14, lastActiveDate: new Date() },
    totalQuizzes: 95,
    totalCorrect: 665,
    totalQuestions: 950,
    categoryStats: {
      aptitude: { attempted: 340, correct: 245, avgTime: 32 },
      reasoning: { attempted: 320, correct: 225, avgTime: 38 },
      verbal: { attempted: 290, correct: 195, avgTime: 28 },
    }
  },
  {
    username: 'ShadowFox',
    email: 'shadowfox@demo.com',
    avatar: '🦊',
    xp: 4900,
    level: 5,
    streak: { current: 3, longest: 11, lastActiveDate: new Date() },
    totalQuizzes: 82,
    totalCorrect: 560,
    totalQuestions: 820,
    categoryStats: {
      aptitude: { attempted: 300, correct: 210, avgTime: 34 },
      reasoning: { attempted: 270, correct: 185, avgTime: 40 },
      verbal: { attempted: 250, correct: 165, avgTime: 30 },
    }
  },
  {
    username: 'NovaFlare',
    email: 'novaflare@demo.com',
    avatar: '🌟',
    xp: 3750,
    level: 4,
    streak: { current: 5, longest: 9, lastActiveDate: new Date() },
    totalQuizzes: 65,
    totalCorrect: 430,
    totalQuestions: 650,
    categoryStats: {
      aptitude: { attempted: 240, correct: 165, avgTime: 36 },
      reasoning: { attempted: 220, correct: 145, avgTime: 42 },
      verbal: { attempted: 190, correct: 120, avgTime: 32 },
    }
  },
  {
    username: 'ThunderBolt',
    email: 'thunderbolt@demo.com',
    avatar: '⛈️',
    xp: 2600,
    level: 3,
    streak: { current: 2, longest: 7, lastActiveDate: new Date() },
    totalQuizzes: 48,
    totalCorrect: 310,
    totalQuestions: 480,
    categoryStats: {
      aptitude: { attempted: 180, correct: 120, avgTime: 38 },
      reasoning: { attempted: 160, correct: 100, avgTime: 44 },
      verbal: { attempted: 140, correct: 90, avgTime: 34 },
    }
  },
  {
    username: 'FrostByte',
    email: 'frostbyte@demo.com',
    avatar: '❄️',
    xp: 1800,
    level: 2,
    streak: { current: 1, longest: 5, lastActiveDate: new Date() },
    totalQuizzes: 35,
    totalCorrect: 220,
    totalQuestions: 350,
    categoryStats: {
      aptitude: { attempted: 130, correct: 85, avgTime: 40 },
      reasoning: { attempted: 120, correct: 75, avgTime: 46 },
      verbal: { attempted: 100, correct: 60, avgTime: 36 },
    }
  },
  {
    username: 'DarkMatter',
    email: 'darkmatter@demo.com',
    avatar: '🌑',
    xp: 1200,
    level: 2,
    streak: { current: 0, longest: 4, lastActiveDate: new Date() },
    totalQuizzes: 25,
    totalCorrect: 150,
    totalQuestions: 250,
    categoryStats: {
      aptitude: { attempted: 100, correct: 60, avgTime: 42 },
      reasoning: { attempted: 80, correct: 50, avgTime: 48 },
      verbal: { attempted: 70, correct: 40, avgTime: 38 },
    }
  },
  {
    username: 'CosmicRay',
    email: 'cosmicray@demo.com',
    avatar: '☄️',
    xp: 800,
    level: 1,
    streak: { current: 0, longest: 3, lastActiveDate: new Date() },
    totalQuizzes: 18,
    totalCorrect: 100,
    totalQuestions: 180,
    categoryStats: {
      aptitude: { attempted: 70, correct: 40, avgTime: 44 },
      reasoning: { attempted: 60, correct: 35, avgTime: 50 },
      verbal: { attempted: 50, correct: 25, avgTime: 40 },
    }
  },
  {
    username: 'NightOwl',
    email: 'nightowl@demo.com',
    avatar: '🦉',
    xp: 450,
    level: 1,
    streak: { current: 1, longest: 2, lastActiveDate: new Date() },
    totalQuizzes: 12,
    totalCorrect: 65,
    totalQuestions: 120,
    categoryStats: {
      aptitude: { attempted: 50, correct: 25, avgTime: 46 },
      reasoning: { attempted: 40, correct: 22, avgTime: 52 },
      verbal: { attempted: 30, correct: 18, avgTime: 42 },
    }
  },
  {
    username: 'EchoWave',
    email: 'echowave@demo.com',
    avatar: '🎵',
    xp: 200,
    level: 1,
    streak: { current: 0, longest: 1, lastActiveDate: null },
    totalQuizzes: 6,
    totalCorrect: 30,
    totalQuestions: 60,
    categoryStats: {
      aptitude: { attempted: 25, correct: 12, avgTime: 48 },
      reasoning: { attempted: 20, correct: 10, avgTime: 54 },
      verbal: { attempted: 15, correct: 8, avgTime: 44 },
    }
  },
];

const runSeeder = async () => {
  try {
    await connectDB();
    const password = await bcrypt.hash('demo123456', 10);

    console.log('Seeding leaderboard users...');
    let created = 0;
    for (const u of SAMPLE_USERS) {
      const exists = await User.findOne({ email: u.email });
      if (exists) {
        // Update existing demo user with fresh stats
        await User.updateOne({ email: u.email }, { $set: { ...u } });
        console.log(`  ↻ Updated: ${u.username}`);
      } else {
        await User.create({ ...u, passwordHash: password });
        console.log(`  ✓ Created: ${u.username}`);
        created++;
      }
    }

    console.log(`\nLeaderboard seeded! ${created} new users created, ${SAMPLE_USERS.length - created} updated.`);
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

runSeeder();
