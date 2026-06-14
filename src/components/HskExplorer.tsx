import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, Sparkles, Check, X, Award, RotateCcw } from "lucide-react";
import { CharacterItem } from "../types";

const HSK_CHARACTERS_DATA: Record<number, CharacterItem[]> = {
  1: [
    { hanzi: "人", pinyin: "rén", meaning: "Person / Human", tone: 2 },
    { hanzi: "木", pinyin: "mù", meaning: "Wood / Tree", tone: 4 },
    { hanzi: "山", pinyin: "shān", meaning: "Mountain", tone: 1 },
    { hanzi: "水", pinyin: "shuǐ", meaning: "Water", tone: 3 },
    { hanzi: "日", pinyin: "rì", meaning: "Sun / Day", tone: 4 },
    { hanzi: "月", pinyin: "yuè", meaning: "Moon / Month", tone: 4 },
  ],
  2: [
    { hanzi: "风", pinyin: "fēng", meaning: "Wind", tone: 1 },
    { hanzi: "火", pinyin: "huǒ", meaning: "Fire", tone: 3 },
    { hanzi: "花", pinyin: "huā", meaning: "Flower", tone: 1 },
    { hanzi: "门", pinyin: "mén", meaning: "Door / Gate", tone: 2 },
    { hanzi: "马", pinyin: "mǎ", meaning: "Horse", tone: 3 },
    { hanzi: "鸟", pinyin: "niǎo", meaning: "Bird", tone: 3 },
  ],
  3: [
    { hanzi: "云", pinyin: "yún", meaning: "Cloud", tone: 2 },
    { hanzi: "石", pinyin: "shí", meaning: "Stone / Rock", tone: 2 },
    { hanzi: "鱼", pinyin: "yú", meaning: "Fish", tone: 2 },
    { hanzi: "草", pinyin: "cǎo", meaning: "Grass", tone: 3 },
    { hanzi: "猫", pinyin: "māo", meaning: "Cat", tone: 1 },
    { hanzi: "路", pinyin: "lù", meaning: "Road / Path", tone: 4 },
  ],
};

const TONE_COLORS: Record<number, string> = {
  1: "text-red-500 bg-red-50 border-red-200",
  2: "text-orange-500 bg-orange-50 border-orange-200",
  3: "text-green-600 bg-green-50 border-green-200",
  4: "text-blue-500 bg-blue-50 border-blue-200",
};

const TONE_NAMES: Record<number, string> = {
  1: "1st Tone (Flat)",
  2: "2nd Tone (Rising)",
  3: "3rd Tone (Dipping)",
  4: "4th Tone (Falling)",
};

