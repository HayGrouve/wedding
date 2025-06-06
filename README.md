# 💒 Ана-Мария & Иван - Wedding Website

A beautiful, responsive wedding website built with modern web technologies, featuring Bulgarian language support and elegant design.

## 👰🤵 Wedding Details

- **Bride:** Ана-Мария (Ana-Maria)
- **Groom:** Иван (Ivan)
- **Language:** Bulgarian (България)
- **Theme:** Rose Gold & Sage Green

## ✨ Features

- 🌍 **Fully Bulgarian Interface** - All text in Bulgarian language
- 📱 **Fully Responsive** - Beautiful on all devices
- 🎨 **Wedding Theme** - Custom color palette with rose, gold, sage, and cream colors
- ⏰ **Countdown Timer** - Live countdown to the wedding day
- 📸 **Photo Gallery** - Curated 4-photo gallery (2x2 desktop, 1-column mobile) with decorative borders and lightbox
- 📝 **RSVP Form** - Complete guest response form with validation
- 🔐 **Admin Dashboard** - Secure admin panel for managing RSVPs
- 🎬 **Video Hero Section** - Elegant video background
- ⚡ **Performance Optimized** - Fast loading and SEO friendly

## 🏗️ Tech Stack

- **Framework:** Next.js 15.3.3 with TypeScript
- **Styling:** Tailwind CSS with custom wedding theme
- **Components:** shadcn/ui component library
- **Forms:** React Hook Form with Zod validation
- **Icons:** Lucide React
- **Fonts:** Playfair Display (headings) + Inter (body)
- **Deployment:** Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone [your-repo-url]
   cd wedding-website
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

> **⚠️ Note**: RSVP functionality requires Redis database in production. See [`DEPLOYMENT.md`](./DEPLOYMENT.md) for complete setup instructions.

### Build and Deploy

```bash
# Build for production
npm run build

# Start production server
npm start

# Deploy to Vercel
vercel --prod
```

## 🎨 Theme Customization

The wedding theme is configured in `src/app/globals.css`:

- **Primary (Rose):** `hsl(var(--primary))` - Wedding rose color
- **Secondary (Gold):** `hsl(var(--secondary))` - Champagne gold
- **Accent (Sage):** `hsl(var(--accent))` - Garden sage green
- **Muted (Cream):** `hsl(var(--muted))` - Elegant cream

### 📸 Gallery Styling

The photo gallery features enhanced decorative borders:

- **Gradient Borders:** Multi-layered gradient borders using wedding theme colors
- **Box Shadows:** Layered shadows with rose and gold wedding colors
- **Hover Effects:** Enhanced gradients and shadows on interaction
- **Responsive Design:** Fixed 4-image layout (2x2 desktop, 1-column mobile)

## 📁 Project Structure

```
wedding-website/
├── src/
│   ├── app/
│   │   ├── globals.css      # Global styles & theme
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Home page
│   ├── components/
│   │   └── ui/              # shadcn/ui components
│   ├── lib/
│   │   └── utils.ts         # Utility functions
│   └── types/
│       └── wedding.ts       # TypeScript definitions
├── public/                  # Static assets
├── vercel.json             # Vercel configuration
└── package.json
```

## 🔒 Security Features

- Environment variables for sensitive data
- Comprehensive `.gitignore` for security
- Admin authentication for dashboard
- Form validation and sanitization

## 🌐 Deployment

This project is optimized for Vercel deployment with Redis database:

1. **Set up Redis database** (required for RSVP functionality)
2. **Push to GitHub**
3. **Connect repository to Vercel**
4. **Configure environment variables** (`REDIS_URL`)
5. **Deploy automatically on push**

📖 **Complete deployment guide:** See [`DEPLOYMENT.md`](./DEPLOYMENT.md) for detailed instructions.

## 📝 Development Notes

- All text content is in Bulgarian
- TypeScript is used throughout for type safety
- Components follow shadcn/ui patterns
- Responsive design with mobile-first approach
- Performance optimized with Next.js best practices

## 💝 Contributing

This is a personal wedding website. For similar projects:

1. Fork the repository
2. Update wedding details in relevant files
3. Customize colors in `globals.css`
4. Update content in components

## 📄 License

This project is for personal use for Ana-Maria & Ivan's wedding.

---

**Built with 💖 for Ana-Maria & Ivan's special day**
