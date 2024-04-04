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
      sx={{
        justifyContent: { xs: "center", md: "flex-start" },
        alignItems: { xs: "center", md: "flex-start" },
        pt: { xs: "24px", md: 0 },
      }}
    >
      <Box
        position={"relative"}
        width={{ xs: "91.2px", md: "152px" }}
        height={{ xs: "91.2px", md: "152px" }}
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
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: { xs: "center", md: "flex-start" },
          alignItems: { xs: "center", md: "flex-start" },
          gap: "16px",
          p: { xs: "0 24px", md: 0 },
        }}
      >
        <Typography
          sx={{
            color: "var(--onSurface, var(--onSurface, #1D1B1E))",
            textAlign: "center",
            fontFeatureSettings: "'clig' off, 'liga' off",
            fontFamily: "Poppins",
            fontSize: "24px",
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: "120%",
          }}
        >
          {privateProfile ? "Anonymous" : user.first_name + " " + user.last_name}
        </Typography>
        <Typography
          component={"div"}
          sx={{
            color: "var(--onSurface, var(--onSurface, #1D1B1E))",
            textAlign: { xs: "center", md: "left" },
            fontFeatureSettings: "'clig' off, 'liga' off",
            fontFamily: "Poppins",
            fontSize: "14px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "160%",
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
