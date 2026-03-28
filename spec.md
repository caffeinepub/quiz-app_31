# BazaarBuzz - Trending App

## Current State
- Backend has quiz/leaderboard functionality only
- CommunityPage is empty (returns null)
- BazaarBuzzPage has static feed posts from buzzData.ts
- No real user posts stored in backend
- No stock signals/tips section

## Requested Changes (Diff)

### Add
- Backend: Community posts CRUD (createPost, getPosts, likePost)
- Backend: Stock signals data (getStockSignals) - returns UP/DOWN signals for 15 NSE stocks with entry, target, stoploss, reason
- Frontend: CommunityPage - real post creation form, list of posts from backend, like button
- Frontend: Stock Signals page / section - shows which stocks are BUY (UP) and SELL (DOWN) with detailed signal cards (Entry, Target, SL, Signal Strength, Reason)
- Frontend: Navigation link to Signals/Tips section in BazaarBuzz

### Modify
- BazaarBuzzPage: Add "Signals" tab in nav that shows the stock signals section
- App.tsx: Wire CommunityPage with backend posts if needed

### Remove
- Nothing

## Implementation Plan
1. Update backend main.mo to add Post type, community post functions, and stock signals
2. Regenerate backend.d.ts bindings
3. Update CommunityPage to fetch/create posts from backend
4. Add StockSignalsPage or section showing BUY/SELL signals with detailed cards
5. Update BazaarBuzzPage nav to include Community and Signals tabs properly
