import React from "react";
import { Avatar, Box, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import useUser from "@/hooks/useUser";
import { useRouter } from "next/router";

export const Home = () => {
  const router = useRouter();
  const user = useUser();

  return (
    <section id="home" style={{ scrollMarginTop: "100px" }}>
      <Box
        sx={{
          justifyContent: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: { xs: "center", sm: "start" },
          padding: { xs: "1em", sm: "2em 0em" },
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
            color: "#1B1B1E",
          }}
        >
          Welcome to your space
        </Typography>
        <Box
          border={{ xs: "", sm: "" }}
          borderRadius="15px"
          mt="2rem"
          width={{ xs: "85%", sm: "100%" }}
        >
          <Box
            display="flex"
            flexDirection={{ xs: "column", sm: "row" }}
            justifyContent="flex-start"
            alignItems="center"
            padding={{ xs: "5px", sm: "45px" }}
            sx={{
              border: { xs: "none", sm: "1px solid #00000021" },
              borderRadius: "15px 15px 0px 0px",
              borderBottom: { xs: "0px", sm: "none" },
              marginBottom: { xs: "0em", sm: "-10px" },
              gap: { xs: "2em", sm: "0em" },
            }}
          >
            <Box>
              {/* <Avatar sx={{ height: '135px', width: '135px' }} src={user?.avatar || "http://placehold.it/250x250"} /> */}
              {!user?.avatar ? (
                <Typography
                  sx={{
                    bgcolor: "black",
                    borderRadius: "132px",
                    width: "132px",
                    height: "132px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    fontFamily: "Poppins",
                    fontStyle: "normal",
                    textAlign: "center",
                    fontWeight: 600,
                    fontSize: "48px",
                    lineHeight: "20px",
                    letterSpacing: "0.14px",
                    color: "#FFFFFF",
                    flex: "none",
                    order: 1,
                    flexGrow: 0,
                    zIndex: 1,
                  }}
                >
                  {!!user?.first_name && !!user?.last_name
                    ? `${user?.first_name[0]?.toUpperCase()}${user?.last_name[0]?.toUpperCase()}`
                    : user?.username[0]?.toUpperCase()}
                </Typography>
              ) : (
                <Avatar
                  sx={{ height: "135px", width: "135px" }}
                  src={user?.avatar || "http://placehold.it/250x250"}
                />
              )}
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: { xs: "center", sm: "flex-start" },
                justifyContent: "center",
                gap: "1em",
              }}
              ml={{ xs: "0px", sm: "35px" }}
              mt={{ xs: "1rem", sm: "0px" }}
            >
              <Typography
                sx={{
                  fontFamily: "Poppins",
                  fontStyle: "normal",
                  fontWeight: 500,
                  fontSize: "24px",
                  lineHeight: "36px",
                  display: "flex",
                  alignItems: "center",
                  textAlign: { xs: "center", sm: "start" },
                  color: "#000000",
                }}
              >
                {user?.first_name} {user?.last_name}
              </Typography>
              <Typography
                // fontWeight={500}
                // fontSize="0.8rem"
                // textAlign={{ xs: 'center', sm: 'start' }}
                sx={{
                  fontFamily: "Poppins",
                  fontStyle: "normal",
                  fontWeight: 400,
                  fontSize: "16px",
                  lineHeight: "150%",
                  display: "flex",
                  alignItems: "center",
                  textAlign: { xs: "center", sm: "start" },
                  letterSpacing: "0.15px",
                  color: "#1B1B1E",
                }}
              >
                {user?.username}
              </Typography>
              <Typography
                fontSize={{ xs: "0.8rem", sm: "1rem" }}
                mt="1rem"
                sx={{
                  fontFamily: "Poppins",
                  fontStyle: "normal",
                  fontWeight: 400,
                  fontSize: { xs: "14px", sm: "1rem" },
                  lineHeight: "143%",
                  display: "flex",
                  alignItems: "center",
                  textAlign: { xs: "center", sm: "start" },
                  letterSpacing: "0.17px",
                  color: "#1B1B1E",
                }}
              >
                {user?.bio}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              boxSizing: "border-box",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "8px 22px",
              width: "100%",
              height: "64px",
              border: "1px solid rgba(55, 92, 169, 0.6)",
              borderRadius: "16px",
              flexDirection: "row",
              gap: "8px",
            }}
            mt={{ xs: "1rem", sm: "0rem" }}
            onClick={() => router.push("/account")}
          >
            <EditIcon
              sx={{
                color: "rgba(55, 92, 169, 1)",
              }}
            />
            <Typography
              ml="0.5rem"
              fontSize="1rem"
              sx={{
                color: "rgba(55, 92, 169, 1)",
              }}
            >
              Edit Profile
            </Typography>
          </Box>
        </Box>
      </Box>
    </section>
  );
};
