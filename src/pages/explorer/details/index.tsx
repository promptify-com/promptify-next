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
import { Header } from "@/components/blocks/Header";
import { Category } from "@/core/api/dto/templates";
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
const label = { inputProps: { "aria-label": "Color switch demo" } };

export default function ExplorerDetail() {
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
        : JSON.parse(category);
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
    if (category) {
      const parsedSubCategory = Array.isArray(subcategory)
        ? JSON.parse(subcategory[0])
        : subcategory;
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
  const { data: categories } = useGetCategoriesQuery();
  const { data: engines } = useGetEnginesQuery();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = React.useState(false);
  const menuAnchorRef = React.useRef<HTMLDivElement | null>(null);
  const menuAnchoMobileRef = React.useRef<HTMLDivElement | null>(null);
  const catgMenuAnchorRef = React.useRef<HTMLDivElement | null>(null);
  const [collections, setCollections] = React.useState<ICollection[]>([]);
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

  useEffect(() => {
    setIsLoadingCollection(true);
    useDeferredAction()
      .then((res: any) => {
        setCollections(res);
        setIsLoadingCollection(false);
      })
      .catch(() => {
        setIsLoadingCollection(false);
      });
  }, []);

  return (
    <>
      <Head>
        <title>Promptify | Boost Your Creativity</title>
        <meta
          name="description"
          content="Free AI Writing App for Unique Idea & Inspiration. Seamlessly bypass AI writing detection tools, ensuring your work stands out."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box>
        <Grid
          sx={{
            backgroundColor: "rgba(245, 244, 250, 1)",
            backgroundSize: "cover",
            width: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Header keyWord={keyWord} setKeyWord={setKeyWord} />
          <Grid
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: { xs: "space-between", sm: "center" },
              paddingLeft: { xs: "0.5em", sm: "0em" },
            }}
          >
            <Grid
              className="scroll-class-name resp-justity"
              sx={{
                // display: '-webkit-box',
                display: { xs: "none", sm: "flex" },
                overflowX: "auto",
                alignItems: "center",
                justifyContent: windowWidth < 1000 ? "flex-start" : "center",
                gap: "0.5em",
                padding: { xs: "0em", sm: "1em 1em" },
                width: "100%",
                maxWidth: { xs: "185px", sm: "96%" },
              }}
            >
              <Grid
                onClick={() => {
                  setIsLoading(true);
                  setCategorySelected({
                    id: -1,
                    name: "All directions",
                    parent: undefined,
                  });
                  setSubCategorSelectedy({
                    id: -1,
                    name: "All subcategories",
                    parent: undefined,
                  });
                }}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  padding: "8px 10px",
                  gap: "8px",
                  maxWidth: "8em",
                  width: "fit-content",
                  height: "1.5em",
                  background:
                    categorySelected.name === "All directions" || !!keyWord
                      ? "#375CA9"
                      : "#FFFFFF",
                  borderRadius: "99px",
                  boxSizing: "initial",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              >
                <Grid
                  sx={{
                    height: "1em",
                    width: "1.5em",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TopicImg />
                </Grid>
                <Typography
                  sx={{
                    display: "flex",
                    fontSize: "0.7em",
                    color:
                      categorySelected.name === "All directions" || !!keyWord
                        ? "#FFFFFF"
                        : "#000000",
                  }}
                >
                  All directions
                </Typography>
              </Grid>
              {!!categories &&
                categories.length > 0 &&
                categories
                  ?.filter((mainCat) => !mainCat.parent)
                  .map((el, idx) => (
                    <Grid
                      onClick={() => {
                        setIsLoading(true);
                        setCategorySelected(el);
                        setSubCategorSelectedy({
                          id: -1,
                          name: "All subcategories",
                          parent: undefined,
                        });
                      }}
                      key={idx}
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        padding: "8px 10px",
                        gap: "8px",
                        maxWidth: "8em",
                        width: "fit-content",
                        height: "1.5em",
                        background:
                          el.id === categorySelected.id && !keyWord
                            ? "#375CA9"
                            : "#FFFFFF",
                        borderRadius: "99px",
                        boxSizing: "initial",
                        cursor: "pointer",
                        "&:hover": {
                          transform: "scale(1.05)",
                        },
                      }}
                    >
                      <Grid
                        sx={{
                          height: "1em",
                          width: "1.5em",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TopicImg />
                      </Grid>
                      <Typography
                        title={el.name.length > 22 ? el.name.toString() : ""}
                        sx={{
                          display: "flex",
                          fontSize: "0.7em",
                          color:
                            el.id === categorySelected.id && !keyWord
                              ? "#FFFFFF"
                              : "#000000",
                        }}
                      >
                        {el?.name.length > 22
                          ? el.name.slice(0, 22) + "..."
                          : el.name}
                      </Typography>
                    </Grid>
                  ))}
            </Grid>
            <Grid
              display={{ xs: "flex", sm: "none" }}
              sx={{
                display: { xs: "flex", sm: "none" },
                flexDirection: "row",
                alignItems: "center",
                padding: "8px 10px",
                gap: "8px",
                width: "fit-content",
                height: "1.5em",
                background: "#375CA9",
                borderRadius: "99px",
                boxSizing: "initial",
              }}
            >
              <Grid
                sx={{
                  height: "1em",
                  width: "1.5em",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {/* <TopicImg /> */}

                <Image
                  src={cardImg}
                  alt={"Unicorn"}
                  loading="lazy"
                  style={{
                    borderRadius: "99px",
                    width: "32px",
                    height: "32px",
                  }}
                />
              </Grid>
              <Typography
                sx={{
                  display: "flex",
                  fontSize: "0.7em",
                  color: "#FFFFFF",
                }}
              >
                {categorySelected.name}
              </Typography>
            </Grid>

            <Grid
              sx={{
                display: { xs: "flex", sm: "none" },
                flexDirection: "row",
                gap: "1em",
                alignItems: "center",
                justifyContent: "center",
                padding: "0.5em",
              }}
            >
              <Grid
                sx={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                }}
              >
                <Grid
                  onClick={() => setIsMenuShown(!isMenuShown)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    "&:hover": {
                      transform: "scale(1.05)",
                      cursor: "pointer",
                    },
                  }}
                >
                  <FilterIcon asc={asc} />
                  <Typography
                    sx={{
                      fontSize: "14px",
                    }}
                    ref={menuAnchoMobileRef}
                  >
                    {filterSelected.title}
                  </Typography>

                  <ArrowDropDownIcon
                    fontSize="small"
                    sx={{
                      opacity: "0.5",
                    }}
                  />
                </Grid>
                <Popper
                  open={isMenuShown}
                  anchorEl={menuAnchoMobileRef.current}
                  role={undefined}
                  placement="bottom-end"
                  transition
                  disablePortal
                  sx={{ zIndex: 2 }}
                >
                  {({ TransitionProps, placement }) => (
                    <Grow
                      {...TransitionProps}
                      style={{
                        transformOrigin:
                          placement === "left-end" ? "left top" : "left top",
                      }}
                    >
                      <Paper
                        sx={{
                          border: "1px solid #E3E3E3",
                          borderRadius: "10px",
                          marginRight: "-2em",
                          width: "13em",
                          marginTop: "5px",
                        }}
                        elevation={0}
                      >
                        <ClickAwayListener
                          onClickAway={() => setIsMenuShown(false)}
                        >
                          <Grid>
                            <MenuList
                              autoFocusItem={false}
                              sx={{ paddingRight: "3rem", width: "100%" }}
                            >
                              {Popularity.map((el, idx) => (
                                <MenuItem
                                  key={idx}
                                  onClick={() => {
                                    setFilterSelected(el);
                                    setIsMenuShown(!isMenuShown);
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      height: "24px",
                                      fontFamily: "Poppins",
                                      fontStyle: "normal",
                                      fontWeight: 400,
                                      fontSize: "16px",
                                      letterSpacing: "0.15px",
                                      color: "#1D2028",
                                      order: 0,
                                    }}
                                  >
                                    {el.title}
                                  </Typography>
                                </MenuItem>
                              ))}
                            </MenuList>
                            <Grid
                              sx={{
                                borderTop: "1px solid #00000024",
                                padding: "0.5em 0.5em 0.5em 0em",
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                                justifyContent: "space-around",
                              }}
                            >
                              <Typography>Ascending</Typography>
                              <GraySwitch
                                checked={asc}
                                onChange={(e) => setAsc(e.target.checked)}
                                {...label}
                                // defaultChecked
                              />
                            </Grid>
                          </Grid>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              </Grid>
              <Grid
                onClick={() => setIsCatgMenuOpen(true)}
                ref={catgMenuAnchorRef}
              >
                <MenuIcon />
              </Grid>
              <Popper
                open={isCatgMenuOpen}
                anchorEl={catgMenuAnchorRef.current}
                role={undefined}
                placement="bottom-end"
                transition
                disablePortal
                sx={{ zIndex: 2 }}
              >
                {({ TransitionProps }) => (
                  <Grow {...TransitionProps}>
                    <Paper
                      sx={{
                        border: "1px solid #E3E3E3",
                        borderRadius: "10px",
                        marginRight: "1em",
                        width: "13em",
                        marginTop: "5px",
                      }}
                      elevation={0}
                    >
                      <ClickAwayListener
                        onClickAway={() => setIsCatgMenuOpen(false)}
                      >
                        <Grid>
                          <MenuList
                            autoFocusItem={false}
                            sx={{ paddingRight: "3rem", width: "100%" }}
                          >
                            <MenuItem
                              onClick={() => {
                                setIsLoading(true);
                                setCategorySelected({
                                  id: -1,
                                  name: "All directions",
                                  parent: undefined,
                                });
                                setSubCategorSelectedy({
                                  id: -1,
                                  name: "All subcategories",
                                  parent: undefined,
                                });
                                setIsCatgMenuOpen(false);
                              }}
                              sx={{
                                background:
                                  categorySelected.name === "All directions"
                                    ? "#375ca917"
                                    : "#FFFFFF",
                              }}
                            >
                              <Typography
                                sx={{
                                  height: "24px",
                                  fontFamily: "Poppins",
                                  fontStyle: "normal",
                                  fontWeight: 400,
                                  fontSize: "16px",
                                  letterSpacing: "0.15px",
                                  color: "#1D2028",
                                  order: 0,
                                }}
                              >
                                All Direction
                              </Typography>
                            </MenuItem>
                            {!!categories &&
                              categories.length > 0 &&
                              categories
                                ?.filter((mainCat) => !mainCat.parent)
                                .map((el, idx) => (
                                  <MenuItem
                                    key={idx}
                                    onClick={() => {
                                      setIsLoading(true);
                                      setCategorySelected(el);
                                      setSubCategorSelectedy({
                                        id: -1,
                                        name: "All subcategories",
                                        parent: undefined,
                                      });
                                      setIsCatgMenuOpen(false);
                                    }}
                                    sx={{
                                      background:
                                        el.id === categorySelected.id &&
                                        !keyWord
                                          ? "#375ca917"
                                          : "#FFFFFF",
                                    }}
                                  >
                                    <Typography
                                      sx={{
                                        height: "24px",
                                        fontFamily: "Poppins",
                                        fontStyle: "normal",
                                        fontWeight: 400,
                                        fontSize: "16px",
                                        letterSpacing: "0.15px",
                                        color: "#1D2028",
                                        order: 0,
                                      }}
                                    >
                                      {el?.name.length > 18
                                        ? el.name.slice(0, 18) + "..."
                                        : el.name}
                                    </Typography>
                                  </MenuItem>
                                ))}
                          </MenuList>
                        </Grid>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </Grid>
          </Grid>

          {categorySelected.name !== "All directions" && (
            <Grid>
              <Grid
                container
                flexDirection="column"
                display={"flex"}
                sx={{
                  margin: "3em 0em 0em 0em",
                }}
                rowGap={2}
              >
                <Grid
                  sx={{
                    display: "flex",
                    justifyContent: { xs: "flex-start", sm: "center" },
                    alignItems: "center",
                    padding: { xs: "0em 1em", sm: "0em" },
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "Poppins",
                      fontStyle: "normal",
                      fontWeight: { xs: 400, sm: 500 },
                      fontSize: { xs: "24px", sm: "48px" },
                      lineHeight: { xs: "133.4%", sm: "72px" },
                      color: { xs: "#1B1B1E", sm: "#1D2028" },
                    }}
                  >
                    {categorySelected.name}
                  </Typography>
                </Grid>
                <Grid
                  sx={{
                    display: "flex",
                    justifyContent: { xs: "flex-start", sm: "center" },
                    alignItems: "center",
                    padding: { xs: "0em 1em", sm: "0em" },
                  }}
                >
                  <Typography
                    sx={{
                      maxWidth: "666px",
                      fontFamily: "Poppins",
                      fontStyle: "normal",
                      fontWeight: 400,
                      fontSize: "14px",
                      lineHeight: "150%",
                      display: "flex",
                      alignItems: "center",
                      textAlign: "inherit",
                      letterSpacing: "0.15px",
                      color: "#1B1B1E",
                    }}
                    align="center"
                  >
                    As the sun set on the year 3022, the world was on the brink
                    of a new era. The rise of artificial intelligence had
                    brought unprecedented progress and prosperity, but it had
                    also given birth to a new breed of anarchist.
                  </Typography>
                </Grid>
              </Grid>
              <Grid
                className="scroll-class-name"
                sx={{
                  display: "-webkit-box",
                  overflowX: "auto",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5em",
                  padding: { xs: "0em", sm: "1em 1em" },
                  width: { xs: "100%", sm: "100%" },
                  margin: { xs: " 1em 0em", sm: "0em" },
                  paddingLeft: { xs: "1em", sm: "1em" },
                  paddingRight: { xs: "1em", sm: "0em" },
                  // maxWidth: { xs: '185px', sm: '96%' },
                }}
              >
                {!(categorySelected.name === "All directions") && (
                  <Typography
                    onClick={() => {
                      setSubCategorSelectedy({
                        id: -1,
                        name: "All subcategories",
                        parent: undefined,
                      });
                    }}
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "8px 12px",
                      width: "fit-content",
                      height: "36px",
                      background:
                        subcategorySelected.id === -1 ? "#375CA9" : "#FFFFFF",
                      color:
                        !!subcategorySelected && subcategorySelected.id === -1
                          ? "#FFFFFF"
                          : "#000000",
                      borderRadius: "100px",
                      fontSize: "13px",
                      cursor: "pointer",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                    }}
                  >
                    All subcategories
                  </Typography>
                )}
                {!!categories &&
                  categories.length > 0 &&
                  categories
                    ?.filter(
                      (mainCat) =>
                        !!mainCat.parent &&
                        mainCat.parent.name === categorySelected.name
                    )
                    .map((el, idx) => (
                      <Typography
                        onClick={() => {
                          setSubCategorSelectedy(el);
                        }}
                        key={idx}
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: "8px 12px",
                          width: "fit-content",
                          height: "36px",
                          background:
                            !!subcategorySelected &&
                            el.name === subcategorySelected.name
                              ? "#375CA9"
                              : "#FFFFFF",
                          color:
                            !!subcategorySelected &&
                            el.name === subcategorySelected.name
                              ? "#FFFFFF"
                              : "#000000",
                          borderRadius: "100px",
                          fontSize: "13px",
                          cursor: "pointer",
                          "&:hover": {
                            transform: "scale(1.05)",
                          },
                        }}
                      >
                        {el.name}
                      </Typography>
                    ))}
              </Grid>
            </Grid>
          )}
        </Grid>

        {
          <Grid
            className="cl-template"
            sx={{
              display: "flex",
              bgcolor: "#F5F5F5",
            }}
          >
            <Grid
              className="side-filter"
              sx={{
                display: { xs: "none", sm: "flex" },
                flexDirection: "column",
                justifyContent: "flex-start",
                gap: "1em",
              }}
            >
              <Grid
                sx={{
                  marginBottom: "10px",
                  height: "32px",
                  fontFamily: "Poppins",
                  fontStyle: "normal",
                  fontWeight: 400,
                  fontSize: "12px",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  color: "#81889E",
                }}
              >
                Sorting By
              </Grid>
              <Grid
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "1em",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <Grid
                  sx={{
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                  }}
                >
                  <Grid
                    onClick={() => setIsMenuShown(!isMenuShown)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      "&:hover": {
                        transform: "scale(1.05)",
                        cursor: "pointer",
                      },
                    }}
                  >
                    <FilterIcon asc={asc} />
                    <Typography
                      sx={{
                        fontSize: "14px",
                      }}
                      ref={menuAnchorRef}
                    >
                      {filterSelected.title}
                    </Typography>

                    <ArrowDropDownIcon
                      fontSize="small"
                      sx={{
                        opacity: "0.5",
                      }}
                    />
                  </Grid>
                  <Popper
                    open={isMenuShown}
                    anchorEl={menuAnchorRef.current}
                    role={undefined}
                    placement="bottom-end"
                    transition
                    disablePortal
                    sx={{ zIndex: 2 }}
                  >
                    {({ TransitionProps, placement }) => (
                      <Grow
                        {...TransitionProps}
                        style={{
                          transformOrigin:
                            placement === "left-end" ? "left top" : "left top",
                        }}
                      >
                        <Paper
                          sx={{
                            border: "1px solid #E3E3E3",
                            borderRadius: "10px",
                            marginRight: "-2em",
                            width: "13em",
                            marginTop: "5px",
                          }}
                          elevation={0}
                        >
                          <ClickAwayListener
                            onClickAway={() => setIsMenuShown(false)}
                          >
                            <Grid>
                              <MenuList
                                autoFocusItem={false}
                                sx={{ paddingRight: "3rem", width: "100%" }}
                              >
                                {Popularity.map((el, idx) => (
                                  <MenuItem
                                    key={idx}
                                    onClick={() => {
                                      setFilterSelected(el);
                                      setIsMenuShown(!isMenuShown);
                                    }}
                                  >
                                    <Typography
                                      sx={{
                                        height: "24px",
                                        fontFamily: "Poppins",
                                        fontStyle: "normal",
                                        fontWeight: 400,
                                        fontSize: "16px",
                                        letterSpacing: "0.15px",
                                        color: "#1D2028",
                                        order: 0,
                                      }}
                                    >
                                      {el.title}
                                    </Typography>
                                  </MenuItem>
                                ))}
                              </MenuList>
                              <Grid
                                sx={{
                                  borderTop: "1px solid #00000024",
                                  padding: "0.5em 0.5em 0.5em 0em",
                                  display: "flex",
                                  alignItems: "center",
                                  width: "100%",
                                  justifyContent: "space-around",
                                }}
                              >
                                <Typography>Ascending</Typography>
                                <GraySwitch
                                  checked={asc}
                                  onChange={(e) => setAsc(e.target.checked)}
                                  {...label}
                                  // defaultChecked
                                />
                              </Grid>
                            </Grid>
                          </ClickAwayListener>
                        </Paper>
                      </Grow>
                    )}
                  </Popper>
                </Grid>
              </Grid>
              <Grid
                sx={{
                  marginBottom: "10px",
                  width: "55px",
                  height: "32px",
                  fontFamily: "Poppins",
                  fontStyle: "normal",
                  fontWeight: 400,
                  fontSize: "12px",
                  lineHeight: "266%",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  color: "#81889E",
                  flex: "none",
                  order: 0,
                  flexGrow: 0,
                }}
              >
                Engines
              </Grid>
              <Grid>
                {!!engines &&
                  engines.length > 0 &&
                  engines.map((el, idx) => (
                    <Grid
                      key={idx}
                      onClick={() => setEngineSelected(`${el.id}`)}
                      sx={{
                        padding: "4px 10px",
                        border: "1px solid rgba(59, 64, 80, 0.15)",
                        borderRadius: "100px",
                        background:
                          engineSelected === `${el.id}` ? "#f6f5ff" : "white",
                        height: "35px",
                        marginBottom: "16px",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        display: "flex",
                        gap: "10px",
                        width: "fit-content",
                        "&:hover": {
                          transform: "scale(1.005)",
                          cursor: "pointer",
                          boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
                        },
                      }}
                      title={el.name.length > 23 ? el.name : ""}
                    >
                      <VictorIcon />
                      {windowWidth < 716 ? (
                        <Typography
                          sx={{
                            fontFamily: "Poppins",
                            fontStyle: "normal",
                            fontWeight: 500,
                            fontSize: "13px",
                            lineHeight: "22px",
                            letterSpacing: "0.46px",
                            color: "#3B4050",
                          }}
                        >
                          {el.name.length > 9
                            ? el.name.slice(0, 9) + "..."
                            : el.name}
                        </Typography>
                      ) : (
                        <Typography
                          sx={{
                            fontFamily: "Poppins",
                            fontStyle: "normal",
                            fontWeight: 500,
                            fontSize: "13px",
                            lineHeight: "22px",
                            letterSpacing: "0.46px",
                            color: "#3B4050",
                          }}
                        >
                          {el.name.length > 23
                            ? el.name.slice(0, 23) + "..."
                            : el.name}
                        </Typography>
                      )}
                    </Grid>
                  ))}
              </Grid>
            </Grid>

            <Grid
              className="lst-template"
              sx={{
                display: "flex",
                flexDirection: "column",
                width: { xs: "100%", sm: "80%" },
                justifyContent: "flex-start",
              }}
            >
              <CustomListDetailTemplates
                categorySelected={categorySelected}
                subcategorySelected={subcategorySelected}
                engineSelected={engineSelected}
                keyWordSearch={keyWord}
                asc={asc}
                filterSelected={filterSelected}
                collections={collections}
                isLoadingCollection={isLoadingCollection}
                windowWidth={windowWidth}
              />
            </Grid>
          </Grid>
        }
      </Box>
    </>
  );
}
