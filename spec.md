# QuizWiz

## Current State
QuizWiz is a full quiz app with 100 questions across 5 categories, per-question timer (30s), and a localStorage-based leaderboard (top 10 scores, device-only).

## Requested Changes (Diff)

### Add
- Backend leaderboard: permanent, cross-device storage of top scores
- Backend API: `submitScore(name, score, total, category)` to save a leaderboard entry
- Backend API: `getLeaderboard()` to retrieve top 20 entries sorted by percentage
- Backend API: `clearLeaderboard()` for admin use

### Modify
- Frontend LeaderboardPage: fetch scores from backend instead of localStorage
- Frontend ResultsPage: submit score to backend on save
- Keep localStorage as fallback if backend is unavailable

### Remove
- Nothing removed

## Implementation Plan
1. Add leaderboard stable storage and types to Motoko backend
2. Add submitScore, getLeaderboard, clearLeaderboard functions
3. Update frontend to call backend actor for leaderboard reads and writes
4. Show loading state while fetching leaderboard from backend
