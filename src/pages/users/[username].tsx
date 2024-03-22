import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Layout } from "@/layout";
import { useGetUserDetailsQuery, useGetUserTemplatesQuery } from "@/core/api/user";
import Image from "@/components/design-system/Image";
import CardTemplate from "@/components/common/cards/CardTemplate";
import LatestTemplatePlaceholder from "@/components/placeholders/LatestTemplatePlaceholder";

function ProfilePage() {
  const router = useRouter();
  const username = router.query.username;

  const { data: user } = useGetUserDetailsQuery(username);
  const { data: templates, isLoading: templatesLoading } = useGetUserTemplatesQuery(username);

  const hasNoTemplates = Boolean(!templates?.results?.length && !templatesLoading);

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
          <Stack
            gap={2}
            width={"100%"}
          >
            <Typography
              fontSize={24}
              fontWeight={400}
              lineHeight={"28.8px"}
              letterSpacing={"0.17px"}
            >
              {`Prompts by ${user.first_name + " " + user.last_name}`}
            </Typography>
            {hasNoTemplates ? (
              <Stack
                minHeight={"60svh"}
                direction={"row"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Typography color={"text.secondary"}>No templates created</Typography>
              </Stack>
            ) : (
              <>
                {templatesLoading ? (
                  <Grid
                    container
                    gap={2}
                  >
                    <LatestTemplatePlaceholder count={10} />
                  </Grid>
                ) : (
                  <Grid
                    container
                    gap={0}
                  >
                    <>
                      {templates?.results?.map(template => (
                        <Grid
                          key={template.id}
                          item
                          md={4}
                          lg={3}
                          xl={2}
                        >
                          <CardTemplate
                            template={template}
                            vertical
                          />
                        </Grid>
                      ))}
                    </>
                  </Grid>
                )}
              </>
            )}
          </Stack>
        </Stack>
      )}
    </Layout>
  );
}

export default ProfilePage;
