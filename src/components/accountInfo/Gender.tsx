import React, { useEffect, useState } from "react";
import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import { Box, Typography } from "@mui/material";
import { FormikProps } from "formik";
import { IEditProfile } from "@/common/types";

interface IProps {
  formik: FormikProps<IEditProfile>;
}

const gendersData = [
  { name: "Male", code: "MALE", icon: <MaleIcon /> },
  { name: "Female", code: "FEMALE", icon: <FemaleIcon /> },
  // { name: 'Non-binary', id: 2, icon: <TransgenderIcon /> },
  { name: "Unspecified", code: "OTHER", icon: <QuestionMarkIcon /> },
];

export const Gender: React.FC<IProps> = ({ formik }) => {
  const [checked, setChecked] = useState("OTHER");

  useEffect(() => {
    if (formik.values.gender) {
      setChecked(formik.values.gender);
    }
  }, [formik.values.gender]);

  return (
    <Box mt="70px">
      <Typography
        fontWeight={500}
        fontSize="1rem"
        textAlign={{ xs: "center", sm: "start" }}
      >
        Gender
      </Typography>
      <Box
        display="flex"
        mt="1rem"
        flexDirection={{ xs: "column", sm: "row" }}
        alignItems="center"
      >
        {gendersData.map((gender) => {
          return (
            <Box
              key={gender.code}
              mr={{ xs: "0rem", sm: "1rem" }}
              mt={{ xs: "0.5rem", sm: "0rem" }}
              border="1px solid #454545"
              paddingY="10px"
              paddingX="10px"
              width="150px"
              borderRadius="10px"
              bgcolor={checked === gender.code ? "#454545" : "#FFF"}
              color={checked === gender.code ? "#FFF" : "#454545"}
              display="flex"
              justifyContent="center"
              alignItems="center"
              onClick={() => {
                setChecked(gender.code);
                formik.setFieldValue("gender", gender.code);
              }}
              sx={{ cursor: "pointer" }}
            >
              {gender.icon}
              <Typography>{gender.name}</Typography>
            </Box>
          );
        })}
      </Box>
      <Typography
        fontWeight={400}
        fontSize="0.8rem"
        mt="0.5rem"
        textAlign={{ xs: "center", sm: "start" }}
      >
        Why we asking
      </Typography>
    </Box>
  );
};
