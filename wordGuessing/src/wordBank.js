// wordBank.js - Enhanced with multiple improvements

// Expanded dictionary of common five-letter words (200 words)
const commonFiveLetterWords = new Set([
  // Common words
  "about", "above", "abuse", "actor", "adapt", "added", "admit", "adopt", "after", "again",
  "agent", "agree", "ahead", "alarm", "album", "alert", "alike", "alive", "allow", "alone",
  "along", "alter", "among", "anger", "angry", "ankle", "apart", "apple", "apply", "argue",
  "arise", "asset", "avoid", "award", "aware", "awful", "badly", "basic", "basis", "beach",
  "began", "begin", "begun", "being", "below", "bench", "birth", "black", "blame", "blank",
  "blast", "blaze", "bleed", "blend", "bless", "blind", "block", "blood", "board", "boast",
  "brain", "brand", "brave", "bread", "break", "brick", "brief", "bring", "broad", "brown",
  "brush", "build", "built", "burst", "cable", "cache", "camel", "candy", "canoe", "carat",
  
  // Words with less common letters (J, Q, X, Z)
  "jazzy", "jelly", "jewel", "joker", "jolly", "judge", "juice", "jumbo", "juror", "quite",
  "quack", "quake", "quick", "quiet", "quilt", "quirk", "quota", "extra", "excel", "expel",
  "xerox", "fixed", "mixer", "pixel", "taxes", "toxic", "boxes", "maxim", "zoom", "zesty",
  "zonal", "zebra", "zilch", "zippy", "zodiac", "quark", "jumps", "fjord", "equip", "jambs",
  
  // Words with common vowel patterns
  "heart", "cheap", "beach", "reach", "feast", "least", "train", "plain", "grain", "stain",
  "sweet", "breed", "greed", "sleep", "weep", "creek", "boost", "shoot", "proof", "moose",
  
  // Words with consonant clusters
  "frame", "crave", "grave", "brave", "drive", "drain", "train", "spent", "split", "spurt",
  "sport", "spray", "shred", "shrub", "shrug", "black", "block", "blink", "cliff", "climb",
  
  // Words with common endings
  "power", "lower", "tower", "cower", "maker", "taker", "baker", "hiker", "ended", "folded",
  "belted", "rested", "starts", "parts", "carts", "darts", "thinks", "blinks", "sinks", "rinks",
  
  // Additional common 5-letter words
  "happy", "funny", "sunny", "drink", "think", "thank", "plant", "planet", "money", "horse",
  "house", "mouse", "light", "night", "fight", "sight", "might", "right", "tight", "voice"
]);

/**
 * ENHANCEMENT 1: Dynamic Dictionary Loading (commented out as requested)
 * 
 * This would allow loading a larger dictionary from an external source
 * but fall back to the built-in dictionary if unavailable.
 * 
 * async function loadFullDictionary() {
 *   try {
 *     const response = await fetch('https://api.example.com/dictionary/five-letter-words');
 *     if (response.ok) {
 *       const words = await response.json();
 *       return new Set(words);
 *     }
 *   } catch (error) {
 *     console.warn('Failed to load dictionary, using built-in fallback', error);
 *   }
 *   return commonFiveLetterWords;
 * }
 */

// ENHANCEMENT 2: Levenshtein Distance for better word similarity matching
const levenshteinDistance = (str1, str2) => {
  const m = str1.length;
  const n = str2.length;
  
  // Create a matrix of size (m+1) x (n+1)
  const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
  
  // Initialize the first row and column
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  
  // Fill the matrix
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i - 1][j],     // deletion
          dp[i][j - 1],     // insertion
          dp[i - 1][j - 1]  // substitution
        );
      }
    }
  }
  
  return dp[m][n];
};

// ENHANCEMENT 3: Common word clusters (included in the expanded dictionary above)
// The dictionary now ensures coverage of all 26 letters

