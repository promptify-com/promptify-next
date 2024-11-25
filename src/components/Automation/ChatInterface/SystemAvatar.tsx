import { PeopleOutlined } from "@/assets/icons/PeopleOutlined";
import Stack from "@mui/material/Stack";

function SystemAvatar() {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{
        width: 24,
        height: 24,
        backgroundColor: "primary.main",
        borderRadius: 2,
      }}
    >
      <PeopleOutlined />
    </Stack>
  );
}

export default SystemAvatar;
