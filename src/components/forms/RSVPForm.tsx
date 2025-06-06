"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Loader2,
  Heart,
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
  const [guestName, setGuestName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [attending, setAttending] = useState(true);
  const [plusOneAttending, setPlusOneAttending] = useState(false);
  const [plusOneName, setPlusOneName] = useState("");
  const [childrenCount, setChildrenCount] = useState(0);
  const [menuChoice, setMenuChoice] = useState<string>("");
  const [plusOneMenuChoice, setPlusOneMenuChoice] = useState<string>("");
  const [allergies, setAllergies] = useState("");

  const handleGoBack = () => {
    // Reset form to initial state
    setGuestName("");
    setEmail("");
    setPhone("");
    setAttending(true);
    setPlusOneAttending(false);
    setPlusOneName("");
    setChildrenCount(0);
    setMenuChoice("");
    setPlusOneMenuChoice("");
    setAllergies("");
    setSubmitSuccess(false);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    // Detect client IP for tracking (non-blocking)
    let clientIP: string | undefined;
    try {
      clientIP = (await getClientIP()) || undefined;
    } catch {
      // IP detection failure shouldn't block form submission
      clientIP = undefined;
    }

    const formData = {
      guestName,
      email,
      phone: phone || undefined,
      attending,
      plusOneAttending,
      plusOneName: plusOneName || undefined,
      childrenCount,

      menuChoice: menuChoice || undefined,
      plusOneMenuChoice: plusOneMenuChoice || undefined,
      allergies: allergies || undefined,
      clientIP, // Include detected IP if available
    };

    // Validate form data
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validation.data),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        if (result.errors) {
          setErrors(result.errors);
        }

        toast.error(
          result.error || "Възникна грешка при изпращането на формуляра"
        );
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
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-wedding-rose/10 rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-wedding-rose fill-current" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-playfair font-semibold text-wedding-rose">
                Благодарим ви!
              </h3>
              <p className="text-muted-foreground text-lg">
                RSVP-то ви е получено успешно. Очакваме ви с нетърпение!
              </p>
              <p className="text-sm text-muted-foreground">
                Ще получите email потвърждение скоро. Ако имате въпроси или
                трябва да направите промени, моля свържете се с нас.
              </p>
            </div>
            <div className="pt-4">
              <Button
                onClick={handleGoBack}
                variant="outline"
                className="border-wedding-rose text-wedding-rose hover:bg-wedding-rose hover:text-white"
              >
                Изпрати друго RSVP
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-playfair text-wedding-rose">
          RSVP Формуляр
        </CardTitle>
        <CardDescription className="text-lg">
          Моля, потвърдете дали ще присъствате на нашата сватба
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Guest Name */}
          <div className="space-y-2">
            <Label htmlFor="guestName" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Вашето име *
            </Label>
            <Input
              id="guestName"
              placeholder="Въведете вашето пълно име"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              disabled={isSubmitting}
              className={errors.guestName ? "border-red-500" : ""}
            />
            {errors.guestName && (
              <p className="text-sm text-red-500">{errors.guestName}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email адрес *</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              className={errors.email ? "border-red-500" : ""}
            />
            <p className="text-sm text-muted-foreground">
              Ще използваме този email за потвърждение
            </p>
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Телефонен номер</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+359 2 XXX XXX или 02 XXX XXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isSubmitting}
              className={errors.phone ? "border-red-500" : ""}
            />
            <p className="text-sm text-muted-foreground">
              Опционално - за свързване при нужда
            </p>
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone}</p>
            )}
          </div>

          {/* Attendance */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Ще присъствате ли на сватбата? *
            </Label>
            <RadioGroup
              value={attending ? "true" : "false"}
              onValueChange={(value) => setAttending(value === "true")}
              className="flex flex-col space-y-2"
              disabled={isSubmitting}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="attending-yes" />
                <Label
                  htmlFor="attending-yes"
                  className="text-sm font-medium cursor-pointer"
                >
                  Да, ще присъствам с удоволствие! ✨
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="attending-no" />
                <Label
                  htmlFor="attending-no"
                  className="text-sm font-medium cursor-pointer"
                >
                  За съжаление, няма да мога да присъствам 😢
                </Label>
              </div>
            </RadioGroup>
            {errors.attending && (
              <p className="text-sm text-red-500">{errors.attending}</p>
            )}
          </div>

          {/* Conditional fields for attending guests */}
          {attending && (
            <div className="space-y-6 border-l-4 border-wedding-rose/20 pl-4 ml-2">
              {/* Plus One */}
              <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-base flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Ще доведете спътник?
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Ако ще дойдете с партньор/а или приятел/ка
                  </p>
                </div>
                <Switch
                  checked={plusOneAttending}
                  onCheckedChange={setPlusOneAttending}
                  disabled={isSubmitting}
                />
              </div>
              {errors.plusOneAttending && (
                <p className="text-sm text-red-500">
                  {errors.plusOneAttending}
                </p>
              )}

              {/* Plus One Name */}
              {plusOneAttending && (
                <div className="space-y-2">
                  <Label htmlFor="plusOneName">Име на спътника *</Label>
                  <Input
                    id="plusOneName"
                    placeholder="Въведете името на вашия спътник"
                    value={plusOneName}
                    onChange={(e) => setPlusOneName(e.target.value)}
                    disabled={isSubmitting}
                    className={errors.plusOneName ? "border-red-500" : ""}
                  />
                  {errors.plusOneName && (
                    <p className="text-sm text-red-500">{errors.plusOneName}</p>
                  )}
                </div>
              )}

              {/* Children Count */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Baby className="w-4 h-4" />
                  Брой деца
                </Label>
                <Select
                  value={childrenCount.toString()}
                  onValueChange={(value) => setChildrenCount(parseInt(value))}
                  disabled={isSubmitting}
                >
                  <SelectTrigger
                    className={errors.childrenCount ? "border-red-500" : ""}
                  >
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
                <p className="text-sm text-muted-foreground">
                  Деца, които ще дойдат с вас на сватбата
                </p>
                {errors.childrenCount && (
                  <p className="text-sm text-red-500">{errors.childrenCount}</p>
                )}
              </div>

              {/* Menu Choice for Primary Guest */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <ChefHat className="w-4 h-4" />
                  Вашето меню *
                </Label>
                <Select
                  value={menuChoice}
                  onValueChange={setMenuChoice}
                  disabled={isSubmitting}
                >
                  <SelectTrigger
                    className={errors.menuChoice ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Изберете основно ястие" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fish">
                      🐟 Риба - морска бяла риба с билки
                    </SelectItem>
                    <SelectItem value="meat">
                      🥩 Месо - пилешко филе със зеленчуци
                    </SelectItem>
                    <SelectItem value="vegetarian">
                      🥗 Вегетарианско - гратин с тиквички
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Моля, изберете основното ястие за себе си
                </p>
                {errors.menuChoice && (
                  <p className="text-sm text-red-500">{errors.menuChoice}</p>
                )}
              </div>

              {/* Menu Choice for Plus One */}
              {plusOneAttending && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <ChefHat className="w-4 h-4" />
                    Меню за спътника *
                  </Label>
                  <Select
                    value={plusOneMenuChoice}
                    onValueChange={setPlusOneMenuChoice}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger
                      className={
                        errors.plusOneMenuChoice ? "border-red-500" : ""
                      }
                    >
                      <SelectValue placeholder="Изберете основно ястие за спътника" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fish">
                        🐟 Риба - морска бяла риба с билки
                      </SelectItem>
                      <SelectItem value="meat">
                        🥩 Месо - пилешко филе със зеленчуци
                      </SelectItem>
                      <SelectItem value="vegetarian">
                        🥗 Вегетарианско - гратин с тиквички
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Моля, изберете основното ястие за вашия спътник
                  </p>
                  {errors.plusOneMenuChoice && (
                    <p className="text-sm text-red-500">
                      {errors.plusOneMenuChoice}
                    </p>
                  )}
                </div>
              )}

              {/* Allergies */}
              <div className="space-y-2">
                <Label htmlFor="allergies" className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Алергии или специални изисквания
                </Label>
                <Textarea
                  id="allergies"
                  placeholder="Опишете алергии към храна или други специални изисквания..."
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  disabled={isSubmitting}
                  rows={3}
                  className={errors.allergies ? "border-red-500" : ""}
                />
                <p className="text-sm text-muted-foreground">
                  Опционално - помогнете ни да направим сватбата комфортна за
                  всички
                </p>
                {errors.allergies && (
                  <p className="text-sm text-red-500">{errors.allergies}</p>
                )}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              className="w-full bg-wedding-rose hover:bg-wedding-rose/90 text-white font-medium py-3 text-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Изпращане...
                </>
              ) : (
                <>
                  <Heart className="mr-2 h-4 w-4 fill-current" />
                  {attending
                    ? "Потвърждавам присъствието си"
                    : "Изпращам отговора си"}
                </>
              )}
            </Button>
          </div>

          {/* Info Alert */}
          <Alert className="border-wedding-sage/20 bg-wedding-sage/5">
            <Heart className="h-4 w-4 text-wedding-sage" />
            <AlertDescription className="text-wedding-sage">
              Вашите данни са в безопасност и ще бъдат използвани само за
              организацията на сватбата. За въпроси можете да се свържете с нас
              директно.
            </AlertDescription>
          </Alert>
        </form>
      </CardContent>
    </Card>
  );
}
