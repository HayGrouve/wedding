"use client";

import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { GuestRecord } from "@/types/admin";

// Validation schema for guest editing
const editGuestSchema = z.object({
  guestName: z.string().min(1, "Име на гост е задължително"),
  email: z.string().email("Невалиден email адрес"),
  phone: z.string().optional(),
  attending: z.boolean(),
  plusOneAttending: z.boolean(),
  plusOneName: z.string().optional(),
  childrenCount: z
    .number()
    .min(0, "Броя деца не може да бъде отрицателен")
    .max(10, "Твърде много деца"),
  childrenDetails: z
    .array(
      z.object({
        name: z.string().min(1, "Име на дете е задължително"),
        age: z
          .number({ invalid_type_error: "Възрастта трябва да е число" })
          .int("Възрастта трябва да е цяло число")
          .min(0, "Минимална възраст 0")
          .max(17, "Максимална възраст 17"),
      })
    )
    .optional(),
  menuChoice: z.enum(["meat", "vegetarian"]).optional(),
  plusOneMenuChoice: z.enum(["meat", "vegetarian"]).optional(),
  allergies: z.string().optional(),
});

type EditGuestFormData = z.infer<typeof editGuestSchema>;

interface EditGuestModalProps {
  guest: GuestRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (guestId: string, updatedData: Partial<GuestRecord>) => Promise<void>;
}

