// Wedding-related TypeScript interfaces and types

export interface WeddingDetails {
  bride: string; // Булката
  groom: string; // Младоженеца
  weddingDate: Date; // Дата на сватбата
  venue: string; // Място
  address: string; // Адрес
  time: string; // Час
}

export interface RSVPFormData {
  name: string; // Име
  email: string; // Електронна поща
  phone?: string; // Телефон (незадължително)
  attendance: "yes" | "no"; // Присъствие: да/не
  plusOne: boolean; // Плюс едно
  plusOneName?: string; // Име на придружаващото лице
  children: number; // Брой деца
  dietaryRestrictions?: string; // Хранителни ограничения
  allergies?: string; // Алергии
  specialRequests?: string; // Специални заявки
  submittedAt: Date; // Дата на подаване
}

export interface PhotoGalleryItem {
  id: string;
  src: string; // URL на снимката
  alt: string; // Алтернативен текст
  caption?: string; // Подпис
  category?: "engagement" | "couple" | "family" | "misc"; // Категория
}

export interface AdminUser {
  id: string;
  email: string;
  hashedPassword: string;
  role: "admin";
  createdAt: Date;
}

export interface CountdownData {
  days: number; // Дни
  hours: number; // Часове
  minutes: number; // Минути
  seconds: number; // Секунди
}

export type RSVPStatus = "pending" | "confirmed" | "declined"; // Статус: чакащ/потвърден/отказан
export type AttendanceType = "yes" | "no" | "maybe"; // Тип присъствие: да/не/може би
