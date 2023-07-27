import React from "react";
import {
  Box, Typography, alpha, useTheme,
} from "@mui/material";
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { PromptExecutions } from "@/core/api/dto/templates";

interface Props {
  spark?: PromptExecutions
}

export const History: React.FC<Props> = ({
  spark
}) => {
  const { palette } = useTheme();

  return (
    <Box sx={{ p: "16px" }}>
      <Typography 
        sx={{ 
          fontSize: 14,
          fontWeight: 500,
          color: "onSurface",
          py: "8px"
        }}
      >
        Changes History
      </Typography>
      <Box>
        <Timeline sx={{ p: 0 }}>
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 500,
              color: "onSurface",
              opacity: .5,
              p: "8px 16px",
              textTransform: "uppercase"
            }}
          >
            Today
          </Typography>

          {new Array(3).fill(0).map((_, i) => (

            <TimelineItem key={i}
              sx={{
                cursor: "pointer",
                borderRadius: "8px",
                ":hover": {
                  bgcolor: "action.hover"
                },
                ".active": {
                  bgcolor: "surface.3"
                }
              }}
            >
              <TimelineOppositeContent
                sx={{ 
                  p: "16px", 
                  textAlign: "left", 
                  color: "onSurface" 
                }}
              >
                9:30 am
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineConnector sx={{ 
                    visibility: i === 0 ? "hidden" : "visible",
                    bgcolor: `${alpha(palette.primary.main, .3)}`
                  }}
                />
                <TimelineDot variant={true ? "filled": "outlined"} color="primary"
                  sx={{ 
                    m: 0,
                    p: 0,
                    borderColor: `${alpha(palette.primary.main, .3)}`,
                    width: "8px",
                    height: "8px",
                  }}
                >
                  <TimelineConnector sx={{ bgcolor: "transparent" }} />
                </TimelineDot>
                <TimelineConnector sx={{ bgcolor: `${alpha(palette.primary.main, .3)}` }} />
              </TimelineSeparator>
              <TimelineContent sx={{ 
                  flex: 3,
                  p: '16px',
                  color: "onSurface" 
                }}
              >
                <Typography>Because you need strength</Typography>
              </TimelineContent>
            </TimelineItem>

          ))}

        </Timeline>
      </Box>
    </Box>
  );
};