const NYTIMES_DID = 'did:plc:eclio37ymobqex2ncko63h4r';
const GEMINI_DID = 'did:plc:57na4nqoqohad5wk47jlu4rk';
const CLEARSKY_API_BASE = 'https://api.clearsky.services/api/v1/anon';

const nytimesBlockersElem = document.getElementById('nytimes-blockers');
const geminiBlockersElem = document.getElementById('gemini-blockers');
const celebrationElem = document.getElementById('celebration');

let nytimesBlockerCount = 0;
let geminiBlockerCount = 0;

async function fetchAccountBlockerCount(did) {
    const response = await fetch(`${CLEARSKY_API_BASE}/single-blocklist/total/${did}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} for DID ${did}`);
    }
    const data = await response.json();
    if (data && data.data && typeof data.data.count === 'number') {
        return data.data.count;
    }
    throw new Error(`Unexpected data structure from single-blocklist/total for DID ${did}`);
}

async function fetchBlockerCounts() {
    try {
        // Fetch counts for both DIDs using the specific endpoint
        nytimesBlockerCount = await fetchAccountBlockerCount(NYTIMES_DID);
        geminiBlockerCount = await fetchAccountBlockerCount(GEMINI_DID);

        nytimesBlockersElem.textContent = nytimesBlockerCount.toLocaleString();
        geminiBlockersElem.textContent = geminiBlockerCount.toLocaleString();

        checkCelebration();

    } catch (error) {
        console.error('Failed to fetch blocker counts:', error);
        // Display error for the specific element that failed, or both if it's a general failure
        if (error.message.includes(NYTIMES_DID)) {
            nytimesBlockersElem.textContent = 'Error';
        } else if (error.message.includes(GEMINI_DID)) {
            geminiBlockersElem.textContent = 'Error';
        } else {
            nytimesBlockersElem.textContent = 'Error';
            geminiBlockersElem.textContent = 'Error';
        }
    }
}

function checkCelebration() {
    if (typeof nytimesBlockerCount === 'number' &&
        typeof geminiBlockerCount === 'number' &&
        geminiBlockerCount > nytimesBlockerCount) {
        celebrationElem.classList.remove('hidden');
        document.querySelector('header h1').style.animation = 'flash 1s infinite';
    } else {
        celebrationElem.classList.add('hidden');
        document.querySelector('header h1').style.animation = 'none';
    }
}

// Add a simple flashing animation for the celebration (if not already there)
if (!document.getElementById('flash-animation-style')) {
    const styleSheet = document.createElement("style");
    styleSheet.id = 'flash-animation-style';
    styleSheet.type = "text/css";
    styleSheet.innerText = `
    @keyframes flash {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }
    `;
    document.head.appendChild(styleSheet);
}

// Fetch counts on page load and then every 60 seconds
fetchBlockerCounts();
setInterval(fetchBlockerCounts, 60000); // 60000 ms = 1 minute 