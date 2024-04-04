import Link from "next/link";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ClearRounded from "@mui/icons-material/ClearRounded";
import MenuRounded from "@mui/icons-material/MenuRounded";

import { LogoApp } from "@/assets/icons/LogoApp";
import { theme } from "@/theme";
import { useAppSelector } from "@/hooks/useStore";
import { isValidUserFn } from "@/core/store/userSlice";
import Image from "@/components/design-system/Image";
import type { SidebarType } from "@/components/SidebarMobile/Types";
import Stack from "@mui/material/Stack";
import Search from "@mui/icons-material/Search";

interface Props {
  type: SidebarType;
  onCloseDrawer: () => void;
  setSidebarType: (value: React.SetStateAction<SidebarType>) => void;
}

function Header({ type, onCloseDrawer, setSidebarType }: Props) {
  const isValidUser = useAppSelector(isValidUserFn);
  const currentUser = useAppSelector(state => state.user.currentUser);

  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      justifyContent={"space-between"}
      padding={"0px 0px 0px 24px"}
      height={theme.custom.headerHeight.xs}
    >
      <Link
        href={"/"}
        style={{
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <LogoApp width={23} />
        <Typography
          sx={{ fontSize: 19, ml: 1 }}
          fontWeight={500}
          letterSpacing={"-0.5px"}
          lineHeight={"26.6px"}
        >
          Promptify
        </Typography>
      </Link>
      <Stack
        display={{ xs: "flex", md: "none" }}
        direction={"row"}
        alignItems={"center"}
        mr={1}
        gap={3}
      >
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"center"}
          onClick={() => setSidebarType("navigation")}
        >
          <Search sx={{ fontSize: "26px" }} />
        </Stack>
        {type === "navigation" ? (
          <>
            {isValidUser && (
              <Image
                onClick={() => setSidebarType("profile")}
                src={currentUser?.avatar ?? require("@/assets/images/default-avatar.jpg")}
                alt={currentUser?.first_name?.slice(0, 1) ?? "P"}
                width={23}
                height={23}
                style={{
                  marginLeft: "auto",
                  cursor: "pointer",
                  backgroundColor: "black",
                  borderRadius: "30px",
                  padding: "1px",
                  fontStyle: "normal",
                  textAlign: "center",
                  fontWeight: 400,
                  fontSize: 10,
                  textTransform: "capitalize",
                  lineHeight: "22px",
                  letterSpacing: "0.14px",
                }}
              />
            )}
          </>
        ) : (
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"center"}
            onClick={onCloseDrawer}
          >
            <ClearRounded sx={{ fontSize: "26px" }} />
          </Stack>
        )}

        {type !== "profile" ? (
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"center"}
            onClick={onCloseDrawer}
          >
            <ClearRounded sx={{ fontSize: "26px" }} />
          </Stack>
        ) : (
          <Stack
            onClick={onCloseDrawer}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <MenuRounded sx={{ fontSize: "26px" }} />
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}

export default Header;
