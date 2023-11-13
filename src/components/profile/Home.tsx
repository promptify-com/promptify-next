import React from "react";
import { Avatar, Box, Typography } from "@mui/material";
import Mode from "@mui/icons-material/Mode";
import { useDispatch, useSelector } from "react-redux";
import BaseButton from "@/components/base/BaseButton";
import { showProfileInEditMode } from "@/core/store/profileSlice";
import { RootState } from "@/core/store";

export const Home = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  return (
    <Box
      sx={{
        justifyContent: "center",
        display: "flex",
        width: "100%",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <Box
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        justifyContent={"space-between"}
        alignItems="center"
        padding={{ xs: 0, md: "24px" }}
        gap={"24px"}
        sx={{
          bgcolor: "surface.1",
          borderRadius: "15px",
        }}
      >
        <Box
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          alignItems="center"
          gap={"16px"}
        >
          <Box>
            <Avatar
              sx={{
                height: "72px",
                width: "72px",
                bgcolor: "onSurface",
                fontSize: 40,
                textTransform: "capitalize",
              }}
              src={currentUser?.avatar}
              alt={currentUser?.username}
            />
          </Box>
          <Box
            display={"flex"}
            flexDirection={"column"}
            alignItems={{ xs: "center", md: "start" }}
          >
            <Typography
              sx={{
                fontFamily: "Poppins",
                fontStyle: "normal",
                fontWeight: 500,
                fontSize: "18px",
                lineHeight: "22.23px",
                color: "onSurface",
              }}
            >
              {currentUser?.first_name} {currentUser?.last_name}
            </Typography>
            <Typography
              sx={{
                fontFamily: "Poppins",
                fontStyle: "normal",
                fontWeight: 400,
                fontSize: "13px",
                lineHeight: "150%",
                letterSpacing: "0.15px",
                color: " var(--on-surface, #1B1B1E)",
                opacity: 0.5,
              }}
            >
              {currentUser?.username}
            </Typography>
          </Box>
        </Box>

        {currentUser?.bio && (
          <Box maxWidth={"505px"}>
            <Typography
              fontSize={16}
              fontStyle={"normal"}
              fontWeight={"400"}
              lineHeight={"22.88px"}
              letterSpacing={"0.17px"}
            >
              {currentUser.bio}
            </Typography>
          </Box>
        )}
        <Box>
          <BaseButton
            onClick={() => dispatch(showProfileInEditMode(true))}
            color="primary"
            variant="contained"
            style={{
              fontSize: "15px",
              fontWeight: "500",
            }}
            icon={
              <Box mt={-1}>
                <Mode
                  sx={{
                    fontSize: { xs: "16px", md: "20px" },
                  }}
                />
              </Box>
            }
          >
            Edit
          </BaseButton>
        </Box>
      </Box>
    </Box>
  );
};
