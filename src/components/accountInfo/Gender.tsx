import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { FormikProps } from "formik";
import { IEditProfile } from "@/common/types";

interface IProps {
  formik: FormikProps<IEditProfile>;
}

const gendersData = [
  { name: "Male", code: "MALE" },
  { name: "Female", code: "FEMALE" },
  { name: "Non-Binary", code: "NON-BINARY" },
  { name: "Unspecified", code: "OTHER" },
];

export const Gender: React.FC<IProps> = ({ formik }) => {
  const [checked, setChecked] = useState("OTHER");

  useEffect(() => {
    if (formik.values.gender) {
      setChecked(formik.values.gender);
    }
  }, [formik.values.gender]);

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      gap={"16px"}
      width={"100%"}
      bgcolor={"surface.1"}
      padding={{ md: "16px" }}
      borderRadius={"16px"}
    >
      <Typography
        fontWeight={500}
        fontSize="18px"
        textAlign={"start"}
      >
        Gender
      </Typography>
      <Box
        display="flex"
        alignItems="center"
        flexWrap={"wrap"}
        gap={"16px"}
      >
        {gendersData.map(gender => {
          return (
            <Box
              key={gender.code}
              border="1px solid var(--primary-main, #3B4050)"
              padding={"6px 16px"}
              borderRadius="16px"
              bgcolor={checked === gender.code ? "var(--primary-main, #3B4050)" : "surface.1"}
              display="flex"
              justifyContent="center"
              alignItems="center"
              onClick={() => {
                setChecked(gender.code);
                formik.setFieldValue("gender", gender.code);
              }}
              sx={{ cursor: "pointer" }}
            >
              {/* <Icon xs>{gender.icon}</Icon> */}
              <Typography color={checked === gender.code ? "surface.1" : "#454545"}>{gender.name}</Typography>
            </Box>
          );
        })}
      </Box>
      <Typography
        fontWeight={400}
        fontSize="0.8rem"
        mt="0.5rem"
        textAlign={"start"}
      >
        Why we asking
      </Typography>
    </Box>
  );
};