// ENHANCEMENT 4: Letter pair analysis for English
const commonLetterPairs = {
  // Frequency data based on analysis of English text
  // These values represent relative frequencies for letter pairs
  'th': 15, 'he': 14, 'in': 13, 'er': 12, 'an': 11, 're': 10, 'on': 9, 
  'at': 8, 'en': 8, 'nd': 8, 'ti': 7, 'es': 7, 'or': 7, 'te': 7, 
  'of': 6, 'ed': 6, 'is': 6, 'it': 6, 'al': 6, 'ar': 6, 'st': 6, 
  'to': 5, 'nt': 5, 'ng': 5, 'se': 5, 'ha': 5, 'as': 5, 'ou': 5, 
  'io': 4, 'le': 4, 've': 4, 'co': 4, 'me': 4, 'de': 4, 'hi': 4, 
  'ri': 3, 'ro': 3, 'ic': 3, 'ne': 3, 'ea': 3, 'ra': 3, 'ce': 3, 
  'li': 3, 'ch': 3, 'll': 3, 'be': 3, 'ma': 3, 'si': 3, 'om': 3, 
  'ur': 2, 'ca': 2, 'el': 2, 'ta': 2, 'la': 2, 'ns': 2, 'ee': 2
};

// Helper function to pick a weighted random letter pair
const getWeightedLetterPair = () => {
  const pairs = Object.keys(commonLetterPairs);
  const weights = Object.values(commonLetterPairs);
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  
  let random = Math.random() * totalWeight;
  let cumulativeWeight = 0;
  
  for (let i = 0; i < pairs.length; i++) {
    cumulativeWeight += weights[i];
    if (random <= cumulativeWeight) {
      return pairs[i];
    }
  }
  
  // Fallback
  return pairs[0];
};

// Smart generation function that uses letter pairs and English patterns
export const generateCandidate = () => {
  // Patterns for 5-letter words (C = consonant, V = vowel, P = letter pair)
  const patterns = [
    'PCVC',   // pair + consonant + vowel + consonant
    'CVPC',   // consonant + vowel + pair + consonant
    'CPVC',   // consonant + pair + vowel + consonant
    'CVCP',   // consonant + vowel + consonant + pair
    'PCVV',   // pair + consonant + vowel + vowel
    'VVPC',   // vowel + vowel + pair + consonant
    'VPPC',   // vowel + pair + pair
    'CCVVC',  // consonant + consonant + vowel + vowel + consonant
    'CVCVC',  // consonant + vowel + consonant + vowel + consonant
    'VCVCV'   // vowel + consonant + vowel + consonant + vowel
  ];
  
  // Probability-weighted consonants (based on English frequency)
  const consonantWeights = {
    'b': 5, 'c': 8, 'd': 7, 'f': 5, 'g': 5, 'h': 6, 'j': 1, 'k': 3, 
    'l': 8, 'm': 6, 'n': 9, 'p': 6, 'q': 1, 'r': 9, 's': 10, 't': 9, 
    'v': 3, 'w': 4, 'x': 1, 'y': 4, 'z': 1
  };
  
  // Probability-weighted vowels
  const vowelWeights = { 'a': 10, 'e': 12, 'i': 9, 'o': 8, 'u': 5 };
  
  // Weighted selection function
  const weightedRandom = (weights) => {
    const entries = Object.entries(weights);
    const total = entries.reduce((sum, [_, weight]) => sum + weight, 0);
    let random = Math.random() * total;
    
    for (const [item, weight] of entries) {
      random -= weight;
      if (random <= 0) return item;
    }
    return entries[0][0]; // Fallback
  };
  
  // Select a random pattern
  const pattern = patterns[Math.floor(Math.random() * patterns.length)];
  
  // Generate word based on pattern
  let word = '';
  let i = 0;
  
  while (i < pattern.length) {
    if (pattern[i] === 'P') {
      // Add a common letter pair
      const pair = getWeightedLetterPair();
      word += pair;
      i++; // Only increment once, even though we added two letters
    } 
    else if (pattern[i] === 'C') {
      word += weightedRandom(consonantWeights);
      i++;
    } 
    else if (pattern[i] === 'V') {
      word += weightedRandom(vowelWeights);
      i++;
    }
    
    // Ensure we don't exceed 5 letters
    if (word.length >= 5) break;
  }
  
  // Trim or pad to ensure exactly 5 letters
  if (word.length > 5) {
    word = word.substring(0, 5);
  } 
  else if (word.length < 5) {
    // Pad with random consonants or vowels to reach 5 letters
    while (word.length < 5) {
      if (word.length % 2 === 0) {
        word += weightedRandom(consonantWeights);
      } else {
        word += weightedRandom(vowelWeights);
      }
    }
  }
  
  return word;
};

