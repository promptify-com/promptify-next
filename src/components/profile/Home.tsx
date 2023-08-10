import React from "react";
import { Avatar, Box, Typography } from "@mui/material";
import { Mode } from "@mui/icons-material";
import { useDispatch } from "react-redux";

import { useGetCurrentUserQuery } from "@/core/api/user";
import useToken from "@/hooks/useToken";
import BaseButton from "@/components/base/BaseButton";
import { showProfileInEditMode } from "@/core/store/profileSlice";

export const Home = () => {
  const token = useToken();
  const dispatch = useDispatch();
  const { data: user } = useGetCurrentUserQuery(token);

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
              src={user?.avatar}
              alt={user?.username}
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
              {user?.first_name} {user?.last_name}
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
              {user?.username}
            </Typography>
          </Box>
        </Box>

        {user?.bio && (
          <Box maxWidth={"505px"}>
            <Typography
              fontSize={16}
              fontStyle={"normal"}
              fontWeight={"400"}
              lineHeight={"22.88px"}
              letterSpacing={"0.17px"}
            >
              {user.bio}
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
