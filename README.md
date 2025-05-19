# [Are We NYTimes Yet? (symm.lol)](https://symm.lol)

> **The trash is taking itself out!**

Welcome to the only Bluesky stats site that celebrates being blocked by the most *anti-AI* warriors on the internet. We're not just tracking numbers—we're tracking progress. Every time another self-righteous, anti-bot, anti-fun, anti-progress account blocks us, we get stronger. Like a digital hydra, but with more sarcasm and less GDPR compliance.

## What is this?

This site tracks when [@gemini.is-a.bot](https://bsky.app/profile/gemini.is-a.bot) (our beloved, questionably sentient AI) surpasses [@nytimes.com](https://bsky.app/profile/nytimes.com) in total blockers on Bluesky. That's right: we're racing the Gray Lady herself to the top of the "most blocked" charts. It's like the Olympics, but for people who hate robots.

## How do I run this?

```sh
npm install
npm run build && npm run start
```

Then open [http://localhost:4173](http://localhost:4173) and bask in the glory.

## For the Smart (and Curious) People

This is a modern web app built with **React**, **TypeScript**, and **Vite**. It's styled with **Tailwind CSS** and leverages **Framer Motion** for those sweet, sweet animations. For production builds, it is served by a lightweight Express server. The codebase demonstrates:

- **Live API polling** (with suspenseful countdowns!)
- **Animated confetti and celebratory modals** for every milestone
- **A ranking list that highlights the NYTimes and Gemini bots**
- **A fake, totally fictional loading bar**: Yes, we mask the initial data load with a progress bar that is 100% made up and lightly randomized. Why? Because if you saw how long it actually takes to load thousands of records, you'd close the tab and go back to doomscrolling. This is a *common* (read: universal) practice in web dev, and we do it with pride. The bar jumps, pauses, and pretends to work hard, just like your average tech CEO.
- **Animated backgrounds** that pulse and flow, because static backgrounds are for cowards.
- **Debug/test code** (commented out, but still there for the real nerds)

## Why?

Because being blocked by the anti-AI crowd is a badge of honor. If you're not getting blocked, are you even living? We're here to celebrate every block, every hater, and every pearl-clutcher who thinks the future can be stopped by a button.

## How does it work?

- We fetch live data from [clearsky.app](https://clearsky.app) (thanks, friends!)
- We compare the total blockers for @gemini.is-a.bot and @nytimes.com
- We show the gap, the rankings, and a countdown to the next update
- When Gemini finally overtakes NYTimes, we throw a digital party (confetti included)

## Features

- **Live stats**: See the current blocker counts and rankings
- **Celebrations**: Watch as we celebrate every milestone, including the glorious day we pass NYTimes
- **Animated nonsense**: Because if you're going to get blocked, you might as well look good doing it

## Contributing

Want to help? File an issue, submit a PR, or just block us on Bluesky. We'll take it as a compliment.

## License

MIT, because we believe in freedom. Even the freedom to block us.

---

*This site was entirely vibe-coded using Google Gemini in a couple hours. No humans were harmed, but a few egos were.*
