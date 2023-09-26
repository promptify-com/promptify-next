import React from "react";
import { Box, Button, Divider, Stack, Typography, alpha } from "@mui/material";
import { useGetEnginesQuery } from "@/core/api/engines";
import { Engine } from "@/core/api/dto/templates";
import { theme } from "@/theme";

interface Props {
  onChange: (engine: Engine) => void;
}

export const EnginesGroups: React.FC<Props> = ({ onChange }) => {
  const { data: engines } = useGetEnginesQuery();

  const engineGroups = engines?.reduce(
    (result, engine) => {
      const outputType = engine.output_type;
      if (!result[outputType]) {
        result[outputType] = [];
      }

      result[outputType].push(engine);

      return result;
    },
    {} as Record<string, Engine[]>,
  );

  return (
    <Stack height={"100%"}>
      <Box p={"16px"}>Select AI Engine:</Box>
      <Divider sx={{ borderColor: "surface.3" }} />
      <Box
        sx={{
          overflowY: "auto",
        }}
      >
        <Stack
          direction={"row"}
          gap={3}
        >
          {engineGroups &&
            Object.keys(engineGroups)?.map(group => (
              <Box>
                <Typography
                  sx={{
                    p: "14px 16px",
                    fontSize: 11,
                    fontWeight: 500,
                    color: alpha(theme.palette.text.secondary, 0.45),
                    letterSpacing: 0.8,
                  }}
                >
                  {group} GENERATION
                </Typography>
                {engineGroups[group].map(engine => (
                  <Button
                    sx={{
                      width: "100%",
                      justifyContent: "flex-start",
                      gap: 1,
                      p: "14px 16px",
                      fontSize: 16,
                      fontWeight: 400,
                      borderRadius: 0,
                      ":hover": {
                        bgcolor: "action.hover",
                      },
                    }}
                    onClick={() => onChange(engine)}
                  >
                    <img
                      src={engine.icon}
                      alt={engine.name}
                      loading="lazy"
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                      }}
                    />
                    {engine.name}
                  </Button>
                ))}
              </Box>
            ))}
        </Stack>
      </Box>
    </Stack>
  );
};
