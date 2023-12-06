import { timeAgo } from "@/common/helpers/timeManipulation";
import SigninButton from "@/components/common/buttons/SigninButton";
import useToken from "@/hooks/useToken";
import { Avatar, Box, Stack, Typography } from "@mui/material";
import MessageSender from "../ChatBox/MessageSender";
import { useRef, useState } from "react";
import { IMessage } from "@/common/types/chat";
import { randomId } from "@/common/helpers";

const maxLength = 2500;
const initMessages: IMessage[] = Array.from({ length: 3 }).map(_ => ({
  id: randomId(),
  createdAt: new Date(new Date().getTime() - 320000),
  fromUser: true,
  text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi provident perferendis in quisquam, dolore modi!",
  type: "text",
}));

export const Feedback = () => {
  const token = useToken();
  const [feedback, setFeedback] = useState("");
  const [feedbacks, setFeedbacks] = useState(initMessages);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (feedback: string) => {
    if (!feedback) return;

    const newFeedback: IMessage = {
      id: randomId(),
      createdAt: new Date(new Date().getTime() - 1000),
      fromUser: true,
      text: feedback,
      type: "text",
    };
    setFeedbacks(prevFeedbacks => prevFeedbacks.concat(newFeedback));
    setFeedback("");
    scrollToBottom();
  };

  const scrollToBottom = () => {
    if (!containerRef.current) return;
    containerRef.current.style.paddingBottom = `${inputRef.current?.clientHeight}px` || "91px";
    containerRef.current.scrollIntoView({
      block: "end",
      behavior: "smooth",
    });
    containerRef.current.style.paddingBottom = "0";
  };

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
          {feedbacks.map(feedback => (
            <Stack
              direction={"row"}
              alignItems={"baseline"}
              gap={1.5}
            >
              <Avatar
                src={require("@/assets/images/default-avatar.jpg")}
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
                  >
                    Promptify {feedback.id}
                  </Typography>
                  <Typography
                    fontSize={10}
                    fontWeight={400}
                    color={"onSurface"}
                    sx={{
                      opacity: 0.5,
                    }}
                  >
                    {timeAgo(feedback.createdAt)}
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
                  {feedback.text}
                </Typography>
              </Stack>
            </Stack>
          ))}
        </>
        <div ref={containerRef}></div>
      </Stack>
      {token ? (
        <Stack
          ref={inputRef}
          alignItems={"flex-end"}
        >
          <Box width={"100%"}>
            <MessageSender
              onSubmit={handleSubmit}
              onChange={setFeedback}
              placeholder="Leave your feedback..."
              maxLength={maxLength}
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
        <SigninButton />
      )}
    </Stack>
  );
};
