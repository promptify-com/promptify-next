import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";

const ChatCredentialsPlaceholder = () => {
  return (
    <Stack
      width={"50svh"}
      gap={8}
      ml={4}
    >
      <Stack
        direction={"row"}
        gap={2}
      >
        <Skeleton
          variant="circular"
          width={"40px"}
          height={"40px"}
          sx={{
            borderRadius: "50%",
          }}
        />
        <Skeleton
          variant="rectangular"
          height={"46px"}
          sx={{
            width: { xs: "250px", md: "377px" },
            borderRadius: "0px 100px 100px 100px",
          }}
        />
      </Stack>
      <Stack
        gap={4}
        width={{ xs: "350px", md: "600px" }}
      >
        <Skeleton
          variant="rectangular"
          width={"140px"}
          height={"16px"}
        />
        <Stack
          gap={2}
          sx={{
            flexDirection: "row",
            justifyContent: "start",
            alignItems: "center",
            borderRadius: "16px",
            width: "100%",
            height: "92px",
            bgcolor: "#eeeeee",
            pl: 2,
          }}
        >
          <Skeleton
            variant="circular"
            width={"36px"}
            height={"36px"}
            sx={{
              borderRadius: "50%",
            }}
          />
          <Skeleton
            variant="rectangular"
            width={"50%"}
            height={"16px"}
            sx={{
              borderRadius: "16px",
            }}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ChatCredentialsPlaceholder;
