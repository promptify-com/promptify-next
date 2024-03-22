import Link from "next/link";
import Box from "@mui/material/Box";
import Icon from "@mui/material/Icon";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Support from "@mui/icons-material/Support";

import BlogPostCard from "@/components/Homepage/BlogPostCard";
import { RaisedHand } from "@/assets/icons/RaisedHand";
import { BlogPosts } from "@/components/Homepage/Constants";
import { BLOG_URL } from "@/common/constants";

interface ILink {
  icon: React.JSX.Element;
  title: string;
  description: string;
  link: string;
}

const LinkCard = ({ link }: { link: ILink }) => (
  <Link
    href={link.link}
    style={{ textDecoration: "none" }}
    target="_blank"
  >
    <Stack
      gap={1}
      sx={{
        p: "24px 32px",
        bgcolor: "#F7F6FE",
        borderRadius: "24px",
      }}
    >
      <Icon
        sx={{
          width: 48,
          height: 48,
          svg: {
            width: "inherit",
            height: "inherit",
            color: "#1C1B1F",
          },
        }}
      >
        {link.icon}
      </Icon>
      <Typography
        fontSize={18}
        fontWeight={400}
        color={"#000000"}
      >
        {link.title}
      </Typography>
      <Typography
        fontSize={14}
        fontWeight={400}
        color={"#000000"}
        minHeight={"50px"}
      >
        {link.description}
      </Typography>
    </Stack>
  </Link>
);

const links: ILink[] = [
  {
    icon: <Support />,
    title: "Help Center",
    description: "Receive support through our help center",
    link: BLOG_URL,
  },
  {
    icon: <RaisedHand />,
    title: "FAQ",
    description: "Browsing our Frequently Asked Questions (FAQs)",
    link: BLOG_URL,
  },
];

function Learn() {
  return (
    <Stack
      py={{ xs: "30px", md: "48px" }}
      gap={4}
    >
      <Stack
        gap={1}
        px={"16px"}
      >
        <Typography
          fontSize={{ xs: 28, md: 32 }}
          fontWeight={400}
          color={"#2A2A3C"}
        >
          Learn & Help
        </Typography>
        <Typography
          fontSize={16}
          fontWeight={400}
          color={"#2A2A3C"}
        >
          Discover insightful content on our blog and get assistance via our help center or by consulting our FAQs.
        </Typography>
      </Stack>
      <Stack
        direction={{ md: "row" }}
        gap={{ xs: 2, md: 0 }}
      >
        <Grid container>
          <Grid
            item
            xs={12}
            md={6}
          >
            <Box
              px={"16px"}
              flex={1}
            >
              <BlogPostCard post={BlogPosts[0]} />
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}
            pb={2}
          >
            <Grid
              container
              gap={1}
              justifyContent={"space-around"}
            >
              <Grid
                item
                xs={5}
              >
                <BlogPostCard
                  post={BlogPosts[1]}
                  min
                />
              </Grid>
              <Grid
                item
                xs={5}
              >
                <BlogPostCard
                  post={BlogPosts[2]}
                  min
                />
              </Grid>
            </Grid>

            <Grid
              container
              gap={1}
              justifyContent={"space-around"}
            >
              {links.map(link => (
                <Grid
                  key={link.title}
                  item
                  xs={5}
                >
                  <LinkCard link={link} />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Stack>
    </Stack>
  );
}

export default Learn;
