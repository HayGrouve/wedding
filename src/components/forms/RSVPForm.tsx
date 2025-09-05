"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Loader2,
  Users,
  Baby,
  ChefHat,
  AlertTriangle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import { validateRSVPForm } from "@/lib/validations";
import { getClientIP } from "@/lib/utils";

export function RSVPForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form state
  const [guestFirstName, setGuestFirstName] = useState("");
  const [guestLastName, setGuestLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [attending, setAttending] = useState(true);
  const [plusOneAttending, setPlusOneAttending] = useState(false);
  const [plusOneFirstName, setPlusOneFirstName] = useState("");
  const [plusOneLastName, setPlusOneLastName] = useState("");
  const [childrenCount, setChildrenCount] = useState(0);
  const [childrenUi, setChildrenUi] = useState<{ first: string; last: string; age: string }[]>([]);
  const [menuChoice, setMenuChoice] = useState<string>("");
  const [plusOneMenuChoice, setPlusOneMenuChoice] = useState<string>("");
  const [allergies, setAllergies] = useState("");

  const handleGoBack = () => {
    // Reset form to initial state
    setGuestFirstName("");
    setGuestLastName("");
    setEmail("");
    setPhone("");
    setAttending(true);
    setPlusOneAttending(false);
    setPlusOneFirstName("");
    setPlusOneLastName("");
    setChildrenCount(0);
    setChildrenUi([]);
    setMenuChoice("");
    setPlusOneMenuChoice("");
    setAllergies("");
    setSubmitSuccess(false);
    setErrors({});
  };

  // Sync children UI array length with childrenCount
  if (childrenUi.length !== childrenCount) {
    const next: { first: string; last: string; age: string }[] = Array.from({ length: childrenCount }, (_, i) => ({
      first: childrenUi[i]?.first || "",
      last: childrenUi[i]?.last || "",
      age: childrenUi[i]?.age || "",
    }));
    // Avoid setState during render by scheduling microtask
    Promise.resolve().then(() => setChildrenUi(next));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    // Detect client IP for tracking (non-blocking)
    let clientIP: string | undefined;
    try {
      clientIP = (await getClientIP()) || undefined;
    } catch {
      clientIP = undefined;
    }

    const composedGuestName = `${guestFirstName} ${guestLastName}`
      .trim()
      .replace(/\s+/g, " ");
    const composedPlusOneName = plusOneAttending
      ? `${plusOneFirstName} ${plusOneLastName}`
          .trim()
          .replace(/\s+/g, " ")
      : undefined;

    // Client-side field-level validation to ensure both first and last are provided
    const localErrors: Record<string, string> = {};
    if (!guestFirstName.trim()) {
      localErrors.guestFirstName = "Моля, въведете собствено име";
    }
    if (!guestLastName.trim()) {
      localErrors.guestLastName = "Моля, въведете фамилия";
    }
    if (plusOneAttending) {
      if (!plusOneFirstName.trim()) {
        localErrors.plusOneFirstName = "Моля, въведете име на госта";
      }
      if (!plusOneLastName.trim()) {
        localErrors.plusOneLastName = "Моля, въведете фамилия на госта";
      }
    }
    // Validate children details
    if (attending && childrenCount > 0) {
      const slice = childrenUi.slice(0, childrenCount);
      const incomplete = slice.some((c) => !c?.first?.trim() || !c?.last?.trim() || c.age === "" || isNaN(parseInt(c.age)));
      if (incomplete) {
        localErrors.childrenDetails = "Моля, въведете име и възраст за всяко дете";
      }
    }

    if (Object.keys(localErrors).length > 0) {
      setErrors(localErrors);
      setIsSubmitting(false);
      toast.error("Моля, коригирайте грешките във формуляра");
      return;
    }

    const parsedChildren = (attending && childrenCount > 0)
      ? childrenUi.slice(0, childrenCount).map((c) => ({
          name: `${c.first} ${c.last}`.trim().replace(/\s+/g, " "),
          age: Number.isFinite(parseInt(c.age)) ? parseInt(c.age) : 0,
        }))
      : undefined;

    const formData = {
      guestName: composedGuestName,
      email,
      phone: phone || undefined,
      attending,
      plusOneAttending,
      plusOneName: composedPlusOneName,
      childrenCount,
      childrenDetails: parsedChildren,
      menuChoice: menuChoice || undefined,
      plusOneMenuChoice: plusOneMenuChoice || undefined,
      allergies: allergies || undefined,
      clientIP,
    };

    const validation = validateRSVPForm(formData);

    if (!validation.success) {
      setErrors(validation.errors);
      setIsSubmitting(false);
      toast.error("Моля, коригирайте грешките във формуляра");
      return;
    }

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        if (result.errors) setErrors(result.errors);
        toast.error(result.error || "Възникна грешка при изпращането на формуляра");
        return;
      }

      setSubmitSuccess(true);
      toast.success(result.message || "RSVP-то ви е изпратено успешно!");
    } catch (error) {
      console.error("RSVP submission error:", error);
      toast.error("Възникна неочаквана грешка. Моля, опитайте отново.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-serif font-semibold text-primary">Благодарим ви за RSVP-то!</h3>
              <p className="text-gray-700 text-lg">
                {attending
                  ? "Вашият отговор е получен успешно. Очакваме ви с нетърпение!"
                  : "Вашият отговор е получен успешно. Съжаляваме, че няма да можете да присъствате."}
              </p>
            </div>
            <div className="pt-4">
              <Button onClick={handleGoBack} variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                Изпрати друго RSVP
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Left: Guest & Attendance */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-serif">Гост</CardTitle>
          <CardDescription>Основна информация и потвърждение</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="guestFirstName" className="flex items-center gap-2 text-black font-medium">
                <Users className="w-4 h-4" /> Собствено име *
              </Label>
              <Input
                id="guestFirstName"
                placeholder="Име"
                value={guestFirstName}
                onChange={(e) => setGuestFirstName(e.target.value)}
                disabled={isSubmitting}
                className={`${(errors.guestFirstName || errors.guestName) ? "border-red-500" : "border-gray-300"} bg-white text-black placeholder:text-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20`}
              />
              {errors.guestFirstName && <p className="text-sm text-red-500">{errors.guestFirstName}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="guestLastName" className="text-black font-medium">Фамилия *</Label>
              <Input
                id="guestLastName"
                placeholder="Фамилия"
                value={guestLastName}
                onChange={(e) => setGuestLastName(e.target.value)}
                disabled={isSubmitting}
                className={`${(errors.guestLastName || errors.guestName) ? "border-red-500" : "border-gray-300"} bg-white text-black placeholder:text-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20`}
              />
              {errors.guestLastName && <p className="text-sm text-red-500">{errors.guestLastName}</p>}
            </div>
          </div>
          {errors.guestName && <p className="text-sm text-red-500">{errors.guestName}</p>}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-black font-medium">Email адрес *</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              className={`${errors.email ? "border-red-500" : "border-gray-300"} bg-white text-black placeholder:text-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20`}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-black font-medium">Телефонен номер</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="08X XXX XXXX или +359 8X XXX XXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isSubmitting}
              className={`${errors.phone ? "border-red-500" : "border-gray-300"} bg-white text-black placeholder:text-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20`}
            />
            {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
          </div>

          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-black font-medium">
              <Users className="w-4 h-4" /> Ще присъствате ли на сватбата? *
            </Label>
            <RadioGroup
              value={attending ? "true" : "false"}
              onValueChange={(v) => setAttending(v === "true")}
              className="grid gap-3 sm:grid-cols-2"
              disabled={isSubmitting}
            >
              <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded bg-white hover:bg-gray-50">
                <RadioGroupItem value="true" id="attending-yes" className="text-primary border-gray-300 focus:ring-2 focus:ring-primary/20" />
                <Label htmlFor="attending-yes" className="text-sm font-medium cursor-pointer text-black">Да, ще присъствам</Label>
              </div>
              <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded bg-white hover:bg-gray-50">
                <RadioGroupItem value="false" id="attending-no" className="text-primary border-gray-300 focus:ring-2 focus:ring-primary/20" />
                <Label htmlFor="attending-no" className="text-sm font-medium cursor-pointer text-black">Не, няма да присъствам</Label>
              </div>
            </RadioGroup>
            {errors.attending && <p className="text-sm text-red-500">{errors.attending}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Right: Companions & Preferences */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-serif">Допълнителна информация</CardTitle>
          <CardDescription>Информация за +1, деца и меню</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {attending ? (
            <>
              <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 bg-white">
                <div className="space-y-0.5">
                  <Label className="text-base flex items-center gap-2 text-black"><Users className="w-4 h-4" /> Ще доведете някого със себе си?</Label>
                  <p className="text-sm text-gray-600">Партньор или приятел/ка</p>
                </div>
                <Switch checked={plusOneAttending} onCheckedChange={setPlusOneAttending} disabled={isSubmitting} className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-300" />
              </div>
              {errors.plusOneAttending && <p className="text-sm text-red-500">{errors.plusOneAttending}</p>}

              {plusOneAttending && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="plusOneFirstName" className="text-black font-medium">Име на гост *</Label>
                      <Input
                        id="plusOneFirstName"
                        placeholder="Име"
                        value={plusOneFirstName}
                        onChange={(e) => setPlusOneFirstName(e.target.value)}
                        disabled={isSubmitting}
                        className={`${(errors.plusOneFirstName || errors.plusOneName) ? "border-red-500" : "border-gray-300"} bg-white text-black placeholder:text-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20`}
                      />
                      {errors.plusOneFirstName && <p className="text-sm text-red-500">{errors.plusOneFirstName}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="plusOneLastName" className="text-black font-medium">Фамилия *</Label>
                      <Input
                        id="plusOneLastName"
                        placeholder="Фамилия"
                        value={plusOneLastName}
                        onChange={(e) => setPlusOneLastName(e.target.value)}
                        disabled={isSubmitting}
                        className={`${(errors.plusOneLastName || errors.plusOneName) ? "border-red-500" : "border-gray-300"} bg-white text-black placeholder:text-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20`}
                      />
                      {errors.plusOneLastName && <p className="text-sm text-red-500">{errors.plusOneLastName}</p>}
                    </div>
                  </div>
                  {errors.plusOneName && <p className="text-sm text-red-500">{errors.plusOneName}</p>}
                </>
              )}

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-black font-medium"><Baby className="w-4 h-4" /> Брой деца</Label>
                <Select value={childrenCount.toString()} onValueChange={(v) => setChildrenCount(parseInt(v))} disabled={isSubmitting}>
                  <SelectTrigger className={`${errors.childrenCount ? "border-red-500" : "border-gray-300"} bg-white text-black focus:border-primary focus:ring-2 focus:ring-primary/20`}>
                    <SelectValue placeholder="Изберете брой деца" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Без деца</SelectItem>
                    <SelectItem value="1">1 дете</SelectItem>
                    <SelectItem value="2">2 деца</SelectItem>
                    <SelectItem value="3">3 деца</SelectItem>
                    <SelectItem value="4">4 деца</SelectItem>
                    <SelectItem value="5">5+ деца</SelectItem>
                  </SelectContent>
                </Select>
                {errors.childrenCount && <p className="text-sm text-red-500">{errors.childrenCount}</p>}
              </div>

              {attending && childrenCount > 0 && (
                <div className="space-y-4">
                  <Label className="text-black font-medium">Деца - имена и възраст</Label>
                  <div className="space-y-3">
                    {Array.from({ length: childrenCount }).map((_, index) => (
                      <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <Input
                            placeholder={`Име #${index + 1}`}
                            value={childrenUi[index]?.first || ""}
                            onChange={(e) => {
                              const next = [...childrenUi];
                              next[index] = { ...(next[index] || { first: "", last: "", age: "" }), first: e.target.value };
                              setChildrenUi(next);
                            }}
                            disabled={isSubmitting}
                            className="bg-white text-black placeholder:text-gray-500 border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                        <div className="space-y-1">
                          <Input
                            placeholder="Фамилия"
                            value={childrenUi[index]?.last || ""}
                            onChange={(e) => {
                              const next = [...childrenUi];
                              next[index] = { ...(next[index] || { first: "", last: "", age: "" }), last: e.target.value };
                              setChildrenUi(next);
                            }}
                            disabled={isSubmitting}
                            className="bg-white text-black placeholder:text-gray-500 border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                        <div className="space-y-1">
                          <Input
                            type="number"
                            min={0}
                            max={17}
                            placeholder="Възраст"
                            value={childrenUi[index]?.age || ""}
                            onChange={(e) => {
                              const next = [...childrenUi];
                              next[index] = { ...(next[index] || { first: "", last: "", age: "" }), age: e.target.value };
                              setChildrenUi(next);
                            }}
                            disabled={isSubmitting}
                            className="bg-white text-black placeholder:text-gray-500 border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  {errors.childrenDetails && (
                    <p className="text-sm text-red-500">{errors.childrenDetails}</p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-black font-medium"><ChefHat className="w-4 h-4" /> Вашето меню *</Label>
                <Select value={menuChoice} onValueChange={setMenuChoice} disabled={isSubmitting}>
                  <SelectTrigger className={`${errors.menuChoice ? "border-red-500" : "border-gray-300"} bg-white text-black focus:border-primary focus:ring-2 focus:ring-primary/20`}>
                    <SelectValue placeholder="Изберете основно ястие" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="meat">🥩 Месно</SelectItem>
                    <SelectItem value="vegetarian">🥗 Вегетарианско</SelectItem>
                  </SelectContent>
                </Select>
                {errors.menuChoice && <p className="text-sm text-red-500">{errors.menuChoice}</p>}
              </div>

              {plusOneAttending && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-black font-medium"><ChefHat className="w-4 h-4" /> Избор на меню за гост *</Label>
                  <Select value={plusOneMenuChoice} onValueChange={setPlusOneMenuChoice} disabled={isSubmitting}>
                    <SelectTrigger className={`${errors.plusOneMenuChoice ? "border-red-500" : "border-gray-300"} bg-white text-black focus:border-primary focus:ring-2 focus:ring-primary/20`}>
                      <SelectValue placeholder="Изберете основно ястие за госта" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="meat">🥩 Месно</SelectItem>
                      <SelectItem value="vegetarian">🥗 Вегетарианско</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.plusOneMenuChoice && <p className="text-sm text-red-500">{errors.plusOneMenuChoice}</p>}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="allergies" className="flex items-center gap-2 text-black font-medium"><AlertTriangle className="w-4 h-4" /> Алергии или специални изисквания</Label>
                <Textarea
                  id="allergies"
                  placeholder="Опишете алергии към храна или други специални изисквания..."
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  disabled={isSubmitting}
                  rows={3}
                  className={`${errors.allergies ? "border-red-500" : "border-gray-300"} bg-white text-black placeholder:text-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20`}
                />
                {errors.allergies && <p className="text-sm text-red-500">{errors.allergies}</p>}
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-600">Ако няма да присъствате, не е необходимо да попълвате допълнителни данни.</p>
          )}
        </CardContent>
      </Card>

      {/* Submit & info section under both cards */}
      <div className="md:col-span-2 space-y-4">
        <Button
          type="submit"
          form="rsvp-form"
          className="hidden"
        />
        <Button
          onClick={(e) => {
            e.preventDefault();
            void handleSubmit(e);
          }}
          className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 text-lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Изпращане...
            </>
          ) : (
            <>
              <Users className="mr-2 h-4 w-4" /> Изпрати отговор
            </>
          )}
        </Button>

        <Alert className="border-gray-200 bg-gray-50">
          <AlertTriangle className="h-4 w-4 text-gray-600" />
          <AlertDescription className="text-gray-700">
            Вашите данни са в безопасност и ще бъдат използвани само за организацията на сватбата. За въпроси можете да се свържете с нас директно.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