export function EditGuestModal({
  guest,
  isOpen,
  onClose,
  onSave,
}: EditGuestModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<EditGuestFormData>({
    resolver: zodResolver(editGuestSchema),
    defaultValues: {
      guestName: "",
      email: "",
      phone: "",
      attending: false,
      plusOneAttending: false,
      plusOneName: "",
      childrenCount: 0,
      childrenDetails: [],
      menuChoice: "meat",
      plusOneMenuChoice: "meat",
      allergies: "",
    },
  });

  // Reset form when guest changes
  useEffect(() => {
    if (guest) {
      form.reset({
        guestName: guest.guestName,
        email: guest.email,
        phone: guest.phone || "",
        attending: guest.attending,
        plusOneAttending: guest.plusOneAttending,
        plusOneName: guest.plusOneName || "",
        childrenCount: guest.childrenCount,
        childrenDetails: guest.childrenDetails || [],

        menuChoice:
          guest.menuChoice === "meat" || guest.menuChoice === "vegetarian"
            ? guest.menuChoice
            : "meat",
        plusOneMenuChoice:
          guest.plusOneMenuChoice === "meat" ||
          guest.plusOneMenuChoice === "vegetarian"
            ? guest.plusOneMenuChoice
            : "meat",
        allergies: guest.allergies || "",
      });
    }
  }, [guest, form]);

  const watching = form.watch(["attending", "plusOneAttending"]);
  const [isAttending, isPlusOneAttending] = watching;

  const onSubmit = async (data: EditGuestFormData) => {
    if (!guest) return;

    setIsLoading(true);
    try {
      // Prepare the updated data
      const updatedData: Partial<GuestRecord> = {
        guestName: data.guestName,
        email: data.email,
        phone: data.phone || undefined,
        attending: data.attending,
        plusOneAttending: data.attending ? data.plusOneAttending : false,
        plusOneName:
          data.attending && data.plusOneAttending
            ? data.plusOneName || undefined
            : undefined,
        childrenCount: data.attending ? data.childrenCount : 0,
        childrenDetails:
          data.attending && data.childrenCount > 0
            ? (data.childrenDetails || [])
                .slice(0, data.childrenCount)
                .filter((c) => c && c.name && Number.isFinite(Number(c.age)))
                .map((c) => ({
                  name: c.name.trim().replace(/\s+/g, " "),
                  age: Math.max(0, Math.min(17, Number(c.age))),
                }))
            : undefined,

        menuChoice:
          data.attending && data.menuChoice ? data.menuChoice : undefined,
        plusOneMenuChoice:
          data.attending && data.plusOneAttending && data.plusOneMenuChoice
            ? data.plusOneMenuChoice
            : undefined,
        allergies:
          data.attending && data.allergies ? data.allergies : undefined,
      };

      await onSave(guest.id, updatedData);
      toast.success("Гостът е успешно обновен");
      onClose();
    } catch (error) {
      console.error("Error updating guest:", error);
      toast.error("Грешка при обновяване на гост");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      form.reset();
      onClose();
    }
  };

  const handleRemoveChild = (idx: number) => {
    const current = form.getValues("childrenDetails") || [];
    const next = [...current];
    next.splice(idx, 1);
    form.setValue("childrenDetails", next, { shouldDirty: true });
    const currentCount = form.getValues("childrenCount") || 0;
    form.setValue("childrenCount", Math.max(0, currentCount - 1), {
      shouldDirty: true,
    });
  };

  const handleAddChild = () => {
    const currentCount = form.getValues("childrenCount") || 0;
    if (currentCount >= 10) return;
    const details = form.getValues("childrenDetails") || [];
    form.setValue("childrenCount", currentCount + 1, { shouldDirty: true });
    form.setValue(
      "childrenDetails",
      [...details, { name: "", age: undefined as unknown as number }],
      { shouldDirty: true }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Редактиране на гост</DialogTitle>
          <DialogDescription>
            Направете промени в информацията за гостите. Кликнете
            &quot;Запази&quot; за да съхраните.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Guest Name */}
            <FormField
              control={form.control}
              name="guestName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Име на гост *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Въведете име на гост"
                      {...field}
                      disabled={isLoading}
                      className="border border-gray-300 bg-white text-black placeholder:text-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Въведете email адрес"
                      {...field}
                      disabled={isLoading}
                      className="border border-gray-300 bg-white text-black placeholder:text-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Телефон</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="Въведете телефонен номер"
                      {...field}
                      disabled={isLoading}
                      className="border border-gray-300 bg-white text-black placeholder:text-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Attending */}
            <FormField
              control={form.control}
              name="attending"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Ще присъства на сватбата
                    </FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />

            {/* Attending-dependent fields */}
            {isAttending && (
              <>
                {/* Plus One */}
                <FormField
                  control={form.control}
                  name="plusOneAttending"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Ще дойде с партньор
                        </FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isLoading}
                          />
                        </FormControl>
                      </div>
                    </FormItem>
                  )}
                />

                {/* Plus One Name */}
                {isPlusOneAttending && (
                  <FormField
                    control={form.control}
                    name="plusOneName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Име на партньор</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Въведете име на партньор"
                            {...field}
                            disabled={isLoading}
                            className="border border-gray-300 bg-white text-black placeholder:text-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Children Count */}
                <FormField
                  control={form.control}
                  name="childrenCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Брой деца</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          max="10"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                          disabled={isLoading}
                          className="border border-gray-300 bg-white text-black placeholder:text-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Children details */}
                {isAttending && form.watch("childrenCount") > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <FormLabel>Деца - имена и възраст (0–17)</FormLabel>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={handleAddChild}
                        disabled={
                          isLoading || (form.watch("childrenCount") || 0) >= 10
                        }
                        aria-label="Добави дете"
                      >
                        Добави дете
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {Array.from({ length: form.watch("childrenCount") }).map(
                        (_, idx) => (
                          <div
                            key={idx}
                            className="grid grid-cols-1 sm:grid-cols-[1fr_160px_auto] gap-3 items-end"
                          >
                            <FormField
                              control={form.control}
                              name={`childrenDetails.${idx}.name` as const}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs">Име</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder={`Име #${idx + 1}`}
                                      {...field}
                                      className="border border-gray-300 bg-white text-black placeholder:text-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`childrenDetails.${idx}.age` as const}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs">
                                    Възраст
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      min={0}
                                      max={17}
                                      placeholder="0–17"
                                      value={field.value as number | undefined}
                                      onChange={(e) =>
                                        field.onChange(
                                          e.target.value === ""
                                            ? undefined
                                            : Number(e.target.value)
                                        )
                                      }
                                      className="border border-gray-300 bg-white text-black placeholder:text-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="flex sm:justify-start">
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-red-600"
                                    aria-label={`Премахни дете #${idx + 1}`}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Премахване на дете
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Сигурни ли сте, че искате да премахнете
                                      това дете от списъка? Действието може да
                                      бъде отменено преди запазване.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Отказ</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleRemoveChild(idx)}
                                    >
                                      Премахни
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Menu choices row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="menuChoice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Меню</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isLoading}
                        >
                          <FormControl>
                            <SelectTrigger className="border border-gray-300 bg-white text-black">
                              <SelectValue placeholder="Изберете меню" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="meat">🥩 Месно</SelectItem>
                            <SelectItem value="vegetarian">
                              🥗 Вегетарианско
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {isPlusOneAttending && (
                    <FormField
                      control={form.control}
                      name="plusOneMenuChoice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Меню за партньор</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={isLoading}
                          >
                            <FormControl>
                              <SelectTrigger className="border border-gray-300 bg-white text-black">
                                <SelectValue placeholder="Изберете меню за партньор" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="meat">🥩 Месно</SelectItem>
                              <SelectItem value="vegetarian">
                                🥗 Вегетарианско
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                {/* Allergies */}
                <FormField
                  control={form.control}
                  name="allergies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Алергии</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Опишете алергии (ако има)"
                          {...field}
                          disabled={isLoading}
                          className="resize-none border border-gray-300 bg-white text-black placeholder:text-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Отказ
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Запазва..." : "Запази"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
