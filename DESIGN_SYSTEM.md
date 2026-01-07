# WeatherCast Design System

## 🎨 Color Palette

### Primary Colors
- **Sky Blue**: `#87CEEB` - Primary background gradient
- **Light Gray**: `#F5F7FA` - Card backgrounds
- **Accent Blue**: `#3B82F6` - Buttons, links, focus states
- **Accent Hover**: `#2563EB` - Hover states

### Weather Condition Colors
- **Sunny**: 
  - Soft Orange: `#FF8C42`
  - Yellow: `#FFD700`
- **Rain**: 
  - Light Blue: `#4A90E2`
  - Blue: `#87CEEB`
- **Clouds**: 
  - Gray Tones: `#95A5A6`
- **Storm**: 
  - Purple: `#9333EA`
- **Snow**: 
  - Cyan: `#06B6D4`

### AQI Colors
- **Good (1)**: Green `#10B981`
- **Fair (2)**: Yellow `#F59E0B`
- **Moderate (3)**: Orange `#F97316`
- **Poor (4)**: Red `#EF4444`
- **Very Poor (5)**: Purple `#9333EA`

## 📝 Typography

### Font Families
- **Primary**: Inter (body text, UI elements)
- **Headings**: Poppins (titles, section headers)

### Font Sizes
- **Hero Title**: `5xl` (3rem) - `7xl` (4.5rem) on desktop
- **Section Headers**: `2xl` (1.5rem) - `3xl` (1.875rem) on desktop
- **Card Titles**: `xl` (1.25rem) - `2xl` (1.5rem)
- **Body Text**: `base` (1rem)
- **Small Text**: `sm` (0.875rem)
- **Labels**: `xs` (0.75rem) uppercase with tracking

### Font Weights
- **Bold**: 700 (headings)
- **Semibold**: 600 (subheadings, labels)
- **Medium**: 500 (body emphasis)
- **Regular**: 400 (body text)

## 🎭 Spacing System

### Padding
- **Card Padding**: `p-6 md:p-8` (1.5rem - 2rem)
- **Section Spacing**: `space-y-8 md:space-y-10` (2rem - 2.5rem)
- **Element Gap**: `gap-4` (1rem) standard, `gap-6` (1.5rem) for larger elements

### Border Radius
- **Cards**: `rounded-3xl` (1.5rem)
- **Buttons**: `rounded-xl` (0.75rem) - `rounded-2xl` (1rem)
- **Inputs**: `rounded-2xl` (1rem)
- **Small Elements**: `rounded-lg` (0.5rem)

## 🎬 Animations

### Framer Motion Presets

#### Page Transitions
```javascript
initial={{ opacity: 0, y: 30 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
```

#### Card Hover
```javascript
whileHover={{ scale: 1.02, y: -2 }}
```

#### Stagger Children
```javascript
transition={{ delay: index * 0.1 }}
```

#### Number Counter
- Smooth increment animation for temperature values
- Spring physics for natural movement

## 🎯 Component Patterns

### Cards
- **Background**: `bg-white/95 dark:bg-gray-900/95`
- **Backdrop**: `backdrop-blur-xl`
- **Shadow**: `shadow-2xl`
- **Border**: `border border-gray-100 dark:border-gray-800`

### Buttons
- **Primary**: Blue gradient with hover scale
- **Secondary**: Gray background with hover lift
- **Icon Buttons**: Circular with subtle background

### Input Fields
- **Border**: `border-2` with focus ring
- **Focus**: `focus:ring-2 focus:ring-blue-500`
- **Padding**: `py-4 px-4`

## 📱 Responsive Breakpoints

- **Mobile**: `< 640px` - Single column, stacked layout
- **Tablet**: `640px - 1024px` - 2-3 column grids
- **Desktop**: `> 1024px` - Full multi-column layouts

## 🌈 Background Gradients

### Default (No Weather)
```css
from-sky-300 via-blue-200 to-indigo-100
```

### Sunny
```css
from-sky-300 via-blue-200 to-cyan-100 (day)
from-indigo-800 via-purple-800 to-blue-900 (night)
```

### Rainy
```css
from-blue-300 via-blue-200 to-gray-300 (day)
from-blue-600 via-blue-700 to-gray-700 (night)
```

### Cloudy
```css
from-gray-300 via-gray-200 to-gray-300 (day)
from-gray-600 via-gray-700 to-gray-800 (night)
```

## ✨ Visual Effects

### Shadows
- **Card Shadow**: `shadow-2xl` (0 25px 50px -12px rgba(0, 0, 0, 0.25))
- **Hover Shadow**: `hover:shadow-2xl` with lift effect

### Backdrop Blur
- **Cards**: `backdrop-blur-xl` (24px blur)
- **Backgrounds**: `backdrop-blur-md` (12px blur)

### Glass Morphism
- Semi-transparent backgrounds with blur
- Border with subtle opacity
- Layered depth effect

## 🎨 Icon System

### Weather Icons
- **Size**: `text-5xl` to `text-9xl` depending on context
- **Colors**: Match weather condition
- **Animation**: Subtle rotation/pulse for active states

### UI Icons
- **Size**: `20px` standard, `24px` for emphasis
- **Color**: Gray with hover state change

## 📐 Layout Guidelines

### Section Structure
1. **Section Header** (title + description)
2. **Main Card** (content)
3. **Spacing**: `mb-4` for header, `space-y-8` for sections

### Grid Systems
- **2 Columns**: `grid-cols-2` (mobile), `md:grid-cols-3` (tablet+)
- **3 Columns**: `grid-cols-3` (desktop)
- **7 Columns**: `lg:grid-cols-7` (weekly forecast)

### Horizontal Scroll
- **Container**: `overflow-x-auto` with `-mx-2 px-2` for padding
- **Content**: `flex gap-4 min-w-max`
- **Cards**: `flex-shrink-0` to prevent compression

## 🎯 Accessibility

### Color Contrast
- All text meets WCAG AA standards (4.5:1 minimum)
- Focus states clearly visible
- High contrast mode support

### Interactive Elements
- Minimum touch target: 44x44px
- Clear hover/focus states
- Keyboard navigation support

### Screen Readers
- ARIA labels on all interactive elements
- Semantic HTML structure
- Descriptive alt text for icons

---

**Last Updated**: Current implementation
**Version**: 2.0 - Professional Redesign

