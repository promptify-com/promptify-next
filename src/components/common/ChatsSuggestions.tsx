import { useEffect, useState, type RefObject } from "react";
import { useRouter } from "next/router";
import { useTheme } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import AccountCircleOutlined from "@mui/icons-material/AccountCircleOutlined";
import AddCircleOutlineRounded from "@mui/icons-material/AddCircleOutlineRounded";
import Grid from "@mui/material/Grid";
import { useGetChatsQuery } from "@/core/api/chats";
import SuggestionCard, { Avatar } from "@/components/Homepage/SuggestionCard";
import SuggestionCardPlaceholder from "@/components/Homepage/SuggestionCardPlaceholder";
import { useGetExecutionsByMeQuery } from "@/core/api/executions";
import { usePrepareTemplatesExecutions } from "@/components/Documents/Hooks/usePrepareTemplatesExecutions";
import { useGetTemplateByIdQuery } from "@/core/api/templates";
import type { EngineOutput, TemplateExecutionsDisplay, TemplatesExecutions } from "@/core/api/dto/templates";

interface Props {
  carouselRef?: RefObject<HTMLDivElement>;
  slice?: number;
}

function ChatsSuggestions({ carouselRef, slice = 1 }: Props) {
  const { data: chats } = useGetChatsQuery({ limit: slice });
  const { data: fetchExecutions, isFetching: isExecutionsFetching } = useGetExecutionsByMeQuery({ limit: 1 });
  const [executions, setExecutions] = useState<TemplatesExecutions[]>([]);

  const templateId = executions.length && executions[0].template ? executions[0].template.id : null;
  const { data: templates, isLoading: isTemplatesLoading } = useGetTemplateByIdQuery(templateId!, {
    skip: !templateId,
  });

  const { executions: templatesExecutions } = usePrepareTemplatesExecutions(
    executions,
    ([templates] as TemplateExecutionsDisplay[]) ?? [],
    isTemplatesLoading,
  );

  useEffect(() => {
    if (fetchExecutions?.results) {
      setExecutions(fetchExecutions?.results);
    }
  }, [fetchExecutions?.results]);

  const router = useRouter();
  const theme = useTheme();
  const profilePage = router.pathname === "/profile";
  const isHomePage = router.pathname === "/";
  let documentDescription = "";

  if (templatesExecutions[0]) {
    const promptsData = templatesExecutions[0].template?.prompts.reduce(
      (acc, prompt) => {
        acc[prompt.id] = { show_output: prompt.show_output, engineOutputType: prompt.engine.output_type };

        return acc;
      },
      {} as Record<string, { show_output: boolean; engineOutputType: EngineOutput }>,
    );
    const firstFoundExecution = templatesExecutions[0].prompt_executions?.find(
      execution =>
        !execution.errors &&
        execution.output.length > 0 &&
        promptsData?.[execution.prompt].show_output &&
        promptsData?.[execution.prompt].engineOutputType === "TEXT",
    );
    documentDescription = firstFoundExecution ? firstFoundExecution.output : "";
  }

  return (
    <>
      {isExecutionsFetching ? (
        <Stack
          direction={"row"}
          gap={1}
          alignItems={"center"}
          flexWrap={"nowrap"}
          justifyContent={isHomePage ? "flex-start" : "space-between"}
          sx={{
            ...(profilePage && {
              [theme.breakpoints.down("md")]: {
                flexWrap: "wrap",
                flexDirection: "column",
              },
            }),
          }}
        >
          <SuggestionCardPlaceholder
            count={2 + slice}
            width={profilePage || isHomePage ? "100%" : "23%"}
          />
        </Stack>
      ) : (
        <Stack
          ref={carouselRef}
          overflow={"hidden"}
        >
          <Grid
            container
            gap={4}
            flexWrap={"nowrap"}
            justifyContent={isHomePage ? "flex-start" : "center"}
            sx={{
              ...(profilePage && {
                [theme.breakpoints.down("lg")]: {
                  flexWrap: "wrap",
                  flexDirection: "column",
                  alignItems: "center",
                },
              }),
            }}
          >
            <Grid
              item
              xs={12}
              lg={4}
              sx={{
                maxWidth: { xs: "290px", sm: "330px", xl: "100%" },
              }}
            >
              <SuggestionCard
                title="CHAT WITH Promptify"
                description="Make more happen with Promptify and stand out!"
                avatar={
                  <Avatar variant="chat">
                    <AddCircleOutlineRounded sx={{ color: "onPrimary", fontSize: 32 }} />
                  </Avatar>
                }
                actionLabel="Let's Go!"
                href="/chat"
              />
            </Grid>
            {chats?.results[0] && (
              <Grid
                item
                xs={12}
                lg={4}
                sx={{
                  maxWidth: { xs: "290px", sm: "330px", xl: "100%" },
                  ...(profilePage && {
                    [theme.breakpoints.down("md")]: {
                      mr: 0,
                    },
                    maxWidth: { xs: "290px", sm: "330px", xl: "100%" },
                  }),
                }}
              >
                <SuggestionCard
                  title="Chats"
                  description={chats.results[0].last_message ?? ""}
                  actionLabel="Review"
                  href={`/chat/?ci=${chats.results[0].id}`}
                  avatar={
                    <Avatar
                      variant="last_chat_entry"
                      src={chats.results[0].thumbnail}
                    />
                  }
                />
              </Grid>
            )}

            {!profilePage && templatesExecutions[0] && (
              <Grid
                item
                mr={2}
                xs={12}
                md={4}
                sx={{
                  maxWidth: { xs: "290px", sm: "330px", xl: "100%" },
                }}
              >
                <SuggestionCard
                  title="Your LAST Work"
                  description={documentDescription}
                  avatar={
                    <Avatar
                      src={templatesExecutions[0]?.template?.thumbnail}
                      variant="explore"
                    />
                  }
                  actionLabel="Check Your Doc!"
                  href={`/sparks?slug=${templatesExecutions[0].template?.slug}&hash=${templatesExecutions[0].hash}`}
                />
              </Grid>
            )}
            {!profilePage && (
              <Grid
                item
                mr={2}
                xs={12}
                md={4}
                sx={{
                  maxWidth: { xs: "290px", sm: "330px", xl: "100%" },
                }}
              >
                <SuggestionCard
                  title="Explore PROMPT TEmplate"
                  description="Check out hundreds of ready-to-go prompt templates!"
                  avatar={
                    <Avatar
                      src={require("@/assets/images/explore-page.webp")}
                      variant="explore"
                    />
                  }
                  actionLabel="Start Exploring Now!"
                  href="/explore"
                />
              </Grid>
            )}

            <Grid
              item
              mr={2}
              xs={12}
              lg={4}
              sx={{
                maxWidth: { xs: "290px", md: "330px", xl: "100%" },
                ...(profilePage && {
                  [theme.breakpoints.down("lg")]: {
                    mr: 0,
                  },
                  maxWidth: { xs: "290px", sm: "330px", xl: "100%" },
                }),
              }}
            >
              <SuggestionCard
                title="Customize Your Experience"
                description="Tailor Promptify to your style and make your work unique!"
                avatar={
                  <Avatar variant="profile">
                    <AccountCircleOutlined sx={{ color: "onSurface", fontSize: 32 }} />
                  </Avatar>
                }
                actionLabel="Personalize Now!"
                href="/profile/user"
              />
            </Grid>
          </Grid>
        </Stack>
      )}
    </>
  );
}

export default ChatsSuggestions;
