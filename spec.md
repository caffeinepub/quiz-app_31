# Option Traders

## Current State
Empty project. New build.

## Requested Changes (Diff)

### Add
- Complete trading platform app inspired by TradZoo
- App name: Option Traders — "Platform for Traders by Traders"
- Features:
  - Index FNO Analysis (Nifty 50, Bank Nifty, Finnifty)
  - Equity FNO Analysis (top NSE stocks with options data)
  - Latest Market Trends (news + trend analysis)
  - Real Time Intraday Updates (live simulated prices + signals)
  - Community Feed (traders sharing ideas)
  - Dashboard with candlestick chart, market signals, ticker
  - Option Chain with CE/PE, OI, LTP, ITM highlighting
  - BUY/SELL signal cards with entry, stoploss, target
  - Market ticker strip
  - Daily update notifications panel

### Modify
- N/A (new project)

### Remove
- N/A

## Implementation Plan
1. Generate Motoko backend for storing community posts, daily updates, watchlist
2. Build full dark-theme React frontend matching the design preview
3. Pages: Dashboard, Index FNO, Equity FNO, Market Trends, Community, Support
4. Simulated live data with realistic Indian market prices updating every few seconds
5. Option chain, signal cards, candlestick chart using recharts/canvas
6. Community feed with post creation
