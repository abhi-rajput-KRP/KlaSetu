# KlaSetu: Inclusive Digital Commerce Platform for Local Artisans

## Executive Summary

KlaSetu is an end-to-end digital marketplace and seller empowerment ecosystem engineered to bridge the divide between traditional Indian artisans and contemporary global markets. Traditional craftspeople frequently face steep barriers to entry in e-commerce, including non-native languages, digital literacy challenges, complex product cataloging requirements, and predatory intermediary pricing.

KlaSetu eliminates these bottlenecks through an artificial intelligence-driven listing engine, an artisan-first mobile application, a high-performance web marketplace, and a centralized backend API. By combining speech recognition in 24 Indian regional languages, multimodal computer vision for automated studio photography, and algorithmic fair-price modeling, KlaSetu enables any craftsperson to photograph their work, narrate their process in their mother tongue, and publish an optimized commercial listing within minutes.

---

## Architectural Overview

The repository is structured as a unified monorepo divided into three specialized layers:

```mermaid
graph TD
    subgraph Clients ["Client Applications"]
        APP["Mobile Application (React Native / Expo SDK 57)"]
        WEB["Web Storefront & Studio (React 19 / Vite / Tailwind CSS)"]
    end

    subgraph API ["Backend Services (FastAPI)"]
        ROUTER["REST API Gateway (Auth, Catalog, Cart, Studio)"]
        DB[(PostgreSQL Database via SQLAlchemy)]
        STATIC["Static Media Storage (/bucket)"]
    end

    subgraph AI_Engine ["LangGraph Intelligence Engine"]
        VLM["VLM Image Analysis (Qwen3-VL-4B)"]
        CV["Computer Vision Pipeline (rembg, OpenCV, CLAHE)"]
        STT["Indic Speech Recognition (Indic-Conformer 600M)"]
        LLM["Catalog Content Generator (Groq / GPT)"]
        PRICER["Fair Price Algorithm"]
    end

    APP -->|REST / Multipart Form| ROUTER
    WEB -->|REST / Multipart Form| ROUTER
    ROUTER --> DB
    ROUTER --> STATIC
    ROUTER -->|Process Product Request| AI_Engine
    AI_Engine --> VLM
    AI_Engine --> CV
    AI_Engine --> STT
    AI_Engine --> LLM
    AI_Engine --> PRICER
    CV --> STATIC
```

### System Components

1. **Client Mobile Application (`/App`)**:
   Built with React Native and Expo (SDK 57). Provides an intuitive, touch-first mobile interface tailored for artisans in remote or field environments. Supports camera capture, native voice recording, real-time listing generation, order monitoring, and consumer shopping.

2. **Client Web Application (`/Website`)**:
   Built with React 19, Vite, Tailwind CSS v4, and React Router v7. Serves both as an earthy, story-driven e-commerce storefront for buyers and a comprehensive web-based studio dashboard for registered sellers to monitor inventory, metrics, and incoming orders.

3. **Core Backend & AI Pipeline (`/Backend`)**:
   Powered by FastAPI, SQLAlchemy, Alembic, and PostgreSQL. Orchestrates database persistence, user authentication, marketplace operations, and an asynchronous LangGraph execution graph that integrates Indic speech-to-text, computer vision enhancements, and large language models.

---

## Core Capabilities

### 1. Multilingual Voice-to-Listing
Artisans can record an audio narrative describing their handcrafted product in their native language. Powered by AI4Bharat's `indic-conformer-600m-multilingual` model, the engine decodes audio into text across 24 Indian languages and dialects. A language model subsequently synthesizes this transcript into polished, SEO-ready bilingual listings in both English and Hindi, complete with titles, descriptive bullet points, materials, and search tags.

