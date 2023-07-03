import { Box, Grid } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { PageLoading } from "@/components/PageLoading";
import { PageWrapper } from "@/components/PageWrapper";
import { HeaderMenu } from "@/components/blocks";
import { Header } from "@/components/blocks/Header";
import useToken from "@/hooks/useToken";
import { Connections, Home, Identy, Prompts } from "@/components/dashboard";
import Head from "next/head";

const Dashboard = () => {
  const router = useRouter();

  const [hash, setHash] = useState("home");
  const [token, setToken] = useState<any>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [keyWord, setKeyWord] = useState("");
  const hashElement = useMemo(() => {
    const hash = router.asPath;
    const removeHashCharacter = (str: string) => {
      return str.slice(1);
    };

    if (hash && typeof window !== "undefined") {
      return document.getElementById(removeHashCharacter(hash));
    } else {
      return null;
    }
  }, [router.asPath]);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    if (hashElement) {
      hashElement.scrollIntoView({
        behavior: "auto",
        inline: "nearest",
      });
    }
  }, [hashElement]);

  useEffect(() => {
    const headings = document.querySelectorAll("section");

    const handleScroll = () => {
      headings.forEach((ha) => {
        const rect = ha.getBoundingClientRect();
        if (rect.top > 0 && rect.top < 150 && ha.id) {
          const location = window.location.toString().split("#")[0];
          history.replaceState(null, "", location + "#" + ha.id);
          setHash(ha.id);
        }
      });
    };

    document.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
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
      <PageWrapper>
        <Grid
          sx={{
            background: "#e8e4ff",
            position: "fixed",
            zIndex: 1,
            top: 0,
          }}
        >
          <Header keyWord={keyWord} setKeyWord={setKeyWord} />
        </Grid>
        {showMenu && (
          <HeaderMenu
            hash={hash}
            setShowMenu={setShowMenu}
            setHash={setHash}
            mobile
          />
        )}
        {!!token ? (
          <Grid
            container
            zIndex={1}
            sx={{
              paddingTop: "90px",
              background: "#FDFBFF",
            }}
          >
            <Grid item xs={0} sm={3}>
              <Box display={{ xs: "none", sm: "flex" }} justifyContent="center">
                <HeaderMenu hash={hash} setHash={setHash} />
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              sm={8}
              mt={{ xs: "0px", sm: "3em" }}
              display="flex"
              justifyContent="center"
              flexDirection={{ xs: "column", sm: "row" }}
              zIndex={0}
            >
              <Grid
                item
                xs={0}
                sm={0}
                sx={{
                  flexBasis: { xs: "100%", sm: "0" },
                }}
              >
                <Box
                  display={{ xs: "flex", sm: "none" }}
                  justifyContent="center"
                >
                  <HeaderMenu mobile={true} hash={hash} setHash={setHash} />
                </Box>
              </Grid>

              <Box width={{ xs: "100%", sm: "100%" }}>
                <Home />
                <Connections />
                <Identy />
                <Prompts />
              </Box>
            </Grid>
          </Grid>
        ) : (
          <PageLoading />
        )}
      </PageWrapper>
    </>
  );
};

export default Dashboard;
