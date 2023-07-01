import React from 'react';
import { Box, Typography } from '@mui/material';

const contentData = [
  { value: '256 Mb', name: 'My Data', id: 0 },
  { value: '556', name: 'My Prompts', id: 1 },
  { value: '556', name: 'My Templates', id: 2 },
  { value: '556', name: 'My Collections', id: 3 },
];

export const Content = () => {
  return (
    <section id="content" style={{ scrollMarginTop: '100px', marginTop: '8rem' }}>
      <Box>
        <Typography
          fontWeight={500}
          fontSize={{ xs: '1.5rem', sm: '2rem' }}
          textAlign={{ xs: 'center', sm: 'start' }}
        >
          My Content
        </Typography>
        <Box display="flex" justifyContent="center">
          <Typography
            fontWeight={500}
            fontSize="1rem"
            mt={{ xs: '1rem', sm: '2rem' }}
            textAlign={{ xs: 'center', sm: 'start' }}
            width={{ xs: '80%', sm: '100%' }}
          >
            Choose what you want to share blah balh blah,
          </Typography>
        </Box>

        {contentData.map(item => {
          return (
            <Box
              border="1px solid #BCBCBC"
              borderRadius={{ xs: '10px', sm: '15px' }}
              mt="0.8rem"
              key={item.id}
              display="flex"
              flexDirection="row"
              height="70px"
            >
              <Box display="flex" width="100%" justifyContent="space-between">
                <Box display="flex" flexDirection="row" alignItems="center">
                  <Box ml="2rem">
                    <Typography fontWeight={500} fontSize="1rem" color="#0F6FFF">
                      {item.name}
                    </Typography>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" mr="2rem">
                  <Typography fontWeight={500} fontSize="1rem" ml="1rem">
                    {item.value}
                  </Typography>
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
    </section>
  );
};
