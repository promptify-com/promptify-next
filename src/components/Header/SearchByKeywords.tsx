import React from "react";
import { Keywords } from "@/common/constants";
import { Grid, MenuItem, MenuList, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { setSelectedKeyword } from "@/core/store/filtersSlice";

const SearchByKeywords = ({ title }: { title: string | null }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  return (
    <Grid>
      <Grid
        sx={{
          display: "flex",
          padding: "24px 24px 8px 24px",
          justifyContent: "space-between",
          alignItems: "flex-start",
          alignSelf: "stretch",
        }}
      >
        <Grid
          sx={{
            color: "var(--on-background, #1B1B1E)",
            fontSize: "12px",
            fontWeight: 500,
            lineHeight: "22px",
            letterSpacing: "0.46px",
            opacity: 0.75,
          }}
        >
          Popular requests:
        </Grid>
        <Grid
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: "8px",
            alignSelf: "stretch",
          }}
        >
          <Typography
            sx={{
              color: "var(--on-surface, #1B1B1E)",
              fontSize: "11px",
              fontWeight: 500,
              lineHeight: "166%",
              letterSpacing: "0.4px",
              opacity: 0.5,
            }}
          >
            Search:
          </Typography>

          <Grid
            sx={{
              borderRadius: "4px",
              background: "var(--surface-5, #E1E2EC)",
              display: "flex",
              padding: "0px 0px 2px 0px",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "8px",
            }}
          >
            <Grid
              sx={{
                display: "flex",
                padding: "2px 4px",
                alignItems: "flex-start",
                borderRadius: "4px",
                border: "1px solid var(--surface-5, #E1E2EC)",
                background: "var(--surface-1, #FDFBFF)",
              }}
            >
              <Typography
                sx={{
                  color: "var(--on-surface, #1B1B1E)",
                  fontSize: "11px",
                  fontWeight: 500,
                  lineHeight: "166%",
                  letterSpacing: "0.4px",
                  opacity: 0.5,
                  textTransform: "uppercase",
                }}
              >
                Enter
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <MenuList
        autoFocusItem={false}
        sx={{ width: "100%" }}
      >
        {Keywords.map(el => (
          <MenuItem
            key={el.name}
            onClick={() => {
              dispatch(setSelectedKeyword(el.name));
              router.push({ pathname: "/explore" });
            }}
            sx={{
              display: "flex",
              padding: "16px 24px",
              alignItems: "flex-start",
              gap: "8px",
              alignSelf: "stretch",
              background: el.name === title ? "#8080801a" : "none",
            }}
          >
            <Typography
              sx={{
                color: "var(--on-background, #1B1B1E)",
                fontSize: "16px",
                fontWeight: 500,
                lineHeight: "22px",
                letterSpacing: "0.46px",
              }}
            >
              {el.name}
            </Typography>
          </MenuItem>
        ))}
      </MenuList>
    </Grid>
  );
};

export default SearchByKeywords;
