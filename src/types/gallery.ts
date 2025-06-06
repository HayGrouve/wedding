export interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  title: string;
  category:
    | "venue"
    | "couple"
    | "engagement"
    | "preparation"
    | "ceremony"
    | "reception";
  description?: string;
  width: number;
  height: number;
  blurDataURL?: string;
  priority?: boolean;
  tags?: string[];
  dateTaken?: string;
  photographer?: string;
  location?: string;
}

export interface GalleryCategory {
  id: string;
  name: string;
  nameBg: string;
  description?: string;
  descriptionBg?: string;
  icon?: string;
  color?: string;
}

export interface PhotoGalleryProps {
  images: GalleryImage[];
  onImageClick?: (image: GalleryImage, index: number) => void; // Optional since clicking is disabled
  loading?: boolean;
  className?: string;
  showCategories?: boolean;
  filterCategory?: string;
  /**
   * @deprecated columns prop is no longer used.
   * Gallery is now fixed to display exactly 4 images:
   * - Desktop: 2x2 grid (2 columns, 2 rows)
   * - Mobile: 1 column with 4 images stacked vertically
   * - Centered layout with max-width: 800px and decorative borders
   */
  columns?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
}

export interface LightboxProps {
  images: GalleryImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const GALLERY_CATEGORIES: GalleryCategory[] = [
  {
    id: "all",
    name: "All Photos",
    nameBg: "Всички снимки",
    description: "View all wedding photos",
    descriptionBg: "Вижте всички сватбени снимки",
    icon: "📷",
    color: "wedding-rose",
  },
  {
    id: "venue",
    name: "Venues",
    nameBg: "Локации",
    description: "Wedding ceremony and reception venues",
    descriptionBg: "Места за венчавка и тържество",
    icon: "🏛️",
    color: "wedding-sage",
  },
  {
    id: "couple",
    name: "Couple",
    nameBg: "Двойка",
    description: "Beautiful moments of the bride and groom",
    descriptionBg: "Красиви моменти на булката и младоженеца",
    icon: "💑",
    color: "wedding-gold",
  },
  {
    id: "engagement",
    name: "Engagement",
    nameBg: "Годеж",
    description: "Engagement photo session",
    descriptionBg: "Фотосесия от годежа",
    icon: "💍",
    color: "wedding-cream",
  },
  {
    id: "ceremony",
    name: "Ceremony",
    nameBg: "Венчавка",
    description: "Wedding ceremony moments",
    descriptionBg: "Моменти от венчавката",
    icon: "⛪",
    color: "wedding-rose",
  },
  {
    id: "reception",
    name: "Reception",
    nameBg: "Тържество",
    description: "Reception and celebration",
    descriptionBg: "Тържество и празник",
    icon: "🎉",
    color: "wedding-gold",
  },
];

export const generateBlurDataURL = (width: number, height: number): string => {
  return `data:image/svg+xml;base64,${Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#f3f1f0;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#e8e5e3;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)"/>
    </svg>`
  ).toString("base64")}`;
};
