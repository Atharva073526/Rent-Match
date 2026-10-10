# RentMatch — Mutual Merit Platform
> **Find a Home That Fits. Find a Tenant You Trust.**  
> *Fairness, dignity, and zero-exploitation in urban rental living.*

---

## 1. Product Overview

Traditional rental platforms across urban India (Bengaluru, Mumbai, Pune, Hyderabad, Delhi NCR) operate primarily as lead-generation classifieds. This leads to:
* **Artificial Rental Bidding Wars:** Intermediaries pitting applicants against each other in high-pressure token races.
* **10-Month Deposit Lockdowns:** Lakhs of rupees in life savings locked up, leading to painful deduction disputes.
* **Broker Spam & Interrogation:** Unregulated sharing of personal phone numbers on WhatsApp broker syndicates.
* **Discriminatory Profiling:** Unfair rejections based on sensitive demographic proxies.
* **Phantom Listings & Deepfake Renders:** Deceptive wide-angle lenses or synthetic property photos.

**RentMatch** introduces the **Mutual Merit Platform** — an ethical, AI-driven tenant–landlord matching platform designed for Indian urban living. Guided by **The Fair Arbiter / Sage** archetype (supported by The Guardian / Caregiver), RentMatch enforces:
1. **Explainable Compatibility Matching (0–100%):** Practical alignment on budget ceiling, move-in schedules, square footage, and house rules. Zero caste, religion, or discriminatory proxies.
2. **Two-Party Mutual Approval:** Contact credentials remain masked until both parties independently review verified compatibility and approve connection.
3. **RentMatch Verified:** Deeds and BESCOM/electricity bills verified before listing publication.
4. **C2PA Media Authenticity:** Digital verification of property images against manipulation.
5. **Model Tenancy Act (MTA) Digital Leasing:** Capped deposits (2–3 months), standardized 11-month agreements, and dual digital execution.
6. **RentMatch Escrow:** A tripartite deposit protection architecture preventing arbitrary withholding.

---

## 2. Quick Start & Installation

### Prerequisites
* **Node.js**: v18.x or v20+ (Tested on Node v24.20.0)
* **npm**: v9+ (Tested on npm 11.19.0)

### Setup & Run
```bash
# 1. Clone or navigate to the project directory
cd C:\Users\siddh\.gemini\antigravity\scratch\rentmatch

# 2. Install dependencies (if not already installed)
npm install

# 3. Start the Vite development server
npm run dev

# 4. Run automated test suite (Vitest)
npm run test

# 5. Build for production
npm run build
```

When you start the development server, open **`http://localhost:5173`** in your browser.

---

## 3. Interactive Persona Demo Switcher

RentMatch includes a persistent **Interactive Demo Mode Bar** pinned at the top of the application. With 1-click, you can test live workflows across all 3 key platform roles:

| Persona | Role | Profile Context | Key Workflows to Test |
| :--- | :--- | :--- | :--- |
| **👩‍💻 Ananya Sharma** | **Tenant** | Senior Software Engineer in Bengaluru Tech Corridor. Verified Aadhaar & Atlassian email. | • Search & filter homes<br>• View live Compatibility Breakdowns (94% on Indiranagar listing)<br>• Express interest (creates pending match)<br>• Submit tenancy applications<br>• Review & eSign draft lease |
| **👨‍💼 Rajesh Mehta** | **Landlord** | Verified Homeowner with 3 properties in Indiranagar & Koramangala. | • Manage property portfolio<br>• Toggle Publish/Pause status<br>• Review Mutual Match requests<br>• Accept match & unlock direct chat<br>• Review tenancy applications & issue leases |
| **🛡️ Vikram Adiga** | **Admin** | RentMatch Platform Ethics & Verification Lead. | • Platform Overview Metrics<br>• Verification Queue (Approve/Reject BBMP/tax docs)<br>• Property Moderation<br>• Anti-Bidding Reports desk<br>• Live Algorithm Tuning (adjust factor weights live!)<br>• Publish Knowledge Hub articles |
| **👤 Guest** | **Logged Out** | Public browsing mode. | • Full public discovery, About, How It Works, Pricing, Safety, Help Centre, Blog, DPDP Act Privacy Policy |