export default function HskExplorer() {
  const [level, setLevel] = useState<number>(1);
  const [selectedChar, setSelectedChar] = useState<CharacterItem>(HSK_CHARACTERS_DATA[1][0]);
  
  // Matching mini-game state
  const [gameIndex, setGameIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [score, setScore] = useState<number>(0);
  const [gameFinished, setGameFinished] = useState<boolean>(false);

  // Generate game question options based on current level's characters
  const currentChars = HSK_CHARACTERS_DATA[level];
  const activeQuestion = currentChars[gameIndex % currentChars.length];

  // Pick 3 random distractors + the correct answer
  const getOptions = (correctAnswer: string) => {
    const allMeanings = Object.values(HSK_CHARACTERS_DATA)
      .flat()
      .map((c) => c.meaning);
    const uniqueDistractors = Array.from(new Set(allMeanings.filter((m) => m !== correctAnswer)));
    
    // Shuffle distractors and pick 3
    const shuffledDistractors = [...uniqueDistractors].sort(() => 0.5 - Math.random());
    const pickedOptions = [correctAnswer, ...shuffledDistractors.slice(0, 3)];
    // Shuffle output
    return pickedOptions.sort(() => 0.5 - Math.random());
  };

  const [options, setOptions] = useState<string[]>(() => getOptions(activeQuestion.meaning));

  const handleLevelChange = (newLevel: number) => {
    setLevel(newLevel);
    const firstChar = HSK_CHARACTERS_DATA[newLevel][0];
    setSelectedChar(firstChar);
    resetMiniGame(newLevel);
  };

  const handleCharacterClick = (char: CharacterItem) => {
    setSelectedChar(char);
  };

  const decodeToneSymbol = (toneNum: number) => {
    switch (toneNum) {
      case 1: return "ā (flat)";
      case 2: return "á (rising)";
      case 3: return "ǎ (dipping)";
      case 4: return "à (falling)";
      default: return "";
    }
  };

  const handleAnswerSubmit = (option: string) => {
    if (feedback !== null) return;
    setSelectedAnswer(option);
    if (option === activeQuestion.meaning) {
      setFeedback("correct");
      setScore((prev) => prev + 1);
    } else {
      setFeedback("incorrect");
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setFeedback(null);
    if (gameIndex < currentChars.length - 1) {
      const nextIdx = gameIndex + 1;
      setGameIndex(nextIdx);
      const nextQuestion = currentChars[nextIdx];
      setOptions(getOptions(nextQuestion.meaning));
    } else {
      setGameFinished(true);
    }
  };

  const resetMiniGame = (customLevel?: number) => {
    const targetLevel = customLevel || level;
    setGameIndex(0);
    setSelectedAnswer(null);
    setFeedback(null);
    setScore(0);
    setGameFinished(false);
    const chars = HSK_CHARACTERS_DATA[targetLevel];
    setOptions(getOptions(chars[0].meaning));
  };

  return (
    <div id="hsk-explorer" className="w-full bg-white rounded-3xl border border-memzi-cream-dark/80 p-6 md:p-8 shadow-xl relative overflow-hidden">
      
      {/* Decorative leaf backgrounds */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-memzi-sprout/10 rounded-bl-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-memzi-green/5 rounded-tr-full pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-memzi-cream-dark pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-memzi-sprout/20 rounded-lg text-memzi-green">
              <BookOpen size={16} />
            </span>
            <span className="text-xs font-semibold text-memzi-green uppercase tracking-wider font-display">Pedagogical Demo</span>
          </div>
          <h3 className="text-2xl font-bold font-display text-memzi-forest">HSK Living Library</h3>
        </div>

        {/* Level Toggles */}
        <div className="flex items-center gap-2 bg-memzi-cream p-1 rounded-xl border border-memzi-cream-dark">
          {[1, 2, 3].map((num) => (
            <button
              key={num}
              id={`hsk-level-btn-${num}`}
              onClick={() => handleLevelChange(num)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                level === num
                  ? "bg-memzi-green text-white shadow-md"
                  : "text-memzi-teal/75 hover:bg-memzi-cream-dark hover:text-memzi-teal"
              }`}
            >
              HSK {num}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* CHARACTER EXPLORER DECK: 7 columns */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-memzi-cream/40 p-4 rounded-2xl border border-memzi-cream-dark/50">
            <h4 className="text-sm font-medium text-memzi-teal/70 mb-3">Select a characters node below to study:</h4>
            
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {currentChars.map((char) => (
                <button
                  key={char.hanzi}
                  id={`char-node-${char.hanzi}`}
                  onClick={() => handleCharacterClick(char)}
                  className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center p-2 transition-all relative ${
                    selectedChar.hanzi === char.hanzi
                      ? "border-memzi-green bg-white shadow-md scale-105"
                      : "border-transparent bg-memzi-cream hover:bg-memzi-cream-dark/60 hover:scale-[1.02]"
                  }`}
                >
                  <span className="text-2xl font-bold font-display text-memzi-forest">{char.hanzi}</span>
                  <span className="text-xs text-memzi-teal/70 font-mono mt-0.5">{char.pinyin}</span>
                  <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-memzi-gold opacity-0 active:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>

          {/* Active study details */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedChar.hanzi}
              id="selected-char-detail"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-memzi-cream p-6 rounded-2xl border border-memzi-cream-dark flex flex-col sm:flex-row gap-6 items-center"
            >
              <div className="w-24 h-24 rounded-2xl bg-white border border-memzi-cream-dark flex items-center justify-center shadow-inner shrink-0 relative">
                <span className="text-5xl font-bold font-display text-memzi-teal">{selectedChar.hanzi}</span>
                <span className={`absolute bottom-1 right-1 font-mono text-[10px] font-bold px-1.5 py-0.2 rounded border ${TONE_COLORS[selectedChar.tone]}`}>
                  T{selectedChar.tone}
                </span>
              </div>

              <div className="text-center sm:text-left flex-1 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
                  <span className="text-xl font-bold text-memzi-forest font-mono">{selectedChar.pinyin}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium font-sans border flex items-center gap-1 w-fit mx-auto sm:mx-0 bg-white shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-memzi-gold animate-pulse" />
                    {TONE_NAMES[selectedChar.tone]}
                  </span>
                </div>
                
                <p className="text-sm font-medium text-memzi-teal">
                  Meaning: <span className="text-base font-bold text-memzi-green-deep">{selectedChar.meaning}</span>
                </p>

                <p className="text-xs text-memzi-teal/75 leading-relaxed italic bg-white/70 px-3 py-2 rounded-lg border border-memzi-cream-dark/60">
                  🌱 <span className="font-semibold text-memzi-forest">Cozy memory hint:</span> Imagine this character as a physical entity. Note how the pen stroke mirrors the curves of a the {selectedChar.meaning.toLowerCase()} in nature!
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* INTERACTIVE MINI MATCHING GAME: 5 columns */}
        <div className="lg:col-span-5 bg-memzi-teal text-white p-6 rounded-2xl shadow-lg border border-memzi-forest relative">
          <div className="flex items-center justify-between mb-4 border-b border-memzi-green pb-3">
            <span className="text-xs font-semibold uppercase tracking-wider font-display text-memzi-sprout/90 flex items-center gap-1">
              <Sparkles size={12} /> Lumo's Mini Quiz
            </span>
            <span className="text-xs font-mono bg-memzi-green-deep px-2 py-0.5 rounded border border-memzi-green/20">
              Score: {score}/{currentChars.length}
            </span>
          </div>

          <AnimatePresence mode="wait">
            {!gameFinished ? (
              <motion.div
                key={gameIndex}
                className="space-y-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center py-4 bg-memzi-green-deep/30 rounded-xl border border-memzi-green-light/20">
                  <p className="text-xs text-memzi-sprout/70 uppercase font-mono tracking-wider mb-2">What does this sprout card mean?</p>
                  <p className="text-5xl font-extrabold font-display leading-tight">{activeQuestion.hanzi}</p>
                  <p className="text-sm text-memzi-sprout font-mono font-medium mt-1">{activeQuestion.pinyin}</p>
                </div>

                {/* Multiple choice values */}
                <div className="grid grid-cols-1 gap-2.5">
                  {options.map((option) => {
                    const isSelected = selectedAnswer === option;
                    let optionStyle = "border-memzi-green-light bg-memzi-forest/50 hover:bg-memzi-green-deep hover:scale-[1.01]";
                    
                    if (isSelected) {
                      if (feedback === "correct") optionStyle = "bg-green-600 border-green-400 text-white shadow-lg shadow-green-900/20";
                      else optionStyle = "bg-red-600 border-red-400 text-white shadow-lg shadow-red-900/20";
                    } else if (feedback !== null && option === activeQuestion.meaning) {
                      // Highlight correct answer if user got it wrong
                      optionStyle = "bg-green-800/80 border-green-500 text-green-100";
                    }

                    return (
                      <button
                        key={option}
                        id={`option-btn-${option.replace(/[^a-zA-Z0-9]/g, "")}`}
                        disabled={feedback !== null}
                        onClick={() => handleAnswerSubmit(option)}
                        className={`w-full text-left px-4 py-2.5 rounded-xl border text-sm font-medium transition-all flex items-center justify-between ${optionStyle}`}
                      >
                        <span>{option}</span>
                        {isSelected && feedback === "correct" && <Check size={16} />}
                        {isSelected && feedback === "incorrect" && <X size={16} />}
                      </button>
                    );
                  })}
                </div>

                {/* Feedback prompt */}
                {feedback !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-2 mt-2 pt-2 border-t border-memzi-green/20"
                  >
                    <p className="text-xs font-medium text-center">
                      {feedback === "correct" ? (
                        <span className="text-memzi-sprout font-bold">✨ Brilliant Match! Lumo is ecstatic! 🌱</span>
                      ) : (
                        <span className="text-orange-300 font-bold">Close! Sprout learning is iterative! 🧡</span>
                      )}
                    </p>
                    <button
                      id="next-question-btn"
                      onClick={handleNextQuestion}
                      className="w-full bg-memzi-sprout text-memzi-forest font-semibold text-xs py-2 rounded-lg shadow-md hover:bg-white transition-colors"
                    >
                      {gameIndex < currentChars.length - 1 ? "Next Sprout Chapter →" : "See Quiz Results"}
                    </button>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6 space-y-4"
              >
                <div className="inline-flex p-3 bg-memzi-green-deep/50 rounded-full text-memzi-gold">
                  <Award size={40} className="animate-bounce" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-lg font-display">Sprout Quiz Complete!</h4>
                  <p className="text-sm text-memzi-sprout/80">You scored {score} out of {currentChars.length} matches!</p>
                </div>
                <div className="bg-memzi-forest/30 border border-memzi-green/20 p-3 rounded-xl text-xs text-left max-w-xs mx-auto">
                  <span className="font-semibold block text-white mb-0.5">🌱 Lumo says:</span>
                  "Every leaf starts as a seed. Learning Chinese is about daily sips of spring water. Keep exploring!"
                </div>
                <button
                  id="restart-quiz-btn"
                  onClick={() => resetMiniGame()}
                  className="inline-flex items-center gap-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs px-4 py-2 rounded-lg transition-colors"
                >
                  <RotateCcw size={12} /> Play Again
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
