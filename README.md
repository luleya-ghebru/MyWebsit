# LG Store — Website Project (WEDE5020)

**Module:** Web Development (Introduction) — WEDE5020
**Student Name:** [Your Full Name]
**Student Number:** [Your Student Number]
**Group:** [If applicable]

---

## Project Overview

LG Store is an independently owned retail shop that has sold branded LG
consumer electronics and home appliances since 2010. Starting from a single
showroom, the business has grown into a well-known local retailer of
televisions, home entertainment equipment, fridges, washing machines, air
conditioners and small appliances, supported by knowledgeable sales staff and
dependable after-sales service.

This project delivers a professional, functional website for LG Store, built
across three phases:

- **Part 1** — HTML foundation: project planning, content research, file
  structure, and static page structure for five core pages.
- **Part 2** — CSS styling and responsive design across desktop, tablet and
  mobile.
- **Part 3** — JavaScript functionality, form validation, SEO optimisation
  and deployment.

**Mission:** To provide quality entertainment and household technology to
every household, backed by expert guidance and professional after-sales
services.

**Vision:** To become the No. 1 choice in the region for LG products, as an
authority for both our range of products and services and our digital
consumer experience.

**Target Audience:**
- Homeowners and families furnishing/upgrading appliances (28–55 years old)
- Renters and young professionals furnishing a home on a budget
- Tech-savvy consumers researching specifications before purchase
- Small business owners and property developers buying in bulk
- Existing customers needing service bookings, warranty or spare parts info

---

## Website Goals and Objectives

- Maximise web traffic through a professional, optimised online store
  presence.
- Generate qualified sales leads via enquiry forms, click-to-call and
  WhatsApp.
- Support online transactions for appliances and electronics via e-commerce
  listings (future phase).
- Provide clear product specifications, warranty, delivery and service
  booking information to reduce workload on in-store and call centre staff.

**Key Performance Indicators:**
- Unique monthly visitors (target: 20% quarter-on-quarter growth within a
  year)
- Visitor-to-lead/sale conversion rate (target: 2.5%)
- Average time on site and pages per visit
- Homepage/category bounce rate (target: under 45%)
- Online revenue as a share of total store revenue (target: 15% after year
  one)
- Number of service bookings and form submissions per month

---

## Key Features and Functionality

- **Home Page** — hero banner, featured product categories, value
  proposition, customer trust/social proof.
- **About Us** — company history, mission and vision, team introduction,
  store locator.
- **Products & Services** — catalogue of televisions, fridges, washing
  machines, air conditioning and small appliances, plus installation/repair
  services.
- **Enquiry** — form for product, pricing, installation, repair and warranty
  enquiries.
- **Contact** — store locations (Sandton and Cape Town), maps, opening
  hours, and a general contact form.
- *(Planned for later phases: shopping cart/checkout, blog/resource section,
  admin panel, live JavaScript form validation, SEO, deployment.)*

---<img width="467" height="840" alt="image" src="https://github.com/user-attachments/assets/4b236f5f-e481-44bb-b5eb-b554da1446d3" />


## Timeline and Milestones

| Phase | Milestone | Duration |
|---|---|---|
| Phase 1: Discovery | Stakeholder interviews, requirements gathering, competitor analysis | Week 1–2 |
| Phase 2: Planning | Sitemap, content strategy, low-fidelity wireframes approved | Week 3 |
| Phase 3: Design | Visual design (colour, typography, layout), high-fidelity mock-ups approved | Week 4–5 |
| Phase 4: Development | Front-end build, CMS/e-commerce integration, content population | Week 6–9 |
| Phase 5: Testing | Functional, usability, cross-browser and performance testing | Week 10 |
| Phase 6: Launch | Final client review, domain go-live, staff handover training | Week 11 |
| Phase 7: Post-launch support | Monitoring, bug-fixing, performance review against KPIs | Week 12 onward |

---

## Part 1 — Building the Foundation

Part 1 covered project initiation, planning and the HTML foundation of the
website.

**Completed in this phase:**
- Website Project Proposal submitted and approved for LG Store.
- Content research and sourcing conducted for all five pages.
- Project file and folder structure established (`assets/`, `css/`,
  `pages/`).
- Semantic HTML5 structure created for five pages: `index.html`,
  `pages/about.html`, `pages/products.html`, `pages/enquiry.html`,
  `pages/contact.html`, using elements such as `header`, `nav`, `main`,
  `section`, `article` and `footer`.
- Consistent navigation menu linking all five pages.
- Basic content (headings, paragraphs, images, lists, forms) added to each
  page.
- File and folder naming corrected to lowercase, no-space conventions
  following Part 1 feedback.

---

## Part 2 — Designing the Visuals: CSS Styling and Responsive Design

Part 2 covered working through Part 1 feedback and building the full visual
design of the website with CSS.

**Completed in this phase:**
- Created an external stylesheet (`css/style.css`) and linked it to all five
  HTML pages.
