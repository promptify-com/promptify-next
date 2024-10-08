import { Box, Grid, IconButton, Typography } from "@mui/material";
import { Email } from "@mui/icons-material";
import ShareIcon from "@/assets/icons/ShareIcon";
import { useAppSelector } from "@/hooks/useStore";
import { format } from "date-fns";

interface Props {
  content: string;
}

const SendEmail = ({ content }: Props) => {
  const clonedWorkflow = useAppSelector(state => state.chat?.clonedWorkflow ?? undefined);
  const appTitle = clonedWorkflow?.name;
  const currentDate = format(new Date(), "MM-dd-yyyy");
  const title = `${appTitle} - ${currentDate}`;

  const handleSendEmail = () => {
    const subject = title ? title.replace(/-+/g, "-").trim() : "No title available for this AI App";
    const body = content ? encodeURIComponent(content) : encodeURIComponent("No text available for this AI App");
    const mailtoLink = `mailto:?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
  };

  return (
    <Grid
      p={"16px"}
      display={"flex"}
      justifyContent={"space-between"}
      alignItems={"center"}
    >
      <Grid
        display={"flex"}
        alignItems={"center"}
      >
        <Box
          p={"0px 8px"}
          mt={1}
        >
          <Email />
        </Box>
        <Box
          display={"flex"}
          flexDirection={"column"}
        >
          <Typography
            fontSize={14}
            fontWeight={500}
            lineHeight={"157%"}
            sx={{ opacity: 0.8 }}
          >
            Send via Email
          </Typography>
          <Typography
            fontSize={12}
            fontWeight={400}
            lineHeight={"143%"}
            sx={{ opacity: 0.5 }}
          >
            {title}
          </Typography>
        </Box>
      </Grid>
      <Box width={"60px"}>
        <IconButton
          onClick={handleSendEmail}
          sx={{ border: "none", opacity: 0.6 }}
        >
          <ShareIcon />
        </IconButton>
      </Box>
    </Grid>
  );
};

export default SendEmail;
