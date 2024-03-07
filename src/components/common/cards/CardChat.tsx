import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import type { IChat } from "@/core/api/dto/chats";
import Image from "@/components/design-system/Image";

interface Props {
  chat: IChat;
}

export const ChatCard = ({ chat }: Props) => {
  return (
    <Card
      elevation={0}
      title={chat.title}
      sx={{
        width: "100%",
        bgcolor: "surfaceContainerHigh",
        borderRadius: "16px",
        overflow: "hidden",
        "&:hover": {
          bgcolor: "surfaceContainerHighest",
        },
      }}
    >
      <CardActionArea
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          p: "16px 18px 16px 16px",
        }}
      >
        <CardMedia
          sx={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
          }}
        >
          <Image
            src={chat.thumbnail ?? require("@/assets/images/default-thumbnail.jpg")}
            alt={chat.title}
            style={{ borderRadius: "50%", objectFit: "cover", width: "100%", height: "100%" }}
            priority={true}
          />
        </CardMedia>
        <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1, p: 0 }}>
          <Typography
            fontSize={14}
            fontWeight={500}
            color={"onSurface"}
          >
            {chat.title}
          </Typography>
          <Typography
            fontSize={13}
            fontWeight={400}
            color={"onSurface"}
            whiteSpace={"nowrap"}
          >
            {chat.title}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
