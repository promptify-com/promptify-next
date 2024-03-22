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
import useCopyToClipboard from "@/hooks/useCopyToClipboard";
import FooterPrompt from "@/components/explorer/FooterPrompt";

function ProfilePage() {
  const router = useRouter();
  const username = router.query.username;

  const { data: user } = useGetUserDetailsQuery(username);
  const { data: templates, isLoading: templatesLoading } = useGetUserTemplatesQuery(username);

  const [copyToClipboard] = useCopyToClipboard();

  const userLink = `www.promptify.com/users/${user?.username}`;

  const handleClickCopy = () => {
    copyToClipboard(userLink);
  };

  const hasNoTemplates = Boolean(!templates?.results?.length && !templatesLoading);

  return (
    <Layout>
      {user && (
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems={"start"}
          pt={{ xs: " 80px", md: "48px" }}
          width={"97%"}
          gap={"90px"}
          ml={"auto"}
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
                onClick={handleClickCopy}
                sx={{ cursor: "pointer" }}
              >
                {userLink}
              </Typography>
            </Stack>
          </Stack>
          <Stack
            gap={2}
            pt={{ xs: "10px", md: "48px" }}
            height={{ md: "calc(100svh - 320px)" }}
            width={"100%"}
            overflow={"hidden"}
            sx={{
              overflowY: "auto",
              overflowX: "hidden",
              "&::-webkit-scrollbar": {
                width: "0px",
              },
            }}
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
                    justifyContent={"center"}
                  >
                    <LatestTemplatePlaceholder count={10} />
                  </Grid>
                ) : (
                  <Grid
                    container
                    gap={1}
                    pr={{ xs: "32px", sm: 0 }}
                  >
                    <>
                      {templates?.results?.map(template => (
                        <Grid
                          key={template.id}
                          item
                          sm={5}
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
      <FooterPrompt />
    </Layout>
  );
}

export default ProfilePage;
