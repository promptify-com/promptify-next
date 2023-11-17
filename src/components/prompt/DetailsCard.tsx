import { Templates } from "@/core/api/dto/templates";
import { useTheme, useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CardMedia from "@mui/material/CardMedia";
import Chip from "@mui/material/Chip";
import FavoriteIcon from "./FavoriteIcon";
import Image from "@/components/design-system/Image";
import { theme } from "@/theme";

interface Props {
  templateData: Templates;
}

const favoriteIconStyle = {
  sx: {
    gap: "3px",
    color: "onSurface",
  },
};

export function DetailsCard({ templateData }: Props) {
  const { breakpoints } = useTheme();

  // Determine the appropriate border radius value based on the breakpoint
  // If the current breakpoint is medium (md) or larger,
  const isMdBreakpoint = useMediaQuery(breakpoints.up("md"));
  const borderRadiusValue = isMdBreakpoint ? "16px" : "0px";

  const templateStatus = templateData?.status !== "PUBLISHED" && (
    <Chip
      label={templateData?.status}
      size="small"
      sx={{ fontSize: "12px", fontWeight: 500, ml: "8px" }}
      component={"span"}
    />
  );

  return (
    <Box
      sx={{
        bgcolor: "surface.1",
        p: { xs: "0px", md: "16px" },
        width: `calc(100% - ${{ xs: 0, md: 32 }}px)`,
        height: "fit-content",
      }}
    >
      <CardMedia
        sx={{
          position: "relative",
          height: 226,
          width: "100%",
          borderRadius: { xs: "0px", md: "16px" },
        }}
      >
        <Image
          src={templateData.thumbnail ?? require("@/assets/images/default-thumbnail.jpg")}
          alt={templateData.title}
          style={{ borderRadius: borderRadiusValue, objectFit: "cover", width: "100%", height: "100%" }}
        />
      </CardMedia>
      <Stack
        gap={2}
        sx={{
          borderTopLeftRadius: "25px",
          borderTopRightRadius: "25px",
          position: "relative",
          mt: { xs: "-35px", md: "0px" },
          bgcolor: "surface.1",
          p: { xs: "16px", md: "16px 0 0" },
        }}
      >
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          gap={1}
        >
          <Stack gap={1}>
            <Typography
              fontSize={18}
              fontWeight={500}
              color={"onSurface"}
            >
              {templateData.title}
              {templateStatus}
            </Typography>

            <Typography
              fontSize={12}
              fontWeight={500}
              color={"grey.600"}
            >
              {templateData.category?.name}
            </Typography>
          </Stack>
          <Stack
            direction={"row"}
            alignItems={"center"}
            gap={1}
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            <FavoriteIcon style={favoriteIconStyle} />
            <Image
              src={templateData.created_by?.avatar ?? require("@/assets/images/default-avatar.jpg")}
              alt={templateData.created_by?.first_name ?? "Promptify"}
              width={32}
              height={32}
              style={{
                backgroundColor: theme.palette.surface[5],
                borderRadius: "50%",
              }}
            />
          </Stack>
        </Stack>
        <Stack
          direction={"row"}
          alignItems={"center"}
          gap={1}
          sx={{ display: { md: "none" } }}
        >
          <Image
            src={templateData.created_by?.avatar ?? require("@/assets/images/default-avatar.jpg")}
            alt={templateData.created_by.first_name ?? "Promptify"}
            width={32}
            height={32}
            style={{
              backgroundColor: theme.palette.surface[5],
              borderRadius: "50%",
            }}
          />
          <Typography fontSize={12}>
            by{" "}
            {templateData?.created_by?.first_name && templateData?.created_by?.last_name ? (
              <>
                {templateData.created_by.first_name.charAt(0).toUpperCase() +
                  templateData.created_by.first_name.slice(1)}{" "}
                {templateData.created_by.last_name.charAt(0).toUpperCase() + templateData.created_by.last_name.slice(1)}
              </>
            ) : (
              <>
                {templateData.created_by?.username.charAt(0).toUpperCase() + templateData.created_by?.username.slice(1)}
              </>
            )}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}
