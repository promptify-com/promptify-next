import React from "react";
import { Avatar, Box, Button, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useRouter } from "next/router";
import { useGetCurrentUserQuery } from "@/core/api/user";
import useToken from "@/hooks/useToken";
import { Mode } from "@mui/icons-material";

export const Home = () => {
  const router = useRouter();
  const token = useToken();
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
        display={"flex"}
        justifyContent={{ xs: "center", md: "start" }}
        textAlign={{ xs: "center", sm: "start" }}
      >
        <Typography
          fontWeight={500}
          fontSize={{ xs: "1.5rem", sm: "2rem" }}
          sx={{
            fontFamily: "Poppins",
            fontStyle: "normal",
            fontWeight: 500,
            fontSize: { xs: "24px", sm: "34px" },
            lineHeight: { xs: "27px", sm: "123.5%" },
            color: "onSurface",
          }}
        >
          Welcome to your space
        </Typography>
      </Box>
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
              src={user?.avatar ?? user?.username}
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
          <Box maxWidth={"605px"}>
            <Typography
              fontSize={16}
              fontStyle={"normal"}
              fontWeight={"400"}
              lineHeight={"22.88px"}
              letterSpacing={"0.17px"}
            >
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptas
              nisi tenetur sapiente
            </Typography>
          </Box>
        )}
        <Box>
          <Button
            onClick={() => router.push("/profile/edit")}
            sx={{
              bgcolor: "var(--primary-main, #3B4050)",
              color: "white",
              display: "flex",
              gap: "8px",
              "&:hover": {
                color: "onSurface",
                bgcolor: "surface.3",
              },
            }}
          >
            <Mode
              sx={{
                fontSize: { xs: "16px", md: "20px" },
              }}
            />
            Edit
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
