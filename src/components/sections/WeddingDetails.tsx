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
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2"
            id="wedding-details-heading"
          >
            Детайли
          </h2>
        </div>

        {/* Notes */}
        <div className="space-y-16 max-w-4xl mx-auto text-center leading-relaxed">
          {/* Where */}
          <div>
            <h3 className="text-3xl md:text-4xl text-foreground mb-4">Къде?</h3>
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
                <div className="text-2xl md:text-3xl text-foreground mb-4">
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
            <h3 className="text-3xl md:text-4xl text-foreground mb-4">Дрескод</h3>
            <p className="text-lg text-muted-foreground">
              Няма задължителен дрескод на събитието. Молим Ви единствено да вземете предвид
              минусовите температури и да предвидите връхна дреха.
            </p>
          </div>

          <div className="mt-10 md:mt-12">
            <h3 className="text-3xl md:text-4xl text-foreground mb-4">Цветя</h3>
            <p className="text-lg text-muted-foreground">
              Молим ви да не купувате цветя, тъй като сме предвидили достатъчно.
            </p>
          </div>

          <div className="mt-10 md:mt-12">
            <h3 className="text-3xl md:text-4xl text-foreground mb-4">Транспорт</h3>
            <div className="space-y-6">
              <p className="text-lg text-muted-foreground">
                Pasarel Lake Club е достъпен чрез следните начини на транспорт от София: Yellow taxi,
                Volt Premium Taxi и Lucky Drink &amp; Drive за тези от Вас, които планират да дойдат със
                собствен автомобил.
              </p>
              <div className="space-y-3">
                <h4 className="text-xl md:text-2xl text-foreground">Контакти:</h4>
                <p className="text-lg text-muted-foreground">
                  Lucky Drink &amp; Drive - тел: <a href="tel:0884116464" className="underline">0884116464</a>
                  {" "}/ Фиксирана тарифа до всички точки на гр. София - 85 лв. за един курс/
                </p>
                <p className="text-lg text-muted-foreground">
                  Yellow taxi - тел: <a href="tel:0291119" className="underline">0291119</a>
                  {" "}/ Стандартна тарифа/
                </p>
                <p className="text-lg text-muted-foreground">
                  Volt Premium Taxi - тел: <a href="tel:0875777555" className="underline">0875777555</a>
                  {" "}/ 65 лв. фиксирана тарифа до гр. София/
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WeddingDetails;
