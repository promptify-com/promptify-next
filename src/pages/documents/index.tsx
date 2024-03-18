import Stack from "@mui/material/Stack";
import Seo from "@/components/Seo";
import { Layout } from "@/layout";
import Protected from "@/components/Protected";
import TemplatesCarousel from "@/components/Documents/TemplatesCarousel";

export default function DocumentsPage() {
  return (
    <>
      <Seo title={"My Documents"} />
      <Layout>
        <Protected>
          <Stack
            gap={3}
            p={"40px 72px"}
          >
            <TemplatesCarousel />
          </Stack>
        </Protected>
      </Layout>
    </>
  );
}
