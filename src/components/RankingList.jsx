import { motion } from 'framer-motion';
import { formatNumber } from '../utils/formatters';

const RankingList = ({ rankings = [], nytimesDid, geminiDid, loading = false }) => {
  // Loading state
  if (loading) {
    return (
      <motion.div 
        className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold text-white mb-4">Top Blocked Accounts</h2>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex justify-between items-center p-2 animate-pulse">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 bg-gray-700 rounded-full"></div>
                <div className="h-4 w-32 bg-gray-700 rounded"></div>
              </div>
              <div className="h-4 w-16 bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }
  
  // No data state
  if (!rankings || rankings.length === 0) {
    return (
      <motion.div 
        className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold text-white mb-4">Top Blocked Accounts</h2>
        <p className="text-gray-300">We're working on fetching the top blocked accounts...</p>
        <p className="text-gray-400 text-sm mt-2">In the meantime, we're still tracking NYTimes and Gemini!</p>
      </motion.div>
    );
  }
  
  // Helper function to safely check if a DID matches
  const checkDid = (accountDid, targetDid) => {
    if (!accountDid || !targetDid) return false;
    try {
      return accountDid === targetDid;
    } catch (error) {
      return false;
    }
  };
  
  // Data available state
  return (
    <motion.div 
      className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      whileHover={{ 
        boxShadow: "0 0 25px rgba(139, 92, 246, 0.3)",
        scale: 1.01
      }}
    >
      <h2 className="text-xl font-semibold text-white mb-4">Top Blocked Accounts</h2>
      <div className="space-y-1">
        {rankings.slice(0, 20).map((account, index) => {
          // Skip accounts with missing data
          if (!account.did) return null;
          
          const isNytimes = checkDid(account.did, nytimesDid);
          const isGemini = checkDid(account.did, geminiDid);
          let highlightClass = isNytimes 
            ? 'bg-nytimes/20 border-nytimes/30' 
            : isGemini 
              ? 'bg-gemini/20 border-gemini/30' 
              : 'hover:bg-gray-700/50';
          
          let trophyIcon = null;
          if (index === 0) { // 1st place
            highlightClass = `${highlightClass} bg-yellow-500/30 border-yellow-400/50`;
            trophyIcon = '🥇';
          } else if (index === 1) { // 2nd place
            highlightClass = `${highlightClass} bg-gray-400/30 border-gray-300/50`;
            trophyIcon = '🥈';
          } else if (index === 2) { // 3rd place
            highlightClass = `${highlightClass} bg-orange-400/30 border-orange-300/50`;
            trophyIcon = '🥉';
          }
          
          // Use a safe handle
          const safeHandle = account.handle || 'unknown';
          
          return (
            <motion.a
              key={`${account.did}-${index}`}
              href={safeHandle !== 'unknown' ? `https://bsky.app/profile/${safeHandle}` : '#'}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex justify-between items-center p-2 rounded-lg border border-transparent ${highlightClass} transition-colors duration-200 block`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ 
                x: 5,
                transition: { duration: 0.2 }
              }}
            >
              <div className="flex items-center gap-2">
                <div className="bg-gray-900/60 text-gray-300 h-6 w-6 rounded-full flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </div>
                <span className={`text-md ${isNytimes || isGemini ? 'font-semibold' : ''} text-gray-200`}>
                  {trophyIcon && <span className="mr-1">{trophyIcon}</span>}
                  @{safeHandle}
                  {(isNytimes || isGemini) && (
                    <motion.span 
                      className="inline-block ml-2"
                      animate={{ rotate: [0, 5, 0, -5, 0] }}
                      transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                    >
                      {isNytimes ? '📰' : '🤖'}
                    </motion.span>
                  )}
                </span>
              </div>
              <div className="text-gray-300 font-mono">
                {formatNumber(account.blockerCount || 0)}
              </div>
            </motion.a>
          );
        })}
      </div>
    </motion.div>
  );
};

export default RankingList; 