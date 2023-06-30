import { Grid } from "@mui/material";
import React from "react";
import { NotFoundIcon } from "@/assets/icons/NotFoundIcon";
import { TypePopularity } from "@/common/helpers/getFilter";
import { FetchLoading } from "@/components/FetchLoading";
import { Category, FilterParams } from "@/core/api/dto/templates";
import {
  useGetTemplatesByFilterQuery,
  useGetTemplatesByKeyWordQuery,
} from "@/core/api/explorer";
import { CustomDetailCardTemplates } from "./CustomDetailsCardTemplate";

interface Props {
  engineSelected: string;
  categorySelected: Category;
  subcategorySelected: Category;
  keyWordSearch: string;
  asc: boolean;
  filterSelected: TypePopularity;
}

export const CustomDetailTemplates: React.FC<Props> = ({
  engineSelected,
  categorySelected,
  subcategorySelected,
  keyWordSearch,
  asc,
  filterSelected,
}) => {
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
    <Grid>
      {!isFetching ? (
        !!templatesKW && templatesKW.length > 0 ? (
          <CustomDetailCardTemplates templates={[]} />
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
  );
};
