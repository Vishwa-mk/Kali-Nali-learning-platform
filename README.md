# Learn & Play

A digital learning environment where play becomes the primary engine of understanding.

## Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Google AI API key (for Genkit AI features)

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Then edit `.env` and add:
   - Your Google AI API key: `GOOGLE_GENAI_API_KEY=your_actual_api_key_here`
   
3. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)
   

## Available Scripts

- `npm run dev` - Start the Next.js development server
- `npm run build` - Build the production application
- `npm run start` - Start the production server (after building)
- `npm run lint` - Run ESLint
- `npm run genkit` - Start the Genkit development server (for AI flows)

## Project Structure

- `app/` - Next.js app router pages and layouts
- `components/` - React components (UI, dashboard, project, profile)
- `lib/` - Utilities, types, and data
- `ai/` - Genkit AI flows and configuration
- `hooks/` - Custom React hooks


## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI + shadcn/ui
- **AI:** Genkit with Google AI (Gemini)
- **State Management:** React Context API

<img width="155" height="490" alt="localhost_3000_" src="https://github.com/user-attachments/assets/ca3cf18a-71e8-49ed-ba0b-692d46d6a561" />
<img width="155" height="236" alt="localhost_3000_projects_1 (1)" src="https://github.com/user-attachments/assets/0b7e6206-df31-4b3d-ba71-cdeba5563a04" />
<img width="155" height="236" alt="localhost_3000_projects_1 (1)" src="https://github.com/user-attachments/assets/4877f0c0-8451-40f0-b1fb-ee6c5ffb8eca" />
