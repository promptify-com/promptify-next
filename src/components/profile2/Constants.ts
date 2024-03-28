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
