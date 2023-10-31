import React, { useState, memo, useEffect, Dispatch, SetStateAction } from "react";
import { Avatar, Button, Grid, Stack, Tooltip, Typography } from "@mui/material";

import LogoAsAvatar from "@/assets/icons/LogoAvatar";
import { useAppSelector } from "@/hooks/useStore";
import { ToggleButtonsGroup } from "@/components/design-system/ToggleButtonsGroup";
import CodeFieldModal from "@/components/modals/CodeFieldModal";
import { IMessage } from "@/common/types/chat";
import useTextSimulationStreaming from "@/hooks/useTextSimulationStreaming";
import { FileType } from "@/common/types/prompt";
import { getFileTypeExtensionsAsString } from "@/common/helpers/uploadFileHelper";
import { useUploadFileMutation } from "@/core/api/uploadFile";

interface MessageBlockProps {
  message: IMessage;
  hideHeader?: boolean;
  onChangeValue: (value: string | File) => void;
  disabledChoices: boolean;
  setIsSimulaitonStreaming: Dispatch<SetStateAction<boolean>>;
  onScrollToBottom: () => void;
  lastMessage: IMessage;
}

interface MessageContentProps {
  content: string;
  shouldStream: boolean;
  setIsSimulaitonStreaming: Dispatch<SetStateAction<boolean>>;
  onStreamingFinished: () => void;
}

const MessageContent = memo(
  ({ content, shouldStream, setIsSimulaitonStreaming, onStreamingFinished }: MessageContentProps) => {
    const { streamedText, hasFinished } = useTextSimulationStreaming({
      text: content,
      shouldStream,
    });

    useEffect(() => {
      if (hasFinished) {
        setIsSimulaitonStreaming(false);
        onStreamingFinished();
      }
    }, [hasFinished]);

    return <>{streamedText}</>;
  },
);

export const Message = ({
  message,
  hideHeader,
  onChangeValue,
  disabledChoices,
  setIsSimulaitonStreaming,
  onScrollToBottom,
  lastMessage,
}: MessageBlockProps) => {
  const { fromUser, type, text, createdAt, choices, fileExtensions } = message;
  const currentUser = useAppSelector(state => state.user.currentUser);
  const [uploadFile] = useUploadFileMutation();

  const name = fromUser ? currentUser?.first_name ?? currentUser?.username : "Promptify";

  const [selectedValue, setSelectedValue] = useState("");
  const [codeFieldPopup, setCodeFieldPopup] = useState(false);
  const [codeUploaded, setCodeUploaded] = useState(false);

  const handleChange = (value: string) => {
    setSelectedValue(value);
    onChangeValue(value);
    setCodeUploaded(true);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setSelectedValue(file.name);
      onChangeValue(file);
    }
  };

  function getUploadStatusMessage() {
    if ((selectedValue !== "" && codeUploaded) || !(lastMessage.type === "code")) {
      return "Code uploaded";
    } else {
      return "Upload your code";
    }
  }

  const uploadBtnName = getUploadStatusMessage();

  return (
    <Grid
      p={"16px"}
      display={"flex"}
      gap={"16px"}
    >
      {!hideHeader && (
        <>
          {message.fromUser && currentUser ? (
            <Avatar
              src={currentUser.avatar}
              alt={currentUser.first_name}
              sx={{
                width: 40,
                height: 40,
                bgcolor: "surface.5",
              }}
            />
          ) : (
            <LogoAsAvatar />
          )}
        </>
      )}

      <Grid
        flex={1}
        ml={{ xs: hideHeader ? 6.5 : 0, md: hideHeader ? 7 : 0 }}
        mt={{ xs: hideHeader ? -2 : 0, md: hideHeader ? -2 : 0 }}
        display={"flex"}
        flexDirection={"column"}
        gap={"8px"}
      >
        {!hideHeader && (
          <Grid
            display={"flex"}
            alignItems={"center"}
            gap={"8px"}
          >
            <Typography
              fontSize={12}
              lineHeight={"17.16px"}
            >
              {name}
            </Typography>
            <Typography
              fontSize={12}
              lineHeight={"17.16px"}
              sx={{
                opacity: 0.5,
              }}
            >
              {createdAt}
            </Typography>
          </Grid>
        )}

        <Grid
          display={"flex"}
          flexDirection={"column"}
          gap={"8px"}
          alignItems={"start"}
        >
          <Typography
            fontSize={15}
            lineHeight={"24px"}
            letterSpacing={"0.17px"}
          >
            <MessageContent
              content={text}
              shouldStream={!fromUser}
              setIsSimulaitonStreaming={setIsSimulaitonStreaming}
              onStreamingFinished={onScrollToBottom}
            />
          </Typography>
          {type === "code" && (
            <Button
              onClick={() => setCodeFieldPopup(true)}
              variant="outlined"
              disabled={!(lastMessage.type === "code")}
              size="small"
              sx={{
                height: 30,
              }}
            >
              {uploadBtnName}
            </Button>
          )}
          {type === "choices" && choices && (
            <ToggleButtonsGroup
              variant="horizontal"
              items={choices}
              value={selectedValue}
              onChange={handleChange}
              disabled={disabledChoices || selectedValue !== ""}
            />
          )}
          {type === "file" && (
            <Stack
              direction={"row"}
              alignItems={"center"}
              gap={0.5}
            >
              <Button
                component="label"
                variant="outlined"
                disabled={!(lastMessage.type === "file")}
                size="small"
                sx={{
                  height: 30,
                }}
              >
                {selectedValue || "Upload file"}
                <input
                  hidden
                  accept={getFileTypeExtensionsAsString(fileExtensions as FileType[])}
                  type="file"
                  onChange={handleUpload}
                />
              </Button>
            </Stack>
          )}

          {codeFieldPopup && (
            <CodeFieldModal
              open
              setOpen={setCodeFieldPopup}
              value={selectedValue}
              onSubmit={handleChange}
            />
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};
