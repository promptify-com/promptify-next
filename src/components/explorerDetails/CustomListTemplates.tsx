import { Grid, Typography } from "@mui/material";
import React from "react";

import { NotFoundIcon } from "@/assets/icons/NotFoundIcon";
import { TypePopularity } from "@/common/helpers/getFilter";
import { FetchLoading } from "@/components/FetchLoading";
import { Category, FilterParams } from "@/core/api/dto/templates";
import {
  useGetTemplatesByFilterQuery,
  useGetTemplatesByKeyWordQuery,
} from "@/core/api/explorer";
import ListTemplate from "./ListPrompt";
import { ICollection } from "@/common/types/collection";
import Collections from "./Collections";
import { useRouter } from "next/router";

interface Props {
  engineSelected: string;
  categorySelected: Category;
  subcategorySelected: Category;
  keyWordSearch: string;
  asc: boolean;
  filterSelected: TypePopularity;
  collections: ICollection[];
  isLoadingCollection: boolean;
  windowWidth: number;
}

export const CustomListDetailTemplates: React.FC<Props> = ({
  engineSelected,
  categorySelected,
  subcategorySelected,
  keyWordSearch,
  asc,
  filterSelected,
  isLoadingCollection,
  collections,
  windowWidth,
}) => {
  const router = useRouter();
  const filter: FilterParams = {
    categoryId: categorySelected.id === -1 ? "" : `${categorySelected.id}`,
    subcategoryId:
      subcategorySelected.id === -1 ? "" : `${subcategorySelected.id}`,
    engineId: engineSelected,
    filter: asc ? filterSelected.value : "-" + filterSelected.value,
  };
  const { data: templatesKW, isFetching } =
    keyWordSearch !== ""
      ? useGetTemplatesByKeyWordQuery(keyWordSearch, {
          refetchOnMountOrArgChange: true,
        })
      : useGetTemplatesByFilterQuery(filter, {
          refetchOnMountOrArgChange: true,
        });

  return (
    <Grid
      sx={{
        width: "100%",
      }}
    >
      {categorySelected.id === -1 && (
        <Grid
          sx={{
            display: { xs: "flex", sm: "none" },
            flexDirection: "row",
            alignItems: "center",
            padding: 0,
            height: "36px",
            border: "1px solid #E7E7F0",
            borderRadius: "100px",
            margin: "2em 0em",
          }}
        >
          <Grid
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "6px 16px",
              height: "36px",
              background: "#1B1B1E",
              borderRadius: "19px 0px 0px 19px",
              color: "white",
              width: "12%",
            }}
          >
            All
          </Grid>
          <Grid
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "6px 16px",
              height: "36px",
              borderRadius: "4px",
              bgcolor: "#F5F5F5",
              color: "#000000",
              border: "1px solid #E7E7F0",
              borderLeft: "none",
              width: "40%",
            }}
          >
            <Typography
              sx={{
                fontFamily: "Poppins",
                fontStyle: "normal",
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "24px",
                letterSpacing: "0.4px",
                color: "#1B1B1E",
              }}
            >
              Collections: 74
            </Typography>
          </Grid>
          <Grid
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "6px 16px",
              height: "36px",
              borderRadius: "4px",
              bgcolor: "#F5F5F5",
              color: "#000000",
              border: "1px solid #E7E7F0",
              borderRight: "none",
              borderLeft: "none",
              width: "40%",
            }}
          >
            <Typography
              sx={{
                fontFamily: "Poppins",
                fontStyle: "normal",
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "24px",
                letterSpacing: "0.4px",
                color: "#1B1B1E",
              }}
            >
              Templates: 16k
            </Typography>
          </Grid>
        </Grid>
      )}
      {!keyWordSearch && (
        <Collections
          collections={collections}
          isLoadingCollection={isLoadingCollection}
          title={"Collections"}
        />
      )}
      <Grid
        sx={{
          justifyContent: "flex-start",
        }}
      >
        <Grid>
          <Typography
            sx={{
              fontFamily: "Poppins",
              fontStyle: "normal",
              fontWeight: 400,
              fontSize: "24px",
              lineHeight: "133.4%",
              color: "#1B1B1E",
              marginBottom: "1em",
            }}
          >
            Templates
          </Typography>
        </Grid>
      </Grid>
      <Grid
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: { xs: "2em", sm: "0em" },
        }}
      >
        {!isFetching ? (
          !!templatesKW && templatesKW.length > 0 ? (
            templatesKW.map((el, idx) => (
              <ListTemplate
                onFavoriteClick={() => router.push(`/prompt/${el.id}`)}
                key={idx}
                template={el}
                windowWidth={windowWidth}
              />
            ))
          ) : (
            <Grid
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <NotFoundIcon />
            </Grid>
          )
        ) : (
          <FetchLoading />
        )}
      </Grid>
    </Grid>
  );
};
