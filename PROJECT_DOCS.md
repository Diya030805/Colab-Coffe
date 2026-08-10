# CoLab Coffee Website - Project Documentation

This document provides a comprehensive overview of the technical stack and feature implementations for the CoLab Coffee web application.

---

## Technical Stack

- **Framework:** React 18+ with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion (`motion/react`)
- **Audio Management:** `use-sound` hook
- **Data Persistence/Backend:** Supabase (Infrastructure available)

---

## Core Features & Functionality

### 1. Preloader
Ensures a smooth, branded entrance for the user. It masks initial asset loading and creates a premium first impression.

### 2. Lo-Fi Audio System
- **Functionality:** Provides an ambient background music experience.
- **Implementation:** Utilizes the `use-sound` library for robust audio management. 
- **Key Mechanics:** Handles browser autoplay restrictions by requiring explicit user interaction. It includes a fallback mechanism: if the primary audio source fails to load, it automatically attempts to play secondary sources. The `SoundIcon` component provides visual feedback for the current play/pause state.

### 3. Menu Management
The menu is architected for a clean user journey:
- **Menu Preview (Home Page):** Displays a curated selection of signature items to entice the user immediately upon landing.
- **Full Menu:** Accessible via the main navigation button, providing the complete, detailed menu structure.

### 4. Location Marker Component
- **Functionality:** Integrates an interactive Google Maps view to help customers locate the café.
- **Implementation:** Uses a custom React component wrapping a Google Maps iframe. It features a floating card with address details and a 'Get Directions' button that opens the location in Google Maps. Includes subtle hover animations for a premium feel.

### 5. Customer Testimonials
- **Functionality:** Builds social proof by rotating quotes from patrons.
- **Implementation:** Uses `Framer Motion`'s `AnimatePresence` to handle smooth, fade-in/out transitions between quotes. The styling focuses on a premium, serif-font aesthetic to align with the brand identity.

---

## Backend & Admin Architecture

### Supabase Integration
The project infrastructure includes a dedicated `supabase` directory, setting the foundation for robust, cloud-hosted backend services. This is intended to handle data persistence, user authentication, and secure API interactions as the application requirements evolve.

### Admin Panel
The architecture supports the integration of a protected Admin Panel. This component is designed to manage menu items, testimonial content, and café hours, ensuring dynamic content updates without requiring direct code changes.

---

## UI & Styling Philosophy

- **Tailwind CSS Utility Classes:** Used exclusively to maintain consistent spacing, typography, and responsive behavior without the complexity of separate CSS files.
- **Scroll Animations:** Framer Motion is integrated throughout the home page to apply 'fade-up' scroll animations to sections (Menu Preview, About, Testimonials, Location Marker). This creates a polished, premium rhythm as the user explores the page.
- **Typography:** The design utilizes "Inter" for UI elements and "Playfair Display" (or similar serif font-pairings) to reinforce the sophisticated, artisanal mood of the café.
