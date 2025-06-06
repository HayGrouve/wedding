"use client";

import { useState, useEffect } from "react";
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
  dietaryPreference: z.enum(["", "vegetarian", "standard"]).optional(),
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
      dietaryPreference: "",
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
        dietaryPreference:
          (guest.dietaryPreference as "vegetarian" | "standard" | "") || "",
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
        dietaryPreference:
          data.attending && data.dietaryPreference
            ? data.dietaryPreference
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

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Редактиране на гост</DialogTitle>
          <DialogDescription>
            Направете промени в информацията за гостя. Кликнете
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
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Dietary Preference */}
                <FormField
                  control={form.control}
                  name="dietaryPreference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Диетични предпочитания</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Изберете диетични предпочитания" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">Няма предпочитания</SelectItem>
                          <SelectItem value="vegetarian">
                            Вегетарианска
                          </SelectItem>
                          <SelectItem value="standard">Стандартна</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                          className="resize-none"
                          {...field}
                          disabled={isLoading}
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
