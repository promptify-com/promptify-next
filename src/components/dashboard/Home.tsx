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
      width={"95%"}
      sx={{
        justifyContent: "center",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <Typography
        fontWeight={500}
        fontSize={{ xs: "1.5rem", sm: "2rem" }}
        textAlign={{ xs: "center", sm: "start" }}
        sx={{
          fontFamily: "Poppins",
          fontStyle: "normal",
          fontWeight: 500,
          fontSize: { xs: "18px", sm: "34px" },
          lineHeight: { xs: "27px", sm: "123.5%" },
          display: "flex",
          alignItems: "center",
          textAlign: "center",
          color: "onSurface",
        }}
      >
        Welcome to your space
      </Typography>
      <Box
        display="flex"
        width={"100%"}
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent={"space-between"}
        alignItems="center"
        padding={"24px"}
        gap={"24px"}
        sx={{
          bgcolor: "white",
          borderRadius: "15px",
        }}
      >
        <Box display="flex" alignItems="center" gap={"24px"}>
          <Box>
            <Avatar
              sx={{
                height: "72px",
                width: "72px",
                bgcolor: "onSurface",
                fontSize: 40,
                textTransform: "capitalize",
              }}
              src={user?.avatar || user?.username}
              alt={user?.username}
            />
          </Box>
          <Box>
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
                color: "text.secondary",
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
            sx={{
              bgcolor: "black",
              color: "white",
              "&:hover": {
                color: "onSurface",
                bgcolor: "surface.3",
              },
            }}
          >
            <Mode />
            Edit
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
