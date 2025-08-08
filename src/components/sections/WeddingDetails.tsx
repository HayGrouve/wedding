"use client";

import Image from "next/image";

const WeddingDetails = () => {
  return (
    <section
      id="details"
      className="section-padding bg-background scroll-offset"
      aria-label="Детайли за сватбата"
    >
      <div className="container-wedding">
        {/* Heading */}
        <div className="text-center mb-12 md:mb-16">
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-2"
            id="wedding-details-heading"
          >
            Детайли
          </h2>
          <p className="text-base md:text-lg text-muted-foreground mb-4">
            13 декември 2025 г.
          </p>
          <hr className="border-border" />
        </div>

        {/* Notes */}
        <div className="space-y-16 max-w-4xl mx-auto text-center leading-relaxed">
          {/* Where */}
          <div>
            <h3 className="font-serif text-3xl md:text-4xl text-foreground mb-4">Къде?</h3>
            <div className="grid gap-6 md:gap-12 md:grid-cols-2 items-center text-left pt-2">
              <div className="flex justify-center md:justify-start">
                <Image
                  src="/images/wedding-place-removebg-preview.png"
                  alt="Pasarel Lake Club илюстрация"
                  width={582}
                  height={294}
                  priority
                />
              </div>
              <div>
                <div className="font-serif text-2xl md:text-3xl text-foreground mb-4">
                  PASAREL LAKE CLUB, с.ДОЛНИ ПАСАРЕЛ
                </div>
                <p className="text-lg text-muted-foreground">
                  Сгушен между висока борова гора и приказния язовир Пасарел, Pasarel Lake Club
                  предлага неповторима атмосфера и е само на 15 км от София. Клубът се намира на
                  няколко крачки от внушителния въжен мост на яз. Пасарел и гъстите горски пейзажи
                  на Лозенска и Плана планина.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-serif text-3xl md:text-4xl text-foreground mb-4">Дрескод</h3>
            <p className="text-lg text-muted-foreground">
              Няма задължителен дрескод на събитието. Молим Ви единствено да вземете предвид
              минусовите температури и да предвидите връхна дреха.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-3xl md:text-4xl text-foreground mb-4">Цветя</h3>
            <p className="text-lg text-muted-foreground">
              Молим ви да не купувате цветя, тъй като сме предвидили достатъчно.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-3xl md:text-4xl text-foreground mb-4">Транспорт</h3>
            <p className="text-lg text-muted-foreground">
              Pasarel Lake Club е достъпен чрез следните начини на транспорт от София: Yellow Taxi,
              Volt Premium Taxi и Lucky Drink &amp; Drive. За тези от вас, които планират да дойдат
              със собствен автомобил.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WeddingDetails;
