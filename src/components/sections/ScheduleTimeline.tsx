import { MapPin } from "lucide-react";

interface TimelineItem {
  time: string;
  title: string;
  locationName: string;
  address?: string;
  mapsUrl: string;
}

const items: TimelineItem[] = [
  {
    time: "11:30",
    title: "ВЗИМАНЕ НА\nБУЛКАТА",
    locationName: "жк. Малинова долина, ул. Йордан Стратиев 4, вх. Б",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent("жк. Малинова долина, ул. Йордан Стратиев 4, вх. Б"),
  },
  {
    time: "13:00",
    title: "ЦЪРКОВЕН БРАК",
    locationName: "Лозенски манастир \"Свети Апостоли Петър и Павел\"",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent("Лозенски манастир Свети Апостоли Петър и Павел"),
  },
  {
    time: "14:30",
    title: "WELCOME DRINK",
    locationName: "Pasarel Lake Club, с. Долни Пасарел",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent("Pasarel Lake Club, Dolni Pasarel"),
  },
  {
    time: "15:30",
    title: "СВАТБЕНА\nЦЕРЕМОНИЯ",
    locationName: "Pasarel Lake Club, с. Долни Пасарел",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent("Pasarel Lake Club, Dolni Pasarel"),
  },
  {
    time: "16:00",
    title: "СНИМКИ И\nПРИЕМАНЕ НА\nПОЗДРАВЛЕНИЯ",
    locationName: "Pasarel Lake Club, с. Долни Пасарел",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent("Pasarel Lake Club, Dolni Pasarel"),
  },
];

export default function ScheduleTimeline() {
  return (
    <section
      id="schedule"
      className="section-padding bg-white"
      aria-label="Програма на сватбения ден"
    >
      <div className="container-wedding">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-great-vibes text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            Програма
          </h2>
        </div>

        {/* Timeline Grid */}
        <ol className="relative grid gap-10 md:gap-12 md:grid-cols-[minmax(220px,280px)_1px_minmax(420px,1fr)_minmax(96px,120px)]">
          {/* Vertical line for md+ */}
          <div className="hidden md:block md:col-start-2 md:row-span-full bg-gray-300" />

          {items.map((item, index) => (
            <li key={index} className="grid grid-cols-1 md:grid-cols-subgrid md:col-span-4 items-center">
              {/* Left: Time + Title with wreath */}
              <div className="flex items-center gap-4">
                <div className="relative w-28 h-28 md:w-32 md:h-32 shrink-0 mx-auto md:mx-0">
                  {/* Placeholder wreath - replace with /wreath.png when provided */}
                  <div
                    className="absolute inset-0 bg-center bg-contain bg-no-repeat opacity-90"
                    style={{ backgroundImage: "url('/images/wreath.png')" }}
                    aria-hidden="true"
                  />
                  <div className="relative w-full h-full flex items-center justify-center">
                    <time className="text-3xl md:text-4xl text-foreground">{item.time}</time>
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <div className="text-sm md:text-base lg:text-lg tracking-[0.2em] uppercase whitespace-pre-line text-foreground">
                    {item.title}
                  </div>
                </div>
              </div>

              {/* Middle: tick on the vertical line (md+) */}
              <div className="hidden md:flex items-center justify-center">
                <div className="w-10 h-px bg-gray-400" />
              </div>

              {/* Right: Location */}
              <div className="text-center md:text-left flex items-center md:items-start">
                {/* Right-side tick to mirror the picture */}
                <div className="hidden md:block w-10 h-px bg-gray-400 mr-4" />
                <div className="text-sm md:text-base text-muted-foreground italic">
                  {item.locationName}
                </div>
              </div>

              {/* Far Right: Google Maps link pinned to the edge */}
              <div className="hidden md:flex md:flex-col md:items-end">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <a
                  href={item.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 text-sm text-primary underline underline-offset-4 hover:text-primary/80"
                  aria-label={`Отвори в Google Maps: ${item.locationName}`}
                >
                  Google maps
                </a>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
