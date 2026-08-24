# CreatorHub --- YouTuber Website & Creator Management Platform

## 1. Project Overview

Build a premium, responsive website platform for a YouTuber/content
creator.

The system has two major areas:

1.  **Public Creator Website**
    -   Visitors can discover the creator, watch videos, explore
        recommended products, read articles, view resources, join the
        community, and contact the creator.
2.  **Creator/Admin Dashboard**
    -   The creator/admin can manage videos, products, sponsors,
        affiliate links, promotions, community chat, AI assistant
        knowledge, articles, events, analytics, SEO, media, and website
        settings.

The application should be designed so that it can initially serve one
YouTuber but can later be converted into a multi-creator SaaS.

------------------------------------------------------------------------

# 2. Primary Technology Stack (REVISED --- No Custom Backend)

> **Architecture decision:** the creator does not want a custom-coded
> backend (no Java, no Spring Boot, no self-written server of any
> kind). The platform is built as a **frontend-only Angular app backed
> entirely by managed, no-code services** — Google Sheets (via SheetDB)
> for content data, and Firebase for authentication, real-time chat,
> and media storage. Every section elsewhere in this document that
> mentions Java/Spring Boot/PostgreSQL/WebSocket-STOMP describes the
> *original* design and is **superseded** by this section and Section
> 68. Sections 43--53 have already been rewritten to match; treat any
> remaining Java/Spring reference elsewhere in the doc as historical
> context, not an instruction.

## Frontend

-   Angular
-   TypeScript
-   Angular Router
-   Angular Signals where appropriate
-   RxJS
-   SCSS
-   Angular Reactive Forms
-   Angular Material/CDK only where useful; do not let Material dictate
    the visual design
-   Responsive desktop/tablet/mobile layouts

## "Backend" (no code written or hosted by you)

-   **Google Sheets + SheetDB (or Sheety)** — the live database. Every
    entity (Videos, Products, Users, Coupons, AnalyticsEvents, etc.)
    is a tab in one Google Sheet; SheetDB turns each tab into a REST
    endpoint automatically. No server, no ORM, no migrations to write.
-   **Firebase Authentication** — handles registration, login,
    logout, and password reset. No auth code to write.
-   **Firebase Firestore** — used only for the two things a Sheet
    can't do well: real-time community chat and high-frequency audit
    log rows (Sections 44, 53).
-   **Firebase Storage** (or Cloudinary) — image/media uploads
    (thumbnails, product photos, logos), configured through security
    rules/upload presets, not server code.
-   **YouTube Data API** — called directly from Angular with a
    domain-restricted API key (Section 45) to fetch video metadata.
    No backend proxy needed for this one.

## The one exception: AI Assistant

