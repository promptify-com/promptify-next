import Stack from "@mui/material/Stack";
import useBrowser from "@/hooks/useBrowser";
import Header from "@/components/Prompt/Common/Header";
import { Templates } from "@/core/api/dto/templates";
import TemplateDetails from "./TemplateDetails";
import Box from "@mui/material/Box";
import Image from "@/components/design-system/Image";
import ContentContainer from "./ContentContainer";

interface Props {
  template: Templates;
}

function TemplatePage({ template }: Props) {
  const { isMobile } = useBrowser();

  return (
    <Stack
      direction={"row"}
      gap={4}
      height={"100%"}
      px={"32px"}
      bgcolor={"surfaceContainerLowest"}
    >
      <Stack flex={4}>
        {!isMobile && <Header template={template} />}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: isMobile ? "408px" : "446px",
            borderRadius: "24px",
            overflow: "hidden",
          }}
        >
          <Image
            src={template.thumbnail ?? require("@/assets/images/default-thumbnail.jpg")}
            alt={template.title?.slice(0, 1) ?? "P"}
            priority={true}
            fill
            sizes="(max-width: 900px) 253px, 446px"
            style={{
              objectFit: "cover",
            }}
          />
        </Box>
        <ContentContainer template={template} />
      </Stack>
      <Box flex={2}>
        <TemplateDetails template={template} />
      </Box>
    </Stack>
  );
}

export default TemplatePage;
