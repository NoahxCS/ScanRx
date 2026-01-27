# ScanRx: Visual Medical Bill Auditor

## The Hidden Cost of Healthcare

The medical industry, while dedicated to healing, is often marred by opaque pricing practices and staggering bills that leave patients in financial shock. It's an open secret: medical billing is complex, inconsistent, and frequently includes errors or inflated charges. Patients routinely face "sticker shock" when receiving bills for thousands of dollars for procedures they believed were covered, or encounter mysterious line items with exorbitant prices that bear little relation to fair market value.

These malpractices range from simple billing errors and duplicate charges to more systematic issues like "surprise billing" and dramatic price variation for identical services. The result? Patients either pay bills they can't afford or embark on exhausting, time-consuming disputes with insurers and providers—often without the specialized knowledge needed to challenge charges effectively.

## Our Solution: ScanRx(https://noahxcs.github.io/ScanRx/)

ScanRx is a visual medical bill auditor designed to empower patients and bring transparency to medical billing. By comparing your medical bill against a comprehensive database of fair market prices for medical items and services, ScanRx automatically identifies price discrepancies and presents them in an intuitive, visual format.

### Key Features:
- **Visual Bill Analysis**: Upload your medical bill and see immediate visual highlighting of problematic charges
- **Automated Price Comparison**: Cross-references each line item against our database of fair market prices
- **Clear Discrepancy Summaries**: Get both textual and visual summaries of overcharges
- **User-Friendly Interface**: Designed for patients, not billing experts

## How It Works

### Technology Stack
- **Frontend Prototyping**: Rapid prototyping and initial development using **Google Firebase**
- **UI Framework**: Built with **Google Antigravity** for a clean, responsive interface
- **AI Processing**: Originally designed to leverage **Google Gemini** from **Google AI Studio** for intelligent bill parsing and analysis
  - *Note: Due to current API limitations, we're using pre-processed results from Gemini for this demonstration*

### Process Flow:
1. **Upload**: Users upload their medical bill (PDF format)
2. **Analysis**: The system extracts line items and compares them against our price database
3. **Visualization**: Discrepancies are highlighted with color-coding and visual indicators
4. **Summary**: Users receive a clear breakdown of potential overcharges

## Project Files

For demonstration purposes, please examine:
- [`hospital-bill.pdf`](./hospital-bill.pdf): A sample medical bill showing the type of document ScanRx analyzes
- [`item-database.xlsx`](./item-database.xlsx): Our reference database of fair market prices for medical services and items

## Current Status & Limitations

**This is a hackathon project** developed within tight time constraints. While we've created a functional prototype that demonstrates our core concept, several areas would benefit from further development:

- **Full AI Integration**: Complete integration with Google Gemini API for real-time processing
- **Expanded Database**: Broader coverage of medical procedures and regional price variations
- **Enhanced Parsing**: Improved handling of varied bill formats and medical coding systems
- **User Accounts**: Secure storage of bill history and personalized recommendations

We've done our best to create a compelling proof-of-concept within the available time, and we believe ScanRx demonstrates a viable approach to tackling medical billing transparency.

## Getting Started

1. Clone this repository
2. Open `index.html` in your browser
3. Explore the sample bill analysis
4. Review the price database to understand our comparison framework

   or
   
Check out our Github Pages Site: https://noahxcs.github.io/ScanRx/

## The Future of ScanRx

With additional development, ScanRx could evolve into:
- A mobile app for instant bill scanning
- A platform for collective bargaining through aggregated user data
- An educational tool explaining medical billing codes and fair pricing
- A connection service to medical billing advocates when significant discrepancies are found

---

*ScanRx: Bringing transparency to medical billing, one bill at a time.*
