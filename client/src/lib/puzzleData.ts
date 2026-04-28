export interface Puzzle {
  id: string;
  type: 'number_sequence' | 'pattern_match' | 'matrix' | 'logic_grid';
  difficulty: 'easy' | 'medium' | 'hard';
  prompt: string;
  sequence?: (number | string | null)[];
  grid?: (number | string | null)[][];
  options: string[];
  correctIndex: number;
  explanation: string;
  xpReward: number;
}

export const PUZZLES: Puzzle[] = [
  // === NUMBER SEQUENCE (20) ===
  { id: 'ns1', type: 'number_sequence', difficulty: 'easy', prompt: 'Find the next number:', sequence: [2, 4, 6, 8, null], options: ['9', '10', '12', '11'], correctIndex: 1, explanation: 'Each number increases by 2.', xpReward: 10 },
  { id: 'ns2', type: 'number_sequence', difficulty: 'easy', prompt: 'Find the next number:', sequence: [1, 3, 5, 7, null], options: ['8', '9', '10', '11'], correctIndex: 1, explanation: 'Odd numbers: +2 each time.', xpReward: 10 },
  { id: 'ns3', type: 'number_sequence', difficulty: 'easy', prompt: 'Find the next number:', sequence: [5, 10, 15, 20, null], options: ['30', '22', '25', '35'], correctIndex: 2, explanation: 'Multiples of 5.', xpReward: 10 },
  { id: 'ns4', type: 'number_sequence', difficulty: 'medium', prompt: 'Find the next number:', sequence: [2, 4, 8, 16, null], options: ['24', '32', '20', '18'], correctIndex: 1, explanation: 'Each number doubles (×2).', xpReward: 15 },
  { id: 'ns5', type: 'number_sequence', difficulty: 'medium', prompt: 'Find the next number:', sequence: [1, 1, 2, 3, 5, null], options: ['7', '6', '8', '9'], correctIndex: 2, explanation: 'Fibonacci: each = sum of previous two.', xpReward: 15 },
  { id: 'ns6', type: 'number_sequence', difficulty: 'medium', prompt: 'Find the next number:', sequence: [3, 6, 12, 24, null], options: ['36', '48', '30', '42'], correctIndex: 1, explanation: 'Each number doubles (×2).', xpReward: 15 },
  { id: 'ns7', type: 'number_sequence', difficulty: 'hard', prompt: 'Find the next number:', sequence: [1, 4, 9, 16, 25, null], options: ['30', '36', '49', '35'], correctIndex: 1, explanation: 'Perfect squares: 1², 2², 3², 4², 5², 6²=36.', xpReward: 20 },
  { id: 'ns8', type: 'number_sequence', difficulty: 'hard', prompt: 'Find the next number:', sequence: [2, 6, 12, 20, 30, null], options: ['40', '42', '38', '44'], correctIndex: 1, explanation: 'n(n+1): differences increase by 2.', xpReward: 20 },
  { id: 'ns9', type: 'number_sequence', difficulty: 'easy', prompt: 'Find the next number:', sequence: [10, 20, 30, 40, null], options: ['45', '50', '55', '60'], correctIndex: 1, explanation: 'Add 10 each time.', xpReward: 10 },
  { id: 'ns10', type: 'number_sequence', difficulty: 'medium', prompt: 'Find the next number:', sequence: [1, 3, 7, 15, null], options: ['30', '31', '29', '23'], correctIndex: 1, explanation: '×2+1 pattern.', xpReward: 15 },
  { id: 'ns11', type: 'number_sequence', difficulty: 'easy', prompt: 'Find the next number:', sequence: [100, 90, 80, 70, null], options: ['50', '60', '65', '55'], correctIndex: 1, explanation: 'Subtract 10 each time.', xpReward: 10 },
  { id: 'ns12', type: 'number_sequence', difficulty: 'medium', prompt: 'Find the next number:', sequence: [0, 1, 3, 6, 10, null], options: ['13', '14', '15', '16'], correctIndex: 2, explanation: 'Triangular numbers: +1,+2,+3,+4,+5.', xpReward: 15 },
  { id: 'ns13', type: 'number_sequence', difficulty: 'hard', prompt: 'Find the next number:', sequence: [1, 8, 27, 64, null], options: ['100', '125', '81', '216'], correctIndex: 1, explanation: 'Perfect cubes: 1³,2³,3³,4³,5³=125.', xpReward: 20 },
  { id: 'ns14', type: 'number_sequence', difficulty: 'easy', prompt: 'Find the next number:', sequence: [7, 14, 21, 28, null], options: ['32', '35', '42', '30'], correctIndex: 1, explanation: 'Multiples of 7.', xpReward: 10 },
  { id: 'ns15', type: 'number_sequence', difficulty: 'medium', prompt: 'Find the next number:', sequence: [2, 3, 5, 7, 11, null], options: ['12', '13', '14', '15'], correctIndex: 1, explanation: 'Prime numbers.', xpReward: 15 },
  { id: 'ns16', type: 'number_sequence', difficulty: 'hard', prompt: 'Find the next number:', sequence: [1, 2, 4, 7, 11, null], options: ['14', '15', '16', '17'], correctIndex: 2, explanation: 'Differences: +1,+2,+3,+4,+5=16.', xpReward: 20 },
  { id: 'ns17', type: 'number_sequence', difficulty: 'easy', prompt: 'Find the next number:', sequence: [3, 6, 9, 12, null], options: ['14', '15', '16', '18'], correctIndex: 1, explanation: 'Multiples of 3.', xpReward: 10 },
  { id: 'ns18', type: 'number_sequence', difficulty: 'medium', prompt: 'Find the next number:', sequence: [4, 9, 16, 25, null], options: ['30', '36', '49', '34'], correctIndex: 1, explanation: 'Perfect squares starting from 2².', xpReward: 15 },
  { id: 'ns19', type: 'number_sequence', difficulty: 'hard', prompt: 'Find the next number:', sequence: [1, 5, 14, 30, null], options: ['50', '55', '45', '60'], correctIndex: 1, explanation: 'Sum of squares: 1, 1+4, 1+4+9, ...', xpReward: 20 },
  { id: 'ns20', type: 'number_sequence', difficulty: 'easy', prompt: 'Find the next number:', sequence: [50, 45, 40, 35, null], options: ['25', '30', '32', '28'], correctIndex: 1, explanation: 'Subtract 5 each time.', xpReward: 10 },

  // === PATTERN MATCH (20) ===
  { id: 'pm1', type: 'pattern_match', difficulty: 'easy', prompt: 'Complete the pattern: ■ ○ ■ ○ ■ ?', options: ['○', '■', '△', '◇'], correctIndex: 0, explanation: 'Alternating ■ and ○.', xpReward: 10 },
  { id: 'pm2', type: 'pattern_match', difficulty: 'easy', prompt: 'Complete: A B A B A ?', options: ['A', 'B', 'C', 'D'], correctIndex: 1, explanation: 'Alternating A and B.', xpReward: 10 },
  { id: 'pm3', type: 'pattern_match', difficulty: 'medium', prompt: 'Complete: ■ ■ ○ ■ ■ ○ ■ ■ ?', options: ['■', '○', '△', '◇'], correctIndex: 1, explanation: 'Pattern repeats every 3: ■■○.', xpReward: 15 },
  { id: 'pm4', type: 'pattern_match', difficulty: 'medium', prompt: 'Complete: 1 A 2 B 3 C 4 ?', options: ['5', 'D', 'E', '4'], correctIndex: 1, explanation: 'Alternating numbers and letters.', xpReward: 15 },
  { id: 'pm5', type: 'pattern_match', difficulty: 'hard', prompt: 'Complete: ○ ○ ■ ○ ○ ○ ■ ○ ○ ○ ○ ?', options: ['○', '■', '△', '◇'], correctIndex: 1, explanation: 'After ■, circles increase by 1.', xpReward: 20 },
  { id: 'pm6', type: 'pattern_match', difficulty: 'easy', prompt: 'Complete: → ↑ ← ↓ → ↑ ← ?', options: ['→', '↑', '↓', '←'], correctIndex: 2, explanation: 'Clockwise rotation repeats.', xpReward: 10 },
  { id: 'pm7', type: 'pattern_match', difficulty: 'medium', prompt: 'Complete: AA BB CC DD ?', options: ['EE', 'EF', 'DE', 'FF'], correctIndex: 0, explanation: 'Double letters in sequence.', xpReward: 15 },
  { id: 'pm8', type: 'pattern_match', difficulty: 'hard', prompt: 'Complete: Z Y X W V ?', options: ['S', 'T', 'U', 'W'], correctIndex: 2, explanation: 'Reverse alphabet.', xpReward: 20 },
  { id: 'pm9', type: 'pattern_match', difficulty: 'easy', prompt: 'Complete: ★ ☆ ★ ☆ ★ ?', options: ['★', '☆', '●', '○'], correctIndex: 1, explanation: 'Alternating filled and empty stars.', xpReward: 10 },
  { id: 'pm10', type: 'pattern_match', difficulty: 'medium', prompt: 'Complete: RR SS TT ?', options: ['UU', 'TU', 'VV', 'UV'], correctIndex: 0, explanation: 'Double letters in alphabetical order.', xpReward: 15 },
  { id: 'pm11', type: 'pattern_match', difficulty: 'easy', prompt: 'Complete: ● ● ○ ● ● ○ ?', options: ['●', '○', '◇', '■'], correctIndex: 0, explanation: 'Pattern ●●○ repeats, next starts with ●.', xpReward: 10 },
  { id: 'pm12', type: 'pattern_match', difficulty: 'medium', prompt: 'Complete: A C E G ?', options: ['H', 'I', 'J', 'K'], correctIndex: 1, explanation: 'Every other letter (skip one).', xpReward: 15 },
  { id: 'pm13', type: 'pattern_match', difficulty: 'hard', prompt: 'Complete: AZ BY CX DW ?', options: ['EU', 'EV', 'FU', 'FV'], correctIndex: 1, explanation: 'First goes A→E, second goes Z→V.', xpReward: 20 },
  { id: 'pm14', type: 'pattern_match', difficulty: 'easy', prompt: 'Complete: 1 2 1 2 1 ?', options: ['1', '2', '3', '0'], correctIndex: 1, explanation: 'Alternating 1 and 2.', xpReward: 10 },
  { id: 'pm15', type: 'pattern_match', difficulty: 'medium', prompt: 'Complete: ■○△ ■○△ ■○?', options: ['■', '○', '△', '◇'], correctIndex: 2, explanation: 'Group of 3 repeats.', xpReward: 15 },
  { id: 'pm16', type: 'pattern_match', difficulty: 'hard', prompt: 'Complete: AB CD EF GH ?', options: ['HI', 'IJ', 'JK', 'GI'], correctIndex: 1, explanation: 'Consecutive letter pairs.', xpReward: 20 },
  { id: 'pm17', type: 'pattern_match', difficulty: 'easy', prompt: 'Complete: ↑ → ↓ ← ↑ →  ?', options: ['↑', '↓', '←', '→'], correctIndex: 1, explanation: 'Clockwise: up, right, down, left repeats.', xpReward: 10 },
  { id: 'pm18', type: 'pattern_match', difficulty: 'medium', prompt: 'Complete: XO XO XO X?', options: ['X', 'O', 'Z', 'Y'], correctIndex: 1, explanation: 'XO pattern repeats.', xpReward: 15 },
  { id: 'pm19', type: 'pattern_match', difficulty: 'hard', prompt: 'Complete: M N O N M N O N ?', options: ['M', 'N', 'O', 'P'], correctIndex: 0, explanation: 'Pattern MNON repeats.', xpReward: 20 },
  { id: 'pm20', type: 'pattern_match', difficulty: 'easy', prompt: 'Complete: ♠ ♥ ♦ ♣ ♠ ♥ ♦ ?', options: ['♠', '♣', '♥', '♦'], correctIndex: 1, explanation: 'Card suits cycle.', xpReward: 10 },

  // === MATRIX PUZZLES (20) ===
  { id: 'mx1', type: 'matrix', difficulty: 'easy', prompt: 'What goes in place of ?', grid: [[2,4,6],[8,10,12],[14,16,null]], options: ['17', '18', '20', '22'], correctIndex: 1, explanation: 'Each cell +2 sequentially.', xpReward: 10 },
  { id: 'mx2', type: 'matrix', difficulty: 'easy', prompt: 'What goes in place of ?', grid: [[1,2,3],[4,5,6],[7,8,null]], options: ['9', '10', '11', '12'], correctIndex: 0, explanation: 'Sequential numbers 1-9.', xpReward: 10 },
  { id: 'mx3', type: 'matrix', difficulty: 'medium', prompt: 'What goes in place of ?', grid: [[9,3,1],[18,6,2],[27,9,null]], options: ['3', '6', '4', '1'], correctIndex: 0, explanation: 'Each row: first÷3=second, second÷3=third.', xpReward: 15 },
  { id: 'mx4', type: 'matrix', difficulty: 'medium', prompt: 'What goes in place of ?', grid: [[2,4,8],[3,9,27],[5,25,null]], options: ['50', '75', '125', '100'], correctIndex: 2, explanation: 'Row pattern: n, n², n³.', xpReward: 15 },
  { id: 'mx5', type: 'matrix', difficulty: 'hard', prompt: 'What goes in place of ?', grid: [[1,1,2],[3,5,8],[13,21,null]], options: ['26', '34', '29', '30'], correctIndex: 1, explanation: 'Fibonacci across the grid.', xpReward: 20 },
  { id: 'mx6', type: 'matrix', difficulty: 'easy', prompt: 'What goes in place of ?', grid: [[5,10,15],[20,25,30],[35,40,null]], options: ['42', '45', '50', '55'], correctIndex: 1, explanation: 'Multiples of 5 in sequence.', xpReward: 10 },
  { id: 'mx7', type: 'matrix', difficulty: 'medium', prompt: 'What goes in place of ?', grid: [[2,3,5],[7,11,13],[17,19,null]], options: ['21', '23', '25', '29'], correctIndex: 1, explanation: 'Prime numbers in sequence.', xpReward: 15 },
  { id: 'mx8', type: 'matrix', difficulty: 'hard', prompt: 'What goes in place of ?', grid: [[1,4,9],[16,25,36],[49,64,null]], options: ['72', '81', '100', '90'], correctIndex: 1, explanation: 'Perfect squares: 1²..9².', xpReward: 20 },
  { id: 'mx9', type: 'matrix', difficulty: 'easy', prompt: 'What goes in place of ?', grid: [[10,20,30],[40,50,60],[70,80,null]], options: ['85', '90', '95', '100'], correctIndex: 1, explanation: 'Counting by 10s.', xpReward: 10 },
  { id: 'mx10', type: 'matrix', difficulty: 'medium', prompt: 'Row sum is constant. Find ?', grid: [[3,7,5],[4,6,5],[8,2,null]], options: ['3', '5', '7', '4'], correctIndex: 1, explanation: 'Each row sums to 15.', xpReward: 15 },
  { id: 'mx11', type: 'matrix', difficulty: 'easy', prompt: 'What goes in place of ?', grid: [[1,3,5],[7,9,11],[13,15,null]], options: ['16', '17', '19', '21'], correctIndex: 1, explanation: 'Odd numbers in sequence.', xpReward: 10 },
  { id: 'mx12', type: 'matrix', difficulty: 'medium', prompt: 'What goes in place of ?', grid: [[6,12,24],[3,6,12],[1,2,null]], options: ['3', '4', '6', '8'], correctIndex: 1, explanation: 'Each row: ×2 pattern. Last row: 1,2,4.', xpReward: 15 },
  { id: 'mx13', type: 'matrix', difficulty: 'hard', prompt: 'What goes in place of ?', grid: [[2,6,18],[4,12,36],[6,18,null]], options: ['36', '48', '54', '72'], correctIndex: 2, explanation: 'Each row: ×3 pattern. 6×3=18, 18×3=54.', xpReward: 20 },
  { id: 'mx14', type: 'matrix', difficulty: 'easy', prompt: 'What goes in place of ?', grid: [[0,1,2],[3,4,5],[6,7,null]], options: ['8', '9', '10', '11'], correctIndex: 0, explanation: '0 through 8 in order.', xpReward: 10 },
  { id: 'mx15', type: 'matrix', difficulty: 'medium', prompt: 'Col sums are equal. Find ?', grid: [[1,5,3],[4,2,6],[7,5,null]], options: ['1', '2', '3', '4'], correctIndex: 2, explanation: 'Each column sums to 12.', xpReward: 15 },
  { id: 'mx16', type: 'matrix', difficulty: 'hard', prompt: 'What goes in place of ?', grid: [[1,2,3],[2,4,6],[3,6,null]], options: ['8', '9', '12', '10'], correctIndex: 1, explanation: 'Multiplication table: row×col.', xpReward: 20 },
  { id: 'mx17', type: 'matrix', difficulty: 'easy', prompt: 'What goes in place of ?', grid: [[11,22,33],[44,55,66],[77,88,null]], options: ['99', '90', '100', '110'], correctIndex: 0, explanation: 'Multiples of 11.', xpReward: 10 },
  { id: 'mx18', type: 'matrix', difficulty: 'medium', prompt: 'What goes in place of ?', grid: [[4,8,12],[16,20,24],[28,32,null]], options: ['34', '36', '38', '40'], correctIndex: 1, explanation: 'Counting by 4s.', xpReward: 15 },
  { id: 'mx19', type: 'matrix', difficulty: 'hard', prompt: 'What goes in place of ?', grid: [[1,3,6],[10,15,21],[28,36,null]], options: ['40', '42', '45', '48'], correctIndex: 2, explanation: 'Triangular numbers.', xpReward: 20 },
  { id: 'mx20', type: 'matrix', difficulty: 'easy', prompt: 'What goes in place of ?', grid: [[2,4,6],[8,10,12],[14,16,null]], options: ['17', '18', '20', '19'], correctIndex: 1, explanation: 'Even numbers 2-18.', xpReward: 10 },

  // === LOGIC GRID (20) ===
  { id: 'lg1', type: 'logic_grid', difficulty: 'easy', prompt: 'If A > B and B > C, then:', options: ['A > C', 'C > A', 'A = C', 'Cannot determine'], correctIndex: 0, explanation: 'Transitivity: A > B > C, so A > C.', xpReward: 10 },
  { id: 'lg2', type: 'logic_grid', difficulty: 'easy', prompt: 'All cats are animals. Tom is a cat. Therefore:', options: ['Tom is an animal', 'Tom is not an animal', 'All animals are cats', 'Cannot determine'], correctIndex: 0, explanation: 'Classic syllogism: Tom inherits the property.', xpReward: 10 },
  { id: 'lg3', type: 'logic_grid', difficulty: 'medium', prompt: 'If it rains, the ground is wet. The ground is wet. Therefore:', options: ['It rained', 'It did not rain', 'Cannot determine', 'Ground is always wet'], correctIndex: 2, explanation: 'Affirming the consequent is a fallacy.', xpReward: 15 },
  { id: 'lg4', type: 'logic_grid', difficulty: 'medium', prompt: 'No fish can fly. Some birds can fly. Therefore:', options: ['No fish are birds', 'Some fish are birds', 'All birds are fish', 'Cannot determine'], correctIndex: 3, explanation: 'Cannot conclude relationship between fish and birds.', xpReward: 15 },
  { id: 'lg5', type: 'logic_grid', difficulty: 'hard', prompt: '"If P then Q" is true. "P is false". What about Q?', options: ['Q is true', 'Q is false', 'Q can be true or false', 'Q must be true'], correctIndex: 2, explanation: 'When antecedent is false, conditional is vacuously true regardless of Q.', xpReward: 20 },
  { id: 'lg6', type: 'logic_grid', difficulty: 'easy', prompt: 'A is taller than B. C is shorter than B. Who is tallest?', options: ['A', 'B', 'C', 'Cannot determine'], correctIndex: 0, explanation: 'A > B > C, so A is tallest.', xpReward: 10 },
  { id: 'lg7', type: 'logic_grid', difficulty: 'medium', prompt: 'All X are Y. All Y are Z. Some Z are W. Therefore:', options: ['All X are Z', 'All X are W', 'Some X are W', 'None of these'], correctIndex: 0, explanation: 'X⊂Y⊂Z, so all X are Z.', xpReward: 15 },
  { id: 'lg8', type: 'logic_grid', difficulty: 'hard', prompt: 'Statement: "Not all heroes wear capes." Which MUST be true?', options: ['No heroes wear capes', 'Some heroes don\'t wear capes', 'All heroes wear capes', 'Most heroes wear capes'], correctIndex: 1, explanation: '"Not all" means "at least one does not".', xpReward: 20 },
  { id: 'lg9', type: 'logic_grid', difficulty: 'easy', prompt: 'Monday comes before Tuesday. Wednesday comes after Tuesday. What is the order?', options: ['Mon, Tue, Wed', 'Wed, Tue, Mon', 'Tue, Mon, Wed', 'Mon, Wed, Tue'], correctIndex: 0, explanation: 'Chronological order.', xpReward: 10 },
  { id: 'lg10', type: 'logic_grid', difficulty: 'medium', prompt: 'If A=1, B=2, C=3, then CAB=?', options: ['123', '312', '321', '213'], correctIndex: 1, explanation: 'C=3, A=1, B=2 → 312.', xpReward: 15 },
  { id: 'lg11', type: 'logic_grid', difficulty: 'easy', prompt: 'X is heavier than Y. Z is lighter than Y. Which is lightest?', options: ['X', 'Y', 'Z', 'Equal'], correctIndex: 2, explanation: 'X>Y>Z, so Z is lightest.', xpReward: 10 },
  { id: 'lg12', type: 'logic_grid', difficulty: 'medium', prompt: 'If "MOUSE" is coded as "PRXVH", what is the coding rule?', options: ['+1 each', '+2 each', '+3 each', '-1 each'], correctIndex: 2, explanation: 'M+3=P, O+3=R, U+3=X, S+3=V, E+3=H.', xpReward: 15 },
  { id: 'lg13', type: 'logic_grid', difficulty: 'hard', prompt: 'A says "B always lies." B says "A always lies." If one always tells truth:', options: ['A tells truth', 'B tells truth', 'Both lie', 'Cannot determine which'], correctIndex: 3, explanation: 'Both scenarios are logically consistent.', xpReward: 20 },
  { id: 'lg14', type: 'logic_grid', difficulty: 'easy', prompt: '5 is to 25 as 6 is to:', options: ['30', '36', '42', '12'], correctIndex: 1, explanation: '5²=25, 6²=36.', xpReward: 10 },
  { id: 'lg15', type: 'logic_grid', difficulty: 'medium', prompt: 'Pointing to a photo: "He is my mother\'s only son\'s son." Who is in the photo?', options: ['His son', 'His nephew', 'His father', 'Himself'], correctIndex: 0, explanation: 'Mother\'s only son = himself. So it\'s his son.', xpReward: 15 },
  { id: 'lg16', type: 'logic_grid', difficulty: 'hard', prompt: 'In a group: every person shakes hands with every other exactly once. 6 people = how many handshakes?', options: ['12', '15', '18', '30'], correctIndex: 1, explanation: 'C(6,2) = 6!/(2!×4!) = 15.', xpReward: 20 },
  { id: 'lg17', type: 'logic_grid', difficulty: 'easy', prompt: 'Book : Read :: Knife : ?', options: ['Cut', 'Sharp', 'Metal', 'Cook'], correctIndex: 0, explanation: 'A book is for reading; a knife is for cutting.', xpReward: 10 },
  { id: 'lg18', type: 'logic_grid', difficulty: 'medium', prompt: 'Facing north, turn right, then left, then about-turn. You face:', options: ['North', 'South', 'East', 'West'], correctIndex: 1, explanation: 'N→right=E→left=N→about-turn=S.', xpReward: 15 },
  { id: 'lg19', type: 'logic_grid', difficulty: 'hard', prompt: 'A clock shows 3:15. What is the angle between hour and minute hands?', options: ['0°', '7.5°', '15°', '22.5°'], correctIndex: 1, explanation: 'Hour hand at 97.5°, minute at 90°. Difference = 7.5°.', xpReward: 20 },
  { id: 'lg20', type: 'logic_grid', difficulty: 'easy', prompt: '"Pen" is to "Write" as "Eye" is to:', options: ['Blink', 'See', 'Cry', 'Read'], correctIndex: 1, explanation: 'Primary function analogy.', xpReward: 10 },
];

export const getPuzzlesByType = (type: Puzzle['type']) => PUZZLES.filter(p => p.type === type);
export const getRandomPuzzles = (count: number): Puzzle[] => {
  const shuffled = [...PUZZLES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};
