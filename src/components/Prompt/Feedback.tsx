import { useRef, useState } from "react";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useRouter } from "next/router";
import { timeAgo } from "@/common/helpers/timeManipulation";
import SigninButton from "@/components/common/buttons/SigninButton";
import useToken from "@/hooks/useToken";
import MessageSender from "./Common/Chat/MessageSender";
import { useGetFeedbacksQuery, useSaveFeedbackMutation } from "@/core/api/templates";
import { useAppSelector } from "@/hooks/useStore";
import ChatMessagePlaceholder from "@/components/placeholders/ChatMessagePlaceholder";
import type { UserPartial } from "@/core/api/dto/user";

const maxLength = 2500;
const Feedback = () => {
  const token = useToken();
  const router = useRouter();
  const currentUser = useAppSelector(state => state.user.currentUser);
  const templateId = useAppSelector(state => state.template.id);
  const { data: feedbacks, isFetching } = useGetFeedbacksQuery(templateId);
  const [saveFeedback, { isLoading }] = useSaveFeedbackMutation();

  const handleSubmit = async (feedback: string) => {
    if (!feedback || !currentUser) return;

    await saveFeedback({
      comment: feedback,
      template: templateId,
      user: currentUser,
    }).unwrap();
  };

  function getDisplayName(user: UserPartial) {
    if (user && user.first_name) {
      return user.first_name;
    } else if (user && user.username) {
      return user.username.charAt(0).toUpperCase() + user.username.slice(1).toLowerCase();
    } else {
      return "Unknown User";
    }
  }

  const publishedFeedbacks = feedbacks?.filter(_f => _f.status === "published") || [];

  return (
    <Stack
      gap={2}
      p={"48px"}
    >
      <Typography
        fontSize={32}
        fontWeight={400}
        color={"onSurface"}
        py={"16px"}
      >
        Feedback:
      </Typography>
      {token && (
        <Box
          width={"100%"}
          py={"16px"}
        >
          <MessageSender
            onSubmit={handleSubmit}
            placeholder="Leave your feedback..."
            maxLength={maxLength}
            loading={isLoading}
          />
        </Box>
      )}
      <Stack
        gap={3}
        sx={{
          overflow: "auto",
          py: "16px",
        }}
      >
        {isFetching ? (
          <ChatMessagePlaceholder count={3} />
        ) : publishedFeedbacks.length > 0 ? (
          <Stack
            gap={3}
            direction={"column-reverse"}
          >
            {publishedFeedbacks.map(feedback => {
              const createdAt =
                timeAgo(feedback.created_at) === "some time ago"
                  ? timeAgo(new Date(new Date().getTime() - 2000))
                  : timeAgo(feedback.created_at);
              return (
                <Stack
                  key={feedback.id}
                  direction={"row"}
                  alignItems={"flex-start"}
                  gap={2}
                >
                  <Avatar
                    src={feedback.user.avatar}
                    alt={"Promptify"}
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: "surface.5",
                    }}
                  />
                  <Stack gap={1.5}>
                    <Typography
                      fontSize={18}
                      fontWeight={500}
                      color={"onSurface"}
                      textTransform={"capitalize"}
                    >
                      {getDisplayName(feedback.user)}
                    </Typography>
                    <Typography
                      fontSize={16}
                      fontWeight={400}
                      color={"onSurface"}
                      sx={{
                        wordBreak: "break-word",
                      }}
                    >
                      {feedback.comment}
                    </Typography>
                    <Typography
                      fontSize={13}
                      fontWeight={400}
                      color={"secondary.light"}
                      sx={{
                        wordBreak: "break-word",
                      }}
                    >
                      {createdAt}
                    </Typography>
                  </Stack>
                </Stack>
              );
            })}
          </Stack>
        ) : (
          <Typography
            fontSize={14}
            fontWeight={400}
            color={"onSurface"}
          >
            No feedback yet
          </Typography>
        )}
      </Stack>
    </Stack>
  );
};

export default Feedback;
