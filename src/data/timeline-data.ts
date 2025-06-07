import { TimelineData } from "@/types/timeline";

/**
 * Love Story Timeline Data for Ана-Мария & Георги
 *
 * This file contains the timeline milestones that tell the couple's
 * love story. Photos should be placed in /public/images/timeline/
 */

export const timelineData: TimelineData = {
  milestones: [
    {
      id: "how-we-met",
      date: "Лято 2020",
      title: "Как се запознахме",
      description:
        "Съдбата ни срещна по време на слънчев летен ден в София. Един случаен поглед, една усмивка и всичко започна да се променя. Знаехме, че това е нещо специално от първия момент.",
      photo: {
        src: "/images/timeline/how-we-met.jpg",
        alt: "Ана-Мария и Георги се запознават",
        width: 400,
        height: 300,
        caption: "Първата ни снимка заедно",
      },
      placement: "left",
      order: 1,
    },
    {
      id: "first-date",
      date: "Август 2020",
      title: "Първата ни среща",
      description:
        "Нервни и вълнувани, отидохме на кафе в центъра на Sofia. Разговорите течаха естествено, времето летеше, а ние разбрахме, че имаме много общо. Кафето се превърна в дълга разходка из парка.",
      photo: {
        src: "/images/timeline/first-date.jpg",
        alt: "Първата среща в кафенето",
        width: 400,
        height: 300,
        caption: "Къде всичко започна",
      },
      placement: "right",
      order: 2,
    },
    {
      id: "first-love",
      date: "Октомври 2020",
      title: 'Първото "Обичам те"',
      description:
        'По време на романтична разходка край Витоша, под звездното небе, Георги за първи път каза "Обичам те". Сърцето на Ана-Мария се разтопи и тя отвърна същото. Този момент завинаги остана в сърцата ни.',
      photo: {
        src: "/images/timeline/first-love.jpg",
        alt: "Романтична разходка край Витоша",
        width: 400,
        height: 300,
        caption: "Под звездите",
      },
      placement: "left",
      order: 3,
    },
    {
      id: "moving-together",
      date: "Пролет 2021",
      title: "Заедно под един покрив",
      description:
        "Решихме да направим следващата стъпка в отношенията си - да се преместим заедно. Първия ни общ дом беше малък, но изпълнен с любов, смях и безброй щастливи моменти.",
      photo: {
        src: "/images/timeline/moving-together.jpg",
        alt: "Първия общ дом",
        width: 400,
        height: 300,
        caption: "Нашето малко гнездо",
      },
      placement: "right",
      order: 4,
    },
    {
      id: "proposal",
      date: "Декември 2023",
      title: "Предложението",
      description:
        'В снежна декемврийска вечер, в любимото ни място в парка, Георги се свали на едно коляно. С треперещи ръце и сълзи на щастие, Ана-Мария каза "Да!" на най-важния въпрос в живота им.',
      photo: {
        src: "/images/timeline/proposal.jpg",
        alt: "Предложението за брак",
        width: 400,
        height: 300,
        caption: 'Момента когато каза "Да!"',
      },
      placement: "left",
      order: 5,
    },
    {
      id: "engagement",
      date: "2024 - 2025",
      title: "Планиране на сватбата",
      description:
        "Месеци планиране, избиране на мястото, роклята, костюма... Понякога стресиращо, но винаги заедно. Всеки момент от подготовката ни приближаваше към мечтания ден.",
      photo: {
        src: "/images/timeline/planning.jpg",
        alt: "Планиране на сватбата",
        width: 400,
        height: 300,
        caption: "Подготовки за големия ден",
      },
      placement: "right",
      order: 6,
    },
    {
      id: "wedding-day",
      date: "15 септември 2025",
      title: "Нашата сватба",
      description:
        'Днес е денят! След години любов, смях, сълзи и мечти, ние казваме "Да" пред най-близките си хора. Започваме нов етап от живота си като семейство, изпълнени с любов и надежди.',
      photo: {
        src: "/images/timeline/wedding-day.jpg",
        alt: "Сватбения ден на Ана-Мария и Георги",
        width: 400,
        height: 300,
        caption: "Големият ден",
      },
      placement: "left",
      order: 7,
    },
    {
      id: "future",
      date: "Занапред",
      title: "Нашето бъдеще",
      description:
        "Пред нас се откриват безброй възможности и приключения. Заедно ще изградим дома си, ще пътуваме, ще се смеем и ще споделяме всички радости и предизвикателства на живота.",
      photo: {
        src: "/images/timeline/future.jpg",
        alt: "Планове за бъдещето",
        width: 400,
        height: 300,
        caption: "Към новото начало",
      },
      placement: "right",
      order: 8,
    },
  ],
  metadata: {
    title: "Нашата История на Любовта",
    subtitle: "Пътешествието ни от първата среща до сватбения ден",
    couple: {
      bride: "Ана-Мария",
      groom: "Георги",
    },
    lastUpdated: new Date().toISOString(),
  },
};

/**
 * Helper function to get milestones sorted by order
 */
export function getSortedMilestones() {
  return [...timelineData.milestones].sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  );
}

/**
 * Helper function to get milestones with auto-alternating placement
 */
export function getMilestonesWithAutoPlacement() {
  const sorted = getSortedMilestones();
  return sorted.map((milestone, index) => ({
    ...milestone,
    placement: (index % 2 === 0 ? "left" : "right") as "left" | "right",
  }));
}

/**
 * Helper function to get milestone by ID
 */
export function getMilestoneById(id: string) {
  return timelineData.milestones.find((milestone) => milestone.id === id);
}

/**
 * Helper function to get next milestone
 */
export function getNextMilestone(currentId: string) {
  const sorted = getSortedMilestones();
  const currentIndex = sorted.findIndex((m) => m.id === currentId);
  return currentIndex !== -1 && currentIndex < sorted.length - 1
    ? sorted[currentIndex + 1]
    : null;
}

/**
 * Helper function to get previous milestone
 */
export function getPreviousMilestone(currentId: string) {
  const sorted = getSortedMilestones();
  const currentIndex = sorted.findIndex((m) => m.id === currentId);
  return currentIndex > 0 ? sorted[currentIndex - 1] : null;
}