*Click **"Reset Seeds"** in the top bar anytime to restore mock data to the initial factory state.*

---

## 4. Architectural Stack

* **Frontend:** React 19 with TypeScript, Vite 8, Tailwind CSS v3.
* **Component System:** Reusable proptech component library with restrained shadows, warm off-white tones (`#FAF9F6`), deep navy typography (`#0F172A`), and emerald/teal accents (`#0D9488`).
* **Icons:** `lucide-react`.
* **State & Persistence:** Reactive local storage data store (`src/services/store.ts`) with pub-sub event listener bus, RLS permission checks, and instant state hydration.
* **Compatibility Engine:** Deterministic explainable scoring algorithm (`src/services/compatibilityEngine.ts`) with configurable weights and zero protected demographic proxies.
* **Digital Leasing Service:** Model Tenancy Act aligned draft agreement generator (`src/services/leaseGenerator.ts`).
* **Relational Database:** Full PostgreSQL & Supabase schema migrations, seed scripts, and Row Level Security (RLS) policies located in `supabase/`.
* **Automated Testing:** Vitest test suite (`src/tests/`).

---

## 5. Mutual Merit Compatibility Engine

### Scoring Logic
Compatibility is computed between `TenantProfile` and `Property` attributes as a deterministic score between `0` and `100`:

$$\text{Score} = \sum_{i} \left( \frac{\text{Factor Score}_i \times \text{Weight}_i}{100} \right)$$

### Default Factor Weights:
1. **Budget Compatibility (25%):** Rent $\le$ tenant ceiling = 100%. Within 8% = 75%. Within 20% = 45%. Exceeds budget = 15%.
2. **Location Proximity (20%):** Locality exact match = 100%. Same metro corridor = 60%.
3. **Move-in Timing (15%):** Within 7 days of target date = 100%. Available early = 85%. Minor gap = 70%.
4. **Property Layout & Furnishing (15%):** BHK layout + furnishing match = 100%. Layout match with different furnishing = 75%.
5. **Amenities Alignment (15%):** Ratio of tenant-required amenities available on-premise ($\ge 80\% \rightarrow 100\%$).
6. **Lifestyle & House Rules (10%):** Pets allowed + WFH high-speed support + quiet hours compatibility.

### Ethical Non-Discrimination Charter
* **Zero Demographic Inputs:** Caste, religion, marital status, gender, disability, or regional origin are **strictly excluded** from data schemas and scoring logic.
* **Full Transparency:** Every score displays an itemized factor breakdown with tenant requirement vs. property offering.
* **Dynamic Admin Tuning:** Weights can be adjusted live from the Admin Control Desk (`/admin`), dynamically recalculating scores across all properties.

---

## 6. Database Schema & Security (Supabase / PostgreSQL)

