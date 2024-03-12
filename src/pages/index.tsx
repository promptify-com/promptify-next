import Box from "@mui/material/Box";
import { useSelector } from "react-redux";
import { Layout } from "@/layout";
import { isValidUserFn } from "@/core/store/userSlice";
import { GetServerSideProps } from "next/types";
import { getCategories } from "@/hooks/api/categories";
import { Category } from "@/core/api/dto/templates";
import { SEO_DESCRIPTION, SEO_TITLE } from "@/common/constants";
import GuestUserLayout from "@/components/Homepage/GuestUserLayout";
import HomepageLayout from "@/components/Homepage";
import FooterPrompt from "@/components/explorer/FooterPrompt";

const HomePage = ({ categories }: { categories: Category[] }) => {
  const isValidUser = useSelector(isValidUserFn);

  return (
    <Layout>
      <Box
        mt={{ xs: 7, md: 0 }}
        padding={{ xs: "4px 0px", md: "0px 8px" }}
        p={{ xs: "16px", md: "32px" }}
      >
        {isValidUser ? <HomepageLayout categories={categories} /> : <GuestUserLayout categories={categories} />}
        <FooterPrompt />
      </Box>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader("Cache-Control", "public, maxage=1800, stale-while-revalidate=30");

  const categories = await getCategories();

  return {
    props: {
      categories,
      title: SEO_TITLE,
      description: SEO_DESCRIPTION,
    },
  };
};

export default HomePage;
