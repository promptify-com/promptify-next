import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";

function TemplateCardPlaceholder() {
  return Array.from({ length: 10 }).map((_, index) => (
    <Stack
      key={index}
      direction={{ xs: "column", md: "row" }}
      gap={"24px"}
      sx={{
        // bgcolor: "surfaceContainerLowest",
        border: "1px solid",
        borderColor: "surfaceDim",
        width: { xs: "88%", md: "calc(100% - 32px)" },
        p: { xs: "16px 8px", md: "16px" },
        borderRadius: "16px",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        gap={"24px"}
        width={{ xs: "100%", md: "fit-content" }}
      >
        <Box
          sx={{
            zIndex: 0,
            position: "relative",
            width: { xs: "260px", md: "152px" },
            minWidth: "152px",
            height: "113px",
            borderRadius: "24px",
            overflow: "hidden",
            textDecoration: "none",
          }}
        >
          <Skeleton
            animation="wave"
            width={152}
            height={113}
          />
        </Box>
        <Stack
          direction={"column"}
          justifyContent={"space-between"}
          gap={2}
          py={"8px"}
        >
          <Stack alignItems={"flex-start"}>
            <Skeleton
              animation="wave"
              width={100}
            />

            <Skeleton
              animation="wave"
              width={150}
            />
          </Stack>
          <Stack
            direction={"row"}
            gap={"8px"}
            alignItems={"center"}
          >
            <Box
              display={"flex"}
              alignItems={"center"}
            >
              <Skeleton
                animation="wave"
                width={50}
              />
            </Box>
            <Box
              display={"flex"}
              alignItems={"center"}
            >
              <Skeleton
                animation="wave"
                width={50}
              />
            </Box>
          </Stack>
        </Stack>
      </Stack>

      <Stack
        direction={"row"}
        alignItems={"center"}
        gap={1}
        px={{ md: "16px" }}
        width={{ xs: "100%", md: "fit-content" }}
      >
        <Skeleton
          variant="circular"
          animation="wave"
          width={32}
          height={32}
        />

        <Skeleton
          animation="wave"
          sx={{
            border: "1px solid",
            borderColor: "surfaceContainerHigh",
            p: "8px 16px",
          }}
          width={100}
        />
      </Stack>
    </Stack>
  ));
}

export default TemplateCardPlaceholder;
