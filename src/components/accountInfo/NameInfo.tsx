import React from "react";
import { Box, TextField, Typography } from "@mui/material";
import { FormikProps } from "formik";
import { IEditProfile } from "@/common/types";

interface IProps {
  formik: FormikProps<IEditProfile>;
}

export const NameInfo: React.FC<IProps> = ({ formik }) => {
  return (
    <Box mt="2rem">
      <Typography
        fontWeight={500}
        fontSize="1rem"
        textAlign={{ xs: "center", sm: "start" }}
      >
        Name Info
      </Typography>
      <Box
        sx={{
          width: "100%",
          mt: "1rem",
        }}
        flexDirection="column"
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: { xs: "center", sm: "space-between" },
            alignItems: "center",
            mt: "1rem",
          }}
        >
          <TextField
            sx={{
              width: { xs: "90%", sm: "47%" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderRadius: 3,
                },
              },
            }}
            name="first_name"
            id="outlined-required"
            label="FirstName"
            value={formik.values.first_name}
            onChange={formik.handleChange}
            helperText={formik.touched.first_name && formik.errors.first_name}
            error={
              !!formik.touched.first_name && Boolean(formik.errors.first_name)
            }
          />

          <TextField
            sx={{
              width: { xs: "90%", sm: "47%" },
              mt: { xs: "1rem", sm: "0rem" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderRadius: 3,
                },
              },
            }}
            id="outlined-required"
            label="Last Name"
            name="last_name"
            onChange={formik.handleChange}
            value={formik.values.last_name}
            helperText={formik.touched.last_name && formik.errors.last_name}
            error={
              !!formik.touched.last_name && Boolean(formik.errors.last_name)
            }
          />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", mt: "1rem" }}>
          <TextField
            sx={{
              width: { xs: "90%", sm: "100%" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderRadius: 3,
                },
              },
            }}
            id="outlined-required"
            label="Nickname"
            name="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            helperText={formik.touched.username && formik.errors.username}
            error={!!formik.touched.username && Boolean(formik.errors.username)}
          />
        </Box>
      </Box>
      <Box
        display="flex"
        mt="0.5rem"
        flexDirection={{ xs: "column", sm: "row" }}
      >
        <Typography
          fontWeight={400}
          fontSize="0.8rem"
          textAlign={{ xs: "center", sm: "start" }}
          whiteSpace="nowrap"
        >
          Nickname will be used as link to your profile:
        </Typography>
        <Typography
          fontWeight={500}
          fontSize="0.8rem"
          textAlign={{ xs: "center", sm: "start" }}
          overflow="hidden"
          textOverflow="ellipsis"
          maxWidth="90%"
          alignSelf={{ xs: "center", sm: "start" }}
          whiteSpace="nowrap"
        >
          &nbsp; www.promptify.com/users/{formik.values.username}
        </Typography>
      </Box>
    </Box>
  );
};
