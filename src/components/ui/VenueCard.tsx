import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MapPin,
  Navigation,
  Car,
  Clock,
  Phone,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

interface VenueLocation {
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  details: {
    phone?: string;
    website?: string;
    parking?: string;
    accessibility?: string;
    notes?: string;
  };
  type: "ceremony" | "reception";
}

const venues: VenueLocation[] = [
  {
    name: "Къща на Културата",
    address: 'ул. "Култура" 1, 1000 София',
    coordinates: {
      lat: 42.6977,
      lng: 23.3219,
    },
    details: {
      phone: "+359 2 988 1234",
      parking: "Безплатен паркинг зад сградата",
      accessibility: "Достъпно за хора с увреждания",
      notes:
        "Венчавката започва точно в 14:00 часа. Моля, пристигнете до 13:30.",
    },
    type: "ceremony",
  },
  {
    name: 'Хотел "България"',
    address: 'бул. "Русия" 4, 1000 София',
    coordinates: {
      lat: 42.6966,
      lng: 23.3245,
    },
    details: {
      phone: "+359 2 981 6541",
      website: "https://hotelbulgaria.bg",
      parking: "Охраняем паркинг - 10 лв.",
      accessibility: "Пълно достъпно обслужване",
      notes: "Тържеството започва в 18:00 с коктейл на терасата.",
    },
    type: "reception",
  },
];

const VenueCard = () => {
  const [selectedVenue, setSelectedVenue] = useState<VenueLocation>(venues[0]);
  const [mapLoaded, setMapLoaded] = useState(false);

  const handleGetDirections = (venue: VenueLocation) => {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${venue.coordinates.lat},${venue.coordinates.lng}`;
    window.open(googleMapsUrl, "_blank");
  };

  const handleShowOnMap = (venue: VenueLocation) => {
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${venue.coordinates.lat},${venue.coordinates.lng}`;
    window.open(googleMapsUrl, "_blank");
  };

  const getMapEmbedUrl = (venue: VenueLocation) => {
    // Note: In production, you would use a real Google Maps API key
    // For now, we'll use a placeholder that shows the location
    const { lat, lng } = venue.coordinates;
    return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2932.8!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDLCsDQxJzUxLjciTiAyM8KwMTknMTkuMiJF!5e0!3m2!1sen!2sbg!4v1234567890!5m2!1sen!2sbg`;
  };

  return (
            <Card className="group transition-all duration-300 md:col-span-2">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10 w-fit">
          <MapPin className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-xl">Локации</CardTitle>
        <p className="text-sm text-muted-foreground">
          Информация за венчавката и тържеството
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Venue Selection Tabs */}
        <div className="flex flex-col sm:flex-row gap-2">
          {venues.map((venue) => (
            <Button
              key={venue.name}
              variant={
                selectedVenue.name === venue.name ? "default" : "outline"
              }
              onClick={() => setSelectedVenue(venue)}
              className="flex-1 justify-start gap-2 text-sm"
            >
              <MapPin className="h-4 w-4" />
              {venue.type === "ceremony" ? "Венчавка" : "Тържество"}
            </Button>
          ))}
        </div>

        {/* Selected Venue Information */}
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-lg">
                  {selectedVenue.name}
                </h3>
                <Badge variant="secondary" className="text-xs">
                  {selectedVenue.type === "ceremony" ? "Венчавка" : "Тържество"}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                {selectedVenue.address}
              </p>
            </div>
          </div>

          {/* Venue Details */}
          <div className="grid gap-3 text-sm">
            {selectedVenue.details.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Телефон:</span>
                <a
                  href={`tel:${selectedVenue.details.phone}`}
                  className="text-primary hover:underline"
                >
                  {selectedVenue.details.phone}
                </a>
              </div>
            )}

            {selectedVenue.details.website && (
              <div className="flex items-center gap-3">
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Уебсайт:</span>
                <a
                  href={selectedVenue.details.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Посетете сайта
                </a>
              </div>
            )}

            {selectedVenue.details.parking && (
              <div className="flex items-start gap-3">
                <Car className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span className="font-medium">Паркинг:</span>
                <span className="text-muted-foreground">
                  {selectedVenue.details.parking}
                </span>
              </div>
            )}

            {selectedVenue.details.notes && (
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span className="font-medium">Забележка:</span>
                <span className="text-muted-foreground">
                  {selectedVenue.details.notes}
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={() => handleGetDirections(selectedVenue)}
              className="flex-1 gap-2"
              size="sm"
            >
              <Navigation className="h-4 w-4" />
              Навигация
            </Button>
            <Button
              variant="outline"
              onClick={() => handleShowOnMap(selectedVenue)}
              className="flex-1 gap-2"
              size="sm"
            >
              <MapPin className="h-4 w-4" />
              Покажи на картата
            </Button>
          </div>

          {/* Google Maps Embed */}
          <div className="relative bg-muted/20 rounded-lg overflow-hidden">
            <div className="aspect-video w-full">
              {!mapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted/40 backdrop-blur-sm">
                  <LoadingSpinner size="md" text="Зареждане на картата..." />
                </div>
              )}
              <iframe
                src={getMapEmbedUrl(selectedVenue)}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Карта за ${selectedVenue.name}`}
                onLoad={() => setMapLoaded(true)}
                className="rounded-lg"
              />
            </div>
          </div>

          {/* Distance Information */}
          <div className="bg-primary/10 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">
              💡 <strong>Полезна информация:</strong> Двете локации са на около
              5 минути път една от друга.
              {selectedVenue.type === "ceremony"
                ? " След венчавката ще имате време за снимки преди тържеството."
                : " Лесно достъпно от мястото на венчавката."}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VenueCard;
