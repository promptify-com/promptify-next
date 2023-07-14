import React, { useEffect } from 'react';
import { Box, Divider, InputLabel, Stack, TextField } from '@mui/material';
import { InputsErrors } from './GeneratorForm';

interface GeneratorInputProps {
  promptId: number;
  inputs: {
    name: string;
    fullName: string;
    type: string;
  }[];
  resInputs: any;
  setResInputs: (obj: any) => void;
  errors: InputsErrors;
}

export const GeneratorInput: React.FC<GeneratorInputProps> = ({
  promptId,
  inputs,
  setResInputs,
  resInputs,
  errors,
}) => {

  const handleChange = (value: string, name: string, type: string) => {
    const resObj = [...resInputs].find(prompt => prompt.id === promptId);
    const resArr = [...resInputs];

    if (!resObj) {
      return setResInputs([
        ...resInputs,
        { id: promptId, inputs: { [name]: type === 'number' ? +value : value } },
      ]);
    }

    resArr.forEach((prompt: any, index: number) => {
      if (prompt.id === promptId) {
        resArr[index] = {
          ...prompt,
          inputs: { ...prompt.inputs, [name]: type === 'number' ? +value : value },
        };
      }
    });

    setResInputs([...resArr]);
  };

  useEffect(() => {
    if (inputs.length > 0) {
      const defaultObj = inputs
        .map(input => ({
          [input.name]: input.type === 'number' ? 0 : '',
        }))
        .reduce((acc, curr) => Object.assign(acc, curr), {});

      setResInputs([...resInputs, { id: promptId, inputs: defaultObj }]);
    }
  }, []);

  return inputs.length > 0 ? (
    <Box>
      {inputs.map((input, index) => (
        <React.Fragment key={index} >
          <Divider sx={{ borderColor: 'surface.3' }} />
          <Stack direction={'row'} alignItems={'center'} gap={1}
            sx={{ p: '16px 8px 16px 16px' }}
          >
            <InputLabel
              sx={{
                fontSize: 14,
                fontWeight: 500,
                color: errors[input.name] ? 'error.main' : 'tertiary'
              }}
            >
              {input.fullName}:
            </InputLabel>
            <TextField
              sx={{
                flex: 1,
                '.MuiInputBase-input': {
                  p: 0,
                  color: 'onSurface',
                  fontSize: 14,
                  fontWeight: 400,
                  '&::placeholder': {
                    color: 'grey.600',
                    opacity: 1
                  },
                  '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
                    WebkitAppearance: 'none',
                    margin: 0,
                  },
                  '&[type=number]': {
                    MozAppearance: 'textfield',
                  },
                },
                '.MuiOutlinedInput-notchedOutline': {
                  border: 0,
                },
                '.MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  border: 0,
                },
              }}
              placeholder={input.type === 'number' ? 'Write a number here..' : 'Type here...'}
              type={input.type}
              onChange={e => handleChange(e.target.value, input.name, input.type)}
            />
          </Stack>
        </React.Fragment>
      ))}
    </Box>
    ) : (
      null
  );
};
