"use client";

import { resendTwoFactor, twoFactor } from "@/actions/auth/two-factor";
import { CardWrapper } from "@/src/components/comp/auth/card-wrapper";
import { FormInput } from "@/src/components/comp/auth/form-input";
import { Button } from "@/src/ui/button/button";
import { Form } from "@/src/ui/form";
import { loginSchema, twoFactorSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type TwoFactorFormProps = {
  payload: z.infer<typeof loginSchema>;
};

export const TwoFactorForm = ({ payload }: TwoFactorFormProps) => {
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof twoFactorSchema>>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: {
      code: "",
    },
  });

  const handleSubmit = form.handleSubmit((values) => {
    startTransition(() => {
      twoFactor(values, payload).then((data) => {
        if (!data) return;
        if (!data.success) {
          return toast.error(data.error.message);
        }
      });
    });
  });

  const handleResend = () => {
    startTransition(() => {
      resendTwoFactor(payload.login).then((data) => {
        if (data.success) {
          return toast.success(data.message);
        }
        return toast.error(data.error.message);
      });
    });
  };

  return (
    <CardWrapper
      headerTitle="Two-Factor Authentication"
      headerDescription="Please enter the 6 digit code from your email to access your account. Code will expire after 2 minutes."
      backButtonLabel="Back to login"
      backButtonHref="/login"
    >
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormInput
            control={form.control}
            name="code"
            label="Authentication Code"
            placeholder="XXXXXX"
            isPending={isPending}
            autoComplete="off"
          />
          <Button type="submit" disabled={isPending} className="w-full">
            Verify
          </Button>
        </form>
        <Button
          type="button"
          variant="link"
          disabled={isPending}
          className="w-full"
          onClick={handleResend}
        >
          Resend
        </Button>
      </Form>
    </CardWrapper>
  );
};
