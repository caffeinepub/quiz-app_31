# AI Creator Studio

## Current State
The app has Image Generator, Video Generator, My Gallery, and Community tabs. The Video Generator shows a thumbnail/placeholder with a fake play button, a download toast (no real download), and a save-to-gallery button. The "Go Pro" button in the header does nothing. There is no premium plan modal, no audio/voice in videos, and no demo restriction logic.

## Requested Changes (Diff)

### Add
- **Demo video with voice/audio**: The one free demo video should play with a sample audio narration (Web Audio API or a sample audio file). Show a real HTML5 `<video>` or `<audio>` element layered with the thumbnail.
- **Video play functionality**: Clicking the play button should actually play the video (with audio). Use an HTML5 video element with a looping sample MP4 or embed an audio element that plays a narration alongside the thumbnail image.
- **Download button**: Clicking download should trigger a real browser download of the demo video/image asset.
- **Save to Gallery**: Already exists, keep it working.
- **Premium plan modal**: Clicking "Go Pro" opens a modal with 3 pricing tiers (Free, Pro ₹499/mo, Premium ₹999/mo), listing features. Free = 1 demo video only. Pro/Premium = unlimited video, image, voice.
- **Premium lock on generation**: After the first demo video is generated, subsequent "Generate Video" clicks open the premium plan modal (paywall) for all users EXCEPT the owner (Vinay Pandey / admin). The app owner (identified by a hardcoded flag or specific userId) can always generate freely.
- **Image Generator premium lock**: After 1 free demo image, show the premium upsell modal.
- **Voice Generator tab**: Add a new "Voice" tab in the header for AI voice generation, also behind premium after 1 free demo.

### Modify
- **VideoGenerator**: Replace fake thumbnail play with real HTML5 video/audio playback. Show audio waveform badge on the video. Download triggers real download.
- **AICreatorStudio header**: "Go Pro" button opens the premium plan modal. Add "Voice" tab.
- **Generation logic**: Track how many free generations have been used (localStorage). After 1 demo, show premium modal.

### Remove
- Nothing removed.

## Implementation Plan
1. Create `PremiumModal.tsx` component with 3 pricing tiers (Free/Pro/Premium) in a dialog.
2. Create `VoiceGenerator.tsx` component (similar to VideoGenerator, behind premium after 1 demo).
3. Update `VideoGenerator.tsx`:
   - Use a real sample video URL (a short free-to-use video from a CDN like `https://www.w3schools.com/html/mov_baa.mp4` or similar) as the demo.
   - Add `<video>` element with controls, autoplay muted initially, unmute on play button click.
   - Add a synthesized voice narration using Web Speech API (`window.speechSynthesis.speak()`) triggered on play.
   - Real download: anchor tag with `download` attribute pointing to the video URL.
   - After 1st generation: check localStorage `freeGenerations` count; if >= 1, open premium modal instead.
4. Update `ImageGenerator.tsx`: same free generation limit logic.
5. Update `AICreatorStudio.tsx`:
   - Add `PremiumModal` state and open it from "Go Pro" button.
   - Add "Voice" tab.
   - Pass `onShowPremium` callback to generators.
