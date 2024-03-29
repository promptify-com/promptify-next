import { SortOption } from "@/components/profile2/Types";

export const AccountSidebarWidth = 268;

export const NavItems = [
  {
    items: [
      { title: "Welcome", link: "/profile" },
      { title: "My prompts", link: "/profile/prompts" },
    ],
  },
  {
    label: "Privacy",
    items: [{ title: "User profile", link: "/profile/user" }],
  },
  {
    label: "Account",
    items: [
      { title: "My accounts", link: "/profile/social-accounts" },
      { title: "Credentials", link: "/profile/credentials" },
      { title: "Email", link: "/profile/email" },
    ],
  },
  {
    label: "App settings",
    items: [
      { title: "Identity", link: "/profile/identity" },
      { title: "Notifications", link: "/profile/notifications" },
      { title: "Preferences", link: "/profile/preferences" },
    ],
  },
];

export const RELATION_TYPES = ["Single", "Engaged", "Married", "Widowed", "Separated", "Divorced"];

export const SORTING_OPTIONS: SortOption[] = [
  { label: "Edit date (new first)", orderby: "-updated_at" },
  { label: "Edit date (old first)", orderby: "updated_at" },
  { label: "Number of executions", orderby: "-runs" },
  { label: "Number of likes", orderby: "-likes" },
  { label: "Alphabetical", orderby: "title" },
];