### 2. Automated Studio Photography Enhancement
Raw photos taken under sub-optimal lighting or cluttered workshop backgrounds are processed through an automated vision pipeline:
- **Vision-Language Analysis**: Evaluates image sharpness, blur severity, lighting deficiencies, background tone, and framing requirements.
- **Background Segmentation**: Removes complex backgrounds cleanly using neural boundary detection (`rembg` with U-2-Net).
- **Photometric Correction**: Applies Contrast Limited Adaptive Histogram Equalization (CLAHE), gamma adjustments, and sharpening filters.
- **Commercial Composition**: Auto-crops to the subject, adds proportional canvas padding, injects realistic surface reflections, and blends onto curated neutral backdrops.

### 3. Transparent and Fair Pricing Model
To protect artisans from underpricing or platform exploitation, KlaSetu incorporates an algorithmic cost-plus pricing calculator. The engine parses material and labor expenditures and calculates craft-specific margins (ranging from 30% to 50% across textiles, pottery, metalwork, woodwork, and jewelry), ensuring sustainable artisan wages while maintaining competitive market pricing.

### 4. Unified Marketplace & Maker Identity
Every product listed on KlaSetu is linked to the artisan's personal profile, geographic origin, and craft tradition. Shoppers gain authentic provenance and narrative context for each handmade craft, transforming transactional purchasing into conscious cultural support.

---

## Repository Structure

```
KlaSetu/
├── App/                    # Cross-platform mobile client (React Native / Expo)
│   ├── src/
│   │   ├── components/     # UI components (Header, ProductCard, etc.)
│   │   ├── constants/      # Color palettes, typography, theme tokens
│   │   ├── context/        # Global state (ShopContext)
│   │   ├── screens/        # Mobile views (Home, Studio, PostProduct, etc.)
│   │   └── services/       # Network abstraction and API clients
│   ├── App.js              # Mobile application entry point
│   ├── app.json            # Expo configuration
│   ├── package.json        # Mobile dependencies and run scripts
│   └── README.md           # Mobile-specific documentation
├── Backend/                # Core REST API and AI pipeline (FastAPI / LangGraph)
│   ├── AI/
│   │   ├── config.py       # Model providers and inference configuration
│   │   └── pipeline/       # LangGraph graph, nodes, prompts, schemas
│   ├── alembic/            # Database schema migration files
│   ├── bucket/             # Persistent static media uploads and enhanced images
│   ├── src/
│   │   ├── market/         # Product catalog, cart, and order endpoints
│   │   └── users/          # Authentication, profiles, and artisan accounts
│   ├── utils/              # Database engine, JWT utilities, environment settings
│   ├── main.py             # FastAPI entry point, lifespan hooks, route registration
│   ├── requirements.txt    # Python dependencies
│   └── README.md           # Backend-specific documentation
├── Website/                # Modern desktop/mobile web storefront (React 19 / Vite)
│   ├── src/
│   │   ├── components/     # View components (Hero, Catalog, Studio, PostProduct)
│   │   ├── context/        # Shared application state and cart context
│   │   ├── data/           # Mock data and initial catalogues
│   │   ├── index.css       # Tailwind CSS v4 design system
│   │   └── main.jsx        # Client router and mount point
│   ├── index.html          # Web application document template
│   ├── package.json        # Web dependencies and build scripts
│   ├── vite.config.js      # Vite build configuration
│   └── README.md           # Web-specific documentation
├── DesignDoc.md            # Visual language, color tokens, and UX guidelines
└── README.md               # Monorepo architecture and platform overview
```

---

## Supported Indian Languages

The AI speech-to-text engine natively supports 24 languages and dialects:

| Language Code | Language Name | Language Code | Language Name |
|:---:|:---|:---:|:---|
| `hi` | Hindi | `bn` | Bengali |
| `ta` | Tamil | `te` | Telugu |
| `mr` | Marathi | `gu` | Gujarati |
| `kn` | Kannada | `ml` | Malayalam |
| `pa` | Punjabi | `or` | Odia |
| `as` | Assamese | `ur` | Urdu |
| `sa` | Sanskrit | `ks` | Kashmiri |
| `kok` | Konkani | `mai` | Maithili |
| `mni` | Manipuri | `ne` | Nepali |
| `sd` | Sindhi | `brx` | Bodo |
| `doi` | Dogri | `gom` | Goan Konkani |
| `sat` | Santali | `en` | Indian English |

