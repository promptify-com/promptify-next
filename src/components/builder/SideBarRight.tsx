import {
  Box,
  Divider,
  Drawer,
  Grid,
  Icon,
  IconButton,
  Link,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Typography,
} from "@mui/material";
import { Close, FormatListBulleted } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import HelpIcon from "@/assets/icons/HelpIcon";
import { ApiIcon } from "@/assets/icons";
import PaperIcon from "@/assets/icons/PaperIcon";

interface SideBarRightProps {
  open: boolean;
  toggleSideBarRight: (name: string) => void;
  closeSideBarRight: () => void;
}
const drawerWidth = 352;

export const SidebarRight: React.FC<SideBarRightProps> = ({ open, toggleSideBarRight, closeSideBarRight }) => {
  const theme = useTheme();

  const navItems = [
    {
      name: "list",
      icon: <FormatListBulleted />,
    },
    {
      name: "paper",
      icon: <PaperIcon />,
      external: false,
    },
    {
      name: "help",
      icon: <HelpIcon />,
      external: false,
    },
    {
      name: "api",
      icon: <ApiIcon />,
      external: false,
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        position: "fixed",
        right: 0,
        top: 0,
        height: "100vh",
        width: "64px",
        borderRadius: "var(--none, 0px)",
        borderLeft: "1px solid var(--divider, #E1E2EC)",
        bgcolor: "var(--dynamic-m-3-surfaces-surface-1, #FDFBFF)",
        padding: "75px var(--1, 8px)",
        zIndex: 1,
        flexDirection: "column",
        alignItems: "center",
        gap: "var(--3, 24px)",
        alignSelf: "stretch",
        transition: theme.transitions.create(["margin", "width"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: "auto",
        ...(open && {
          width: "64px",
          transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
          marginRight: `${drawerWidth}px`,
        }),
      }}
    >
      <Box
        display={"flex"}
        flexDirection={"column"}
        gap={1}
      >
        {navItems.map(item => (
          <Grid key={item.name}>
            <ListItem
              disablePadding
              onClick={() => toggleSideBarRight(item.name)}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  borderRadius: "8px",
                  mx: 1,
                  padding: "16px 22px ",
                }}
              >
                <Box
                  style={{
                    textDecoration: "none",

                    display: "flex",
                    width: "auto",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: "auto",
                      color: "onSurface",
                      justifyContent: "center",
                    }}
                  >
                    <Icon>{item.icon}</Icon>
                  </ListItemIcon>
                </Box>
              </ListItemButton>
            </ListItem>
          </Grid>
        ))}
      </Box>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxShadow: "3px 0px 10px rgba(0, 0, 0, 0.2)",
          },
        }}
        variant="persistent"
        anchor="right"
        open={open}
      >
        <Box
          bgcolor={"surface.1"}
          display="flex"
          alignItems="center"
          p={"16px 24px"}
          justifyContent="space-between"
          border={`1px solid ${theme.palette.surface[3]}`}
        >
          <Typography
            variant="h6"
            sx={{
              color: "var(--onSurface, #1B1B1E)",
              fontFeatureSettings: "'clig' off, 'liga' off",
              fontFamily: "Poppins",
              fontSize: "20px",
              fontStyle: "normal",
              fontWeight: "400",
              lineHeight: "140%",
              letterSpacing: "0.5px",
            }}
          >
            Help
          </Typography>

          <IconButton
            onClick={closeSideBarRight}
            sx={{ marginLeft: "auto" }}
          >
            <Close />
          </IconButton>
        </Box>
        <Divider />
        <Box
          sx={{
            display: "flex",
            height: "815px",
            padding: "var(--2, 16px) var(--3, 24px)",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "24px",
            alignSelf: "stretch",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: "#000",
              fontFeatureSettings: "'clig' off, 'liga' off",
              fontFamily: "Poppins",
              fontSize: "12px",
              fontStyle: "normal",
              fontWeight: "400",
              lineHeight: "166%",
              letterSpacing: "0.4px",
            }}
          >
            Home
          </Typography>

          <Typography
            variant="h4"
            sx={{
              color: "#000",
              fontFeatureSettings: "'clig' off, 'liga' off",
              fontFamily: "Poppins",
              fontSize: "34px",
              fontStyle: "normal",
              fontWeight: "400",
              lineHeight: "120%",
            }}
          >
            Get Started
          </Typography>

          <Typography
            variant="body2"
            sx={typographyStyle}
          >
            Each prompt builds on the last, passing context between them. Responses get progressively more detailed and
            nuanced.
          </Typography>

          <Typography
            variant="body2"
            sx={typographyStyle}
          >
            It's like asking a series of logical follow-up questions, leading the AI through a reasoning process.
          </Typography>

          <Typography
            variant="body2"
            sx={typographyStyle}
          >
            Build chains from reusable template prompts or by capturing previous outputs as variables.
          </Typography>

          <Typography
            variant="body2"
            sx={typographyStyle}
          >
            The result - sophisticated content tailored to your needs, without losing relevance across long texts.
          </Typography>

          <Typography
            variant="body2"
            sx={typographyStyle}
          >
            Chains transform AI writing from rambling monologues to structured dialogues. Progressively direct the AI
            and watch ideas blossom.
          </Typography>

          {/* <Box
            sx={{
              display: "flex",
              padding: "var(--none, 0px)",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "var(--1, 8px)",
              alignSelf: "stretch",
            }}
          >
            <Link
              href="#"
              sx={{ textDecoration: "underline", color: "blue" }}
            >
              What is Prompt
            </Link>
            <Link
              href="#"
              sx={{ textDecoration: "underline", color: "blue" }}
            >
              What is GPT
            </Link>
            <Link
              href="#"
              sx={{ textDecoration: "underline", color: "blue" }}
            >
              How to choose model
            </Link>
            <Link
              href="#"
              sx={{ textDecoration: "underline", color: "blue" }}
            >
              How to use variables
            </Link>
            <Link
              href="#"
              sx={{ textDecoration: "underline", color: "blue" }}
            >
              How to set output
            </Link>
            <Link
              href="#"
              sx={{ textDecoration: "underline", color: "blue" }}
            >
              How to use AP
            </Link>
          </Box>

          <Typography
            variant="h5"
            sx={{
              color: "#000",
              fontFeatureSettings: "'clig' off, 'liga' off",
              fontFamily: "Poppins",
              fontSize: "24px",
              fontStyle: "normal",
              fontWeight: "400",
              lineHeight: "130%",
            }}
          >
            FAQ
          </Typography>

          <Typography
            sx={{
              color: "var(--onSurface, #1B1B1E)",
              fontFamily: "Poppins",
              fontSize: "12px",
              fontStyle: "normal",
              fontWeight: "400",
              lineHeight: "160%",
            }}
          >
            Without wasting a moment, they packed their bags with provisions and magical artifacts passed down through
            generations. Lili, with her magical map in hand, led the way, weaving through enchanted forests with trees
            that whispered secrets and leaves that danced in the moonlight. As they ventured deeper into the woods, they
            stumbled upon a peculiar signpost, pointing in multiple directions. Chris, always the pragmatic thinker,
            scratched his head and said, "Which way should we go? Left or right, up or down?"
          </Typography> */}
        </Box>
      </Drawer>
    </Box>
  );
};

const typographyStyle = {
  color: "var(--onSurface, #1B1B1E)",
  fontFeatureSettings: "'clig' off, 'liga' off",
  fontFamily: "Poppins",
  fontSize: "14px",
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: "140%",
  letterSpacing: "0.2px",
};
