# **App Name**: SicBo Pro

## Core Features:

- Bankroll & Session Tracking: Allow users to set an initial bankroll, and automatically track the current bankroll, total bets placed, and session profit/loss over time.
- Primer Data Input: Enable users to input recent historical dice roll data (past 3 rounds) to 'prime' the prediction AI with initial patterns for analysis.
- Real-time Betting Interface: Provide a user-friendly interface to place bets on 'BIG/SMALL', 'ODD/EVEN', and 'LEOPARD' outcomes using predefined and customizable chip values.
- Heuristic Prediction Engine: Analyze game history using heuristic algorithms (streak detection, mean reversion, and frequency analysis) to provide predictive insights for the next dice roll outcomes (e.g., BIG/SMALL, ODD/EVEN, Leopard chance).
- Dice Result Submission: Allow users to accurately input the actual outcome of dice rolls after each round to update the game state, prediction engine, and history records.
- Comprehensive Game History: Display a detailed and easily navigable history of all played rounds, including dice outcomes, the sum of dice, type of winning bets, and individual round profit/loss.

## Style Guidelines:

- Primary color: A vibrant, deep emerald green (#33CC77) to signify prosperity, digital efficiency, and strategic advantage. Used for primary calls to action, brand elements, and key highlight text.
- Background color: A very dark charcoal (#121C16) with a subtle hint of green, creating a sophisticated and non-distracting environment conducive to focus on data and predictions.
- Accent color: A soft, muted light green (#C5EAD0) to provide gentle contrast and highlight secondary information, labels, or active states in a balanced way.
- Headline font: 'Space Grotesk' (sans-serif) for its modern, techy, and precise character, aligning with the app's predictive nature. Body text font: 'Inter' (sans-serif) for superior readability, ensuring clarity of data and long-form information. Code/Data font: 'Source Code Pro' (monospace) for consistent and clear presentation of numerical data and currency.
- Use a clean, modern outline or two-tone icon set (such as 'lucide-react' as already implemented). Icons should be minimalist, ensuring clear recognition without visual clutter, enhancing navigation and understanding of features.
- Implement a responsive, grid-based layout that efficiently organizes complex information. Emphasize visual hierarchy through distinct card-like sections for predictions, betting controls, and history, utilizing generous dark spacing to reduce cognitive load and highlight key interactive elements and data points. Max-width constraints ensure readability on larger screens while maintaining adaptability for mobile devices.
- Incorporate subtle and smooth transition animations (e.g., `transition-colors`, `transform`) for interactive elements like buttons and chips, providing instant visual feedback. Employ gentle entry animations for modals and toast notifications to enhance user experience by indicating new content gracefully rather than abruptly. A soft pulse or glow effect for active bets or significant prediction changes can subtly draw user attention.