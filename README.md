# 📚 StudyFlow — Your AI Study Companion

> Smart, offline-first study tools for students — Doubt Solver, Assignment Generator, Roadmaps, Flowcharts & Notes. No API keys. No backend. No account required.

![StudyFlow Preview](https://img.shields.io/badge/PWA-Ready-5b4eff?style=for-the-badge) ![Offline](https://img.shields.io/badge/Works-Offline-b5ff4d?style=for-the-badge) ![No API](https://img.shields.io/badge/No_API-Required-06d6a0?style=for-the-badge)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🧠 **Smart Doubt Solver** | Step-by-step explanations for Math, Physics, Chemistry, Biology, Programming, History |
| 📝 **Assignment Generator** | Structured essays, reports, Q&A and project plans |
| 🗺️ **Study Roadmap Builder** | Day-wise plans with milestones and checklists |
| 🔀 **Flowchart Generator** | Visual process flows, concept maps, cycle diagrams, decision trees |
| 📓 **Notes Maker** | Structured, Cornell, Mind Map, and Flashcard formats |
| 💾 **Local Storage** | Save everything offline, no account needed |
| 🌙 **Dark / Light Mode** | Toggle anytime |
| 📄 **PDF Export** | Print / save any result as PDF |
| 📋 **Copy to Clipboard** | One-click copy |
| 📱 **PWA** | Install on phone/desktop, works offline |

---

## 🚀 Deploy to GitHub Pages (Free)

### Method 1: GitHub Web Interface (Easiest)

1. **Create a new GitHub repository**  
   Go to [github.com/new](https://github.com/new) → Name it `studyflow` → Set to **Public** → Click "Create repository"

2. **Upload all files**  
   On the repository page → Click "Add file" → "Upload files"  
   Upload all these files:
   ```
   index.html
   style.css
   engine.js
   app.js
   sw.js
   manifest.json
   README.md
   ```

3. **Enable GitHub Pages**  
   Go to **Settings** → **Pages** → Under "Source" select **Deploy from a branch** → Choose **main** branch, **/ (root)** folder → Click **Save**

4. **Your site is live!** 🎉  
   Visit: `https://YOUR-USERNAME.github.io/studyflow`  
   (Takes 1-2 minutes to deploy)

---

### Method 2: Git Command Line

```bash
# Clone / create repo
git init studyflow
cd studyflow

# Copy all files into this folder, then:
git add .
git commit -m "🚀 Initial StudyFlow deployment"

# Connect to GitHub (replace YOUR-USERNAME)
git remote add origin https://github.com/YOUR-USERNAME/studyflow.git
git push -u origin main

# Enable Pages in GitHub Settings → Pages → main branch / root
```

---

### Method 3: Netlify (Alternative, also free)

1. Go to [netlify.com](https://netlify.com) → Sign up free
2. Drag and drop the entire `studyflow` folder onto the deploy zone
3. Done! You get a live URL instantly.

---

## 🏃 Run Locally

Just open `index.html` in any modern browser — **no build step, no npm install**.

```bash
# Option 1: Just double-click index.html

# Option 2: Use a local server (recommended for PWA)
npx serve .
# or
python -m http.server 8000
# then visit http://localhost:8000
```

---

## 📁 File Structure

```
studyflow/
├── index.html       ← App structure & HTML
├── style.css        ← All styles (dark/light theme)
├── engine.js        ← Rule-based AI engine (no API)
├── app.js           ← UI logic, navigation, storage
├── sw.js            ← Service Worker (PWA offline)
├── manifest.json    ← PWA manifest
└── README.md        ← This file
```

---

## 🧠 How the Logic Engine Works

**No API, no AI service.** StudyEngine uses:

- **Keyword detection** — scans your question for subject-specific terms
- **Template matching** — selects the right explanation template
- **Dynamic content** — fills templates with topic-specific content
- **Pattern recognition** — e.g., detects linear equations like `3x + 5 = 14`

**Supported subjects:**
- 📐 Mathematics (equations, geometry, calculus, probability, theorems)
- ⚡ Physics (Newton's laws, kinematics, waves, electricity, gravity)
- 🧪 Chemistry (atomic structure, bonding, reactions, acids/bases, periodic table)
- 🌿 Biology (photosynthesis, respiration, genetics, cells, evolution)
- 💻 Programming (loops, functions, arrays, OOP, recursion, sorting)
- 📜 History & General subjects

---

## 🛠️ Tech Stack

- Pure **HTML5 + CSS3 + Vanilla JavaScript** — no frameworks
- **LocalStorage** for data persistence
- **Service Worker** for PWA offline support
- **CSS Grid + Flexbox** for responsive layout
- **Google Fonts** (Syne + DM Sans) via CDN
- **window.print()** for PDF export
- **Clipboard API** for copy functionality

---

## 📱 PWA Installation

**On Android Chrome:**
1. Visit the app URL
2. Tap "Add to Home Screen" in the browser menu
3. App works offline after first load!

**On iOS Safari:**
1. Visit the app URL
2. Tap Share → "Add to Home Screen"

**On Desktop Chrome:**
1. Click the install icon in the address bar

---

## 🙌 Credits

Built with ❤️ for students everywhere.  
Design system: Neo-Academic aesthetic with Syne + DM Sans typography.  
Color palette: Deep Violet (#5b4eff) + Electric Lime (#b5ff4d).

---

## 📄 License

MIT License — free to use, modify, and distribute.
