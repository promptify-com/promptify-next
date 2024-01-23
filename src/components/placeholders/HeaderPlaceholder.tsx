import { LogoApp } from "@/assets/icons/LogoApp";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

function HeaderPlaceholder() {
  return (
    <Stack
      sx={{
        position: { xs: "fixed", md: "relative" },
        flexDirection: "row",
        bgcolor: "surface.1",
        width: "100%",
        height: { xs: "58px", md: "90px" },
        alignItems: "center",
        zIndex: 1000,
        borderBottomLeftRadius: { md: "16px" },
        borderBottomRightRadius: { md: "16px" },
        borderBottom: { xs: "2px solid #E1E2EC" },
      }}
    >
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        width={"100%"}
        p={{ xs: "0 4px ", md: "0 24px" }}
      >
        <Stack
          sx={{
            display: "flex",
            padding: "0 10px",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <LogoApp width={23} />

          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              fontSize: 19,
              ml: "8px",
              width: "100px",
              height: "40px",
            }}
          />
        </Stack>

        <Skeleton
          variant="rectangular"
          animation="wave"
          height={"48px"}
          sx={{
            display: { xs: "none", sm: "flex" },
            flex: "0.95 1 0",
            borderRadius: "99px",
          }}
        />
        <Stack
          direction={"row"}
          justifyContent={"space-around"}
          gap={"16px"}
          m={{ xs: "8px", md: "0px" }}
        >
          <Skeleton
            variant="circular"
            animation="wave"
            sx={{
              width: { xs: "23px", md: "40px" },
              height: { xs: "23px", md: "40px" },
            }}
          />
        </Stack>
      </Stack>
    </Stack>
  );
}

export default HeaderPlaceholder;
