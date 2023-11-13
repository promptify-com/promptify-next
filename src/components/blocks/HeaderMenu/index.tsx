import React, { useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import { headerMenuItems, headerMenuItemsMobile } from "./const/headerMenuItems";
import Link from "next/link";

interface IHeaderMenu {
  hash: string;
  mobile?: boolean;
  setShowMenu?: (value: boolean) => void;
  setHash: (value: string) => void;
}

export const HeaderMenu = ({ hash, setShowMenu, mobile, setHash }: IHeaderMenu) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current && hash === "home") {
      scrollContainerRef.current.scrollLeft = 0;
    }
  }, [hash]);
  return (
    <>
      {mobile ? (
        <Box
          position="relative"
          display="flex"
          flexDirection="row"
          sx={{
            overflowX: "scroll",
            paddingX: "10px",
            "::-webkit-scrollbar": {
              display: "none",
            },
          }}
          width="100%"
          height="50px"
          bgcolor="#FDFBFF"
          // mb="1rem"
          zIndex={2}
          ref={scrollContainerRef}
        >
          {headerMenuItemsMobile.map(item => {
            return (
              <Link
                key={item.id}
                href={`#${item.link}`}
                prefetch={false}
                style={{
                  textDecorationLine: "none",
                  display: "flex",
                  color: "#000000",
                }}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  paddingX="1em"
                  sx={{
                    height: "36px",
                    background: hash === item.link ? "#ECECF4" : "transparent",
                    borderRadius: "100px",
                    // borderBottom: hash === item.link ? '2px solid #000000' : '2px solid #FFFFFF',
                  }}
                  onClick={() => setHash(item.link)}
                >
                  {item.icon}
                  <Typography
                    sx={{ ml: "0.5rem" }}
                    fontSize="0.8rem"
                    fontWeight={500}
                    whiteSpace="nowrap"
                  >
                    {item.name}
                  </Typography>
                </Box>
              </Link>
            );
          })}
        </Box>
      ) : (
        <Box
          position="fixed"
          mt="2em"
          zIndex={2}
          display="flex"
          flexDirection="column"
        >
          {headerMenuItems.map(item => {
            return (
              <Link
                key={item.id}
                href={`#${item.link}`}
                prefetch={false}
                style={{
                  textDecorationLine: "none",
                  display: "flex",
                  color: "#000000",
                  alignItems: "center",
                }}
                onClick={() => {
                  if (setShowMenu) {
                    setShowMenu(false);
                  }
                }}
              >
                <Box
                  display="flex"
                  mt="0.5rem"
                  alignItems="center"
                  width="100%"
                  sx={
                    hash === item.link
                      ? {
                          bgcolor: "#ECECF4",
                          borderRadius: "100px",
                          paddingX: "20px",
                          gap: "15px",
                          height: "48px",
                        }
                      : {
                          borderRadius: "100px",
                          paddingX: "20px",
                          gap: "15px",
                          height: "48px",
                        }
                  }
                  onClick={() => setHash(item.link)}
                >
                  {item.icon}
                  <Typography
                    sx={{ ml: "0.5rem" }}
                    fontSize="0.8rem"
                    fontWeight={500}
                  >
                    {item.name}
                  </Typography>
                </Box>
              </Link>
            );
          })}
        </Box>
      )}
    </>
  );
};
