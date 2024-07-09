import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { theme } from "@/theme";
import AccordionBox from "@/components/common/AccordionBox";
import { Prompts } from "@/core/api/dto/prompts";
import Image from "../design-system/Image";
import { highlight } from "@/common/constants";
import Tooltip from "@mui/material/Tooltip";

interface Props {
  prompts: Prompts[];
}

export default function Instructions({ prompts }: Props) {
  function highlightContent(content: string) {
    let result = [];
    let lastIndex = 0;

    highlight.forEach(({ highlight, className }) => {
      const regex = new RegExp(highlight);
      let match;

      while ((match = regex.exec(content)) !== null) {
        if (match.index > lastIndex) {
          result.push(content.slice(lastIndex, match.index));
        }

        if (className === "input-variable") {
          // Extract the variable name between {{ and :
          const variableMatch = match[0].match(/{{([^:]+):/);
          const variableName = variableMatch ? variableMatch[1].trim() : "variable";

          result.push(
            <Tooltip
              key={`${match[0]}-${match.index}`}
              title={`The user will be asked to fill the ${variableName} input`}
              arrow
              placement="top"
            >
              <span
                className={className}
                style={{ cursor: "pointer" }}
              >
                {match[0]}
              </span>
            </Tooltip>,
          );
        } else {
          result.push(
            <span
              key={`${match[0]}-${match.index}`}
              className={className}
            >
              {match[0]}
            </span>,
          );
        }
        lastIndex = regex.lastIndex;
      }
    });

    if (lastIndex < content.length) {
      result.push(content.slice(lastIndex));
    }

    return result;
  }

  return (
    <Stack
      gap={3}
      p={{ xs: "10px 24px", md: "48px" }}
    >
      <Typography
        fontSize={{ xs: 24, md: 32 }}
        fontWeight={400}
        color={"onSurface"}
        py={"16px"}
      >
        Prompt instructions:
      </Typography>
      {prompts.length > 0 ? (
        <AccordionBox footerText={prompts.length > 1 ? `Chain of ${prompts.length - 1} more prompts...` : undefined}>
          <Stack gap={3}>
            {prompts.map(prompt => (
              <Stack
                key={prompt.id}
                gap={2}
              >
                <Stack
                  direction={"row"}
                  gap={1}
                >
                  <Typography
                    fontSize={{ xs: 14, md: 16 }}
                    fontWeight={500}
                    color={"onSurface"}
                  >
                    {prompt.title}
                  </Typography>
                  <Stack
                    direction={"row"}
                    alignItems={"center"}
                    gap={"4px"}
                  >
                    <Box
                      width={"16px"}
                      height={"16px"}
                      borderRadius={"16px"}
                      overflow={"hidden"}
                      position={"relative"}
                    >
                      <Image
                        fill
                        style={{ objectFit: "cover" }}
                        alt={prompt.engine.name}
                        src={prompt.engine.icon}
                      />
                    </Box>
                    <Typography
                      fontSize={{ xs: 14, md: 16 }}
                      fontWeight={400}
                      color={"secondary.main"}
                    >
                      {prompt.engine.name}
                    </Typography>
                  </Stack>
                </Stack>
                <Box
                  sx={{
                    ml: "8px",
                    p: "16px 16px 16px 32px",
                    borderLeft: `1px solid ${theme.palette.secondary.light}`,
                  }}
                >
                  <Typography
                    fontSize={{ xs: 14, md: 16 }}
                    fontWeight={400}
                    color={"onSurface"}
                    fontFamily={"Roboto, Mono"}
                    whiteSpace={"pre-wrap"}
                    component="div"
                  >
                    {highlightContent(prompt.content)}
                  </Typography>
                  <Typography
                    fontSize={{ xs: 12, md: 13 }}
                    fontWeight={400}
                    color={"secondary.light"}
                    fontStyle="italic"
                    mt={2}
                  >
                    The output of this prompt will be stored in the variable: {prompt.prompt_output_variable}
                  </Typography>
                </Box>
              </Stack>
            ))}
          </Stack>
        </AccordionBox>
      ) : (
        <Typography
          fontSize={14}
          fontWeight={400}
          color={"onSurface"}
        >
          No instructions found
        </Typography>
      )}
    </Stack>
  );
}
