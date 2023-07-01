import React from "react";
import { Box, TextField, Typography } from "@mui/material";
import { FormikProps } from "formik";
import { IEditProfile } from "@/common/types";

interface IProps {
  formik: FormikProps<IEditProfile>;
}

export const About: React.FC<IProps> = ({ formik }) => {
  return (
    <Box mt="70px">
      <Typography
        fontWeight={500}
        fontSize="1rem"
        textAlign={{ xs: "center", sm: "start" }}
      >
        About you
      </Typography>
      <Box
        mt="1rem"
        display="flex"
        justifyContent={{ xs: "center", sm: "flex-start" }}
      >
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
          sx={{ width: { xs: "90%", sm: "100%" } }}
        />
      </Box>
    </Box>
  );
};
