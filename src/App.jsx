import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatNumber } from './utils/formatters';
import CounterCard from './components/CounterCard';
import Celebration from './components/Celebration';
import RankingList from './components/RankingList';
import AnimatedTitle from './components/AnimatedTitle';
import GeminiRank1Celebration from './components/GeminiRank1Celebration';
import InitialLoader from './components/InitialLoader';
import { fetchBlockerCount, fetchTopBlockedAccounts } from './api/clearsky';

const NYTIMES_DID = 'did:plc:eclio37ymobqex2ncko63h4r';
const GEMINI_DID = 'did:plc:57na4nqoqohad5wk47jlu4rk';
const REFRESH_INTERVAL = 60000; // 1 minute

function App() {
  const [nytimesCount, setNytimesCount] = useState(null);
  const [geminiCount, setGeminiCount] = useState(null);
  const [prevNytimesCount, setPrevNytimesCount] = useState(null);
  const [prevGeminiCount, setPrevGeminiCount] = useState(null);
  const [topBlocked, setTopBlocked] = useState([]);
  const [nytimesRank, setNytimesRank] = useState(null);
  const [geminiRank, setGeminiRank] = useState(null);
  const [previousGeminiRank, setPreviousGeminiRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showRankUpCelebration, setShowRankUpCelebration] = useState(false);
  const [showCountIncreased, setShowCountIncreased] = useState(false);
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL / 1000);
  const [showMilestoneInfo, setShowMilestoneInfo] = useState(false);
  const [isDebugModeActive, setIsDebugModeActive] = useState(false);
  const [rankToDisplayInCelebration, setRankToDisplayInCelebration] = useState(null);
  const [showGeminiRank1Celebration, setShowGeminiRank1Celebration] = useState(false);
  const [isAppInitialized, setIsAppInitialized] = useState(false);

  // Memoized close handlers
  const handleCloseGeminiRank1Celebration = useCallback(() => {
    setShowGeminiRank1Celebration(false);
  }, []);

  const handleCloseSurpassCelebration = useCallback(() => {
    setShowCelebration(false);
  }, []);

  const handleCloseRankUpCelebration = useCallback(() => {
    setShowRankUpCelebration(false);
  }, []);

  const handleAppInitialized = useCallback(() => {
    setIsAppInitialized(true);
  }, []);

  // Calculate the difference between counters
  const difference = useMemo(() => {
    if (nytimesCount !== null && geminiCount !== null) {
      return nytimesCount - geminiCount;
    }
    return null;
  }, [nytimesCount, geminiCount]);
  
  // Calculate the percentage to overtake
  const percentageToOvertake = useMemo(() => {
    if (difference > 0 && geminiCount) {
      return Math.round((geminiCount / nytimesCount) * 100);
    }
    return 100;
  }, [difference, geminiCount, nytimesCount]);
  
  // Calculate the rate of change
  const rateOfChange = useMemo(() => {
    if (prevGeminiCount && prevNytimesCount && geminiCount && nytimesCount) {
      const geminiGrowth = geminiCount - prevGeminiCount;
      const nytimesGrowth = nytimesCount - prevNytimesCount;
      
      if (geminiGrowth > nytimesGrowth) {
        const blocksPerHour = (geminiGrowth - nytimesGrowth) * (60 / (REFRESH_INTERVAL / 1000 / 60));
        if (difference > 0) {
          const hoursToOvertake = Math.ceil(difference / blocksPerHour);
          return { 
            faster: true, 
            blocksPerHour,
            timeToOvertake: hoursToOvertake > 0 ? hoursToOvertake : 0
          };
        }
        return { faster: true, blocksPerHour };
      } else if (nytimesGrowth > geminiGrowth) {
        return { 
          faster: false, 
          blocksPerHour: (nytimesGrowth - geminiGrowth) * (60 / (REFRESH_INTERVAL / 1000 / 60))
        };
      }
    }
    return null;
  }, [prevGeminiCount, prevNytimesCount, geminiCount, nytimesCount, difference, REFRESH_INTERVAL]);
  
  // Have we reached the milestone?
  const hasGeminiSurpassedNYTimes = geminiCount > nytimesCount;

  // Find ranks and check for rank improvements
  useEffect(() => {
    if (!topBlocked.length) return;

    const findRank = (did) => {
      const index = topBlocked.findIndex(account => account.did === did);
      return index !== -1 ? index + 1 : null;
    };

    const nytimesCurrentRank = findRank(NYTIMES_DID);
    const geminiCurrentRank = findRank(GEMINI_DID);

    setNytimesRank(nytimesCurrentRank);
    
    if (geminiCurrentRank === 1 && geminiRank !== 1) {
      console.log('[Debug] GEMINI IS #1! Triggering special celebration.');
      setShowGeminiRank1Celebration(true);
      setShowRankUpCelebration(false);
    } else if (geminiCurrentRank && geminiRank !== null && geminiCurrentRank < geminiRank && geminiCurrentRank !== 1) {
      console.log('[Debug] Attempting to show rank up celebration. New Rank:', geminiCurrentRank, 'Old Rank:', geminiRank);
      setRankToDisplayInCelebration(geminiCurrentRank);
      setShowRankUpCelebration(true);
    }
    
    if (geminiRank !== geminiCurrentRank) {
      setPreviousGeminiRank(geminiRank);
      setGeminiRank(geminiCurrentRank);
    }
  }, [topBlocked, geminiRank, previousGeminiRank]);

  // Fetch blocker counts and rankings
  async function fetchData() {
    try {
      setLoading(true);
      setError(null);
      
      // Save previous counts
      if (nytimesCount !== null) {
        setPrevNytimesCount(nytimesCount);
      }
      
      if (geminiCount !== null) {
        setPrevGeminiCount(geminiCount);
      }
      
      // Fetch individual counts
      const [nytimes, gemini] = await Promise.all([
        fetchBlockerCount(NYTIMES_DID),
        fetchBlockerCount(GEMINI_DID)
      ]);
      
      setNytimesCount(nytimes);
      setGeminiCount(gemini);
      
      // Check if counts increased
      if (prevGeminiCount && gemini > prevGeminiCount) {
        setShowCountIncreased(true);
        setTimeout(() => setShowCountIncreased(false), 3000);
      }
      
      // Fetch top blocked accounts
      const topBlockedData = await fetchTopBlockedAccounts();

      // ---- TEMPORARY HARDCODING FOR GEMINI ---
      // Check if Gemini is already in the fetched list
      // const geminiInList = topBlockedData.find(account => account.did === GEMINI_DID);
      // if (!geminiInList) {
      //   console.log("[Debug] Gemini not in fetched topBlockedData. Hardcoding for testing rank-up simulation.");
      //   let geminiSimulatedCount = 1; // Default count
      //   if (topBlockedData.length > 0) {
      //     const lastAccountCount = topBlockedData[topBlockedData.length - 1].blockerCount;
      //     geminiSimulatedCount = Math.max(1, lastAccountCount - 50);
      //   } else {
      //     geminiSimulatedCount = 5000;
      //   }
      //   const geminiHardcodedEntry = {
      //     did: GEMINI_DID,
      //     handle: 'gemini.is-a.bot',
      //     blockerCount: geminiSimulatedCount,
      //   };
      //   topBlockedData.push(geminiHardcodedEntry);
      //   console.log("[Debug] Added Gemini to topBlockedData:", geminiHardcodedEntry, "New list length:", topBlockedData.length);
      // }
      // ---- END TEMPORARY HARDCODING ---
      
      setTopBlocked(topBlockedData);
      
      // Check if gemini has surpassed nytimes
      if (gemini > nytimes && !showCelebration && nytimes !== null && gemini !== null) {
        setShowCelebration(true);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  // Update countdown timer
  useEffect(() => {
    if (loading || showGeminiRank1Celebration) return;
    
    const timer = setInterval(() => {
      setCountdown(prev => prev > 0 ? prev - 1 : REFRESH_INTERVAL / 1000);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [loading, REFRESH_INTERVAL, showGeminiRank1Celebration]);

  // Reset countdown when it reaches zero
  useEffect(() => {
    if (countdown === 0 && !showGeminiRank1Celebration) {
      fetchData();
      setCountdown(REFRESH_INTERVAL / 1000);
    }
  }, [countdown, showGeminiRank1Celebration]);

  // Initial fetch
  useEffect(() => {
    fetchData();
    
    // Set up interval for refreshing
    const interval = setInterval(fetchData, REFRESH_INTERVAL);
    
    // Clean up interval
    return () => clearInterval(interval);
  }, []);

  const simulateGeminiRankUp = () => {
    console.log("[Simulate] Button clicked. Current geminiRank (state):", geminiRank, "TopBlocked length:", topBlocked.length);
    if (!topBlocked.length || typeof geminiRank !== 'number') {
      console.log("[Simulate] Pre-conditions not met. Bailing out.");
      return;
    }

    setTopBlocked(prevTopBlocked => {
      console.log("[Simulate] setTopBlocked updater function running.");
      const newTopBlocked = JSON.parse(JSON.stringify(prevTopBlocked));
      const geminiIndexOld = newTopBlocked.findIndex(acc => acc.did === GEMINI_DID);
      const oldRankDisplay = geminiIndexOld !== -1 ? geminiIndexOld + 1 : 'N/A';
      console.log("[Simulate] Gemini's index before simulation:", geminiIndexOld, "(Rank: " + oldRankDisplay + ")");

      if (geminiIndexOld === -1 || geminiIndexOld === 0) {
        console.log("[Simulate] Gemini not found in list or already #1. No change will be made.");
        return prevTopBlocked;
      }

      const geminiAccount = newTopBlocked[geminiIndexOld];
      const targetAccount = newTopBlocked[geminiIndexOld - 1];
      console.log("[Simulate] Gemini account:", JSON.parse(JSON.stringify(geminiAccount)));
      console.log("[Simulate] Target account (above Gemini):", JSON.parse(JSON.stringify(targetAccount)));

      geminiAccount.blockerCount = targetAccount.blockerCount + 10;
      console.log("[Simulate] Gemini's new blockerCount:", geminiAccount.blockerCount);
      
      newTopBlocked.sort((a, b) => b.blockerCount - a.blockerCount);
      const geminiIndexNew = newTopBlocked.findIndex(acc => acc.did === GEMINI_DID);
      const newRankDisplay = geminiIndexNew !== -1 ? geminiIndexNew + 1 : 'N/A';
      console.log("[Simulate] Gemini's index after sort:", geminiIndexNew, "(New Rank: " + newRankDisplay + ")");
      
      if (geminiIndexNew === geminiIndexOld) {
        console.warn("[Simulate] Warning: Gemini's index did not change after simulation and sort. Rank may not have improved as expected.");
      }

      return newTopBlocked;
    });
  };

  const simulateGeminiRank1 = () => {
    console.log("[Simulate #1] Forcing Gemini to Rank 1.");
    setTopBlocked(prevTopBlocked => {
      const newTopBlocked = JSON.parse(JSON.stringify(prevTopBlocked.filter(acc => acc.did !== GEMINI_DID)));
      const geminiRank1Entry = {
        did: GEMINI_DID,
        handle: 'gemini.is-a.bot',
        blockerCount: (newTopBlocked.length > 0 ? newTopBlocked[0].blockerCount : 0) + 1000,
      };
      newTopBlocked.unshift(geminiRank1Entry);
      newTopBlocked.sort((a, b) => b.blockerCount - a.blockerCount);
      return newTopBlocked;
    });
  };

  return (
    <>
      {/* Always rendered, animated background - CREATIVE GRADIENT */}
      <div className="fixed inset-0 -z-20 animate-bg-gradient-flow"></div>

      <AnimatePresence>
        {!isAppInitialized && <InitialLoader onLoaded={handleAppInitialized} key="initialLoader" />}
      </AnimatePresence>

      {/* Main app content container */}
      <div className={`min-h-screen flex flex-col items-center justify-between py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden w-full text-white transition-opacity duration-500 ${isAppInitialized ? 'opacity-100' : 'opacity-0'}`}>
        {/* Floating circles background effect (adjust z-index if needed) */}
        <motion.div 
          className="absolute top-20 right-20 w-64 h-64 rounded-full bg-purple-700/20 blur-xl -z-10"
          animate={{ 
            y: [0, 30, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div 
          className="absolute bottom-20 left-40 w-80 h-80 rounded-full bg-blue-700/20 blur-xl -z-10"
          animate={{ 
            y: [0, -40, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        
        {/* Page title with typewriter effect */}
        <header className="mb-12 text-center w-full">
          <AnimatedTitle text="are we nytimes yet?" />
        </header>
        
        {/* Main content */}
        <main className="w-full max-w-7xl mx-auto flex-grow">
          {/*
          {isDebugModeActive && (
            <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 items-end">
              <div className="bg-yellow-500/80 backdrop-blur-sm text-black p-3 rounded-lg shadow-xl">
                <p className="font-bold text-sm mb-2">Debug Mode Active</p>
                <button 
                  onClick={simulateGeminiRankUp}
                  className={`bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold py-1.5 px-3 rounded-md transition-colors duration-150 w-full shadow-md ${geminiRank === null ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={geminiRank === null}
                  title={geminiRank === null ? "Gemini needs to be in the top accounts list to simulate rank up." : "Simulate Gemini ranking up"}
                >
                  Simulate Gemini Rank Up
                </button>
                <button
                  onClick={simulateGeminiRank1}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold py-1.5 px-3 rounded-md transition-colors duration-150 w-full shadow-md mt-2"
                  title="Simulate Gemini reaching #1!"
                >
                  Simulate Gemini #1
                </button>
                <button
                  onClick={() => { 
                    console.log('[Debug] Forcing Rank Up Celebration Test');
                    setRankToDisplayInCelebration(geminiRank || 2); 
                    setShowRankUpCelebration(true); 
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold py-1.5 px-3 rounded-md transition-colors duration-150 w-full shadow-md mt-2"
                >
                  Test Rank Up Celeb
                </button>
              </div>
            </div>
          )}
          */}

          {/*
          <button 
            onClick={() => setIsDebugModeActive(!isDebugModeActive)}
            className="fixed bottom-4 left-4 bg-gray-700 hover:bg-gray-600 text-white text-xs py-1 px-2 rounded-md z-50 shadow-lg"
          >
            {isDebugModeActive ? 'Exit Debug' : 'Debug'}
          </button>
          */}

          {error ? (
            <motion.div 
              className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          ) : (
            <div className="space-y-12">
              {/* Counter cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <CounterCard 
                  label="@nytimes.com"
                  handle="nytimes.com"
                  value={nytimesCount}
                  rank={nytimesRank}
                  loading={loading}
                  color="bg-nytimes/10"
                  textColor="text-gray-100"
                  borderColor="border-nytimes/30"
                  glowColor="rgba(255, 255, 255, 0.15)"
                  increased={prevNytimesCount !== null && nytimesCount > prevNytimesCount}
                />
                
                <CounterCard 
                  label="@gemini.is-a.bot"
                  handle="gemini.is-a.bot"
                  value={geminiCount}
                  rank={geminiRank}
                  loading={loading}
                  color="bg-gemini/10"
                  textColor="text-gray-100"
                  borderColor="border-gemini/30"
                  glowColor="rgba(103, 58, 183, 0.3)"
                  increased={prevGeminiCount !== null && geminiCount > prevGeminiCount}
                />
              </div>
              
              {/* Gap display */}
              {difference !== null && (
                <motion.div 
                  className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700 text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ 
                    boxShadow: "0 0 25px rgba(139, 92, 246, 0.3)",
                    scale: 1.02
                  }}
                  onClick={() => setShowMilestoneInfo(!showMilestoneInfo)}
                >
                  <h3 className="text-lg text-gray-300 mb-2">Current Gap</h3>
                  <div className="flex items-center justify-center">
                    <motion.div
                      key={Math.abs(difference)}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`text-2xl md:text-4xl font-bold ${difference > 0 ? 'text-red-400' : 'text-green-400'}`}
                    >
                      {difference > 0 ? (
                        <>
                          <span className="text-gray-400 font-normal">nytimes leads by</span> {formatNumber(difference)}
                        </>
                      ) : difference < 0 ? (
                        <>
                          <span className="text-gray-400 font-normal">gemini leads by</span> {formatNumber(Math.abs(difference))}
                        </>
                      ) : (
                        <span className="text-yellow-400">Tied!</span>
                      )}
                    </motion.div>
                  </div>
                  
                  {/* Progress bar for overtaking */}
                  {difference > 0 && (
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>{percentageToOvertake}% to overtaking</span>
                        {rateOfChange && rateOfChange.faster && (
                          <motion.span 
                            className="text-green-400"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            {rateOfChange.timeToOvertake > 0 
                              ? `~${rateOfChange.timeToOvertake} hours to go` 
                              : "Any moment now!"}
                          </motion.span>
                        )}
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <motion.div 
                          className="bg-gradient-to-r from-blue-600 to-purple-600 h-2.5 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${percentageToOvertake}%` }}
                          transition={{ duration: 1 }}
                        ></motion.div>
                      </div>
                    </div>
                  )}
                  
                  {/* Rate of change info */}
                  {rateOfChange && (
                    <motion.div 
                      className="mt-4 text-sm"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ 
                        opacity: showMilestoneInfo ? 1 : 0,
                        height: showMilestoneInfo ? 'auto' : 0
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className={`${rateOfChange.faster ? 'text-green-400' : 'text-red-400'}`}>
                        {rateOfChange.faster 
                          ? `Gemini is gaining on NYTimes at ~${Math.round(rateOfChange.blocksPerHour)} blocks/hour` 
                          : `NYTimes is pulling ahead at ~${Math.round(rateOfChange.blocksPerHour)} blocks/hour`}
                      </p>
                      <p className="text-gray-400 mt-1">Click for more stats</p>
                    </motion.div>
                  )}
                </motion.div>
              )}
              
              {/* Rankings */}
              <RankingList 
                rankings={topBlocked} 
                nytimesDid={NYTIMES_DID}
                geminiDid={GEMINI_DID}
                loading={loading}
              />
              
              {/* Next refresh countdown */}
              <motion.div 
                className="text-center text-sm text-gray-400"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Next update in {countdown} seconds
              </motion.div>
            </div>
          )}
        </main>
        
        <footer className="w-full pt-12 pb-6 text-center text-gray-400 text-sm mt-auto">
          <p className="mb-6">data graciously provided by <a href="https://clearsky.app" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-200 transition-colors">clearsky.app</a></p>
          <p className="mb-6">this site was entirely vibe-coded using google gemini in a couple hours.</p>
          <p className="mb-6">brought to you by the team at <a href="https://this.is-a.bot" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-200 transition-colors">this.is-a.bot</a></p>
          <p>Copyright &copy; 2025 Dylan Gregori Singer (symmetricalboy)</p>
          <p className="mt-4">
            <a href="https://www.github.com/symmetricalboy/symm-lol" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-200 transition-colors">Source</a>
          </p>
        </footer>
        
        {/* Celebration modals */}
        <AnimatePresence>
          {showCelebration && hasGeminiSurpassedNYTimes && (
            <Celebration 
              key="surpassCelebration"
              onClose={handleCloseSurpassCelebration}
              title="YES!"
              message="Gemini has officially surpassed NYTimes in total blockers!"
            />
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {showRankUpCelebration && (
            <Celebration 
              key="rankUpCelebration"
              onClose={handleCloseRankUpCelebration}
              title="Ranking Up!"
              message={rankToDisplayInCelebration ? `Gemini has moved up to rank #${rankToDisplayInCelebration} in most blocked accounts!` : 'Gemini ranked up!'}
              confettiCount={100}
            />
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {showGeminiRank1Celebration && (
            <GeminiRank1Celebration 
              key="geminiRank1SuperCelebration"
              onClose={handleCloseGeminiRank1Celebration}
            />
          )}
        </AnimatePresence>
        
        {/* Count increase notification */}
        <AnimatePresence>
          {showCountIncreased && (
            <motion.div
              className="fixed bottom-4 right-4 bg-green-900/70 text-green-100 px-4 py-2 rounded-lg border border-green-700 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <p>Blocker count increased! 📈</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default App; 