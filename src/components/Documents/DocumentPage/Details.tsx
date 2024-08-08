import { useState } from "react";
import Link from "next/link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CreateNewFolderOutlined from "@mui/icons-material/CreateNewFolderOutlined";
import Button from "@mui/material/Button";

import type { ExecutionWithTemplate } from "@/core/api/dto/templates";
import Image from "@/components/design-system/Image";
import { formatDate } from "@/common/helpers/timeManipulation";
import InstructionsAccordion from "./InstructionsAccordion";
import useBrowser from "@/hooks/useBrowser";
import ActionButtons from "./ActionButtons";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { isAdminFn } from "@/core/store/userSlice";
import { useUpdateTemplateMutation } from "@/core/api/templates";
import { setToast } from "@/core/store/toastSlice";
import type { IEditTemplate } from "@/common/types/editTemplate";

interface Props {
  document: ExecutionWithTemplate;
}

function Details({ document }: Props) {
  const { isMobile } = useBrowser();
  const dispatch = useAppDispatch();
  const template = document.template;

  const [updateTemplate] = useUpdateTemplateMutation();

  const isAdmin = useAppSelector(isAdminFn);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleSetAsTemplateExample = async () => {
    if (template?.id && document.id) {
      setIsButtonDisabled(true);
      try {
        const updateData: Partial<IEditTemplate> = {
          example_execution: document.id,
        };
        await updateTemplate({
          id: template.id,
          data: updateData,
        }).unwrap();

        dispatch(setToast({ message: "Template example updated successfully", severity: "success", duration: 6000 }));
      } catch (error) {
        console.error("Failed to set as template example:", error);
        dispatch(
          setToast({
            message: "could not update template example, please try again!",
            severity: "error",
            duration: 6000,
          }),
        );
        setIsButtonDisabled(false);
      }
    }
  };

  return (
    <Stack
      gap={{ xs: 2, md: 3 }}
      py={{ xs: "16px", md: "48px" }}
    >
      <Stack gap={2}>
        {!isMobile && (
          <Typography
            fontSize={14}
            fontWeight={500}
            color={"secondary.light"}
          >
            Prompt used:
          </Typography>
        )}
        <Link
          href={`prompt/${template?.slug}`}
          target="_blank"
          style={{ textDecoration: "none" }}
        >
          <Stack
            direction={"row"}
            gap={2}
            sx={{
              p: "8px",
              borderRadius: "24px",
              bgcolor: { xs: "surfaceContainerHigh", md: "surfaceContainerLow" },
            }}
          >
            <Image
              src={template?.thumbnail ?? require("@/assets/images/default-thumbnail.jpg")}
              alt={template?.title || "Promptify"}
              style={{ borderRadius: "16px", objectFit: "cover", width: "103px", height: "77px" }}
            />
            <Stack
              flex={1}
              gap={1}
              justifyContent={"center"}
            >
              <Typography
                fontSize={16}
                fontWeight={500}
                color={"onSurface"}
                sx={{
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 2,
                  overflow: "hidden",
                  wordBreak: "break-word",
                }}
              >
                {template?.title}
              </Typography>
              <Typography
                fontSize={14}
                fontWeight={400}
                color={"secondary.light"}
                sx={{
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 1,
                  overflow: "hidden",
                  wordBreak: "break-word",
                }}
              >
                {template?.category.name}
              </Typography>
            </Stack>
          </Stack>
        </Link>
      </Stack>

      {isMobile && <ActionButtons document={document} />}
      <InstructionsAccordion document={document} />
      {!isMobile && (
        <Typography
          fontSize={14}
          fontWeight={400}
          color={"onSurface"}
          sx={{
            py: "16px",
            ".label": {
              opacity: 0.5,
              mr: "8px",
            },
          }}
        >
          <span className="label">Created at:</span> {formatDate(document.created_at)}
        </Typography>
      )}
      {isAdmin && (
        <Button
          variant="outlined"
          onClick={handleSetAsTemplateExample}
          startIcon={<CreateNewFolderOutlined />}
          sx={{
            fontWeight: 500,
          }}
          disabled={isButtonDisabled}
        >
          Set as template example
        </Button>
      )}
    </Stack>
  );
}

export default Details;