---

## Technology Stack

| Domain | Technology | Description |
|---|---|---|
| **Backend Framework** | FastAPI | High-performance asynchronous Python API framework |
| **Database & ORM** | PostgreSQL, SQLAlchemy 2.0, Alembic | Relational storage and migration lifecycle management |
| **Workflow Orchestration**| LangGraph | Directed state graph for multi-stage product listing |
| **Speech-to-Text** | AI4Bharat Indic-Conformer 600M | Multilingual on-device / GPU Indian speech recognition |
| **Vision-Language** | Qwen3-VL-4B-Instruct | Image quality, lighting, and semantic attribute evaluation |
| **Text Generation** | Groq (`openai/gpt-oss-120b`) | Rapid bilingual listing compilation and metadata extraction |
| **Computer Vision** | OpenCV, rembg (U-2-Net), NumPy | Photometric enhancement, contrast correction, background isolation |
| **Web Frontend** | React 19, Vite, Tailwind CSS v4 | Responsive, accessible desktop and tablet storefront |
| **Mobile Frontend** | React Native, Expo SDK 57 | Touch-native mobile client for iOS and Android |
| **Audio Processing** | FFmpeg | Universal audio ingestion, resampling, and tensor decoding |

---

## Global Environment Variables

The backend relies on the following environment variables (typically placed inside `Backend/.env`):

| Variable Name | Required | Description |
|---|:---:|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string (e.g., `postgresql+psycopg2://user:pass@host:5432/dbname`) |
| `JWT_SECRET` | Yes | Cryptographic secret key for signing JSON Web Tokens |
| `FEATHERLESS_API_KEY` | Yes | API token for Featherless AI to execute Qwen3-VL queries |
| `GROQ_API_KEY` | Yes | API token for Groq Cloud to execute LLM inferences |
| `HF_TOKEN` | Optional | Hugging Face user access token for downloading restricted weights |

---

## Getting Started

### 1. Prerequisites
- Python 3.10 to 3.12 with pip
- Node.js 18.x or higher with npm
- PostgreSQL database instance
- FFmpeg installed and available on your system `PATH`

### 2. Backend Setup
```bash
# Navigate to Backend directory
cd Backend

# Create and activate a virtual environment
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment file
cp .env.example .env # or create .env with required keys

# Run database migrations
alembic upgrade head

# Start development server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 3. Web Storefront Setup
```bash
# Open a new terminal and navigate to Website directory
cd Website

# Install Node modules
npm install

# Start local Vite development server
npm run dev
```

The web application will be accessible at `http://localhost:5173`.

### 4. Mobile Application Setup
```bash
# Open a new terminal and navigate to App directory
cd App

# Install dependencies
npm install

# Start the Expo development server
npm run start
```

Press `a` to run in an Android emulator, `i` for iOS simulator, or scan the terminal QR code via the Expo Go application on a physical device.

---

## Design and Visual Language

KlaSetu adheres to a design standard rooted in the textures and materials of Indian craftsmanship:
- **Terracotta / Deep Clay (`#B5652F`)**: Primary brand identity reflecting earthenware and brick kilns.
- **Sage Green (`#3C6E47`)**: Accent color symbolizing organic raw materials and sustainability.
- **Warm Linen (`#F3E6D3`)**: Soft contextual background breaking clinical white spaces.
- **Warm White (`#FFFDF9`)**: Clean surface canvas for high-contrast product presentation.
- **Charcoal Brown (`#2B2420`)**: Soft, high-readability typography avoiding harsh pure black.

For complete specifications regarding typography, card elevations, filter pill components, and responsive breakpoints, refer to [DesignDoc.md](file:///d:/Hackathon/SIH2026-Round2/KlaSetu/DesignDoc.md).

---

## License

This project is developed for the Smart India Hackathon (SIH 2026). All rights reserved.
