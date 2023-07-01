import React, { useState } from "react";
import {
  Avatar,
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { FormikProps } from "formik";
import { IEditProfile } from "@/common/types";

interface IProps {
  formik: FormikProps<IEditProfile>;
}

const FinishCard: React.FC<IProps> = ({ formik }) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  return (
    <Box
      sx={{
        width: "100%",
        mt: "70px",
        mr: "20px",
      }}
      borderRadius="10px"
      border={"2px solid #BCBCBC"}
      flexDirection="column"
    >
      <Box
        aria-label="upload picture"
        component="label"
        sx={{ cursor: "pointer" }}
      >
        <Avatar
          src={selectedImage ? URL.createObjectURL(selectedImage) : "no-image"}
          sx={{
            width: "100px",
            height: "100px",
            ml: { xs: "1rem", md: "2.5rem" },
            mt: "-50px",
          }}
        />
        <input
          hidden
          accept="image/*"
          type="file"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            const image = event?.target?.files?.[0] || null;
            setSelectedImage(image);
            formik.setFieldValue("avatar", image);
          }}
        />
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-around", mt: "1rem" }}>
        <TextField
          sx={{
            width: "40%",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderRadius: 3,
              },
            },
          }}
          id="outlined-required"
          label="FirstName"
          name="first_name"
          onChange={formik.handleChange}
          value={formik.values.first_name}
          error={!!formik.touched.first_name && !!formik.errors.first_name}
          helperText={formik.touched.first_name && formik.errors.first_name}
        />
        <TextField
          sx={{
            width: "40%",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderRadius: 3,
              },
            },
          }}
          id="outlined-required"
          name="last_name"
          label="Last Name"
          onChange={formik.handleChange}
          value={formik.values.last_name}
          error={!!formik.touched.last_name && !!formik.errors.last_name}
          helperText={formik.touched.last_name && formik.errors.last_name}
        />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-around", mt: "1rem" }}>
        <TextField
          sx={{
            width: "90%",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderRadius: 3,
              },
            },
          }}
          name="username"
          id="outlined-required"
          label="Nickname"
          onChange={formik.handleChange}
          value={formik.values.username}
          error={!!formik.touched.username && !!formik.errors.username}
          helperText={formik.touched.username && formik.errors.username}
        />
      </Box>

      <FormControl
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          mb: "1rem",
          mt: "1rem",
        }}
      >
        <Typography sx={{ ml: "2rem", color: "grey", fontSize: "0.8rem" }}>
          Gender
        </Typography>
        <RadioGroup
          name="gender"
          row
          defaultValue="MALE"
          sx={{ ml: "2rem" }}
          onChange={formik.handleChange}
          value={formik.values.gender}
        >
          <FormControlLabel
            value="MALE"
            control={
              <Radio
                color="secondary"
                sx={{
                  "&:hover": {
                    backgroundColor: "transparent !important",
                  },
                }}
              />
            }
            label="Male"
          />
          <FormControlLabel
            value="FEMALE"
            control={
              <Radio
                color="secondary"
                sx={{
                  "&:hover": {
                    backgroundColor: "transparent !important",
                  },
                }}
              />
            }
            label="Female"
          />
          <FormControlLabel
            value="OTHER"
            control={
              <Radio
                color="secondary"
                sx={{
                  "&:hover": {
                    backgroundColor: "transparent !important",
                  },
                }}
              />
            }
            label="Unspecified"
          />
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default FinishCard;
