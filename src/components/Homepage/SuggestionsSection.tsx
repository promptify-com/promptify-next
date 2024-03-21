import { useRouter } from "next/router";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { redirectToPath } from "@/common/helpers";
import { useAppSelector } from "@/hooks/useStore";
import useTruncate from "@/hooks/useTruncate";
import SuggestionCard, { Avatar } from "@/components/Homepage/SuggestionCard";
import SuggestionCardPlaceholder from "@/components/Homepage/SuggestionCardPlaceholder";
import type { TemplateExecutionsDisplay, Templates } from "@/core/api/dto/templates";

interface Props {
  templates: Templates[];
  isLoading: boolean;
}

function SuggestionsSection({ templates, isLoading }: Props) {
  const router = useRouter();
  const currentUser = useAppSelector(state => state.user.currentUser);

  const { truncate } = useTruncate();

  return (
    <Stack
      direction={"column"}
      gap={3}
    >
      <Stack gap={1}>
        <Typography
          fontSize={32}
          fontWeight={400}
          lineHeight={"38.4px"}
          letterSpacing={"0.17px"}
        >
          Welcome, {currentUser?.username}
        </Typography>
        <Typography
          fontSize={16}
          fontWeight={400}
          lineHeight={"25.5px"}
          letterSpacing={"0.17px"}
        >
          Suggestions for you:
        </Typography>
      </Stack>
      {isLoading ? (
        <Stack
          direction={"row"}
          gap={1}
          alignItems={"center"}
          flexWrap={"wrap"}
          justifyContent={"space-between"}
        >
          <SuggestionCardPlaceholder />
        </Stack>
      ) : (
        <Stack
          direction={"row"}
          gap={1}
          alignItems={"center"}
        >
          <SuggestionCard
            title="Chats"
            description="Start a new chat"
            avatar={<Avatar variant="chat" />}
            actionLabel="New chat"
            onClick={() => router.push("/chat")}
          />

          {/* {templates.slice(0, 2).map((template: TemplateExecutionsDisplay | Templates) => {
            const updatedTemplate = template as TemplateExecutionsDisplay;
            return (
              <SuggestionCard
                key={updatedTemplate.id}
                title="Chats"
                description={truncate(updatedTemplate.executions[0].title, { length: 30 })}
                actionLabel="Review"
                onClick={() => {
                  redirectToPath(`prompt/${template.slug}`);
                }}
                avatar={
                  <Avatar
                    variant="execution"
                    src={template.thumbnail}
                  />
                }
              />
            );
          })} */}

          <SuggestionCard
            title="Profile"
            description="Set up your public profile"
            avatar={<Avatar variant="profile" />}
            actionLabel="User profile"
            onClick={() => router.push("/profile")}
          />
        </Stack>
      )}
    </Stack>
  );
}

export default SuggestionsSection;
