import React from "react";
import { Box, Typography } from "@mui/material";
import UnicornLeft from "@/assets/images/UnicornLeft.png";
import { PrivacyItem } from "./PrivacyItem";
import Image from "next/image";

const privacyData = [
  {
    name: "Content Group ",
    id: 0,
    allowed: false,
    content: [
      { name: "Content detailed ", id: 0, allowed: false },
      { name: "Content detailed ", id: 1, allowed: false },
      { name: "Content detailed ", id: 2, allowed: false },
    ],
  },
  {
    name: "Content Group ",
    id: 1,
    allowed: false,
    content: [
      { name: "Content detailed ", id: 0, allowed: false },
      { name: "Content detailed ", id: 1, allowed: false },
      { name: "Content detailed ", id: 2, allowed: false },
    ],
  },
  {
    name: "Content Group ",
    id: 2,
    allowed: true,
    content: [
      { name: "Content detailed ", id: 0, allowed: true },
      { name: "Content detailed ", id: 1, allowed: true },
      { name: "Content detailed ", id: 2, allowed: false },
    ],
  },
];

export const Privacy = () => {
  return (
    <section
      id="privacy"
      style={{ scrollMarginTop: "100px", marginTop: "8rem" }}
    >
      <Box
        display="flex"
        alignItems="center"
        flexDirection={{ xs: "column", sm: "row" }}
        mb={{ xs: "2rem", sm: "0rem" }}
      >
        <Box>
          <Typography
            fontWeight={500}
            fontSize={{ xs: "1.5rem", sm: "2rem" }}
            textAlign={{ xs: "center", sm: "start" }}
          >
            Data Privacy
          </Typography>
          <Box display={{ xs: "flex", sm: "none" }} justifyContent="center">
            <Image src={UnicornLeft} alt={"Unicorn"} loading="lazy" />
          </Box>
          <Typography
            fontWeight={500}
            fontSize="1rem"
            mt="1rem"
            width={{ xs: "100%", sm: "80%" }}
            textAlign={{ xs: "center", sm: "start" }}
          >
            Choose what you want to share blah balh blah, short description in 3
            rows to fill in the information, and personalization will improve
            the data output by 34 percent
          </Typography>
          <Typography
            fontWeight={500}
            fontSize="1rem"
            mt="1rem"
            color="#3C8AFF"
            sx={{ cursor: "pointer" }}
            textAlign={{ xs: "center", sm: "start" }}
          >
            Regulator compliance info
          </Typography>
        </Box>
        <Box display={{ xs: "none", sm: "block" }}>
          <Image src={UnicornLeft} alt={"Unicorn"} loading="lazy" />
        </Box>
      </Box>
      {privacyData.map((item) => {
        return <PrivacyItem item={item} key={item.id} />;
      })}
    </section>
  );
};
