import { Layout } from "@/layout";
import Protected from "@/components/Protected";
import { SEO_DESCRIPTION } from "@/common/constants";
import ContentWrapper from "@/components/profile2/ContentWrapper";
import { Connections } from "@/components/profile2/Connections";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "next/link";

function ProfileSocialAccounts() {
  return (
    <Protected>
      <Layout>
        <ContentWrapper
          title="My accounts"
          description="Enhance your experience and unlock personalized features by connecting your accounts. By linking your accounts, our app can securely access relevant information to tailor recommendations and provide a more personalized user experience."
        >
          <Box
            width={"calc(100% - 32px)"}
            px={"16px"}
          >
            <Connections />
          </Box>
          <Box p={"8px 16px"}>
            <Stack
              direction={"row"}
              alignItems={"center"}
              gap={2}
              sx={{
                p: "24px",
                border: "1px solid",
                borderColor: "surfaceContainerHighest",
                borderRadius: "24px",
              }}
            >
              <Typography
                fontSize={16}
                fontWeight={400}
                color={"onSurface"}
                sx={{
                  a: {
                    textDecoration: "none",
                    color: "inherit",
                    fontWeight: 500,
                  },
                }}
              >
                Visit the <Link href={"/profile/identity"}>Identity page</Link> to review the data that the app will
                utilize to generate suggestions.
              </Typography>
              <Button
                onClick={() => console.log("setup identity")}
                variant="contained"
                sx={{
                  minWidth: "auto",
                  p: "8px 16px",
                  fontSize: 14,
                  fontWeight: 500,
                  borderColor: "inverseSurface",
                  bgcolor: "inverseSurface",
                  color: "onPrimary",
                  ":hover": {
                    color: "onSurface",
                  },
                }}
              >
                Set-up Identity
              </Button>
            </Stack>
          </Box>
        </ContentWrapper>
      </Layout>
    </Protected>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      title: "My social accounts",
      description: SEO_DESCRIPTION,
    },
  };
}

export default ProfileSocialAccounts;
