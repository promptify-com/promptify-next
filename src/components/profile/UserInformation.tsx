import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Image from "@/components/design-system/Image";
import useTruncate from "@/hooks/useTruncate";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";

import { useAppDispatch } from "@/hooks/useStore";
import { setToast } from "@/core/store/toastSlice";
import type { UserProfile } from "@/core/api/dto/user";

function UserInformation({
  username,
  user,
  privateProfile = false,
}: {
  username: string | undefined;
  user: UserProfile;
  privateProfile?: boolean;
}) {
  const { truncate } = useTruncate();
  const dispatch = useAppDispatch();
  const [truncateBio, setTruncateBio] = useState(true);
  const [copyToClipboard, copiedResult] = useCopyToClipboard();
  const userLink = `promptify.com/users/${user?.username}`;
  const handleClickCopy = async () => {
    await copyToClipboard(userLink);
  };

  useEffect(() => {
    if (copiedResult?.state === "success") {
      dispatch(
        setToast({
          message: "The URL has been copied successfully.",
          severity: "success",
          duration: 1000,
        }),
      );
    }
  }, [copiedResult]);

  if (!username) {
    return null;
  }

  return (
    <Stack
      gap={"32px"}
      width={{ xs: "100%", md: "320px" }}
      direction={"column"}
      alignItems={{ xs: "center", md: "start" }}
    >
      <Box
        position={"relative"}
        width={"152px"}
        height={"152px"}
        borderRadius={"999px"}
        overflow={"hidden"}
      >
        <Image
          src={user.avatar}
          alt={user.username}
          fallback={require("@/assets/images/default-avatar.jpg")}
          fill
        />
      </Box>
      <Stack
        textAlign={{ xs: "center", md: "start" }}
        px={{ xs: "16px", md: 0 }}
        gap={2}
      >
        <Typography
          fontSize={24}
          lineHeight={"28.8px"}
        >
          {privateProfile ? "Anonymous" : user.first_name + " " + user.last_name}
        </Typography>
        <Typography
          component={"div"}
          fontSize={14}
          fontWeight={400}
          lineHeight={"22.4px"}
          sx={{
            opacity: { xs: 0.72, md: 1 },
          }}
        >
          {truncateBio ? (
            <>
              {truncate(user.bio, { length: 190 })}
              {user.bio?.length > 190 && (
                <Typography
                  component={"span"}
                  sx={{
                    fontSize: 15,
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                  onClick={() => setTruncateBio(!truncateBio)}
                >
                  Read more
                </Typography>
              )}
            </>
          ) : (
            user.bio
          )}
        </Typography>
        {!privateProfile && (
          <Typography
            mt={{ md: "16px" }}
            fontSize={12}
            fontWeight={500}
            lineHeight={"16.8px"}
            letterSpacing={"0.17px"}
            color={"primary.main"}
            onClick={handleClickCopy}
            sx={{ cursor: "pointer" }}
          >
            {userLink}
          </Typography>
        )}
      </Stack>
    </Stack>
  );
}

export default UserInformation;
