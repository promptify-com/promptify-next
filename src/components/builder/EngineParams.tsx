import React from "react";
import { Box, Stack, TextField } from "@mui/material";
import { IEngineParams } from "@/common/types/builder";

interface Props {
  params: IEngineParams | null | undefined;
  setParam: (name: string, value: string) => void;
}

export const EngineParams: React.FC<Props> = ({ params, setParam }) => {
  return (
    <Stack
      gap={1.5}
      my={1}
    >
      <Box>
        <TextField
          label="Temperature"
          variant="standard"
          size="medium"
          type="number"
          fullWidth
          name="temperature"
          value={params?.temperature}
          onChange={e => setParam(e.target.name, e.target.value)}
        />
      </Box>
      <Box>
        <TextField
          label="Maximum Length"
          variant="standard"
          size="medium"
          type="number"
          fullWidth
          name="maximumLength"
          value={params?.maximumLength}
          onChange={e => setParam(e.target.name, e.target.value)}
        />
      </Box>
      <Box>
        <TextField
          label="Top P"
          variant="standard"
          size="medium"
          type="number"
          fullWidth
          name="topP"
          value={params?.topP}
          onChange={e => setParam(e.target.name, e.target.value)}
        />
      </Box>
      <Box>
        <TextField
          label="Presence Penalty"
          variant="standard"
          size="medium"
          type="number"
          fullWidth
          name="presencePenalty"
          value={params?.presencePenalty}
          onChange={e => setParam(e.target.name, e.target.value)}
        />
      </Box>
      <Box>
        <TextField
          label="Frequence Penalty"
          variant="standard"
          size="medium"
          type="number"
          fullWidth
          name="frequencyPenalty"
          value={params?.frequencyPenalty}
          onChange={e => setParam(e.target.name, e.target.value)}
        />
      </Box>
    </Stack>
  );
};
