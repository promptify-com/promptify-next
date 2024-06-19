import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { setStickyLearnSidebar } from "@/core/store/sidebarSlice";
import { LocalStorage } from "@/common/storage";
import { useEffect } from "react";
import DrawerContainer from "@/components/sidebar/DrawerContainer";
import { Stack } from "@mui/material";
import useBrowser from "@/hooks/useBrowser";
import Link from "next/link";
import { useRouter } from "next/router";

const navItems = [
  { title: "Home", link: "/learn" },
  { title: "Get Started", link: "/learn#start" },
  { title: "Blog", link: "/learn#blog" },
  { title: "Tutorials", link: "/learn#tutorials" },
  { title: "FAQ", link: "/learn#faq" },
  { title: "Terms of Use", link: "/terms-of-use" },
  { title: "Privacy Policy", link: "/privacy-policy" },
];

interface Props {
  expandedOnHover?: boolean;
}

export default function LearnSidebar({ expandedOnHover = false }: Props) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isMobile } = useBrowser();
  const isLearnSidebarSticky = useAppSelector(state => state.sidebar.isLearnSidebarSticky);

  const toggleSidebar = () => {
    dispatch(setStickyLearnSidebar(!isLearnSidebarSticky));
  };

  useEffect(() => {
    if (isMobile) return;

    const isLearnSidebarSticky = Boolean(LocalStorage.get("isLearnSidebarSticky"));
    if (isLearnSidebarSticky) {
      dispatch(setStickyLearnSidebar(isLearnSidebarSticky));
    }
  }, []);

  const isExpanded = isLearnSidebarSticky || expandedOnHover;

  return (
    <DrawerContainer
      title="Learn"
      expanded={isExpanded}
      toggleExpand={toggleSidebar}
      sticky={isLearnSidebarSticky}
      onClose={() => dispatch(setStickyLearnSidebar(false))}
    >
      <Stack
        gap={"1px"}
        sx={{
          py: "24px",
          ".item": {
            textDecoration: "none",
            padding: "16px 24px",
            fontSize: 14,
            fontWeight: 500,
            color: "secondary.main",
            borderRadius: "8px",
            cursor: "pointer",
            "&.active, &:hover": {
              bgcolor: "surfaceContainerHighest",
              color: "onPrimaryContainer",
            },
          },
        }}
      >
        {navItems.map((navItem, idx) => (
          <Link
            key={navItem.title}
            href={navItem.link}
            scroll={false}
            className={`item ${router.asPath == navItem.link ? "active" : ""}`}
          >
            {navItem.title}
          </Link>
        ))}
      </Stack>
    </DrawerContainer>
  );
}
