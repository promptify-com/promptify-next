import Link from "next/link";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Favorite from "@mui/icons-material/Favorite";
import Bolt from "@mui/icons-material/Bolt";
import { theme } from "@/theme";
import useTruncate from "@/hooks/useTruncate";
import { isDesktopViewPort, stripTags } from "@/common/helpers";
import Image from "@/components/design-system/Image";
import type { Templates } from "@/core/api/dto/templates";
import Box from "@mui/material/Box";

type CardTemplateProps = {
  template: Templates;
};

function CardTemplate({ template }: CardTemplateProps) {
  const { truncate } = useTruncate();
  const isDesktop = isDesktopViewPort();

  const { tags } = template;
  const displayedTags = tags.slice(0, 2);
  const remainingTagsCount = tags.length - displayedTags.length;

  return (
    <Link
      href={`/prompt/${template.slug}`}
      style={{
        flex: isDesktop ? 1 : "none",
        width: isDesktop ? "auto" : "100%",
        textDecoration: "none",
        position: "relative",
      }}
    >
      <Card
        sx={{
          minWidth: { xs: "50%", sm: isDesktop ? "210px" : "auto" },
          borderRadius: "16px",
          display: "flex",
          flexDirection: "column",
          bgcolor: "#F9F9F9",
          transition: "all 0.3s ease",
          "&:hover": {
            ".likes-favorites": {
              top: 8,
              transition: "top 0.3s ease",
            },
            ".card-effect": {
              m: 0,
              borderRadius: "16px 16px 0 0",
              transition: "margin 0.3s ease, border-radius 0.3s ease",
            },
            ".gradient-effect": {
              opacity: 1,
              transition: "opacity 0.3s ease",
            },
            ".icon-text-style": {
              bgcolor: "rgba(0, 0, 0, 0.5)",
              border: "1px solid rgba(0, 0, 0, 0.02)",
              transition: "background-color 0.3s ease, border 0.3s ease",
            },
          },
        }}
        elevation={0}
      >
        <Stack sx={{ flex: "1 0 auto" }}>
          <Stack
            sx={{
              position: "relative",
              zIndex: 1,
              borderRadius: "16px",
              overflow: "hidden",
              height: { xs: "135px", md: "160px" },
              m: "8px 8px 0 8px",
            }}
            className="card-effect"
          >
            <Image
              src={template.thumbnail ?? require("@/assets/images/default-thumbnail.jpg")}
              alt={template.title}
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
              sizes="(max-width: 600px) 176px, (max-width: 900px) 216px, 216px"
              priority={true}
            />
            <Stack
              sx={{
                height: "115px",
                width: "100%",
                position: "absolute",
                left: 0,
                bottom: -10,
                zIndex: 9999,
                background:
                  "linear-gradient(to top, rgba(249, 249, 249, 1), rgba(250, 250, 250, 0.9), rgba(255, 255, 255, 0))",
                opacity: 0,
              }}
              className="gradient-effect"
            />
            <Box
              sx={{
                position: "absolute",
                top: 126,
                right: 8,
                display: "flex",
                gap: "8px",
                zIndex: 2,
              }}
              className="likes-favorites"
            >
              <Stack
                direction={"row"}
                alignItems={"center"}
                gap={0.5}
                sx={iconTextStyle}
                className="icon-text-style"
              >
                <Favorite />
                {template.favorites_count || 0}
              </Stack>
              {isDesktop && (
                <Stack
                  direction={"row"}
                  alignItems={"center"}
                  gap={0.5}
                  sx={iconTextStyle}
                  className="icon-text-style"
                >
                  <Bolt />
                  {template.likes || template.executions_count || 0}
                </Stack>
              )}
            </Box>
          </Stack>
          <Box
            display="flex"
            flexDirection="column"
            gap="16px"
            p={"16px"}
          >
            <Stack
              flex={1}
              gap={"8px"}
            >
              <Typography
                fontSize={14}
                fontWeight={500}
              >
                {template.title}
              </Typography>
              {isDesktop && (
                <Typography
                  sx={{
                    fontSize: 11,
                    fontWeight: 400,
                    lineHeight: "16.5px",
                    textAlign: "left",
                  }}
                >
                  {truncate(stripTags(template.description), { length: 70 })}
                </Typography>
              )}
            </Stack>

            <Box
              display="flex"
              alignItems="center"
            >
              <Stack
                direction={"row"}
                alignItems={"center"}
                gap={1}
              >
                <Image
                  src={template.created_by?.avatar ?? require("@/assets/images/default-avatar.jpg")}
                  alt={template.created_by?.first_name ?? "Promptify"}
                  width={18}
                  height={18}
                  style={{
                    backgroundColor: theme.palette.surface[5],
                    borderRadius: "50%",
                  }}
                />

                <Typography
                  fontSize={11}
                  fontWeight={500}
                  lineHeight={"13.2px"}
                  textAlign={"left"}
                >
                  {template.created_by?.first_name}
                </Typography>
              </Stack>
            </Box>

            {tags.length > 0 && (
              <Box
                display="flex"
                gap="8px"
                flexWrap="wrap"
              >
                <Box
                  display="flex"
                  gap="8px"
                  flexWrap="wrap"
                >
                  {displayedTags.map((tag, index) => (
                    <>
                      {index === 0 ? (
                        <Chip
                          key={tag.id}
                          label={tag.name}
                          size="small"
                          sx={{
                            fontSize: "11px",
                            fontWeight: 500,
                            lineHeight: "16px",
                            textAlign: "left",
                            padding: "7px 12px 7px 12px",
                            gap: "6px",
                            borderRadius: "100px",
                            border: "1px solid rgba(0, 0, 0, 0.08)",
                            bgcolor: "white",
                          }}
                        />
                      ) : (
                        <Stack
                          gap="8px"
                          direction={{ xs: "column", md: "row" }}
                          alignItems={{ xs: "start", md: "center" }}
                        >
                          <Chip
                            key={tag.id}
                            label={tag.name}
                            size="small"
                            sx={{
                              fontSize: "11px",
                              fontWeight: 500,
                              lineHeight: "16px",
                              textAlign: "left",
                              padding: "7px 12px 7px 12px",
                              gap: "6px",
                              borderRadius: "100px",
                              border: "1px solid rgba(0, 0, 0, 0.08)",
                              bgcolor: "white",
                            }}
                          />
                          {remainingTagsCount > 0 && (
                            <Chip
                              label={`+${remainingTagsCount}`}
                              size="small"
                              sx={{
                                fontSize: "11px",
                                fontWeight: 500,
                                lineHeight: "16px",
                                textAlign: "left",
                                p: "7px 1px 7px 1px",
                                gap: "6px",
                                borderRadius: "100px",
                                border: "1px solid rgba(0, 0, 0, 0.08)",
                                bgcolor: "white",
                              }}
                            />
                          )}
                        </Stack>
                      )}
                    </>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </Stack>
      </Card>
    </Link>
  );
}

const iconTextStyle = {
  fontSize: 13,
  fontWeight: 400,
  color: "white",
  bgcolor: "rgba(0, 0, 0, 0.8)",
  borderRadius: "100px",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  padding: "0px 12px",
  height: "26px",
  svg: {
    fontSize: 12,
  },
};

export default CardTemplate;