If the AI Assistant feature (Sections referencing "AI provider
integration") is built, calling Anthropic/OpenAI directly from Angular
would expose your AI API key to anyone who opens dev tools — that key
can rack up real charges if leaked, so it cannot ship in the frontend
bundle. This is the single place a fully no-code frontend can't avoid
some server-side piece. See **Section 68** for the lightweight options
(a one-click hosted proxy vs. simply deferring this feature) — none of
them require you to write or maintain a Java/Spring application.

## Infrastructure

-   **Static hosting** for the Angular build: Firebase Hosting,
    Netlify, or Vercel — deploy by connecting a Git repo, no server to
    provision.
-   Environment-specific config (SheetDB sheet ID, Firebase project
    config, YouTube API key) injected at build time via Angular
    environment files — see Section 68 for which of these are safe to
    include in the public bundle.
-   Email provider integration for newsletters/notifications: use a
    provider with a client-callable or Zapier/Make-style no-code
    trigger (e.g. Mailchimp/Brevo forms, or a Google Sheets → Email
    automation) rather than a custom mail-sending service.

------------------------------------------------------------------------

# 3. Visual Design Direction

The attached mockup is the primary visual inspiration.

The design should feel like a **premium modern dashboard / smart media
platform**, not a conventional blog.

## Design characteristics

-   Large rounded cards
-   Soft glassmorphism
-   Dark charcoal/black background
-   Warm amber/gold accent
-   Large photographic hero areas
-   High contrast typography
-   Subtle gradients
-   Thin translucent borders
-   Soft shadows
-   Rounded buttons
-   Spacious layouts
-   Minimal icons
-   Premium typography
-   Smooth hover/focus transitions
-   Very little visual clutter

The attached mockup uses a dark, cinematic visual language with:

-   Black/charcoal surfaces
-   Warm amber/orange highlights
-   Large background imagery
-   Semi-transparent dark cards
-   Rounded corners
-   White typography
-   Gold accent controls

The creator website should use the same visual language.

------------------------------------------------------------------------

# 4. Theme System

The application MUST support both:

-   Dark theme
-   Light theme

Add a theme toggle in the header.

Store the selected theme locally and optionally persist it for logged-in
users.

## Dark theme

Primary visual direction:

-   Background: near-black / charcoal
-   Cards: dark translucent charcoal
-   Text: white / light gray
-   Secondary text: muted gray
-   Accent: warm amber/gold
-   Borders: translucent white
-   Hero images: dark overlay

Suggested tokens:

``` scss
--bg-primary: #0b0b0b;
--bg-secondary: #151515;
--surface: rgba(35, 35, 35, 0.78);
--surface-solid: #1b1b1b;
--text-primary: #f7f7f7;
--text-secondary: #a7a7a7;
--border: rgba(255, 255, 255, 0.10);
--accent: #f5a400;
--accent-soft: rgba(245, 164, 0, 0.16);
```

## Light theme

The light theme should NOT simply invert colors.

It should remain premium:

``` scss
--bg-primary: #f4f2ed;
--bg-secondary: #ffffff;
--surface: rgba(255, 255, 255, 0.82);
--surface-solid: #ffffff;
--text-primary: #171717;
--text-secondary: #6f6f6f;
--border: rgba(0, 0, 0, 0.09);
--accent: #d99100;
--accent-soft: rgba(217, 145, 0, 0.12);
```

Use warm off-white backgrounds instead of pure white where appropriate.

------------------------------------------------------------------------

# 5. Global UI Rules

## Border radius

Use large rounded corners similar to the reference:

-   Small controls: 10--14px
-   Buttons: 12--16px
-   Cards: 20--28px
-   Large feature cards: 28--36px
-   Modal/dialog: 24px+

## Typography

Use a modern sans-serif font.

Recommended:

-   Inter
-   Manrope
-   Plus Jakarta Sans

Use:

-   Large bold headings
-   Medium-weight section titles
-   Small muted metadata
-   Comfortable line height

## Icons

Use a consistent icon library such as Lucide.

Do not mix multiple icon styles.

## Motion

Use subtle animations:

-   Card hover
-   Button hover
-   Page transitions
-   Chat opening
-   Modal opening
-   Image reveal
-   Loading skeletons

Avoid excessive animation.

------------------------------------------------------------------------

# 6. Public Website Navigation

Recommended main navigation:

``` text
Home
Videos
Products
Recommendations
Resources
Blog
Events
About
Contact
```

The actual navigation can be responsive.

Desktop:

``` text
[CREATOR LOGO]

Home
Videos
Products
Recommendations
Resources
Blog

                         Search   Theme   [Profile/Community]
```

Mobile:

``` text
Logo                         ☰
```

Use a mobile bottom navigation only if it improves usability.

------------------------------------------------------------------------

# 7. Public Homepage

The homepage should be visually similar to the supplied mockup:

-   Large cinematic hero
-   Floating glass cards
-   Asymmetric grid
-   Strong visual hierarchy
-   Warm accent highlights

## Hero

Hero content:

``` text
[Creator image/background]

Hi, I'm [Creator Name]

I create videos about
technology, AI and software.

[Watch Latest Video]
[Explore My Recommendations]
```

Include:

-   Creator photo or cinematic background
-   YouTube subscriber count
-   Social links
-   Main CTA
-   Secondary CTA

Example:

``` text
2.4M Subscribers
850+ Videos
```

Do not hardcode these values. They must be configurable.

------------------------------------------------------------------------

# 8. Homepage Sections

## Latest Video

Display the newest YouTube video.

Card:

``` text
Thumbnail
Category
Title
Short description
Published date
Views
[Watch]
```

## Featured Video

Large cinematic card.

## Popular Videos

Grid of 3--6 videos.

Filters:

-   Latest
-   Popular
-   Most viewed
-   Category

## Featured Products

Show products recommended by the creator.

Product card:

``` text
Image
Product name
Category
Short description
Creator's note
Price if available
[View Product]
```

## Creator Recommendations

Examples:

-   Cameras
-   Microphones
-   Laptops
-   AI tools
-   Software
-   Books
-   Courses
-   Services

## Latest Articles

Show 3--4 recent blog posts.

## Community Preview

Show recent public chat messages.

Example:

``` text
Community

Rahul
Amazing video!

Anu
Which microphone are you using?

John
Please make a Spring Boot tutorial.

[Join Community]
```

## Newsletter

``` text
Get new videos, tools and recommendations.

[Email]
[Subscribe]
```

## Footer

Include:

-   Creator logo
-   About
-   Navigation
-   Social links
-   Legal
-   Privacy
-   Terms
-   Affiliate disclosure
-   Copyright

------------------------------------------------------------------------

# 9. Video Module

Videos are one of the primary entities.

## Video listing page

Route:

``` text
/videos
```

Features:

-   Search
-   Category filters
-   Tag filters
-   Sort
-   Pagination or infinite scroll
-   Featured videos
-   Latest videos
-   Popular videos

Card fields:

``` text
thumbnail
title
description
category
tags
publishedAt
duration
viewCount
youtubeUrl
```

## Video details

Route:

``` text
/videos/:slug
```

Display:

``` text
YouTube embedded player

Title
Category
Published date
Views

Description

Products mentioned
Resources
Sponsor
Promo code

Related videos

Community comments
```

## Products associated with video

A video can have multiple products.

Example:

``` text
Video
 ├── Camera
 ├── Microphone
 ├── Laptop
 └── Lighting
```

------------------------------------------------------------------------

# 10. YouTube Integration

Admin should be able to paste:

``` text
https://www.youtube.com/watch?v=VIDEO_ID
```

The backend should extract the YouTube video ID.

Where API access is available, retrieve:

-   Title
-   Description
-   Thumbnail
-   Published date
-   Duration
-   View count
-   Like count where available
-   Channel information

The creator can then edit/override website-specific fields.

Do not make the website dependent on the YouTube API for every page
load.

Store synchronized data locally.

**Videos are linked, never uploaded.** The platform does not accept
direct video file uploads (no `.mp4`/media-file storage for video
content, and no video transcoding pipeline). Every video entity is
required to have a valid `youtubeUrl`/`youtubeVideoId`, and playback on
the public site always happens through the embedded YouTube player
(`iframe`, YouTube IFrame Player API, or `youtube-nocookie.com`
embed). Reject the Add/Edit Video form if a valid YouTube URL or video
ID is not supplied. This keeps hosting/bandwidth costs at zero and
keeps view counts consistent with the creator's real YouTube
analytics. See **Section 70 --- YouTube-Only Video Policy** for the
full validation and embed rules.

------------------------------------------------------------------------

# 11. Product / Recommendation System

Products should be generic enough to represent:

-   Physical products
-   Software
-   SaaS
-   Courses
-   Books
-   Digital products
-   Services
-   Creator's own products
-   Affiliate products

## Product fields

``` text
id
name
slug
description
shortDescription
image
category
type
brand
price
currency
officialUrl
affiliateUrl
amazonUrl
flipkartUrl
featured
active
creatorNote
rating
createdAt
updatedAt
```

## Product types

``` text
PHYSICAL
SOFTWARE
COURSE
BOOK
DIGITAL_PRODUCT
SERVICE
SUBSCRIPTION
CREATOR_PRODUCT
OTHER
```

------------------------------------------------------------------------

# 12. Product Details Page

Route:

``` text
/products/:slug
```

Display:

``` text
Product image

Product name

Recommended by [Creator]

Creator's opinion

Description

Price

Where to buy:
- Official website
- Amazon
- Flipkart
- Other

[View / Buy]

Videos featuring this product

Related products
```

Show an affiliate disclosure when relevant.

------------------------------------------------------------------------

# 13. Video ↔ Product Relationship

Create a many-to-many relationship.

``` text
Video
   ↕
VideoProduct
   ↕
Product
```

A product can appear in multiple videos.

Example:

``` text
Sony Camera
 ├── My YouTube Setup
 ├── Best Cameras 2026
 └── My Studio Tour
```

------------------------------------------------------------------------

# 14. Affiliate Link Tracking

Do not expose tracking implementation directly in the UI.

Generate internal links:

``` text
/go/:slug
```

Example:

``` text
/go/sony-camera
/go/my-microphone
/go/canva
```

Flow:

``` text
Visitor
   ↓
/go/sony-camera
   ↓
Record click
   ↓
Redirect to affiliate URL
```

Track:

-   Click timestamp
-   Product
-   Source page
-   Video
-   Campaign
-   Referrer where permitted
-   Device
-   Anonymous session

Do not collect unnecessary personal information.

------------------------------------------------------------------------

# 15. Sponsorship System

Create sponsors and campaigns separately.

## Sponsor

Fields:

``` text
id
companyName
logo
website
description
contactName
contactEmail
active
```

## Campaign

Fields:

``` text
id
sponsorId
name
description
startDate
endDate
promoCode
sponsorUrl
status
```

Campaigns can be associated with:

-   Videos
-   Products
-   Homepage
-   Blog posts

------------------------------------------------------------------------

# 16. Sponsor Display

Video page can display:

``` text
This video is sponsored by

[Company Logo]

Get 20% off with code

CREATOR20

[Visit Sponsor]
```

Admin controls whether this is displayed.

------------------------------------------------------------------------

# 17. Coupon / Promo Codes

Fields:

``` text
code
description
discountText
product
sponsor
campaign
startDate
endDate
active
```

Track clicks on coupon-related CTAs.

Do not claim conversion/revenue unless the external partner actually
provides reliable conversion data.

------------------------------------------------------------------------

# 18. Resources

Create a Resources section.

Examples:

``` text
AI Tools
Development Tools
YouTube Tools
Books
Courses
Websites
Creator Gear
```

Resource fields:

``` text
name
description
image
category
url
affiliateUrl
featured
active
creatorNote
```

------------------------------------------------------------------------

# 19. Blog / Articles

Route:

``` text
/blog
/blog/:slug
```

Features:

-   Rich text editor
-   Featured image
-   Categories
-   Tags
-   SEO metadata
-   Related videos
-   Related products
-   Draft/published status

Articles can complement YouTube videos.

------------------------------------------------------------------------

# 20. Events

For:

-   Workshops
-   Meetups
-   Webinars
-   Livestream announcements
-   Conferences

Fields:

``` text
title
description
image
startDate
endDate
location
registrationUrl
status
```

------------------------------------------------------------------------

# 21. About Page

Include:

-   Creator story
-   Biography
-   Skills/interests
-   Creator stats
-   Social links
-   Featured achievements
-   Contact CTA

------------------------------------------------------------------------

# 22. Contact / Business Enquiries

Create a professional business enquiry form.

Fields:

``` text
name
company
email
website
enquiryType
message
```

Enquiry types:

``` text
SPONSORSHIP
PRODUCT_PROMOTION
COLLABORATION
SPEAKING
MEDIA
OTHER
```

Admin can manage:

``` text
NEW
VIEWED
CONTACTED
CLOSED
SPAM
```

------------------------------------------------------------------------

# 23. Public Community Chat

Add a floating **Community Chat** button in the bottom-right corner.

This is NOT the AI chatbot.

It is a shared real-time public chat.

Everyone currently connected to the website sees the same public
conversation.

Example:

``` text
                    ┌──────────────────────────┐
                    │ 💬 Community Chat         │
                    ├──────────────────────────┤
                    │ Rahul                     │
                    │ Amazing video! 🔥         │
                    │                           │
                    │ Anu                       │
                    │ Which camera do you use?  │
                    │                           │
                    │ John                      │
                    │ Great tutorial!           │
                    ├──────────────────────────┤
                    │ Write a message...    ➤   │
                    └──────────────────────────┘
```

## Real-time technology

**Revised (no-code backend):** use a managed real-time database instead
of a self-hosted WebSocket/STOMP server, since there is no Java backend
process to host one.

``` text
Angular
   ↓
Firebase JS SDK (client-side, no server code)
   ↓
Firestore (or Realtime Database) "chatMessages" collection
   ↓
onSnapshot() listener pushes new messages to every connected client
```

-   Firestore/Realtime Database handle the "everyone sees the same
    live conversation" requirement natively — no WebSocket server,
    STOMP broker, or Redis pub/sub needed.
-   Security Rules (written once in the Firebase console, not
    application code) restrict who can write which fields — e.g. a
    user can only set `senderId` to their own Firebase Auth UID, and
    only the admin can delete/moderate messages.
-   Rate limiting is done with a Firestore Security Rule that checks
    the timestamp of the sender's last message, or with the free
    App Check + Firebase's built-in abuse protection — again, no
    custom server code.
-   Google Sheets/SheetDB is intentionally **not** used for chat: a
    sheet cannot push live updates to other users, and polling it
    fast enough to feel "real-time" would blow through SheetDB's
    request-rate limits almost immediately.

------------------------------------------------------------------------

# 24. Community Chat Features

MVP:

-   Real-time messages
-   Guest or registered users
-   User name
-   Timestamp
-   Creator badge
-   Delete message
-   Report message
-   Basic rate limiting

Phase 2:

-   Replies
-   Reactions
-   Pinned messages
-   Mentions
-   User profiles
-   Typing indicator
-   Online count
-   Moderation tools
-   Slow mode
-   Banned words
-   Temporary timeout
-   User bans

------------------------------------------------------------------------

# 25. Chat Moderation

Admin must be able to:

``` text
Delete message
Warn user
Timeout user
Ban user
Unban user
Pin message
Clear chat
Enable slow mode
Manage blocked words
```

Rate limiting should prevent spam.

Example:

``` text
Maximum 5 messages per 10 seconds per user/session
```

Use stricter limits for anonymous users.

------------------------------------------------------------------------

# 26. AI Assistant

Add a separate floating **AI Assistant**.

The AI assistant is private to each visitor.

Do not mix AI messages with public community messages.

## AI assistant purpose

It should answer questions about the creator's own content.

Knowledge sources:

``` text
Videos
Products
Resources
Blog posts
Events
About page
FAQ
Website pages
```

Example:

User:

``` text
Which microphone does the creator use?
```

Assistant:

``` text
The creator recommends the XYZ microphone.

It appears in:
- My YouTube Setup
- Studio Tour

[View Product]
```

------------------------------------------------------------------------

# 27. AI Assistant UI

Collapsed:

``` text
                    🤖
```

Expanded:

``` text
┌──────────────────────────────┐
│ 🤖 Creator Assistant      ×  │
├──────────────────────────────┤
│ Hi! What can I help you find?│
│                              │
│ [Find a video]               │
│ [Recommended products]       │
│ [Creator's tools]            │
│ [Resources]                  │
│                              │
│ Type a question...       ➤   │
└──────────────────────────────┘
```

Suggested questions should be configurable from admin.

------------------------------------------------------------------------

# 28. AI Architecture

Do not send the entire database blindly to the AI provider.

Implement a retrieval layer.

Basic architecture:

``` text
User Question
      ↓
AI Assistant API
      ↓
Query / Retrieval Service
      ↓
Search creator content
      ↓
Relevant videos/products/resources
      ↓
AI Provider
      ↓
Answer + structured links
```

For a more advanced version:

``` text
Content
   ↓
Chunking
   ↓
Embeddings
   ↓
Vector Store
   ↓
RAG Retrieval
   ↓
LLM
```

The AI should prioritize creator-owned data and clearly say when it does
not know something.

------------------------------------------------------------------------

# 29. AI Safety / Quality Rules

The assistant should:

-   Avoid inventing products
-   Avoid inventing videos
-   Only recommend products that exist in the creator database
-   Link to actual internal pages
-   Clearly distinguish creator recommendations from general knowledge
-   Refuse to claim personal use unless stored in creator data
-   Avoid exposing admin-only information
-   Never reveal private user information
-   Respect rate limits
-   Log anonymized usage metrics

------------------------------------------------------------------------

# 30. AI + Product Recommendations

This is a high-value feature.

User:

``` text
I need a microphone under ₹10,000.
```

The AI searches the creator's available recommendations.

Response:

``` text
Based on the creator's recommendations:

🎙️ XYZ Microphone
₹8,999

Why:
Good for voice recording and streaming.

[View Product]
```

The CTA must link to the product page or tracked outbound link.

------------------------------------------------------------------------

# 31. Admin Dashboard

Admin navigation:

``` text
Dashboard
Content
  ├── Videos
  ├── Categories
  ├── Blog
  ├── Resources
  └── Events

Commerce
  ├── Products
  ├── Affiliate Links
  ├── Sponsors
  ├── Campaigns
  └── Coupons

Community
  ├── Live Chat
  ├── Messages
  ├── Reports
  ├── Banned Users
  └── Blocked Words

AI Assistant
  ├── Settings
  ├── Knowledge Sources
  ├── Suggested Questions
  └── Chat Analytics

Marketing
  ├── Newsletter
  └── Subscribers

Analytics
  ├── Website
  ├── Videos
  ├── Products
  ├── Links
  └── Campaigns

Website
  ├── Pages
  ├── Media
  ├── SEO
  ├── Social Links
  └── Theme

Settings
  ├── Creator Profile
  ├── Users
  ├── Roles
  ├── Integrations
  └── Security
```

------------------------------------------------------------------------

# 32. Admin Dashboard Visual Design

The admin dashboard should use the SAME visual language as the public
site.

Dark mode:

``` text
Black background
Dark glass cards
Amber highlights
White text
Rounded cards
```

Light mode:

``` text
Warm off-white background
White cards
Dark text
Amber highlights
Soft shadows
```

Do not create a generic Bootstrap-looking admin dashboard.

------------------------------------------------------------------------

# 33. Admin Dashboard Overview

Cards:

``` text
Website Visitors
125,430

Video Views
1.8M

Product Clicks
24,530

Affiliate Clicks
12,340

Community Messages
8,420

Business Enquiries
42
```

Charts:

-   Website traffic
-   Video page views
-   Product clicks
-   Top products
-   Top videos
-   Chat activity
-   Enquiries
-   Referral sources

For the full activity/logistics log (every login, page/video/product
view, and purchase-intent event, per user and in aggregate), see
**Section 71 --- Admin Activity & Logistics Log**.

------------------------------------------------------------------------

# 34. Video Admin Form

Admin clicks:

``` text
Videos → Add Video
```

Fields:

``` text
YouTube URL
Title
Slug
Description
Thumbnail
Published Date
Duration
Category
Tags
Featured
Status
```

Associations:

``` text
Products mentioned
Resources
Sponsor
Campaign
Related videos
```

SEO:

``` text
Meta title
Meta description
OG image
Canonical URL
```

------------------------------------------------------------------------

# 35. Product Admin Form

Fields:

``` text
Name
Slug
Short description
Full description
Image
Category
Type
Brand
Price
Currency
Creator note
Official URL
Affiliate URL
Amazon URL
Flipkart URL
Featured
Active
```

Relationships:

``` text
Related videos
Related resources
Campaigns
Sponsors
```

------------------------------------------------------------------------

# 36. Media Library

Admin can upload and manage:

-   Images
-   Thumbnails
-   Logos
-   Documents
-   Product photos

Features:

-   Search
-   Filter
-   Upload
-   Preview
-   Delete
-   Copy URL
-   Select media from forms

Use Firebase Storage (or Cloudinary) for all media — never store
binary files in the Google Sheet/SheetDB. Save only the resulting
public URL in the relevant Sheet row (e.g. `Products.image`).

------------------------------------------------------------------------

# 37. Social Links

Admin can manage:

``` text
YouTube
Instagram
X
LinkedIn
GitHub
Discord
Telegram
Facebook
TikTok
Website
```

Each link:

``` text
platform
label
url
icon
displayOrder
active
```

------------------------------------------------------------------------

# 38. Website Customization

Admin can configure:

``` text
Creator name
Logo
Profile image
Hero image
Hero title
Hero description
CTA text
CTA URL

YouTube URL
Subscriber display
Social links

Footer text
Copyright

Theme accent
```

The core visual system should remain controlled so creators cannot
accidentally destroy the design.

------------------------------------------------------------------------

# 39. Search

Implement global search.

Search across:

``` text
Videos
Products
Resources
Blog
Events
```

Search results should show category/type.

Example:

``` text
Search: microphone

VIDEOS
  My YouTube Setup

PRODUCTS
  XYZ Microphone

RESOURCES
  Audio Setup Guide
```

------------------------------------------------------------------------

# 40. Authentication and Authorization (Revised --- Firebase Auth)

Roles:

``` text
SUPER_ADMIN
CREATOR
EDITOR
MODERATOR
ANALYST
USER
```

**Use Firebase Authentication instead of Spring Security** — there is
no Java backend to host Spring Security. Firebase handles
credential storage, hashing, session tokens, and password reset for
free, with no server code:

-   Roles other than the default `USER` are assigned as **Firebase
    Custom Claims** (set once, manually or via the Firebase console/
    CLI, for the handful of admin/staff accounts — the creator only
    ever has a few of these, so this doesn't need a self-service
    admin-invite flow to start).
-   Authorization is enforced two ways, neither of which needs a
    server you maintain:
    1.  **Firestore/Storage Security Rules** check the caller's
        Firebase custom claim before allowing chat moderation, media
        deletes, or audit-log reads.
    2.  **SheetDB protected-mode API key** is only ever loaded into
        the browser after Angular confirms (via the Firebase ID
        token) that the current user has an admin/editor claim — see
        Section 45's key-exposure notes.
-   Angular route guards are still **UX-only, not the real security
    boundary** — same principle as before, just enforced by Security
    Rules and the protected SheetDB key instead of a Spring Boot
    filter chain.

## Public self-registration (USER role)

In addition to admin/staff accounts, visitors can create their own
free account (`USER` role) via `/register` and `/login`, entirely
through the Firebase JS SDK:

-   Registration fields: name, email, password. Firebase handles
    hashing/storage — no BCrypt/Argon2 code to write.
-   Firebase's built-in email verification link before granting the
    logged-in discount benefit (prevents throwaway-account abuse).
-   Firebase's built-in password reset email flow.
-   Optional social login (Google Sign-In) is a one-line addition with
    Firebase Auth and can be added later as a convenience.
-   On first login, write a matching profile row to the `Users` tab
    in the Sheet (keyed by the Firebase UID) to hold anything SheetDB
    needs to join against — wishlist product IDs, discount-code claim
    history, etc. Firebase Auth stays the source of truth for
    identity/credentials; the Sheet stores everything else about the
    user.

See **Section 69 --- Member Accounts & Logged-In Discounts** for the
full discount mechanic tied to this role.

------------------------------------------------------------------------

# 41. Data Model --- Google Sheet Tabs (Replaces Database Entities)

Same entities as originally planned, but each one is now a **tab in
the Google Sheet** (accessed through SheetDB) instead of a PostgreSQL
table — except Chat and Audit Logs, which live in Firestore because
they're write-heavy/real-time (Sections 44, 53). One row = one record;
the first row of each tab is the header row SheetDB uses as field
names.

``` text
Google Sheet tabs (via SheetDB)
  Users              (profile fields synced from Firebase Auth UID)
  Creator
  CreatorSettings

  Videos
  VideoCategories
  VideoTags
  VideoTagRelations     (join tab: videoId, tagId)

  Products
  ProductCategories
  VideoProducts          (join tab: videoId, productId)

  Resources
  ResourceCategories

  Sponsors
  Campaigns
  Coupons

  BlogPosts
  Events

  SocialLinks

  Subscribers
  BusinessEnquiries

  AnalyticsEvents        (or Firestore — see note below)
  OutboundClicks

  SeoMetadata
  Pages
  WebsiteSettings

Firestore collections (not in the Sheet)
  chatMessages
  chatReports
  chatBans
  blockedWords
  auditLogs
  aiConversations         (only if the AI Assistant is built)
  aiMessages
```

## Relationships without a relational database

SheetDB tabs have no real foreign keys or joins. Model relationships
with **join tabs plus client-side lookups**:

-   `VideoProducts` tab with `videoId`/`productId` columns represents
    the Video↔Product many-to-many relationship (Section 13). The
    Angular service fetches both sides and joins them in memory.
-   One-to-many (e.g. Video → Category) is a plain foreign-key-style
    column (`categoryId`) on the child tab, resolved client-side
    against the parent tab.
-   There is no cascading delete. When an admin deletes a Product,
    the Angular admin service must also delete/clean up its rows in
    `VideoProducts`, `OutboundClicks`, etc. — do this explicitly in
    the delete handler, since SheetDB won't do it for you.

## Volume caveat

`AnalyticsEvents` and `OutboundClicks` can grow very large very fast
(every page/video/product view, Section 71). SheetDB has per-plan row
and request-rate limits, and Google Sheets itself gets slow/error-prone
past roughly 1–2 million cells. **Recommendation:** put
`AnalyticsEvents`/`OutboundClicks`/`AuditLogs` in **Firestore**
instead of the Sheet from day one (it's already in the stack for chat,
free tier is generous, and it's built for exactly this write pattern),
and keep the Sheet for the lower-volume, human-edited content
(Videos, Products, Sponsors, etc.). Export Firestore analytics to
CSV/Excel on demand for the creator's offline reporting (Section 71).

------------------------------------------------------------------------

# 42. Important Relationships

``` text
Creator
 ├── Videos
 ├── Products
 ├── Resources
 ├── BlogPosts
 ├── Events
 ├── Sponsors
 ├── Campaigns
 ├── SocialLinks
 └── WebsiteSettings

Video
 ├── Category
 ├── Tags
 ├── Products
 ├── Resources
 ├── Sponsor
 ├── Campaign
 └── Related Videos

Product
 ├── Category
 ├── Videos
 ├── Campaigns
 └── Outbound Clicks
```

------------------------------------------------------------------------

# 43. Data API Structure (Revised --- No Custom Backend)

There is no custom REST server. Instead, the Angular app talks
directly to managed services:

## Content data (Videos, Products, Resources, Blog, Events, Sponsors,
## Campaigns, Coupons, SocialLinks, Enquiries)

Served by **SheetDB** (or Sheety), which auto-generates a REST API
from a Google Sheet. One Google Sheet = the whole database; one tab =
one entity (see Section 68).

``` text
GET    https://sheetdb.io/api/v1/<SHEET_ID>?sheet=Videos
GET    https://sheetdb.io/api/v1/<SHEET_ID>/search?sheet=Videos&slug=my-video
POST   https://sheetdb.io/api/v1/<SHEET_ID>?sheet=Videos
PATCH  https://sheetdb.io/api/v1/<SHEET_ID>/slug/my-video?sheet=Videos
DELETE https://sheetdb.io/api/v1/<SHEET_ID>/slug/my-video?sheet=Videos
```

The same pattern repeats for every tab: `Products`, `Resources`,
`BlogPosts`, `Events`, `Sponsors`, `Campaigns`, `Coupons`,
`SocialLinks`, `Enquiries`, `AnalyticsEvents`.

Wrap these calls in a small set of Angular services (`VideosApiService`,
`ProductsApiService`, etc.) so the rest of the app never calls SheetDB
directly — this keeps the door open to swap SheetDB for something else
later without touching every component.

## Authentication

Handled entirely by **Firebase Authentication** (see Section 40) using
the Firebase JS SDK directly from Angular — there are no
`/api/v1/auth/*` endpoints to build:

``` text
firebase.auth().createUserWithEmailAndPassword(email, password)
firebase.auth().signInWithEmailAndPassword(email, password)
firebase.auth().signOut()
firebase.auth().sendPasswordResetEmail(email)
```

## Admin content editing

The admin dashboard uses the **same SheetDB endpoints** as the public
site, just with write methods (`POST`/`PATCH`/`DELETE`) gated behind
the Firebase-authenticated admin/editor role in the Angular route
guards **and** a SheetDB "protected mode" API key that is only ever
used from the logged-in admin session (see Section 68's security
notes — this is the one place the "never put secrets in the frontend"
rule needs a pragmatic compromise, since there is no server to hide
the key behind).

------------------------------------------------------------------------

# 44. Public Community Chat --- Firestore Realtime API

Replaces the original STOMP/WebSocket design (Section 23 has the
diagram).

``` text
Angular subscribes:
  onSnapshot(collection(db, 'chatMessages'), ...)

Angular sends a message:
  addDoc(collection(db, 'chatMessages'), {
    content: 'Great video!',
    senderUid: auth.currentUser.uid,
    displayName: auth.currentUser.displayName,
    createdAt: serverTimestamp()
  })
```

Every connected browser receives new messages instantly through the
Firestore listener — no server broadcast step to build.

``` text
Stored document shape:
{
  id: "auto-id",
  senderUid: "firebase-uid",
  displayName: "Rahul",
  content: "Great video!",
  createdAt: <server timestamp>,
  isCreator: false
}
```

**Never trust a client-supplied `isCreator` flag.** Set it via a
Firestore Security Rule that checks the sender's UID against the
single known creator/admin UID (or a custom claim set through the
Firebase console) — the rule engine is the "backend logic" here,
written declaratively, not as application code.

------------------------------------------------------------------------

# 45. Security Requirements (Revised --- No Custom Backend)

With no Java server, "security" mostly means correctly configuring
managed services rather than writing security code:

-   Password hashing/authentication --- handled entirely by Firebase
    Authentication; the app never sees or stores raw passwords.
-   Authorization --- enforced by **Firestore/Storage Security
    Rules** (chat, saved media) and by **SheetDB's read-only vs
    protected-mode API keys** (content data). Angular route guards are
    still UX-only, same principle as before.
-   CORS --- configured in the SheetDB/Sheety and Firebase project
    dashboards, not in application code.
-   Rate limiting --- Firebase App Check + Firestore Security Rules
    for chat; SheetDB's built-in per-key rate limits for content
    writes.
-   Input validation / XSS / HTML sanitization --- still needed and
    still done in Angular (Reactive Forms validators, Angular's
    built-in HTML sanitizer) since there is no server layer to also
    validate on. This is the one area where a missing backend
    genuinely reduces defense-in-depth — be extra careful with
    anything rendered with `[innerHTML]`.
-   File upload validation (type/size) --- enforced through Firebase
    Storage Security Rules (`request.resource.size`,
    `request.resource.contentType`), not server code.
-   Admin audit logs --- written as rows to an `AuditLog` sheet tab
    (or a Firestore collection, which is better suited to
    high-frequency writes) whenever an admin action happens.

## Key exposure --- what's actually safe to put in Angular here

-   **YouTube Data API key** --- safe to embed in the Angular build if
    it is restricted (in the Google Cloud Console) to your website's
    HTTP referrer and to the YouTube Data API only.
-   **Firebase config object** (`apiKey`, `projectId`, etc.) --- this
    is meant to be public; Firebase's real security boundary is its
    Security Rules, not this config.
-   **SheetDB read-only API key** --- safe to embed for `GET` calls to
    public tabs (Videos, Products, etc.).
-   **SheetDB protected/write API key** --- must never ship in the
    public bundle. Load it only after a Firebase-authenticated
    admin session, e.g. from a small config document the admin's
    logged-in client fetches (itself gated by a Firestore Security
    Rule that only the `admin`/`editor` role can read).
-   **AI provider key (Anthropic/OpenAI, if the AI Assistant feature
    is built)** --- this is the one credential that genuinely cannot
    be made safe in a pure-frontend app; see Section 68's note on the
    AI Assistant exception.

Never expose the SheetDB write key or the AI provider key in the
compiled Angular bundle.

------------------------------------------------------------------------

# 46. SEO

Every public page should support:

``` text
title
meta description
canonical URL
Open Graph title
Open Graph description
Open Graph image
Twitter/X card
structured data where appropriate
```

Use SEO-friendly URLs:

``` text
/videos/my-ai-saas
/products/sony-camera
/blog/how-i-built-an-ai-saas
```

Generate sitemap.

Generate robots.txt.

Use server-side rendering/prerendering if SEO is important for the
Angular deployment.

------------------------------------------------------------------------

# 47. Responsive Design

Desktop:

-   Large asymmetric dashboard-like layouts
-   Floating cards
-   Wide hero

Tablet:

-   2-column grids
-   Smaller cards

Mobile:

-   Single-column layout
-   Compact header
-   Bottom-right chat buttons must not cover important controls
-   Chat becomes almost full-width modal/drawer
-   Product cards become horizontal or stacked
-   Video cards use 1-column layout

Test:

``` text
320px
375px
430px
768px
1024px
1280px
1440px
1920px
```

------------------------------------------------------------------------

# 48. Accessibility

Implement:

-   Keyboard navigation
-   Focus states
-   Semantic HTML
-   Accessible labels
-   Alt text
-   ARIA only where required
-   Sufficient contrast
-   Reduced motion preference
-   Accessible chat controls
-   Accessible dialogs

------------------------------------------------------------------------

# 49. Loading / Empty / Error States

Every major component needs:

## Loading

Use skeleton cards.

## Empty

Example:

``` text
No videos found.

Try another category or search term.
```

## Error

``` text
Something went wrong.

[Try Again]
```

Do not leave blank screens.

------------------------------------------------------------------------

# 50. Recommended Angular Structure

Example:

``` text
src/app/

core/
  auth/
  guards/
  interceptors/
  services/
  models/

shared/
  components/
  directives/
  pipes/
  ui/

features/

  public/
    home/
    videos/
    products/
    resources/
    blog/
    events/
    about/
    contact/
    search/

  community/
    chat/

  ai-assistant/
    chat-widget/

  admin/
    dashboard/
    videos/
    products/
    resources/
    sponsors/
    campaigns/
    coupons/
    blog/
    events/
    community/
    ai/
    analytics/
    media/
    seo/
    settings/
```

Use lazy-loaded routes.

------------------------------------------------------------------------

# 51. Data/Integration Service Layer (Replaces Spring Boot Structure)

There is no Java backend to structure. Instead, put a clean layer of
Angular **injectable services** between components and the managed
services (SheetDB, Firebase, YouTube API), so no component ever calls
`fetch`/Firebase SDK directly:

``` text
src/app/core/data/

  sheetdb/
    sheetdb-client.service.ts     (thin wrapper: base URL, API key, error normalization)
    videos-api.service.ts
    products-api.service.ts
    resources-api.service.ts
    blog-api.service.ts
    events-api.service.ts
    sponsors-api.service.ts
    campaigns-api.service.ts
    coupons-api.service.ts
    enquiries-api.service.ts
    analytics-api.service.ts

  firebase/
    auth.service.ts                (register/login/logout/reset)
    chat.service.ts                (Firestore chatMessages listeners + send)
    storage.service.ts             (media upload/delete)

  youtube/
    youtube.service.ts             (metadata lookup via YouTube Data API)

  ai/
    ai-assistant.service.ts        (calls the small AI proxy — Section 68)
```

Keep domain concerns separated the same way the original Spring Boot
module list did (`video`, `product`, `community`, `ai`, `analytics`,
etc.) — it's just Angular services instead of Java packages now.

Avoid one giant "ApiService" god-class; one service per entity/concern
mirrors the original design intent.

------------------------------------------------------------------------

# 52. Error Handling (Client-Side, No Global Exception Handler)

There is no server to centralize error formatting, so normalize errors
inside the Angular data-service layer (Section 51) instead — every
SheetDB/Firebase/YouTube call is wrapped so components always receive
the same shape regardless of which service failed:

``` json
{
  "timestamp": "...",
  "source": "sheetdb | firebase | youtube | ai-proxy",
  "code": "VALIDATION_ERROR",
  "message": "Invalid request",
  "errors": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ]
}
```

-   Do client-side validation (Reactive Forms validators) *before*
    ever calling SheetDB, since SheetDB itself won't validate your
    business rules (required fields, slug uniqueness, price format,
    etc.) the way a JPA/Bean Validation layer would.
-   Catch and translate raw SheetDB/Firebase error responses into the
    shape above in `sheetdb-client.service.ts` / `auth.service.ts` so
    UI components never branch on a third-party error format.

------------------------------------------------------------------------

# 53. Audit Logging (No Backend --- Client-Written Log Rows)

Admin changes should still be auditable, even without a server to
enforce it centrally. Write an audit row from the Angular admin app
immediately after every successful create/update/delete call:

``` text
user
action
entity
entityId
timestamp
before/after summary
```

Example:

``` text
Creator edited product

Product: Sony Camera
Admin: creator@example.com
Time: 2026-08-24 08:30
```

Store these rows in a Firestore `auditLogs` collection rather than a
Sheet tab — audit entries are write-heavy and append-only, which
Firestore handles far better than SheetDB's row-based API (see
Section 68). Restrict read access to `admin`/`SUPER_ADMIN` roles via a
Firestore Security Rule.

Avoid storing sensitive information unnecessarily. Because this log is
written by the client rather than a trusted server, treat it as a
best-effort audit trail, not a tamper-proof one — a compromised admin
browser could in theory skip writing a row. This is an accepted
trade-off of the no-backend architecture; flag it to the creator.

------------------------------------------------------------------------

# 54. Analytics Event Model

Use an event-oriented model.

Events:

``` text
PAGE_VIEW
VIDEO_VIEW
YOUTUBE_CLICK
PRODUCT_VIEW
AFFILIATE_CLICK
RESOURCE_CLICK
SPONSOR_CLICK
COUPON_CLICK
CHAT_MESSAGE
AI_QUESTION
AI_PRODUCT_RECOMMENDATION
CONTACT_SUBMITTED
NEWSLETTER_SUBSCRIBE
```

Store aggregate metrics for dashboard performance.

Do not query millions of raw events for every dashboard request.

------------------------------------------------------------------------

# 55. Suggested Public Routes

``` text
/
/videos
/videos/:slug

/products
/products/:slug

/recommendations
/resources
/resources/:slug

/blog
/blog/:slug

/events
/events/:slug

/about
/contact

/search

/privacy
/terms
/affiliate-disclosure
```

------------------------------------------------------------------------

# 56. Suggested Admin Routes

``` text
/admin
/admin/dashboard

/admin/videos
/admin/videos/new
/admin/videos/:id/edit

/admin/products
/admin/products/new
/admin/products/:id/edit

/admin/resources
/admin/sponsors
/admin/campaigns
/admin/coupons

/admin/blog
/admin/events

/admin/community
/admin/community/reports
/admin/community/bans

/admin/ai
/admin/ai/knowledge
/admin/ai/settings

/admin/analytics
/admin/media
/admin/seo
/admin/settings
```

------------------------------------------------------------------------

# 57. Homepage Visual Layout

Follow the reference mockup's asymmetric card layout.

Example:

``` text
┌──────────────────────────────────────────────────────────────┐
│ LOGO       Home Videos Products ...        Search Theme User │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│             LARGE CINEMATIC HERO IMAGE                       │
│                                                              │
│             Hi, I'm [Creator]                                │
│             I create videos about...                          │
│                                                              │
│             [Watch Latest] [Recommendations]                 │
│                                                              │
├───────────────────────────┬──────────────────────────────────┤
│                           │                                  │
│ Latest Video              │ Featured Product                 │
│                           │                                  │
│ [Large thumbnail]         │ [Product image]                  │
│                           │                                  │
├───────────────────────────┼──────────────────────────────────┤
│ Popular Videos            │ Community                        │
│                           │                                  │
│ [Card] [Card] [Card]      │ Recent messages                  │
│                           │                                  │
├───────────────────────────┴──────────────────────────────────┤
│ Recommended Tools / Resources                                │
├──────────────────────────────────────────────────────────────┤
│ Latest Articles                                               │
└──────────────────────────────────────────────────────────────┘
```

Do not copy the exact mockup content. Use its visual composition and
styling language.

------------------------------------------------------------------------

# 58. Floating Widgets

Bottom-right should contain:

``` text
🤖 AI Assistant
💬 Community Chat
```

Do not let both large panels open simultaneously.

When one opens, minimize the other.

On mobile, open the selected widget as a bottom sheet/full-height
drawer.

------------------------------------------------------------------------

# 59. Theme Toggle

Header:

``` text
☀ / ☾
```

Behavior:

``` text
Dark
 ↕
Light
```

Use CSS variables.

Do not duplicate entire component styles for both themes.

------------------------------------------------------------------------

# 60. Creator Profile Model

Creator:

``` text
id
name
username
displayName
bio
shortBio
profileImage
heroImage
youtubeChannelId
youtubeUrl
subscriberCount
videoCount
location
email
website
active
```

Public values can be displayed based on privacy settings.

------------------------------------------------------------------------

# 61. Multi-Creator Future Architecture

Even if version 1 has one creator, add:

``` text
creator_id
```

to creator-owned entities.

For example:

``` text
Video
Product
Resource
BlogPost
Event
Sponsor
Campaign
```

This makes future multi-tenancy much easier.

Future structure:

``` text
Platform
 ├── Creator A
 │    ├── Website
 │    ├── Videos
 │    └── Products
 │
 ├── Creator B
 │    ├── Website
 │    ├── Videos
 │    └── Products
 │
 └── Creator C
```

------------------------------------------------------------------------

# 62. MVP Scope

Do NOT build everything at once.

## Phase 1 --- Core

Build:

-   Public homepage
-   Videos
-   Video details
-   Products
-   Product details
-   About
-   Contact
-   Admin login
-   Public user self-registration/login (Section 69)
-   Admin dashboard
-   Video CRUD (YouTube-link-only, Section 70)
-   Product CRUD, incl. member-discount fields (Section 72)
-   Category CRUD
-   Theme system
-   Responsive design
-   Google Sheet + SheetDB set up, Firebase project set up (Section 68)

## Phase 2 --- Monetization

Add:

-   Affiliate links
-   Outbound click tracking
-   Sponsors
-   Campaigns
-   Promo codes
-   Resources
-   Analytics
-   Admin activity/logistics log (Section 71, in Firestore)
-   Optional admin export-to-Excel/CSV for offline reporting (Section
    68)

## Phase 3 --- Community

Add:

-   Public real-time chat
-   Reactions
-   Reports
-   Moderation
-   Bans
-   Pinned messages

## Phase 4 --- AI

Add:

-   AI assistant
-   Knowledge retrieval
-   Product recommendations
-   Video recommendations
-   AI analytics

## Phase 5 --- Growth

Add:

-   Blog
-   Newsletter
-   Events
-   SEO tools
-   YouTube synchronization
-   Advanced analytics

## Phase 6 --- SaaS

Add:

-   Multiple creators
-   Creator onboarding
-   Subscription plans
-   Custom domains
-   Themes
-   Billing
-   Tenant isolation

------------------------------------------------------------------------

# 63. Development Order

Recommended order for an AI coding agent:

### Step 1

Create project architecture (Angular app + Google Sheet/SheetDB setup
+ Firebase project — no backend project to scaffold).

### Step 2

Implement theme system.

### Step 3

Build public shell/header/footer.

### Step 4

Build homepage.

### Step 5

Build video module.

### Step 6

Build product module.

### Step 7

Build admin authentication (Firebase Auth + custom claims).

### Step 8

Build admin dashboard.

### Step 9

Connect video/product CRUD to SheetDB.

### Step 10

Add affiliate tracking (writes to Firestore/AnalyticsEvents).

### Step 11

Add sponsors/campaigns.

### Step 12

Add public chat with Firestore real-time listeners.

### Step 13

Add AI assistant (with its small proxy exception, Section 68) — or
skip if deferred.

### Step 14

Add analytics.

### Step 15

Add SEO.

### Step 16

Add testing and deployment (static hosting — Firebase
Hosting/Netlify/Vercel).

------------------------------------------------------------------------

# 64. Important AI Coding Agent Rules

When giving this specification to an AI coding agent, tell it:

1.  Do not generate the entire application in one step.
2.  Build feature-by-feature.
3.  Keep frontend and backend cleanly separated.
4.  Use reusable components.
5.  Do not hardcode creator data into components.
6.  Use API services.
7.  Use environment variables.
8.  Use database migrations.
9.  Add validation.
10. Add error handling.
11. Add loading and empty states.
12. Make the application responsive.
13. Support dark and light themes from the beginning.
14. Do not use placeholder lorem ipsum in final UI.
15. Do not create a generic Bootstrap dashboard.
16. Follow the supplied visual reference.
17. Use the warm amber accent consistently.
18. Use rounded glass-style cards.
19. Keep animations subtle.
20. Never put SheetDB write keys or AI provider keys in the compiled
    Angular bundle (Section 45); the Firebase config and SheetDB
    read-only key are fine to include.
21. Do not write a custom backend server (no Java, no Spring Boot, no
    self-hosted API) — all data/auth/chat go through SheetDB and
    Firebase as specified in Sections 2, 40, 41, and 68.

------------------------------------------------------------------------

# 65. Suggested AI Coding Prompt

Use this as the first prompt for an AI coding agent:

``` text
You are a senior frontend architect and developer.

Build a production-quality YouTuber Creator Website and Creator Management Platform
with NO custom backend server — no Java, no Spring Boot, no self-hosted API of any kind.

Technology:
- Angular + TypeScript + SCSS
- Google Sheets as the database, exposed via SheetDB (or Sheety)
- Firebase Authentication for login/registration
- Firebase Firestore for real-time community chat and analytics/audit logs
- Firebase Storage (or Cloudinary) for media uploads
- YouTube Data API called directly from the client
- Static hosting (Firebase Hosting / Netlify / Vercel)

The supplied UI reference should be treated as the visual design inspiration.

Visual style:
- Premium
- Cinematic
- Dark charcoal/black
- Warm amber/gold accent
- Glassmorphism
- Large rounded cards
- Soft borders
- Subtle shadows
- Modern typography
- Responsive
- Also provide a carefully designed light theme

Do not create a generic Bootstrap-style website.

The platform has:
1. Public creator website
2. Admin dashboard
3. Public real-time community chat (Firestore)
4. Private AI assistant (optional — needs a small hosted proxy for the API key, see spec Section 68)
5. Video management (YouTube links only, no video uploads)
6. Product/recommendation management, incl. logged-in member discounts
7. Affiliate link tracking
8. Sponsors
9. Campaigns
10. Coupons
11. Resources
12. Blog
13. Events
14. Analytics + admin activity/logistics log
15. SEO
16. Media library
17. Contact/business enquiries

Start by creating the folder structure and the Google Sheet tab layout / Firestore
collection layout (Section 41 of the spec), not a SQL schema.

Do not implement all features at once.

First:
1. Inspect the requirements.
2. Propose the Angular folder structure (Section 51 of the spec).
3. Propose the Google Sheet tab layout and Firestore collection layout.
4. Propose the SheetDB/Firebase service boundaries (which Angular service calls what).
5. Propose the Angular routing structure.
6. Propose the design token system.
7. Then implement Phase 1 only.

Wait for confirmation before moving to Phase 2.

All UI must be responsive.
All public content must come from SheetDB/Firebase, never hardcoded.
No creator-specific content should be hardcoded.
Use Angular environment files for config; never ship the SheetDB write key or any AI provider key in the client bundle.
Use Reactive Forms validation on every write, since there is no server-side validation layer.
Use proper client-side error handling and error normalization (Section 52 of the spec).
Use reusable components.
Use lazy-loaded Angular features.
Enforce authorization with Firebase custom claims + Firestore/Storage Security Rules, not just Angular route guards.
```

------------------------------------------------------------------------

# 66. Definition of Done

The project is considered complete only when:

## UI

-   [ ] Dark theme works
-   [ ] Light theme works
-   [ ] Responsive mobile layout works
-   [ ] Desktop layout follows reference visual language
-   [ ] Cards have consistent radius
-   [ ] Amber accent is consistent
-   [ ] Loading states exist
-   [ ] Empty states exist
-   [ ] Error states exist
-   [ ] Accessibility basics are implemented

## "Backend" (managed services, no custom server)

-   [ ] Firebase Authentication registration/login/logout/reset work
-   [ ] Firebase custom claims correctly gate admin/editor actions
-   [ ] SheetDB read-only key works for all public reads
-   [ ] SheetDB protected/write key is never present in the public
        bundle and is only loaded for authenticated admin sessions
-   [ ] CRUD against every Sheet tab works (Section 72)
-   [ ] Client-side (Reactive Forms) validation works on every write
-   [ ] Normalized client-side error handling works (Section 52)
-   [ ] Firestore/Storage Security Rules deployed and tested
-   [ ] Audit log rows written to Firestore for every admin action
-   [ ] Google Sheet tab layout documented (replaces DB migrations —
        there is no schema migration tool for a spreadsheet, so
        column changes must be made and documented by hand)

## Videos

-   [ ] Add video
-   [ ] Edit video
-   [ ] Delete/archive video
-   [ ] Search
-   [ ] Filter
-   [ ] Categories
-   [ ] Related videos
-   [ ] Product associations

## Products

-   [ ] CRUD
-   [ ] Categories
-   [ ] Product details
-   [ ] Affiliate links
-   [ ] Video associations
-   [ ] Click tracking

## Community

-   [ ] Firestore real-time chat
-   [ ] Public messages
-   [ ] Moderation
-   [ ] Reports
-   [ ] Rate limiting

## AI

-   [ ] Private conversations
-   [ ] Creator knowledge retrieval
-   [ ] Video recommendations
-   [ ] Product recommendations
-   [ ] Rate limiting
-   [ ] No hallucinated creator data

## Analytics

-   [ ] Page views
-   [ ] Video views
-   [ ] Product views
-   [ ] Affiliate clicks
-   [ ] Sponsor clicks
-   [ ] Chat metrics
-   [ ] AI usage metrics

------------------------------------------------------------------------

# 67. Final Product Vision

The final experience should feel like:

``` text
              CREATOR WEBSITE
                    │
       ┌────────────┼────────────┐
       │            │            │
     Videos      Products     Resources
       │            │            │
       └────────────┼────────────┘
                    │
             CREATOR CONTENT
                    │
       ┌────────────┴────────────┐
       │                         │
   COMMUNITY                 AI ASSISTANT
     CHAT                         │
       │                          │
       └──────────────┬───────────┘
                      │
                 ANALYTICS
                      │
               CREATOR ADMIN
                      │
       ┌──────────────┼──────────────┐
       │              │              │
    Content        Monetization    Community
       │              │              │
    Videos        Affiliate       Chat
    Products      Sponsors        Moderation
    Blog          Campaigns
    Resources     Coupons
```

The website should ultimately become more than a YouTube portfolio.

It should be a **creator's digital headquarters**:

> **Content + Community + Products + Sponsors + Affiliate Revenue + AI +
> Analytics**

That architecture also leaves a clear path to turn the project into a
multi-creator SaaS later.

------------------------------------------------------------------------

# 68. Data Backend --- Google Sheets via SheetDB (Final Decision)

**Decision:** no custom backend of any kind (confirmed — no Java, no
Spring Boot, no self-hosted server). The live database is a **Google
Sheet exposed as a REST API through SheetDB** (Sheety is an equivalent
alternative if SheetDB's pricing/limits don't fit). This supersedes
the earlier PostgreSQL recommendation everywhere else in this
document.

## How it works

1.  Create one Google Sheet with one tab per entity (Section 41's tab
    list) — first row = column headers, which become JSON field names.
2.  Connect it at [sheetdb.io](https://sheetdb.io): SheetDB gives back
    a base URL like `https://sheetdb.io/api/v1/abcd1234efgh`.
3.  Angular's data services (Section 51) call that URL with query
    params to target a specific tab/sheet, e.g.
    `?sheet=Products`.
4.  SheetDB supports `GET` (list/search), `POST` (create), `PATCH`
    (update by column match), and `DELETE` — enough for full CRUD
    (Section 72) with zero backend code.

## Two API keys, two trust levels

SheetDB supports a **read-only key** and a **protected/write key**:

-   **Read-only key** — safe to ship in the public Angular bundle.
    Used for every public page (video list, product list, etc.).
-   **Protected/write key** — grants `POST`/`PATCH`/`DELETE`. This
    must **never** appear in the compiled bundle. Load it only inside
    the admin app, only after Firebase confirms the logged-in user has
    an admin/editor custom claim (Section 40), and keep the admin
    build on a separate route/lazy-chunk so it isn't fetched by
    anonymous visitors. This is the practical, no-backend equivalent
    of "the server enforces authorization."

## Known limitations to set expectations with the creator

-   **No transactions.** Two simultaneous admin edits to the same row
    can overwrite each other (SheetDB/Sheets has no row-locking). Fine
    for a single creator managing their own content; flag it if a
    second admin/editor is added.
-   **No real relational integrity.** Deleting a Product does not
    cascade to `VideoProducts`/`OutboundClicks` rows that reference
    it — the Angular admin delete flow must clean those up explicitly
    (Section 41).
-   **Rate limits.** SheetDB's free/lower tiers cap requests per
    month/minute. High-frequency data (every page view, every chat
    message) must **not** go through SheetDB — that's why Section 41
    routes `AnalyticsEvents`/`OutboundClicks` and all of chat to
    Firestore instead, keeping the Sheet for content that only the
    admin edits by hand.
-   **The sheet itself must stay private.** Do not set the Google
    Sheet to "Anyone with the link can view/edit" — SheetDB reads/
    writes through its own API layer using your API keys, so the
    underlying sheet can and should stay restricted to your Google
    account. The public-facing surface is the SheetDB API key, not a
    Drive share link, which avoids the exposure risk of the originally
    proposed raw Drive-link approach.
-   **Passwords never go in the Sheet.** Firebase Authentication
    (Section 40) owns credentials entirely; the `Users` tab only ever
    stores non-secret profile data (display name, wishlist, discount
    history) keyed by Firebase UID.

## The AI Assistant exception

If the AI Assistant is built, it needs to call an LLM provider with a
secret API key — something no purely client-side app can do safely.
Without writing/hosting a Java backend, the pragmatic no-code options,
in order of preference, are:

1.  **Skip it for MVP** (it's already Phase 4 in Section 62 — easy to
    defer without losing any other feature).
2.  **A one-click hosted proxy function** — a single small function on
    a serverless platform (e.g. a Cloudflare Worker or a Vercel/Netlify
    Function) that does nothing but forward the request and attach the
    secret key. This is a few lines of boilerplate deployed through a
    dashboard, not an application you build and maintain — closer to
    "configuration" than "backend coding," but it is technically a
    small piece of server-side code, so flag it to the creator as the
    one deliberate exception to "zero backend code."
3.  **A no-code automation platform webhook** (Make.com, Pipedream,
    n8n cloud) configured through a visual builder to call the AI
    provider and return the response — avoids writing any code at all,
    at the cost of higher latency and a usage-based pricing tier on
    that platform.

## Spreadsheet-editing convenience (optional, on top of SheetDB)

Because SheetDB *is* the live Google Sheet, the creator already gets
the "edit in Excel/Sheets" convenience that was originally requested —
editing a row in Google Sheets updates the live site immediately (may
need a manual "Refresh cache" if SheetDB's caching is enabled). A
formal export-to-Excel button in the admin dashboard is still useful
for offline backups/reporting (Section 71) but is no longer required
just to get spreadsheet-style editing.

------------------------------------------------------------------------

# 69. Member Accounts & Logged-In Discounts

Building on the `USER` role and self-registration flow in Section 40.

## Discount mechanic

-   Selected products (or categories/campaigns) can be flagged as
    `memberDiscountEligible = true` with a `memberDiscountPercent`
    (default suggestion: 10%).
-   The discount applies only to a verified, logged-in `USER` --- an
    anonymous visitor sees the standard price and a banner:
    `"Log in to unlock 10% off this product"`.
-   Because most products link out to an external retailer
    (Amazon/Flipkart/official site) rather than a checkout on this
    site, the discount is most often delivered as a **member-only
    promo code** (reusing the Coupon model from Section 17) that is
    revealed/copied only after login, rather than a live price
    change. Where the creator does sell directly (Digital
    Product/Course/Subscription types), the discounted price can be
    computed and shown directly on `/products/:slug`.
-   Track discount reveals and redemptions as their own
    `AnalyticsEvent` types (`MEMBER_DISCOUNT_VIEWED`,
    `MEMBER_DISCOUNT_CLICKED`) so the admin dashboard can report how
    much the perk drives registrations.

## New/updated fields

``` text
Product
  memberDiscountEligible: boolean
  memberDiscountPercent: number
  memberDiscountCode: string (nullable)

User
  id
  name
  email (unique)
  passwordHash
  emailVerified: boolean
  role (default USER)
  createdAt
  lastLoginAt
```

## Admin controls

-   Toggle "Member discount" per product/category on the Product Admin
    Form (Section 35).
-   Set the global default discount percentage in
    Settings → Security/Commerce.
-   View member growth and discount engagement under
    Analytics → Members (new tab alongside the existing Analytics
    tabs in Section 31).

------------------------------------------------------------------------

# 70. YouTube-Only Video Policy

-   The **only** supported way to add a video is by pasting a YouTube
    URL or video ID (Section 10). There is no file-upload field for
    video content anywhere in the admin UI.
-   Accepted URL formats:
    `youtube.com/watch?v=...`, `youtu.be/...`, `youtube.com/shorts/...`,
    and `youtube.com/embed/...` --- all normalized to a single
    `youtubeVideoId`.
-   Validate the ID against the YouTube Data API (video exists, is
    public/unlisted, and belongs to the creator's channel if that
    check is desired) before saving.
-   Playback everywhere on the public site uses the YouTube embedded
    player, never a self-hosted `<video>` tag.
-   Object storage (Section 36, Media Library) is used only for
    thumbnails/OG images/product photos --- never for video files.

------------------------------------------------------------------------

# 71. Admin Activity & Logistics Log

Extends the Analytics Event Model (Section 54) and Admin Dashboard
Overview (Section 33) with a detailed, filterable activity log the
admin can actually drill into, not just aggregate cards.

## What is tracked

``` text
Auth events
  - Registration
  - Login (success/failure)
  - Logout
  - Password reset requested/completed

Browsing events
  - Page view (path, referrer, device, session)
  - Video view (video id, watch-through if available via YouTube API)
  - Product view (product id)
  - Search performed (query, result count)

Commerce/intent events
  - Outbound "Buy/View Product" click (Section 14, /go/:slug)
  - Member discount code viewed/copied
  - Coupon CTA clicked
  - Affiliate/sponsor link clicked

Community & engagement
  - Chat message sent
  - Newsletter subscribe
  - Business enquiry submitted
```

## Admin Logistics page

New admin route: `/admin/analytics/activity`

``` text
Filters: date range, event type, user (logged-in vs anonymous),
         product, video, campaign

Table columns:
  Timestamp | Event type | User (or "Guest") | Target
  (video/product/page) | Source/referrer | Device

Summary cards (per selected range):
  Unique visitors      | Logins            | New registrations
  Total page views     | Video views       | Product views
  Outbound/buy clicks  | Discount reveals  | Chat messages
```

-   Every table row is exportable to CSV/Excel for the creator's own
    offline analysis (this is the recommended way to satisfy an
    "Excel export" need without making Excel the live backend --- see
    Section 68).
-   Aggregate charts (trend over time, top products, top videos,
    funnel from view → click → discount-code copy) reuse the charts
    pattern already defined in Section 33.
-   Respect privacy: log a hashed/anonymous session ID for guests,
    never store raw IP addresses long-term, and let logged-in users
    see (and request deletion of) their own activity history.

------------------------------------------------------------------------

# 72. Full Edit/CRUD for All Uploaded Content

All creator-managed entities must support full Create/Read/Update/
Delete (or soft-delete/archive) from the admin dashboard, not just
creation:

``` text
Videos      -> Add, Edit, Archive, Restore, Bulk edit category/tags
Products    -> Add, Edit, Archive, Restore, Bulk edit price/discount
Categories  -> Add, Edit, Merge, Delete (only if unused)
Media       -> Replace, Rename, Delete, Reassign usage
Sponsors    -> Add, Edit, Deactivate
Campaigns   -> Add, Edit, End early
Coupons     -> Add, Edit, Expire
Blog/Events -> Add, Edit, Unpublish
Users       -> View, Change role, Suspend (never hard-delete;
               anonymize on request instead, for privacy compliance)
```

Rules:

-   Every edit form is pre-filled from the existing record (no
    re-entering unchanged fields).
-   Destructive actions (delete) default to soft-delete/archive with a
    confirm dialog; hard delete is a separate, restricted action.
-   Every create/update/delete on these entities writes an audit-log
    row (who, what, when, before/after diff) as already required in
    Section 66's Definition of Done.

------------------------------------------------------------------------

# 73. Additional Suggested Features

Useful additions beyond what was explicitly requested:

-   **Wishlist / "Save for later"** for logged-in users, separate from
    the member-discount coupon flow.
-   **Price-drop / back-in-stock email alerts** for saved products
    (reuses the Email provider integration already in the stack).
-   **"My Activity" page for logged-in users** --- a personal view of
    their own watch history, saved products, and claimed discount
    codes, mirroring the admin activity log but scoped to themselves.
-   **Referral program**: give existing members a shareable code that
    grants the referred friend the same discount and rewards the
    referrer.
-   **Weekly "Creator Digest" email** auto-generated from the newest
    published video + top 3 products, sent to newsletter subscribers.
-   **Role-based admin invites** (Section 40 roles) so the creator can
    add an EDITOR/MODERATOR without sharing the SUPER_ADMIN password.
-   **Scheduled publishing** for videos/blog posts/products (publish
    at a future date/time instead of immediately).
-   **A/B-testable homepage hero CTA** to see which call-to-action
    drives more product/video engagement, visible in the Analytics
    tab.
-   **Data export/portability**: let a logged-in user download their
    own data (GDPR-style), and let the admin export the full catalog
    to Excel/CSV on demand (see Section 68's recommended
    export/import pattern).
