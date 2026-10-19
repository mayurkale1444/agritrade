# AgriTrade — Google Play Store Production Release Specification

## 1. App Identity & Android Configuration
- **App Name:** AgriTrade
- **Package Name (Application ID):** `in.agritrade.app`
- **Version Code:** `3`
- **Version Name:** `1.0.2`
- **Min SDK:** `24` (Android 7.0+)
- **Compile SDK:** `36` (Android 16 Ready)
- **Target SDK:** `36` (Android 16 Ready — complies with Google Play's latest requirements)
- **Release Build Format:** Android App Bundle (`.aab`) via Gradle `bundleRelease`

---

## 2. Store Listing Content

### App Title (Max 30 characters)
`AgriTrade`

### Short Description (Max 80 characters)
`Independent APMC mandi rates, trader reports, and crop trade profit tools.`

### Full Description (Under 4000 characters)
```text
AgriTrade — Know Before You Sell (विकण्यापूर्वी माहिती घ्या)

IMPORTANT DISCLAIMER (GOVERNMENT ENTITY AFFILIATION):
AgriTrade is an independent, privately developed agricultural intelligence platform. AgriTrade is NOT affiliated with, authorized by, endorsed by, or in any way officially associated with the Government of India, the Ministry of Agriculture and Farmers Welfare, the Directorate of Marketing & Inspection (DMI), AGMARKNET, or any State Agricultural Marketing Board / APMC.

DATA SOURCES (GOVERNMENT MARKET-PRICE RECORDS):
Official agricultural wholesale arrival and price bulletins displayed in this app are sourced from public open datasets provided by:
1. AGMARKNET (Agricultural Marketing Information Network): https://agmarknet.gov.in (Directorate of Marketing & Inspection, Ministry of Agriculture & Farmers Welfare, Government of India)
2. Open Government Data (OGD) Platform India: https://data.gov.in (National Informatics Centre, Ministry of Electronics & Information Technology, Government of India)

TRADER-REPORTED RATES (MAY BE UNVERIFIED):
Rates marked as "Trader Reported — Not Official Government Data" are submitted directly by local market participants (commission agents / traders). These rates may be unverified and reflect negotiated spot-lot transactions based on quality grades, moisture content, and lot conditions. They do NOT constitute official APMC auction benchmarks or official government records.

KEY FEATURES:

1. APMC Mandi Price Records (Sourced from AGMARKNET & data.gov.in)
Directly sourced from the Directorate of Marketing & Inspection (AGMARKNET) via data.gov.in. View minimum, maximum, and modal wholesale prices updated across 300+ APMC mandis.

2. Mandi Price Comparisons
Compare rates across neighboring market yards (e.g., Lasalgaon, Pimpalgaon, Nashik, Pune, Latur, Solapur). Evaluate price spreads, transportation distances, and net yield to choose the most profitable market.

3. Trader-Reported Local Rates (Crowdsourced Intelligence)
Ground-level price reports submitted by registered commission agents (आडते) and local traders for specific crop varieties and quality grades (Super, Medium, FAQ, Gulti). Clearly labeled as "Trader Reported — Not Official Government Data".

4. Trade Profit Calculator
Calculate real take-home profit after accounting for mandi cess, commission, weighing charges (तोलाई), labor (हमाली), packaging bags (बारदाना), and transport freight.

5. Daily Mandi Reports & Bulletins
Market analysis summaries including arrival trends, arrivals quantity, and commodity price movements. When daily auction bulletins have not been released, clear "Reference Baseline" labels are shown.

6. Multilingual Support
Full native support for Marathi (मराठी), English (EN), Hindi (HI), Kannada (KN), and Tamil (TA) to ensure seamless use for regional farmers and traders.

DATA TRANSPARENCY & INTEGRITY:
- Independent platform dedicated to farmer and trader market transparency.
- Government records sourced via AGMARKNET and data.gov.in open catalogs.
- Dedicated in-app "Data Sources & Disclaimer" screen accessible from Home and More.
- Secure mobile-number login via OTP verification. No passwords required.
- Full Google Play Data Safety compliance: easily delete your account and all associated data at any time in-app or via our web portal.

AgriTrade: Market clarity for smarter agricultural trading decisions.
```

---

## 3. Play Console Policy Declarations

### A. App Access (Reviewer Credentials)
- **Restricted Access:** Yes (Login required via OTP)
- **Test Mobile Number:** `+91 9876543210`
- **Fixed Verification OTP:** `123456`
- **Reviewer Instructions:**
  > "Enter mobile number 9876543210 and tap 'पुढे जा' (Continue). On the OTP verification screen, enter 123456. This grants immediate full access to all screens, live mandi rates, comparison views, and calculator tools without requiring an Indian SMS network."

### B. Data Safety Form
| Category | Collected | Shared | Purpose | Optional / Required |
| :--- | :--- | :--- | :--- | :--- |
| **Phone Number** | Yes | No | Account management, OTP authentication | Required |
| **User Profile Data (Name, Primary Mandi, Commodity)** | Yes | No | App personalization, default market setup | Optional |
| **Location (Precise / Coarse)** | No | No | N/A (Mandi selected by user) | N/A |
| **Financial Info (Bank, UPI, Cards)** | No | No | N/A | N/A |
| **Contacts / Photos / Storage** | No | No | N/A | N/A |

- **Data Encryption:** All data in transit is encrypted using HTTPS/TLS.
- **Account Deletion Request:** 
  - In-app: `Settings → खाते हटवा (Delete Account)`
  - Web portal: `https://agritrade.in/delete-account` (no app installation required)

### C. Content Rating
- **Category:** Business / Tools / Reference
- **Violence, Adult, Illegal content:** None
- **Rating:** Everyone (PEGI 3 / USK 0 / ESRB Everyone)

### D. Target Audience
- **Target Age:** 18 and older (Farmers and agricultural traders)
- **Appeals to Children:** No

### E. Ads Declaration
- **Contains Ads:** No. AgriTrade contains zero third-party banner or interstitial advertisements.

### F. Financial Features Declaration
- **Financial Status:** Not a financial institution, lender, or cryptocurrency platform. Provides informational market rate analysis and arithmetic calculators only.

---

## 4. Play Store Graphical Assets Specifications
1. **App Icon:** `512 x 512 px`, 32-bit PNG/SVG, max 1024KB. Available at `/public/playstore-icon.svg`.
2. **Feature Graphic:** `1024 x 500 px`, PNG/JPEG/SVG. Available at `/public/feature-graphic.svg`.
3. **Screenshots:** Standard Android 16:9 / 20:9 ratio (min 1080 x 1920 or 1080 x 2400):
   - Screen 1: Official Mandi Rates (Lasalgaon Onion, Latur Soybean)
   - Screen 2: Step-by-Step Commodity & Variety Wizard
   - Screen 3: Live Mandi Comparison Matrix
   - Screen 4: Ground-level Trader Reported Rates
   - Screen 5: Agricultural Trade Profit & Freight Calculator
4. **Website & Web Resource:**
   - Homepage: `https://agritrade.in`
   - Privacy Policy (HTML Page): `https://agritrade.in/privacy-policy.html` (also available at `/privacy-policy`)
   - Account Deletion Portal: `https://agritrade.in/delete-account`
   - Developer / Publisher: Mayur Kale (`mayurkale1444@gmail.com`)