- Established a base style: colour palette (light pink `#FCE4EC` and dark
  pink `#880E4F`/`#C2185B` theme), typography using Google Fonts
  (Montserrat for headings, Roboto for body text), and a CSS reset for
  cross-browser consistency.
- Applied layout structure using **Flexbox** for the header, navigation,
  category/product/team card grids, footer columns, and form sections.
- Styled all page elements decoratively (colours, borders, border-radius,
  spacing) and centre-aligned page content per feedback.
- Removed default bullet points from lists and re-styled them as clean,
  centred text lists.
- Added interactive **pseudo-classes** (`:hover`, `:focus`) on buttons, nav
  links and form fields.
- Implemented **responsive design** with two breakpoints:
  - **Tablet** (`max-width: 768px`) — header stacks, navigation becomes a
    vertical list, category/team/location cards switch to single column,
    mission/vision section stacks.
  - **Mobile** (`max-width: 480px`) — navigation and footer stack fully,
    hero text and buttons resize for smaller screens, buttons become
    full-width.
- Used relative units (`em`) for spacing/typography and `%`/`max-width` for
  responsive images.
- Fixed a horizontal-scroll bug on mobile by adding `overflow-x: hidden` to
  the page.
- Tested the live site (deployed via Netlify) across desktop, tablet and
  mobile viewport sizes using browser developer tools.

### Screenshot Evidence — Responsive Design

**Mobile view (Home page):**

![Mobile view of LG Store home page](assets/screenshots/mobile-home.png)

**Tablet view (About page):**

![Tablet view of LG Store about page](assets/screenshots/tablet-about.png)

---

## Sitemap

```
Home (index.html)
│
├── About Us (pages/about.html)
│     ├── Our History
│     ├── Mission & Vision
│     ├── Meet the Team (Store Manager, Sales Specialist, Service Technician)
│     └── Store Locator (links to Contact page)
│
├── Products & Services (pages/products.html)
│     ├── Televisions
│     ├── Fridges & Freezers
│     ├── Washing Machines
│     ├── Air Conditioning
│     ├── Small Appliances
│     └── Installation & Repair Services
│
├── Enquiry (pages/enquiry.html)
│     └── Product / pricing / installation / repair / warranty enquiry form
│
└── Contact (pages/contact.html)
      ├── LG Store — Sandton (address, hours, embedded map)
      ├── LG Store — Cape Town (address, hours, embedded map)
      └── General contact form
```

## File and Folder Structure

```
lg-store/
├── assets/
│   └── screenshots/    → responsive design evidence (mobile, tablet)
├── css/
│   └── style.css        → external stylesheet
├── pages/
│   ├── about.html
│   ├── products.html
│   ├── enquiry.html
│   └── contact.html
├── index.html            → homepage (root)
└── README.md
```

---

## Changelog

| Date | Change | Description |
|---|---|---|
| [Date] | Initial commit | Project folder structure created (`assets`, `css`, `pages`). |
| [Date] | Added HTML pages | Created `index.html`, `pages/about.html`, `pages/products.html`, `pages/enquiry.html`, `pages/contact.html` with semantic HTML5 structure and navigation. |
| [Date] | Added base stylesheet | Linked `style.css` to all pages with colour palette and font variables. |
| [Date] | Fixed image paths | Corrected relative asset paths across all pages. |
| [Date] | Fixed file/folder naming per Part 1 feedback | Renamed folders and files to lowercase, no-space conventions. Updated all internal links and image paths to match. |
| [Date] | Applied Part 2 CSS styling | Built full Flexbox layout, typography scale, pink colour theme, and pseudo-class interactivity across all pages. |
| [Date] | Added responsive design | Implemented tablet (768px) and mobile (480px) breakpoints; fixed horizontal-scroll overflow bug; removed list bullets and centred content per feedback. |
| [Date] | Deployed to Netlify | Site published for live testing across desktop, tablet and mobile viewports. |

*(Update this table with every future commit — date, short change title, and
a description detailed enough for the lecturer to follow your progress.)*

---

## References

Interaction Design Foundation (2025) *What is User Experience (UX) Design?*
Available at: https://www.interaction-design.org/literature/topics/ux-design
(Accessed: 3 August 2026).

Nielsen Norman Group (2024) *Website Navigation: Tips for the Global
Navigation Menu.* Available at:
https://www.nngroup.com/articles/navigation-menu/ (Accessed: 3 August 2026).

PayFast (2026) *Pricing and Fees.* Available at:
https://www.payfast.co.za/pricing (Accessed: 3 August 2026).

W3C (2023) *Web Content Accessibility Guidelines (WCAG) 2.2.* Available at:
https://www.w3.org/TR/WCAG22/ (Accessed: 3 August 2026).

WooCommerce (2026) *WooCommerce Documentation.* Available at:
https://woocommerce.com/documentation/ (Accessed: 3 August 2026).

<!-- Add image source references below as you source and save each one,
     e.g.:
     Pexels (2026) Retail store manager in electronics showroom. Available
     at: [image URL] (Accessed: [date]). -->
