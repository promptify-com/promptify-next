import { Fragment } from "react";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import Icon from "@mui/material/Icon";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import ViewWeekOutlined from "@mui/icons-material/ViewWeekOutlined";
import WebAssetOutlined from "@mui/icons-material/WebAssetOutlined";

import { theme } from "@/theme";
import NoteStackIcon from "@/assets/icons/NoteStackIcon";
import { TemplateSidebarLinks } from "@/common/constants";
import { setActiveToolbarLink } from "@/core/store/templatesSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import BaseButton from "@/components/base/BaseButton";
import useVariant from "../../Hooks/useVariant";
import type { Link } from "@/components/Prompt/Types";

function TopHeaderActions({ executionsLength = 0 }) {
  const dispatch = useAppDispatch();

  const isGenerating = useAppSelector(state => state.templates?.isGenerating ?? false);

  const { variant, switchVariant } = useVariant();

  const ToolbarItems = TemplateSidebarLinks.filter(link => ["executions", "details"].includes(link.name));

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
                    ...linkStyle,
                  }}
                >
                  <span className="MuiButton-label">{link.title}</span>
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
                  ...linkStyle,
                }}
              >
                <span className="MuiButton-label">{link.title}</span>
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
          disabled={isGenerating}
          onClick={switchVariant}
        >
          {variant === "a" ? <WebAssetOutlined /> : <ViewWeekOutlined />}
        </BaseButton>
      </Box>
    </Stack>
  );
}

const linkStyle = {
  ".MuiButton-label": {
    fontSize: "10px",
  },
  "@media (min-width:400px)": {
    ".MuiButton-label": {
      fontSize: "14px",
    },
  },
};

const btnStyle = {
  color: "secondary.main",
  fontSize: 14,
  mr: "-10px",
  p: "6px 0",
  height: "30px",
  width: "30px",
  borderRadius: "8px",
  border: "none",
  minWidth: "40px",
  ":hover": {
    bgcolor: "action.hover",
  },
};

export default TopHeaderActions;
