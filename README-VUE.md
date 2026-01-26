# Employee Scheduler - Vue.js Version

A beautiful, modern employee scheduling application built with Vue 3, Vite, and Tailwind CSS.

## Features

- 📅 **Calendar View** - Manage employee availability and view schedules
- ⏰ **Shift Management** - Configure shift templates and override times
- 👥 **Employee Management** - Add/remove employees and set shift availability
- 📊 **Schedule Generation** - Automatically generate balanced schedules
- 📥 **CSV Export** - Export schedules for external use
- 🎨 **Modern UI** - Beautiful gradient designs and smooth animations

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

## Project Structure

```
src-vue/
├── components/          # Vue components
│   ├── CalendarTab.vue
│   ├── EmployeesTab.vue
│   ├── ShiftsTab.vue
│   └── ...
├── composables/         # Vue composables (hooks)
│   └── useSchedule.js
├── utils/              # Utility functions
│   └── dateUtils.js
├── App.vue             # Main app component
├── main.js             # Entry point
└── index.css           # Global styles
```

## Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **Vite** - Next-generation frontend tooling
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide Vue Next** - Beautiful icon library

## UI Enhancements

- Gradient backgrounds and buttons
- Smooth transitions and hover effects
- Shadow effects for depth
- Responsive design
- Modern color scheme

