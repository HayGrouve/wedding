"use client";

import AnimatedCard from "@/components/ui/AnimatedCard";

export default function WeddingInvitation() {
  return (
    <section 
      id="invitation" 
      className="section-padding bg-white py-16 md:py-20 lg:py-24"
      aria-labelledby="invitation-heading"
    >
      <div className="container-wedding">
        <AnimatedCard 
          className="max-w-4xl mx-auto text-center"
          animationType="fadeInUp"
          delay={200}
        >
          <div className="space-y-8 md:space-y-12">
            {/* Opening Line */}
            <p className="text-lg md:text-xl lg:text-2xl text-gray-700 leading-relaxed">
              С ОГРОМНА РАДОСТ И ВЪЛНЕНИЕ, НИЕ,
            </p>

            {/* Couple Names */}
            <div className="space-y-2">
              <h2 
                id="invitation-heading"
                className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-gray-900 leading-tight"
              >
                Анна-Мария
              </h2>
              <p className="text-2xl md:text-3xl lg:text-4xl text-gray-700">
                и
              </p>
              <h3 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-gray-900 leading-tight">
                Георги
              </h3>
            </div>

            {/* Invitation Text */}
            <div className="space-y-4">
              <p className="text-lg md:text-xl lg:text-2xl text-gray-700 leading-relaxed">
                ВИ КАНИМ ДА ОТПРАЗНУВАМЕ ЗАЕДНО
              </p>
              <p className="text-lg md:text-xl lg:text-2xl text-gray-700 leading-relaxed">
                СВАТБЕНОТО НИ ТЪРЖЕСТВО
              </p>
            </div>

            {/* Wedding Date */}
            <div className="pt-4">
              <p className="text-xl md:text-2xl lg:text-3xl text-gray-900 font-semibold leading-relaxed">
                СЪБОТА, 13 ДЕКЕМВРИ 2025
              </p>
            </div>
          </div>
        </AnimatedCard>
      </div>
    </section>
  );
}
