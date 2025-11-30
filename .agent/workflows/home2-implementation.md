---
description: Implementation plan for Home 2 - Image Grid Layout
---

# Home 2 Page Implementation Plan

## Overview
Create a new home page with a masonry-style image grid that displays all product images tightly packed, organized by aspect ratio, with a collapsible sidebar and fast loading performance.

## Architecture Decisions

### Performance Optimizations
1. **Image Loading**: Use Next.js Image component with priority loading for above-the-fold images
2. **Lazy Loading**: Implement intersection observer for images below the fold
3. **Image Optimization**: Serve optimized WebP/AVIF formats via Next.js
4. **Data Fetching**: Server-side rendering with efficient database queries
5. **Caching**: Implement proper cache headers for static assets

### Layout Strategy
1. **Collapsed Sidebar**: Show only icons (40px width) with expand button
2. **Expanded Sidebar**: 250px width with full navigation
3. **Image Grid**: CSS Grid with auto-fill for responsive layout
4. **Aspect Ratio Grouping**: Group images into rows by aspect ratio (square vs rectangle)
5. **Hover Effect**: Scale to 1.3x with z-index elevation and smooth transition

## Implementation Steps

### Step 1: Create Server Action for Products
**File**: `src/app/actions/products.ts`
- Fetch all products with images
- Calculate aspect ratios for each image
- Group products by aspect ratio (square: 0.9-1.1, rectangle: others)
- Return optimized data structure

### Step 2: Create Collapsible Sidebar Component
**File**: `src/components/CollapsibleSidebar.tsx`
- Create sidebar with collapsed (40px) and expanded (250px) states
- Add toggle button with smooth animation
- Show icons only when collapsed
- Show full navigation when expanded
- Use local storage to persist state

### Step 3: Create Image Grid Component
**File**: `src/components/ImageGrid.tsx`
- Accept grouped products (by aspect ratio)
- Render rows of images grouped by aspect ratio
- Implement CSS Grid for tight packing
- Add hover effect with scale and z-index
- Handle click to navigate to product detail page
- Implement intersection observer for lazy loading

### Step 4: Create Home 2 Page
**File**: `src/app/home2/page.tsx`
- Server component that fetches products
- Render CollapsibleSidebar
- Render ImageGrid with grouped products
- Implement proper metadata for SEO
- Add loading states

### Step 5: Update Header Navigation
**File**: Update existing header component
- Add "Home 2" navigation link
- Ensure header remains consistent across pages

### Step 6: Add Styling
**File**: `src/app/home2/styles.module.css` (or global CSS)
- Grid layout styles
- Hover animations
- Sidebar transitions
- Responsive breakpoints

### Step 7: Testing & Optimization
- Test image loading performance
- Verify aspect ratio grouping works correctly
- Test sidebar collapse/expand functionality
- Verify hover effects work smoothly
- Test navigation to product detail pages
- Check responsive behavior

## Technical Specifications

### Image Grid Layout
```
- Container: Full width minus sidebar
- Gap: 0px (no space between images)
- Rows: Auto-generated based on aspect ratio groups
- Columns: Auto-fill based on image aspect ratio
```

### Aspect Ratio Detection
```
- Square: ratio between 0.9 and 1.1
- Rectangle Horizontal: ratio < 0.9
- Rectangle Vertical: ratio > 1.1
```

### Hover Effect
```
- Scale: 1.3x
- Transition: 300ms ease-in-out
- Z-index: 10 (overlay on other images)
- Box-shadow: Add subtle shadow for depth
```

### Sidebar States
```
- Collapsed: 40px width, icons only
- Expanded: 250px width, full navigation
- Transition: 300ms ease-in-out
```

## Performance Targets
- Initial page load: < 2s
- Time to interactive: < 3s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1

## Future Considerations
- If performance is good, replace main home page
- Consider adding filters/search in sidebar
- Consider virtual scrolling for very large datasets
- Add image preloading for next row
