import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useGetUserDetailsQuery, useGetUserTemplatesQuery } from "@/core/api/user";

import { Layout } from "@/layout";
import { TemplatesSection } from "@/components/explorer/TemplatesSection";
import Image from "@/components/design-system/Image";

function ProfilePage() {
  const router = useRouter();
  const username = router.query.username;

  const { data: user } = useGetUserDetailsQuery(username);
  const { data: templates, isLoading: templatesLoading } = useGetUserTemplatesQuery(username);

  return (
    <Layout>
      {user && (
        <Stack
          direction={{ xs: "column", md: "row" }}
          p={{ xs: " 80px 16px", md: "48px" }}
          alignItems={"start"}
          gap={"90px"}
        >
          <Stack gap={"32px"}>
            <Box
              position={"relative"}
              width={"152px"}
              height={"152px"}
              borderRadius={"999px"}
              overflow={"hidden"}
            >
              <Image
                src={user.avatar}
                alt={user.username}
                fill
              />
            </Box>
            <Stack>
              <Typography
                fontSize={24}
                lineHeight={"28.8px"}
              >
                {user.first_name + " " + user.last_name}
              </Typography>
              <Typography
                fontSize={14}
                fontWeight={400}
                lineHeight={"22.4px"}
              >
                {user.bio}
              </Typography>

              <Typography
                mt={"16px"}
                fontSize={12}
                fontWeight={500}
                lineHeight={"16.8px"}
                letterSpacing={"0.17px"}
                color={"primary.main"}
              >
                www.promptify.com/users/{user.username}
              </Typography>
            </Stack>
          </Stack>
          <Stack>
            <TemplatesSection
              templates={templates}
              isLoading={templatesLoading}
              title={`Prompts by ${user.first_name + " " + user.last_name}`}
              explore
            />
          </Stack>
        </Stack>
      )}
    </Layout>
  );
}

export default ProfilePage;
