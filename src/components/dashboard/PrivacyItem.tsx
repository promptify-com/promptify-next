import React from 'react';
import { Box, Switch, Typography } from '@mui/material';
import { useState } from 'react';



interface IPrivacyItem {
  item: {
    name: string;
    id: number;
    allowed: boolean;
    content: {
      name: string;
      id: number;
      allowed: boolean;
    }[];
  };
}

export const PrivacyItem = ({ item }: IPrivacyItem) => {
  const [allowed, setAllowed] = useState(item.allowed);

  return (
    <Box
      display="flex"
      flexDirection="column"
      border="1px solid #BCBCBC"
      borderRadius={{ xs: '10px', sm: '15px' }}
      mt={{ xs: '0.5rem', sm: '1rem' }}
    >
      <Box
        borderRadius={{ xs: '10px', sm: '15px' }}
        display="flex"
        flexDirection="row"
        height={{ xs: '75px', sm: '70px' }}
      >
        <Box display="flex" width="100%" justifyContent="space-between">
          <Box display="flex" flexDirection="row" alignItems="center">
            <Box ml="2rem">
              <Typography fontWeight={500} fontSize="1rem" color={allowed ? '#000' : '#878787'}>
                Content Group
              </Typography>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" mr="1rem">
            <Switch checked={allowed} onChange={() => setAllowed(!allowed)} />
            <Typography
              fontWeight={500}
              fontSize="1rem"
              color={allowed ? '#000' : '#878787'}
              display={{ xs: 'none', sm: 'block' }}
            >
              {allowed ? 'Allow' : 'Deny'}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box>
        {allowed &&
          item.content.map(item => {
            return (
              <Box
                key={item.id}
                display="flex"
                borderTop="1px solid #BCBCBC"
                justifyContent="space-between"
              >
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  mt="1rem"
                  ml={{ xs: '2rem', sm: '3rem' }}
                  height="70px"
                >
                  <Typography
                    fontWeight={500}
                    fontSize="1rem"
                    color={item.allowed ? '#000' : '#878787'}
                  >
                    {item.name}
                  </Typography>
                  <Typography
                    fontWeight={500}
                    fontSize={{ xs: '0.6rem', sm: '0.8rem' }}
                    color={item.allowed ? '#000' : '#878787'}
                  >
                    Choose what you want to share blah balh
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mr="1rem">
                  <Switch
                    checked={item.allowed}
                    //   onChange={() => setAllowed(!allowed)}
                  />
                  <Typography
                    fontWeight={500}
                    fontSize="1rem"
                    color={allowed ? '#000' : '#878787'}
                    display={{ xs: 'none', sm: 'block' }}
                  >
                    {allowed ? 'Allow' : 'Deny'}
                  </Typography>
                </Box>
              </Box>
            );
          })}
      </Box>
    </Box>
  );
};
