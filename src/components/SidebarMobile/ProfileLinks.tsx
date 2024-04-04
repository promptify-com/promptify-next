import { useRouter } from "next/router";
import Stack from "@mui/material/Stack";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import MenuList from "@mui/material/MenuList";

import { useAppSelector } from "@/hooks/useStore";
import useLogout from "@/hooks/useLogout";
import { profileLinks } from "@/common/constants";
import Image from "@/components/design-system/Image";
import type { ProfileLink } from "@/components/SidebarMobile/Types";

interface Props {
  onCloseDrawer: () => void;
}

function ProfileLinks({ onCloseDrawer }: Props) {
  const router = useRouter();
  const logout = useLogout();

  const currentUser = useAppSelector(state => state.user.currentUser);

  const handleHeaderMenu = async (link: ProfileLink) => {
    if (link.href === "/signout") {
      await logout();
    } else {
      router.push(link.href);
    }
    onCloseDrawer();
  };

  const filtredProfileLinks = currentUser?.is_admin
    ? profileLinks
    : profileLinks.filter(item => item.href !== "/deployments" && item.href !== "/profile/prompts-review");

  return (
    <Stack direction={"column"}>
      <Stack
        direction={"column"}
        alignContent={"center"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={1}
        pt={"24px"}
      >
        <Stack
          direction={"row"}
          justifyContent={"center"}
        >
          <Image
            src={currentUser?.avatar ?? require("@/assets/images/default-avatar.jpg")}
            alt={currentUser?.first_name?.slice(0, 1) ?? "P"}
            width={90}
            height={90}
            style={{
              marginLeft: "auto",
              cursor: "pointer",
              backgroundColor: "black",
              color: "white",
              padding: "1px",
              fontStyle: "normal",
              textAlign: "center",
              fontWeight: 500,
              fontSize: "60px",
              textTransform: "capitalize",
              lineHeight: "89px",
              letterSpacing: "0.14px",
              borderRadius: "50%",
            }}
          />
        </Stack>
        <Stack textAlign={"center"}>
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: "18px",
              lineHeight: "25.2px",
              letterSpacing: "0.15px",
            }}
          >
            {currentUser?.first_name} {currentUser?.last_name}
          </Typography>
          <Typography
            sx={{
              color: "secondary.light",
              fontStyle: "normal",
              fontWeight: 500,
              fontSize: "13px",
              lineHeight: "18.2px",
              letterSpacing: "0.15px",
            }}
          >
            @{currentUser?.username}
          </Typography>
        </Stack>
      </Stack>
      <MenuList autoFocusItem={false}>
        {filtredProfileLinks.map(item => (
          <MenuItem
            key={item.name}
            onClick={() => handleHeaderMenu(item)}
            sx={{
              display: "flex",
              alignItems: "center",
              px: "24px",
              minHeight: "48px",
              gap: "15px",
            }}
          >
            {item.icon}
            <Typography
              sx={{
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "150%",
                letterSpacing: "0.15px",
                color: "onBackground",
              }}
            >
              {item.name}
            </Typography>
          </MenuItem>
        ))}
      </MenuList>
    </Stack>
  );
}

export default ProfileLinks;
