import React from "react";
import { Box, Grid, TextField, Typography } from "@mui/material";
import { FormikProps } from "formik";
import { IEditProfile } from "@/common/types";

interface IProps {
  formik: FormikProps<IEditProfile>;
}

export const NameInfo: React.FC<IProps> = ({ formik }) => {
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
      <Typography fontWeight={500} fontSize="1rem" textAlign={"start"}>
        Name Info
      </Typography>
      <Box
        sx={{
          width: "100%",
        }}
        gap={16}
        flexDirection="column"
      >
        <Grid
          container
          display={"flex"}
          flexDirection={{ xs: "column", md: "row" }}
          justifyContent={{ xs: "center", md: "space-between" }}
          gap={"16px"}
        >
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              sx={{
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
          </Grid>

          <TextField
            sx={{
              width: { xs: "100%", sm: "47%" },
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
        </Grid>
        <Box sx={{ display: "flex", justifyContent: "center", mt: "1rem" }}>
          <TextField
            sx={{
              width: "100%",
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
      <Box display="flex" flexDirection={{ xs: "column", md: "row" }}>
        <Typography
          fontWeight={400}
          fontSize="0.8rem"
          textAlign={{ xs: "start", sm: "start" }}
          whiteSpace="nowrap"
        >
          Nickname will be used as link to your profile:
        </Typography>
        <Typography
          fontWeight={600}
          fontSize="0.8rem"
          textAlign={{ xs: "start", sm: "start" }}
          overflow="hidden"
          textOverflow="ellipsis"
          alignSelf={{ xs: "start", sm: "start" }}
          whiteSpace="nowrap"
        >
          www.promptify.com/users/{formik.values.username}
        </Typography>
      </Box>
    </Box>
  );
};
