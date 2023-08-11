import { Box, Skeleton, Stack } from "@mui/material";

export default function TabsAndFormPlaceholder({ form = false }) {
  return (
    <Stack flex={1}>
      {!form && (
        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton
              variant="text"
              key={index}
              animation="wave"
              height={20}
              width="100px"
              sx={{ mb: 2 }}
            />
          ))}
        </Box>
      )}

      <Box
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} animation="wave" height={45} width="90%" />
        ))}
      </Box>

      {!form && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Skeleton
            animation="wave"
            height={60}
            width="70%"
            sx={{
              border: "none",
              borderRadius: "999px",
            }}
          />
        </Box>
      )}
    </Stack>
  );
}
