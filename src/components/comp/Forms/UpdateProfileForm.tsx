"use client";

import { Button } from "@/src/ui/button/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { ProfileFormSchema } from "@/schemas/FormSchema";
import { updateProfile } from "@/actions/genius-profile/update-profile";
import { toast } from "sonner";
import { AnimatedInput } from "@/src/ui/animated-input/animated-input";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/navigation";
import { LabelInputContainer } from "@/src/ui/animated-input/label-input-container";
import { Label } from "@/src/ui/animated-input/label";

import { FileUploaderMinimal } from "@uploadcare/react-uploader";
import "@uploadcare/react-uploader/core.css";
import Image from "next/image";
import { useState } from "react";

interface UpdateProfileDialogProps {
  setOpen: (open: boolean) => void;
  gg_id: string;
  defaultValues?: {
    first_name: string;
    last_name: string;
    address: string;
    description: string;
    dob: Date | null;
    image: string;
  };
}

export default function UpdateProfileForm({
  setOpen,
  gg_id,
  defaultValues,
}: UpdateProfileDialogProps) {
  const router = useRouter();

  const [isImageUploading, setIsImageUploading] = useState(false);

  const form = useForm({
    mode: "onBlur",
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: defaultValues || {
      first_name: "",
      last_name: "",
      address: "",
      description: "",
      dob: null,
      image: "",
    },
  });

  const handleImageUpload = (info: { allEntries: any[] }) => {
    // Check if any files are being uploaded
    const hasUploadingFiles = info.allEntries.some(
      (file) => file.status === "uploading"
    );
    setIsImageUploading(hasUploadingFiles);

    const successfulFiles = info.allEntries.filter(
      (file) => file.status === "success"
    );

    if (successfulFiles.length > 0) {
      // Get the URL of the last uploaded file
      const imageUrl = successfulFiles[successfulFiles.length - 1].cdnUrl;
      // Update the form with the new image URL
      form.setValue("image", imageUrl);

      // If no files are uploading and we have successful files, set uploading to false
      if (!hasUploadingFiles) {
        setIsImageUploading(false);
      }
    }
  };

  const onSubmit = async (data: any) => {
    if (isImageUploading) {
      toast.error("Please wait for image upload to complete");
      return;
    }
    try {
      const formData = {
        gg_id,
        first_name: data.first_name,
        last_name: data.last_name,
        address: data.address,
        description: data.description,
        dob:
          data.dob instanceof Date
            ? data.dob
            : data.dob
            ? new Date(data.dob)
            : null,
        image: data.image, // Include the image URL in the form submission
      };

      const result = await updateProfile(formData);

      if (result.success) {
        toast.success("Profile updated successfully");
        router.refresh();
        setOpen && setOpen(false);
        form.reset();
      } else {
        toast.error(result.error.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        {/* Other form fields remain the same */}
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <LabelInputContainer>
                <Label>First Name</Label>
                <FormControl>
                  <AnimatedInput {...field} placeholder="Eg. John" />
                </FormControl>
              </LabelInputContainer>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <AnimatedInput {...field} placeholder="Eg. Doe" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Updated DOB field with proper date handling */}
        <FormField
          control={form.control}
          name="dob"
          render={() => (
            <FormItem className="flex w-full flex-col">
              <FormLabel>DOB</FormLabel>
              <FormControl>
                <Controller
                  name="dob"
                  control={form.control}
                  render={({ field: { onChange, value } }) => (
                    <DatePicker
                      selected={
                        value ? new Date(value.setHours(12, 0, 0, 0)) : null
                      } // Set a consistent time (e.g., noon) to avoid timezone shifts
                      onChange={(date) => {
                        if (date) {
                          date.setHours(12, 0, 0, 0); // Set hours to avoid midnight timezone issues
                          onChange(date);
                        }
                      }}
                      dateFormat="yyyy-MM-dd"
                      placeholderText="Select your date of birth"
                      className="w-full rounded-md border bg-gray-100 border-white/20 dark:bg-zinc-900 px-3 py-[10px] text-sm text-black dark:text-white ring-offset-background placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                      showYearDropdown
                      yearDropdownItemNumber={100}
                      scrollableYearDropdown
                      calendarClassName="rounded-md shadow-lg bg-white dark:bg-black text-black dark:text-white"
                    />
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <AnimatedInput {...field} placeholder="Eg. 1234 Main St" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <AnimatedInput {...field} placeholder="Eg. Web Developer" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <LabelInputContainer>
                <div className="flex justify-between items-center">
                  <Label>Change Profile Picture</Label>
                  {field.value && (
                    <div className="relative size-8 rounded-full overflow-hidden">
                      <Image
                        src={field.value}
                        alt="Profile picture"
                        fill
                        className="object-cover"
                        unoptimized
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>
                <FileUploaderMinimal
                  onChange={handleImageUpload}
                  pubkey={process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY}
                  imgOnly
                  className="text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  multiple={false}
                />
              </LabelInputContainer>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen && setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isImageUploading || form.formState.isSubmitting}
          >
            {isImageUploading
              ? "Image Uploading..."
              : form.formState.isSubmitting
              ? "Updating..."
              : "Update"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
