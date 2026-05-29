"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BriefcaseBusinessIcon,
  CalendarDaysIcon,
  Loader2Icon,
  MailIcon,
  MapPinIcon,
  PencilIcon,
  PhoneIcon,
  SaveIcon,
  ShieldCheckIcon,
  XIcon,
} from "lucide-react";
import { toast } from "sonner";

import { profileSchema } from "@/lib/validation";
import { useSession, initials } from "@/components/session-provider";
import { GoogleIcon } from "@/components/google-icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const cardClass =
  "border-0 bg-white py-0 ring-1 ring-[#dfecef] shadow-[0_16px_36px_-30px_rgba(148,163,184,0.4)] dark:bg-[#101826] dark:ring-white/[0.05] dark:shadow-none";

const fieldClass =
  "h-11 rounded-xl border-[#e4edf0] bg-white px-3.5 text-sm shadow-none dark:border-white/[0.08] dark:bg-white/[0.04]";

export function ProfileContent() {
  const { user, setUser } = useSession();
  const [editing, setEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      jobTitle: user?.jobTitle || "",
      location: user?.location || "",
      bio: user?.bio || "",
    },
  });

  const onSubmit = async (values) => {
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      toast.error(data.message || "Couldn't save your profile.");
      return;
    }

    setUser(data.user);
    reset(values);
    setEditing(false);
    toast.success("Profile updated successfully.");
  };

  const cancel = () => {
    reset({
      name: user?.name || "",
      phone: user?.phone || "",
      jobTitle: user?.jobTitle || "",
      location: user?.location || "",
      bio: user?.bio || "",
    });
    setEditing(false);
  };

  const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const memberSince = user?.createdAt
    ? `${MONTHS[new Date(user.createdAt).getMonth()]} ${new Date(user.createdAt).getFullYear()}`
    : "—";

  return (
    <div className="space-y-5">
      <Card className={`${cardClass} bg-[radial-gradient(circle_at_top_right,_rgba(45,179,191,0.18),_rgba(255,255,255,0)_34%),linear-gradient(135deg,_#f7fcfc_0%,_#ffffff_48%,_#f0fafb_100%)] dark:bg-[radial-gradient(circle_at_top_right,_rgba(45,179,191,0.18),_rgba(16,24,38,0)_36%),linear-gradient(135deg,_#162230_0%,_#0b1220_100%)]`}>
        <CardContent className="flex flex-col gap-6 px-5 py-6 sm:px-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Avatar className="size-20 ring-4 ring-white shadow-[0_20px_44px_-28px_rgba(15,23,42,0.5)] dark:ring-white/[0.08]">
              {user?.avatar ? <AvatarImage src={user.avatar} alt={user.name} /> : null}
              <AvatarFallback className="bg-[linear-gradient(135deg,#0f172a,#18a8b3)] text-xl font-semibold text-white">
                {initials(user?.name)}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-[1.6rem] font-semibold tracking-tight text-slate-900 dark:text-white">
                  {user?.name}
                </h2>
                <Badge variant="secondary" className="bg-[#ddf5f7] text-[#127b84] dark:bg-[#18a8b3]/16 dark:text-[#7be0e7]">
                  {user?.role || "Member"}
                </Badge>
                {user?.provider === "google" ? (
                  <Badge variant="outline" className="gap-1">
                    <GoogleIcon className="size-3" /> Google
                  </Badge>
                ) : (
                  <Badge variant="outline" className="gap-1">
                    <ShieldCheckIcon className="size-3" /> Email
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap gap-2.5 text-[13px] text-slate-600 dark:text-slate-300">
                <QuickInfo icon={MailIcon} text={user?.email} />
                {user?.phone ? <QuickInfo icon={PhoneIcon} text={user.phone} /> : null}
                {user?.location ? <QuickInfo icon={MapPinIcon} text={user.location} /> : null}
                <QuickInfo icon={CalendarDaysIcon} text={`Joined ${memberSince}`} />
              </div>
            </div>
          </div>

          {!editing ? (
            <Button
              type="button"
              onClick={() => setEditing(true)}
              className="h-11 min-w-[130px] rounded-xl bg-[#2db3bf] px-6 text-sm font-semibold text-white hover:bg-[#22a6b2]"
            >
              <PencilIcon className="size-4" />
              Edit Profile
            </Button>
          ) : null}
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <ProfileStat icon={BriefcaseBusinessIcon} label="Job Title" value={user?.jobTitle || "Not set"} tone="bg-sky-50 text-sky-500 dark:bg-sky-400/12 dark:text-sky-300" />
        <ProfileStat icon={MapPinIcon} label="Location" value={user?.location || "Not set"} tone="bg-teal-50 text-[#18a8b3] dark:bg-[#18a8b3]/12 dark:text-[#77dce3]" />
        <ProfileStat icon={CalendarDaysIcon} label="Member Since" value={memberSince} tone="bg-amber-50 text-amber-500 dark:bg-amber-400/12 dark:text-amber-300" />
      </div>

      <Card className={cardClass}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-5 px-5 py-5 sm:px-6">
            <div className="flex items-center justify-between border-b border-[#edf2f4] pb-4 dark:border-white/[0.08]">
              <div className="space-y-1">
                <p className="text-base font-semibold text-slate-900 dark:text-white">
                  Personal Information
                </p>
                <p className="text-[13px] text-slate-500 dark:text-slate-400">
                  {editing ? "Update your details and save the changes." : "Your account details."}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Full Name" error={errors.name?.message}>
                <Input disabled={!editing} aria-invalid={Boolean(errors.name)} className={fieldClass} {...register("name")} />
              </Field>

              <Field label="Email Address" hint="Email can't be changed">
                <Input disabled value={user?.email || ""} className={`${fieldClass} disabled:opacity-100`} />
              </Field>

              <Field label="Phone Number" error={errors.phone?.message}>
                <Input disabled={!editing} placeholder="+1 (555) 000-0000" className={fieldClass} {...register("phone")} />
              </Field>

              <Field label="Job Title" error={errors.jobTitle?.message}>
                <Input disabled={!editing} placeholder="e.g. Product Designer" className={fieldClass} {...register("jobTitle")} />
              </Field>

              <Field label="Location" error={errors.location?.message} className="md:col-span-2">
                <Input disabled={!editing} placeholder="City, Country" className={fieldClass} {...register("location")} />
              </Field>
            </div>

            <Field label="Bio" error={errors.bio?.message}>
              <Textarea
                disabled={!editing}
                placeholder="Tell us a little about yourself..."
                className="min-h-[110px] rounded-xl border-[#e4edf0] bg-white px-3.5 py-3 text-sm shadow-none dark:border-white/[0.08] dark:bg-white/[0.04]"
                {...register("bio")}
              />
            </Field>

            {editing ? (
              <div className="flex flex-wrap items-center justify-end gap-3 border-t border-[#edf2f4] pt-4 dark:border-white/[0.08]">
                <Button
                  type="button"
                  variant="outline"
                  onClick={cancel}
                  className="h-11 min-w-[120px] rounded-xl border-[#e3eaee] text-sm font-semibold shadow-none dark:border-white/[0.08]"
                >
                  <XIcon className="size-4" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !isDirty}
                  className="h-11 min-w-[150px] rounded-xl bg-[#2db3bf] px-6 text-sm font-semibold text-white hover:bg-[#22a6b2]"
                >
                  {isSubmitting ? <Loader2Icon className="size-4 animate-spin" /> : <SaveIcon className="size-4" />}
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            ) : null}
          </CardContent>
        </form>
      </Card>
    </div>
  );
}

function QuickInfo({ icon: Icon, text }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[#dcebed] bg-white/80 px-3 py-1.5 dark:border-white/[0.08] dark:bg-white/[0.04]">
      <Icon className="size-3.5 text-[#18a8b3]" />
      <span>{text}</span>
    </div>
  );
}

function ProfileStat({ icon: Icon, label, value, tone }) {
  return (
    <Card className={cardClass}>
      <CardContent className="flex items-center gap-4 px-5 py-5">
        <div className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${tone}`}>
          <Icon className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">{label}</p>
          <p className="mt-1 truncate text-base font-semibold text-slate-900 dark:text-white">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function Field({ label, error, hint, className, children }) {
  return (
    <div className={`space-y-2 ${className || ""}`}>
      <div className="flex items-center justify-between">
        <Label className="text-[13px] font-medium text-slate-700 dark:text-slate-200">{label}</Label>
        {hint ? <span className="text-[11px] text-slate-400">{hint}</span> : null}
      </div>
      {children}
      {error ? <p className="text-[12px] font-medium text-red-600 dark:text-red-300">{error}</p> : null}
    </div>
  );
}
