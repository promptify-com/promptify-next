import NoteStackIcon from "@/assets/icons/NoteStackIcon";
import { TemplateSidebarLinks } from "@/common/constants";
import { isDesktopViewPort } from "@/common/helpers";
import { Link } from "@/common/types/TemplateToolbar";
import BaseButton from "@/components/base/BaseButton";
import { setActiveToolbarLink } from "@/core/store/templatesSlice";
import { useAppDispatch } from "@/hooks/useStore";
import { theme } from "@/theme";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import Icon from "@mui/material/Icon";
import Stack from "@mui/material/Stack";
import { alpha } from "@mui/material/styles";
import React, { Fragment } from "react";
import { switchVariant } from "../../utils";
import { useRouter } from "next/router";
import SwitchAccessShortcut from "@mui/icons-material/SwitchAccessShortcut";
import Box from "@mui/material/Box";

function TopHeaderActions({ executionsLength = 0 }) {
  const dispatch = useAppDispatch();

  const router = useRouter();
  const variant = router.query.variant as string;
  const ToolbarItems = TemplateSidebarLinks.filter(link => link.name === "executions" || link.name === "details");

  const renderIcon = (link: Link) => {
    if (link.name === "executions") {
      return <NoteStackIcon color={theme.palette.primary.main} />;
    }
    return link.icon;
  };

  return (
    <Stack
      p={"16px"}
      direction={"row"}
      alignItems={"center"}
      bgcolor={"surface.1"}
      display={"flex"}
      justifyContent={"space-between"}
    >
      <Stack
        flex={1}
        direction={"row"}
        gap={"10px"}
        alignItems={"center"}
      >
        {ToolbarItems.map(link => (
          <Fragment key={link.name}>
            {link.name === "executions" ? (
              <Badge
                badgeContent={executionsLength}
                color="primary"
              >
                <Button
                  onClick={() => dispatch(setActiveToolbarLink(link))}
                  variant="text"
                  startIcon={<Icon>{renderIcon(link)}</Icon>}
                  sx={{
                    height: 22,
                    p: "15px",
                    bgcolor: "surface.3",
                  }}
                >
                  {link.title}
                </Button>
              </Badge>
            ) : (
              <Button
                variant="text"
                onClick={() => dispatch(setActiveToolbarLink(link))}
                startIcon={<Icon sx={{ py: "4px", pr: "2px", mt: -0.5 }}>{renderIcon(link)}</Icon>}
                sx={{
                  height: 22,
                  p: "15px",
                  bgcolor: "surface.3",
                }}
              >
                {link.title}
              </Button>
            )}
          </Fragment>
        ))}
      </Stack>
      <Box>
        <BaseButton
          variant="text"
          color="custom"
          sx={btnStyle}
          startIcon={<SwitchAccessShortcut sx={{ fontSize: 20 }} />}
          onClick={() => switchVariant(variant, router)}
        >
          {variant === "a" ? "B" : "A"}{" "}
        </BaseButton>
      </Box>
    </Stack>
  );
}

const btnStyle = {
  color: "secondary.main",
  fontSize: 14,
  p: "6px",
  height: "30px",
  borderRadius: "8px",
  border: `1px solid ${alpha(theme.palette.onSurface, 0.2)}`,
  ":hover": {
    bgcolor: "action.hover",
  },
};

export default TopHeaderActions;
