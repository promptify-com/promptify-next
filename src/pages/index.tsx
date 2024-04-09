import Box from "@mui/material/Box";
import type { GetServerSideProps } from "next/types";
import { Layout } from "@/layout";
import { isValidUserFn } from "@/core/store/userSlice";
import { getCategories } from "@/hooks/api/categories";
import { useAppSelector } from "@/hooks/useStore";
import { SEO_DESCRIPTION, SEO_TITLE } from "@/common/constants";
import useBrowser from "@/hooks/useBrowser";
import GuestUserLayout from "@/components/Homepage/GuestUserLayout";
import HomepageLayout from "@/components/Homepage";
import Footer from "@/components/Footer";
import type { Category } from "@/core/api/dto/templates";

function HomePage({ categories }: { categories: Category[] }) {
  const isValidUser = useAppSelector(isValidUserFn);
  const { isMobile } = useBrowser();

  return (
    <Layout>
      <Box
        mt={{ xs: 7, md: 0 }}
        padding={{ xs: "4px 0px", md: "0px 8px" }}
        p={{ xs: "16px", md: "42px" }}
      >
        {isValidUser ? <HomepageLayout categories={categories} /> : <GuestUserLayout categories={categories} />}
        {!isMobile && <Footer />}
      </Box>
    </Layout>
  );
}

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
