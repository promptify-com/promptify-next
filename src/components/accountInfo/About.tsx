import React from "react";
import { Box, TextField, Typography } from "@mui/material";
import { FormikProps } from "formik";
import { IEditProfile } from "@/common/types";

interface IProps {
  formik: FormikProps<IEditProfile>;
}

export const About: React.FC<IProps> = ({ formik }) => {
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
      <Typography fontWeight={500} fontSize="18px" textAlign={"start"}>
        About you
      </Typography>
      <Box display="flex">
        <TextField
          id="outlined-multiline-static"
          label="Short"
          name="bio"
          value={formik.values.bio}
          onChange={formik.handleChange}
          error={!!formik.touched.bio && !!formik.errors.bio}
          helperText={formik.touched.bio && formik.errors.bio}
          multiline
          rows={10}
          sx={{ width: { xs: "100%", md: "85%" } }}
        />
      </Box>
    </Box>
  );
};