// Find the closest word in our dictionary using Levenshtein distance
const findClosestWord = (candidate) => {
  let closestWord = null;
  let minDistance = Infinity;
  
  for (const word of commonFiveLetterWords) {
    const distance = levenshteinDistance(candidate, word);
    if (distance < minDistance) {
      minDistance = distance;
      closestWord = word;
    }
    
    // Short-circuit if we find an exact match
    if (distance === 0) break;
    
    // Short-circuit if we find a very close match
    if (distance === 1 && Math.random() > 0.5) break;
  }
  
  return closestWord;
};

// Updated getRandomWord function that selects words based on difficulty
export function getRandomWord(difficulty = "medium") {
  // Convert the set of common words to an array
  const words = Array.from(commonFiveLetterWords);
  
  // Letter frequency values (approximate percentages) from English language studies
  const letterFrequency = {
    a: 8.17, b: 1.49, c: 2.78, d: 4.25, e: 12.70, f: 2.23, g: 2.02, h: 6.09,
    i: 6.97, j: 0.15, k: 0.77, l: 4.03, m: 2.41, n: 6.75, o: 7.51, p: 1.93,
    q: 0.10, r: 5.99, s: 6.33, t: 9.06, u: 2.76, v: 0.98, w: 2.36, x: 0.15,
    y: 1.97, z: 0.07
  };
  
  // Compute a frequency score for each word as the sum of its letters' frequencies
  const scores = words.map(word => {
    let score = 0;
    for (const char of word) {
      score += letterFrequency[char] || 0;
    }
    return score;
  });
  
  // Determine the minimum and maximum scores to normalize the values
  const minScore = Math.min(...scores);
  const maxScore = Math.max(...scores);
  const range = maxScore - minScore;
  
  // Calculate weights based on difficulty setting
  // For 'easy': higher frequency (more common) words get a higher weight
  // For 'hard': lower frequency (more obscure) words get a higher weight
  // For 'medium': use uniform weights
  const weights = scores.map(score => {
    const normalized = range > 0 ? (score - minScore) / range : 1;
    if (difficulty === "easy") {
      return normalized; // Prefer words with higher letter frequency
    } else if (difficulty === "hard") {
      return 1 - normalized; // Prefer words with lower letter frequency
    } else { // medium
      return 1; // Equal chance for all words
    }
  });
  
  // Perform weighted random selection
  const totalWeight = weights.reduce((acc, w) => acc + w, 0);
  let random = Math.random() * totalWeight;
  for (let i = 0; i < words.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return words[i];
    }
  }
  
  // Fallback in case of rounding issues
  return words[0];
}

// A cache of generated words to avoid duplicates in a game session
const wordCache = new Set();

// Get a unique random word
export function getUniqueRandomWord() {
  let word;
  let attempts = 0;
  const maxAttempts = 20; // Prevent infinite loops if we run out of words
  
  do {
    word = getRandomWord();
    attempts++;
  } while (wordCache.has(word) && attempts < maxAttempts);
  
  wordCache.add(word);
  
  // If we've generated too many words, clear part of the cache
  if (wordCache.size > 100) {
    // Remove the oldest entries (approximation by converting to array)
    const oldestEntries = Array.from(wordCache).slice(0, 50);
    oldestEntries.forEach(entry => wordCache.delete(entry));
  }
  
  return word;
}

// Reset the word cache (useful for starting a new game)
export function resetWordCache() {
  wordCache.clear();
}

// Debug function to test word generation
export function testWordGeneration(count = 10) {
  const words = [];
  for (let i = 0; i < count; i++) {
    words.push(getUniqueRandomWord());
  }
  return words;
}