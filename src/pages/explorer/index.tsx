import {
  Box,
  ClickAwayListener,
  Grid,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Switch,
  Typography,
  alpha,
} from "@mui/material";
import React, { useEffect } from "react";
import { TopicImg } from "@/assets/icons/TopicImg";
import { VictorIcon } from "@/assets/icons/VictorIcon";
import { Popularity, TypePopularity } from "@/common/helpers/getFilter";
import { Category, Tag } from "@/core/api/dto/templates";
import { useGetCategoriesQuery, useGetEnginesQuery } from "@/core/api/explorer";
import { CustomListDetailTemplates } from "@/components/explorerDetails/CustomListTemplates";
import { FilterIcon } from "@/assets/icons/FilterIcon";
import { blue } from "@mui/material/colors";
import styled from "@emotion/styled";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { MenuIcon } from "@/assets/icons/MenuIcon";
import { useCollection } from "@/hooks/api/collections";
import { ICollection } from "@/common/types/collection";
import cardImg from "@/assets/images/cardImg.png";
import { useWindowSize } from "usehooks-ts";
import Head from "next/head";
import { useRouter } from "next/router";
import Image from "next/image";
import { authClient } from "@/common/axios";
import { Sidebar } from "@/components/blocks/VHeader/Sidebar";
import { Header } from "@/components/blocks/VHeader";
import { ExploreFilterSideBar } from "@/components/explorer/ExploreFilterSideBar";
const label = { inputProps: { "aria-label": "Color switch demo" } };

export default function ExplorerDetail({
  collections,
  categories,
  engines,
  tags,
}: {
  collections: ICollection[];
  categories: Category[];
  engines: any[];
  tags: Tag[];
}) {
  const router = useRouter();
  const { category, subcategory, keyWordP } = router.query;

  const [keyWord, setKeyWord] = React.useState<string>("");

  const [categorySelected, setCategorySelected] = React.useState<Category>({
    id: -1,
    name: "All subcategories",
    parent: undefined,
  });

  React.useEffect(() => {
    if (category) {
      const parsedCategory = Array.isArray(category)
        ? JSON.parse(category[0])
        : category;
      setCategorySelected(parsedCategory);
    }
  }, [category]);

  React.useEffect(() => {
    if (!!keyWordP) {
      const keyWord = Array.isArray(keyWordP) ? keyWordP[0] : keyWordP;
      setKeyWord(keyWord);
    }
  }, [keyWord]);
  const [subcategorySelected, setSubCategorSelectedy] =
    React.useState<Category>({
      id: -1,
      name: "All subcategories",
      parent: undefined,
    });

  React.useEffect(() => {
    if (subcategory) {
      const parsedSubCategory = Array.isArray(subcategory)
        ? JSON.parse(subcategory[0])
        : JSON.parse(subcategory);
      setSubCategorSelectedy(parsedSubCategory);
    }
  }, [category]);
  const [engineSelected, setEngineSelected] = React.useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isMenuShown, setIsMenuShown] = React.useState(false);
  const [isCatgMenuOpen, setIsCatgMenuOpen] = React.useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isListView, setIsListView] = React.useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [asc, setAsc] = React.useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [filterSelected, setFilterSelected] = React.useState<TypePopularity>(
    Popularity[0]
  );

  // const { data: engines } = useGetEnginesQuery();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = React.useState(false);
  const menuAnchorRef = React.useRef<HTMLDivElement | null>(null);
  const menuAnchoMobileRef = React.useRef<HTMLDivElement | null>(null);
  const catgMenuAnchorRef = React.useRef<HTMLDivElement | null>(null);
  const [isLoadingCollection, setIsLoadingCollection] =
    React.useState<boolean>(false);
  const [useDeferredAction] = useCollection();
  const { width: windowWidth } = useWindowSize();

  const GraySwitch = styled(Switch)(() => ({
    "& .MuiSwitch-switchBase.Mui-checked": {
      color: blue[600],
      "&:hover": {
        backgroundColor: alpha(blue[600], 0.04),
      },
    },
    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
      backgroundColor: blue[600],
    },
  }));

  return (
    <>
      <Box sx={{ bgcolor: "surface.3" }}>
        <Grid display={"flex"}>
          <Sidebar />
          <ExploreFilterSideBar
            categories={categories}
            engines={engines}
            tags={tags}
          />
        </Grid>
        <Box
          sx={{
            minHeight: "100vh",
            width: { md: "calc(100% - 96px - 230px)" },
            ml: { md: "auto" },
          }}
        >
          <Header transparent />
          <Box>
            <Grid
              sx={{
                padding: { xs: "1em 0em 0em 1em", sm: "1.5em 2em" },
              }}
              display={"flex"}
              direction={"column"}
            >
              <Typography fontSize={19}> Browse Category </Typography>
            </Grid>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export async function getServerSideProps() {
  try {
    const collectionResponse = await authClient.get("/api/meta/collections/");
    const collections = collectionResponse.data; // Extract the necessary data from the response
    const tagsResponse = await authClient.get("/api/meta/tags/popular/");
    const tags = tagsResponse.data;
    const enginesResponse = await authClient.get("/api/meta/engines");
    const engines = enginesResponse.data;
    const categoryRequest = await authClient.get("/api/meta/categories/");
    const categories = categoryRequest.data;

    return {
      props: {
        collections,
        categories,
        tags,
        engines,
        title: "Promptify | Boost Your Creativity",
        description:
          "Free AI Writing App for Unique Idea & Inspiration. Seamlessly bypass AI writing detection tools, ensuring your work stands out.",
      },
    };
  } catch (error) {
    console.error("Error fetching collections:", error);
    return {
      props: {
        collections: [],
        categories: [],
        engines: [],
        tags: [],
        title: "Promptify | Boost Your Creativity",
        description:
          "Free AI Writing App for Unique Idea & Inspiration. Seamlessly bypass AI writing detection tools, ensuring your work stands out.",
      },
    };
  }
}