Complete SQL migrations are provided in the `supabase/` directory:
* [`supabase/schema.sql`](file:///C:/Users/siddh/.gemini/antigravity/scratch/rentmatch/supabase/schema.sql): 13 relational tables (`users`, `tenant_profiles`, `landlord_profiles`, `properties`, `saved_properties`, `mutual_matches`, `rental_applications`, `lease_agreements`, `conversations`, `chat_messages`, `verification_requests`, `user_reports`, `blog_articles`, `audit_logs`).
* [`supabase/rls_policies.sql`](file:///C:/Users/siddh/.gemini/antigravity/scratch/rentmatch/supabase/rls_policies.sql): Granular Row Level Security (RLS) policies enforcing participant isolation for private chats, applications, lease drafts, and verification documents.
* [`supabase/seed.sql`](file:///C:/Users/siddh/.gemini/antigravity/scratch/rentmatch/supabase/seed.sql): Production-grade realistic seed data for Bengaluru, Mumbai, Pune, and Hyderabad.

---

## 7. Status of External Integrations

To maintain transparency, the following table details the implementation status of platform features:

| System / Provider | Implementation Status | Integration Blueprint |
| :--- | :--- | :--- |
| **Mutual Merit Scoring** | ✅ **Live & Fully Functional** | Pure TypeScript mathematical engine with real-time weights tuning. |
| **Two-Party Matching** | ✅ **Live & Fully Functional** | State machine with contact masking until dual approval. |
| **Direct Messaging** | ✅ **Live & Fully Functional** | Real-time chat with persistent storage and quick prompts. |
| **Model Tenancy Leases** | ✅ **Live & Fully Functional** | 11-month legal template generation and print formatting. |
| **Aadhaar eSign** | 🟡 **Simulated Sandbox** | UIDAI sandbox simulation. Requires production eSign ASP/ESP credentials (e.g. NeSL / Leegality) for live legally binding signatures. |
| **Payment Gateway** | 🟡 **Simulated Sandbox** | Razorpay / Cashfree test flow for ₹99 & ₹149 tiers without collecting real currency. |
| **RentMatch Escrow** | 🟡 **Architecture Prototype** | Tripartite account logic documented. Real transfers require partner bank account aggregator API. |
| **C2PA Media Authenticity** | 🟡 **Validated Sandbox** | Metadata provenance model configured. Ready for CAI inspection endpoint. |
| **Aadhaar e-KYC / PAN** | 🟡 **Masked Document Sandbox** | Upload & review workflow live. Live OTP verification requires UIDAI KUA integration. |

---

## 8. Automated Test Results

The test suite is powered by **Vitest**:
```
 RUN  v5.0.3 C:/Users/siddh/.gemini/antigravity/scratch/rentmatch

 ✓ src/tests/compatibilityEngine.test.ts (4 tests) 33ms
    ✓ calculates exceptional match when all parameters align perfectly
    ✓ penalizes when property rent significantly exceeds tenant budget
    ✓ flags conflict when tenant has pets but landlord prohibits pets
    ✓ allows dynamic weight adjustments by admin
 ✓ src/tests/store.test.ts (6 tests) 12ms
    ✓ initializes with seed users and default tenant session
    ✓ supports seamless demo user role switching
    ✓ allows tenant to express interest in a property
    ✓ progresses to mutual match when landlord accepts
    ✓ submits rental application and generates draft lease upon landlord approval
    ✓ correctly calculates live platform metrics from database state

 Test Files  2 passed (2)
      Tests  10 passed (10)
```

---

## 9. Routes & Navigation Reference

* `/` — Homepage (Search, pain points, how it works, featured homes, pricing preview, trust charter).
* `/properties` — Property Discovery Directory with advanced filters and side-by-side comparison.
* `/properties/:id` — Rich Property Detail page with photo gallery, landlord credentials, compatibility breakdown, and express interest modal.
* `/about` — Mission, "The Fair Arbiter" archetype, and anti-bidding ethics.
* `/how-it-works` — 5-step interactive Mutual Merit walkthrough.
* `/pricing` — Pricing plans (Free ₹0, Tenant ₹99, Landlord ₹149) with simulated checkout.
* `/safety` — RentMatch Verified hierarchy and C2PA media authenticity framework.
* `/help` — Searchable Help Centre with categorized FAQs and ticket submission modal.
* `/contact` — Office locations and IT Rules Grievance Officer disclosure.
* `/blog` — Knowledge Hub with category filters and search.
* `/blog/:slug` — Article reader with related articles.
* `/privacy` — Privacy Policy (DPDP Act 2023 compliance).
* `/terms` — Terms of Use & Anti-Bidding Charter.
* `/login` & `/signup` — Authentication with role selection and quick demo logins.
* `/onboarding` — Multi-step tenant preference configuration wizard.
* `/tenant/dashboard` — Tenant control center with live recommendations and lease tracker.
* `/landlord/dashboard` — Homeowner portfolio management and match approval queue.
* `/landlord/new-property` — 7-step landlord listing wizard.
* `/matches` — Mutual matches and pending approvals hub.
* `/messages` — Encrypted direct chat with quick suggestions and read receipts.
* `/applications` — Formal rental proposals and status timeline.
* `/leases` — 11-month Model Tenancy Act draft viewer, eSign simulation, and Escrow sandbox.
* `/settings` — Profile settings, document verification upload, and RentMatch Pass.
* `/admin` — Staff Control Desk with platform metrics, moderation, verifications queue, reports desk, and algorithm weights tuning.

---

© 2026 RentMatch Technologies India Pvt. Ltd. All rights reserved. Built with fairness, dignity, and zero exploitation for Indian urban rental living.
