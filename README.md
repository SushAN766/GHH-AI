# AI-Powered Mediation Framework for Multinational Legal and Social Disputes

---

## Project Overview

Global Harmony Hub is an advanced AI-driven platform designed to mediate disputes in multicultural and multinational contexts. By leveraging generative AI, the system interprets legal documents, synthesizes cultural nuances, and fosters empathy to promote fair and legally compliant resolutions.

In a world of increasingly interconnected digital spaces—ranging from global organizations to online communities—conflicts often arise from differences in legal systems, cultural norms, and value systems. Existing tools are limited in their context-awareness, cultural sensitivity, and legal reasoning. GHH addresses these challenges by combining AI, multilingual capabilities, and culturally sensitive dispute resolution.

---

## Core Features

1. **Multilingual Legal Framework Interpretation**
   - Interpret diverse legal documents across multiple languages.
   - Provide neutral, jurisdiction-aware guidance for dispute resolution.

2. **Dispute Contextualizer**
   - Analyze conflicts and summarize key points in a culturally sensitive manner.
   - Highlight areas of agreement and disagreement, suggesting possible solutions.

3. **Empathy Prompting**
   - AI-generated prompts encourage empathy and constructive communication.
   - Helps conflicting parties engage more effectively.

4. **Resolution Summary Generation**
   - Generates clear, understandable summaries of suggested resolutions.
   - Incorporates jurisdiction-aware practices to promote mutual satisfaction.

5. **Interactive Dashboard**
   - Intuitive UI for inputting dispute details and reviewing AI summaries.

6. **Document Upload & Display**
   - Securely upload, manage, and view legal documents related to disputes.

---

## Technology Stack

- **AI Models:**
  - **Gemini:** Advanced AI capable of understanding and generating text, code, audio, images, and video.
  - **Genkit:** Unified API framework to access AI models, streamline AI logic, and manage tools and media generation.

- **Frontend:**
  - **TypeScript:** Ensures type safety and scalable code.
  - **Next.js:** React framework supporting server-side and client-side rendering.
  - **Tailwind CSS:** Utility-first CSS framework for consistent and responsive styling.

- **Backend / Authentication:**
  - **Firebase:** Handles authentication, database operations, and client-server interactions.
  - **Authentication Context:** Manages user authentication state across the application.

---

## Features Implementation

- **Authentication**
  - Login page for user sign-in.
  - Logout button for secure sign-out.
  - Protected routes to restrict access to authenticated users only.

- **Dashboard**
  - Input dispute details for AI analysis.
  - View AI-generated summaries and suggestions.

- **Document Management**
  - Upload, manage, and view legal documents securely within the platform.

---

## Installation and Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/global-harmony-hub.git
cd global-harmony-hub
```
# Install dependencies
npm install

# Setup Firebase configuration
# - Add firebaseConfig files for both client and server
# - Ensure authentication, Firestore, and storage rules are properly configured

# Run the development server
npm run dev

## Access the App

Open [http://localhost:3000](http://localhost:3000) in your browser.
