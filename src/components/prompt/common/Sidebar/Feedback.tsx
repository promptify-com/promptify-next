import { timeAgo } from "@/common/helpers/timeManipulation";
import SigninButton from "@/components/common/buttons/SigninButton";
import useToken from "@/hooks/useToken";
import { Avatar, Box, Stack, Typography } from "@mui/material";
import MessageSender from "../Chat/MessageSender";
import { useRef, useState } from "react";
import { useGetFeedbacksQuery, useSaveFeedbackMutation } from "@/core/api/templates";
import { useAppSelector } from "@/hooks/useStore";
import ChatMessagePlaceholder from "@/components/placeholders/ChatMessagePlaceholder";
import { IUser } from "@/common/types";
import { UserPartial } from "@/core/api/dto/user";

const maxLength = 2500;

export const Feedback = () => {
  const token = useToken();
  const [feedback, setFeedback] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const currentUser = useAppSelector(state => state.user.currentUser);
  const templateId = useAppSelector(state => state.template.id);
  const { data: feedbacks, isFetching } = useGetFeedbacksQuery(templateId);
  const [saveFeedback, { isLoading }] = useSaveFeedbackMutation();

  const handleSubmit = async (feedback: string) => {
    if (!feedback || !currentUser) return;

    setFeedback("");
    scrollToBottom();
    await saveFeedback({
      comment: feedback,
      template: templateId,
      user: currentUser,
    }).unwrap();
  };

  const scrollToBottom = () => {
    if (!containerRef.current) return;
    containerRef.current.style.paddingBottom = `${inputRef.current?.clientHeight}px` ?? "91px";
    containerRef.current.scrollIntoView({
      block: "end",
      behavior: "smooth",
    });
    containerRef.current.style.paddingBottom = "0";
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

  const publichedFeedbacks = feedbacks?.filter(_f => _f.status === "published") || [];
  return (
    <Stack
      gap={3}
      height={"100%"}
      overflow={"auto"}
    >
      <Stack
        flex={1}
        height={"calc(100% - 91px)"}
        gap={3}
        sx={{
          overflow: "auto",
          p: "24px 24px 0",
          "&::-webkit-scrollbar": {
            width: "6px",
            p: 1,
            backgroundColor: "surface.5",
          },
          "&::-webkit-scrollbar-track": {
            webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "surface.1",
            outline: "1px solid surface.1",
            borderRadius: "10px",
          },
        }}
      >
        <>
          {isFetching ? (
            <ChatMessagePlaceholder count={3} />
          ) : (
            <>
              {publichedFeedbacks.map(feedback => {
                const createdAt =
                  timeAgo(feedback.created_at) === "some time ago"
                    ? timeAgo(new Date(new Date().getTime() - 2000))
                    : timeAgo(feedback.created_at);
                return (
                  <Stack
                    key={feedback.id}
                    direction={"row"}
                    gap={1.5}
                  >
                    <Avatar
                      src={feedback.user.avatar}
                      alt={"Promptify"}
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: "surface.5",
                      }}
                    />
                    <Stack gap={1.5}>
                      <Stack
                        direction={"row"}
                        alignItems={"center"}
                        gap={1.5}
                      >
                        <Typography
                          fontSize={13}
                          fontWeight={500}
                          color={"primary.main"}
                          textTransform={"capitalize"}
                        >
                          {getDisplayName(feedback.user)}
                        </Typography>
                        <Typography
                          fontSize={14}
                          fontWeight={400}
                          color={"common.black"}
                          sx={{
                            wordBreak: "break-word",
                          }}
                        >
                          {createdAt}
                        </Typography>
                      </Stack>
                      <Typography
                        fontSize={14}
                        fontWeight={400}
                        color={"common.black"}
                        sx={{
                          wordBreak: "break-word",
                        }}
                      >
                        {feedback.comment}
                      </Typography>
                    </Stack>
                  </Stack>
                );
              })}
            </>
          )}
        </>
        <div ref={containerRef}></div>
      </Stack>
      {token ? (
        <Stack
          ref={inputRef}
          alignItems={"flex-end"}
        >
          <Box
            width={"90%"}
            p={"10px 24px"}
          >
            <MessageSender
              onSubmit={handleSubmit}
              onChange={setFeedback}
              placeholder="Leave your feedback..."
              maxLength={maxLength}
              loading={isLoading}
            />
          </Box>
          <Typography
            fontSize={10}
            fontWeight={500}
            color={"grey.500"}
            m={"-10px 24px 5px"}
          >
            {feedback.length}/{maxLength}
          </Typography>
        </Stack>
      ) : (
        <Stack
          alignItems={"center"}
          mb={"20px"}
        >
          <SigninButton />
        </Stack>
      )}
    </Stack>
  );
};
