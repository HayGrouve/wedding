import { GalleryImage, generateBlurDataURL } from "@/types/gallery";

/**
 * Gallery images for the wedding website.
 *
 * Layout specifications:
 * - Exactly 4 images total (2 venue + 2 couple photos)
 * - Desktop: 2x2 grid layout (2 columns, 2 rows)
 * - Mobile: Single column with 4 images stacked vertically
 * - Centered layout with decorative wedding-themed borders
 * - Max width: 800px for optimal composition
 */
export const galleryImages: GalleryImage[] = [
  {
    id: 1,
    src: "/gallery/venue-1.svg",
    alt: "Къща на Културата - място за венчавката",
    title: "Къща на Културата",
    category: "venue",
    description:
      "Красивата сграда на Къщата на Културата, където ще се проведе нашата венчавка.",
    width: 800,
    height: 600,
    blurDataURL: generateBlurDataURL(800, 600),
    priority: true,
    tags: ["венчавка", "сграда", "култура"],
    location: "Къща на Културата, София",
    photographer: "Сватбен фотограф",
  },
  {
    id: 2,
    src: "/gallery/venue-2.svg",
    alt: "Хотел България - място за тържеството",
    title: 'Хотел "България"',
    category: "venue",
    description:
      'Елегантният хотел "България", където ще празнуваме сватбата си.',
    width: 800,
    height: 600,
    blurDataURL: generateBlurDataURL(800, 600),
    priority: true,
    tags: ["тържество", "хотел", "празник"],
    location: 'Хотел "България", София',
    photographer: "Сватбен фотограф",
  },
  {
    id: 3,
    src: "/gallery/couple-1.svg",
    alt: "Ана-Мария и Георги - романтична снимка",
    title: "Нашата любовна история",
    category: "couple",
    description:
      "Романтичен момент между Ана-Мария и Георги по време на залез слънце.",
    width: 800,
    height: 600,
    blurDataURL: generateBlurDataURL(800, 600),
    priority: true,
    tags: ["любов", "романтика", "залез"],
    dateTaken: "2024-08-15",
    photographer: "Сватбен фотограф",
  },
  {
    id: 4,
    src: "/gallery/couple-2.svg",
    alt: "Венчавката на Ана-Мария и Георги",
    title: "Венчавката",
    category: "ceremony",
    description: "Магичният момент от венчавката на 15 септември 2025 година.",
    width: 800,
    height: 600,
    blurDataURL: generateBlurDataURL(800, 600),
    priority: false,
    tags: ["венчавка", "церемония", "църква"],
    dateTaken: "2025-09-15",
    location: "Къща на Културата, София",
    photographer: "Сватбен фотограф",
  },
];

// Helper function to get images by category
export const getImagesByCategory = (category: string): GalleryImage[] => {
  if (category === "all") {
    return galleryImages;
  }
  return galleryImages.filter((image) => image.category === category);
};

// Helper function to get random images
export const getRandomImages = (count: number): GalleryImage[] => {
  const shuffled = [...galleryImages].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Helper function to get featured images (priority images)
export const getFeaturedImages = (): GalleryImage[] => {
  return galleryImages.filter((image) => image.priority);
};
