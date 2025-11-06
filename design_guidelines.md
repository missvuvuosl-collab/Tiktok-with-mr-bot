# Design Guidelines: TikTok-Style Video Sharing App

## Design Approach

**Reference-Based Design:** Drawing directly from TikTok, Instagram Reels, and YouTube Shorts - prioritizing immersive video experience, gesture-based navigation, and mobile-first interaction patterns.

## Core Design Principles

1. **Immersive Video-First:** Full-screen video experiences that eliminate distractions
2. **Gesture-Driven Navigation:** Vertical swipes between content, tap interactions for engagement
3. **Floating UI Elements:** Minimal chrome with overlay controls that don't obstruct content
4. **Mobile-First Always:** Design for portrait orientation, scale up for desktop

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 3, 4, 6, and 8 for consistency (p-2, gap-4, h-8, etc.)

### Primary Layouts

**Video Feed (Main Experience):**
- Full viewport height (100vh) video containers
- Snap scrolling (snap-y snap-mandatory) for smooth vertical transitions
- Each video takes full screen with aspect-ratio-[9/16] on mobile
- Desktop: Center video with max-w-md, blurred background showing video

**Navigation Structure:**
- Bottom tab bar (fixed bottom-0) with 5 icons: Home, Discover, Create (+), Inbox, Profile
- Tab bar height: h-16 with backdrop-blur-lg
- Active tab indicated with icon fill and subtle scale transform

**Overlay Controls (Per Video):**
- Right sidebar: Vertical stack (space-y-6) of interaction buttons
  - Profile avatar (w-12 h-12, rounded-full with border-2)
  - Like button with count
  - Comment button with count
  - Share button with count
  - More options (3 dots)
- Bottom overlay: Video metadata
  - Username and description (max 2 lines truncated)
  - Sound/audio name with marquee scroll
  - All text with drop-shadow for readability

## Typography

**Font Stack:** 
- Primary: Inter or system-ui for clean, modern readability
- Accent: Poppins for bold statements (usernames, counts)

**Hierarchy:**
- Video descriptions: text-sm (14px), font-normal, leading-snug
- Usernames: text-base (16px), font-semibold
- Interaction counts: text-xs (12px), font-medium
- Tab labels: text-xs (12px), font-medium
- Profile stats: text-xl (20px), font-bold for numbers, text-sm for labels

## Component Library

### Video Player Component
- Auto-play on scroll into view
- Tap to pause/play (center of screen)
- Double-tap for like (heart animation)
- Progress indicator (thin line, bottom-0, transition-all)
- Muted by default with volume toggle

### Interaction Buttons (Right Sidebar)
- Circular backgrounds (w-12 h-12, rounded-full)
- Icons: w-7 h-7, centered
- Count labels below each button (text-xs)
- Like button: Heart with fill animation on tap
- Smooth scale animation on tap (scale-110 transition-transform)

### User Profile Avatar
- Circular with gradient border for "Add" state
- Tap opens profile page
- Small + icon overlay for non-followed users

### Bottom Tab Bar
- Icons: w-6 h-6 for standard tabs, w-8 h-8 for Create button
- Create button: Distinct multi-color gradient border, slightly larger
- Inactive: opacity-60, Active: opacity-100 with icon fill

### Comment Section (Slide-up Sheet)
- Rounded-t-3xl modal from bottom
- Handle bar (w-12 h-1 rounded-full, centered, mt-2)
- Comment input at bottom (sticky bottom-0)
- Comments list: Avatar (w-8 h-8) + username + comment text + timestamp
- Individual comment spacing: space-y-4

### Profile Page
- Header: Cover area with avatar (w-24 h-24, centered, -mt-12 for overlap)
- Stats row: Followers, Following, Likes (grid-cols-3, text-center)
- Bio section (max-w-sm, mx-auto, text-center)
- Tab navigation: "Videos" and "Liked" tabs with underline indicator
- Video grid: grid-cols-3 gap-1, aspect-ratio-[9/16] thumbnails

### Discovery/Search Page
- Search bar at top (rounded-full, p-3)
- Trending hashtags section (horizontal scroll, gap-3)
- Category pills (rounded-full, px-4 py-2)
- Video grid similar to profile but with metadata overlays

## Animations

**Essential Animations Only:**
- Video transitions: Smooth snap scrolling with scroll-snap-type
- Like heart: Scale + opacity animation (0.5s, ease-out)
- Tab switching: Crossfade between content (200ms)
- Button taps: Scale down to 95% on press, bounce back
- Comment sheet: Slide up with spring animation

**No Background Animations:** Keep performance optimal for video playback

## Video Assets & Placeholders

**Demo Videos:**
- Use 9:16 aspect ratio placeholder videos
- Minimum 3-5 demo videos for feed
- Place in /public/videos/ directory
- Videos should be 10-30 seconds each
- Include diverse content types (dance, comedy, educational, etc.)

**Thumbnail Generation:**
- First frame of video as thumbnail for grid views
- Lazy loading for thumbnails in scrollable grids

## Images

**Profile Avatars:**
- Use diverse placeholder avatars from UI Faces or similar
- Circular crop, high contrast for visibility

**No Hero Images:** This is a video-first app - full-screen videos ARE the hero content

## Accessibility

- All interactive elements minimum 44x44px touch target
- Video captions toggle (CC button in controls)
- High contrast text overlays with drop shadows
- Screen reader labels for icon-only buttons
- Keyboard navigation support for desktop

## Desktop Adaptations

- Center video player (max-w-md)
- Side panels for recommended content
- Persistent navigation sidebar (left)
- Larger interaction buttons
- Hover states for buttons (subtle opacity change)

**Key Insight:** This is an immersive, full-screen mobile experience. Every design decision prioritizes video content and effortless navigation through gesture-based interactions. The UI floats above content rather than containing it.