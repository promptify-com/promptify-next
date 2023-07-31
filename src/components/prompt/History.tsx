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
import { Spark, SparkVersion, TemplatesExecutions } from "@/core/api/dto/templates";
import moment from "moment";
import { promptsApi } from "@/core/api/prompts";
import { useAppDispatch } from "@/hooks/useStore";

interface Props {
  spark: Spark | null,
  selectedExecution: TemplatesExecutions | null,
  setSelectedExecution: (execution: TemplatesExecutions) => void,
}

export const History: React.FC<Props> = ({
  spark,
  selectedExecution,
  setSelectedExecution,
}) => {
  const { palette } = useTheme();
  const dispatch = useAppDispatch();
  const versions = [...spark?.versions || []]
  const [groupedVersions, setGroupedVersions] = React.useState<{ date: string; versions: SparkVersion[] }[]>([]);

  const sortedVersions = versions.sort((a, b) => moment(b.created_at).diff(moment(a.created_at)));

  React.useEffect(() => {
    const grouped = sortedVersions.reduce((acc, item) => {
      const createdAt = moment(item.created_at).fromNow();
      const index = acc.findIndex(version => version.date === createdAt);
      if (index !== -1) {
        acc[index].versions.push(item);
      } else {
        acc.push({ date: item.created_at, versions: [item] });
      }
      return acc;
    }, [] as { date: string; versions: SparkVersion[] }[]);
    
    const sortedGrouped = grouped.sort((a, b) => moment(b.date, 'D MMMM YYYY').diff(moment(a.date, 'D MMMM YYYY')));
    setGroupedVersions(sortedGrouped);
  }, [spark?.versions]);


  const TimeLineSeparator = ({noConnector=false, active=false}) => (
    <TimelineSeparator sx={{ position: "relative" }}>
      <TimelineConnector sx={{ 
          bgcolor: `${alpha(palette.primary.main, .3)}`
        }}
      />
      <TimelineDot variant={active ? "filled": "outlined"}
        sx={{ 
          display: noConnector ? "none" : "flex",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "4px",
          height: "4px",
          m: 0,
          p: 0,
          bgcolor: `${active ? "primary.main" : "surface.2"}`,
          borderColor: `${alpha(palette.primary.main, .3)}`,
        }}
      >
        <TimelineConnector sx={{
            bgcolor: "transparent" 
          }} 
        />
      </TimelineDot>
      <TimelineConnector sx={{ bgcolor: `${alpha(palette.primary.main, .3)}` }} />
    </TimelineSeparator>
  );

  const chooseExecution = async (executionId: number) => {
    const execution = (
      await dispatch(
        promptsApi.endpoints.getExecutionById.initiate(executionId)
      )
    ).data;
    if (execution)
      setSelectedExecution(execution);
  }

  const formatDate = (date: string) => {
    const today = moment().startOf('day');
    const inputDate = moment(new Date(date));

    if (inputDate.isSame(today, 'd')) {
      return 'Today';
    } else if (inputDate.isSame(today.subtract(1, 'd'), 'd')) {
      return 'Yesterday';
    } else {
      const diff = today.diff(inputDate, 'days');
      return `${diff} days ago`;
    }
  }

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

          {groupedVersions.map((group, i) => (
            <React.Fragment key={i}>
            <TimelineItem key={i}
              sx={{ minHeight: "0" }} 
            >
              <TimelineOppositeContent
                sx={{ 
                  fontSize: 11,
                  fontWeight: 500,
                  color: "onSurface",
                  opacity: .5,
                  p: "16px", 
                  textTransform: "uppercase",
                  textAlign: "left",
                }}
              >
                {formatDate(group.date)}
              </TimelineOppositeContent>
              <TimeLineSeparator noConnector />
              <TimelineContent sx={{ 
                  flex: 3,
                  p: '16px',
                }}
              >
              </TimelineContent>
            </TimelineItem>

            {group.versions.map((version) => (
              <TimelineItem key={version.id}
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
                onClick={() => chooseExecution(version.id)}
              >
                <TimelineOppositeContent
                  sx={{ 
                    ...timeLineContentStyle,
                  }}
                >
                  {moment(version.created_at).format("hh:mm A")}
                </TimelineOppositeContent>
                <TimeLineSeparator active={version.id === selectedExecution?.id} />
                <TimelineContent sx={{
                    ...timeLineContentStyle, 
                    flex: 3,
                  }}
                >
                  {version.title}
                </TimelineContent>
              </TimelineItem>
            ))}
            </React.Fragment>
          ))}

        </Timeline>
      </Box>
    </Box>
  );
};

const timeLineContentStyle = {
  p: '16px',
  fontSize: 12,
  fontWeight: 500,
  color: "onSurface",
  textAlign: "left",
  display: "flex",
  alignItems: "center",
}