import React from 'react';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import {
  Box,
  Button,
  CardMedia,
  Grid,
  Typography
} from '@mui/material';
import { ReactElement, useCallback, useState } from 'react';
import Images from '../../assets';
import { LogoApp } from '../../assets/icons/LogoApp';
import { IInterest, OnboardingPage } from '../../common/types';
import { useInterests, useUpdateInterests } from '../../hooks/api/interests';
import PromptsCard from './PromptsCard';
import { promptCards } from '@/common/constants/signup'; 
import Link from 'next/link';

const Prompts = ({ setStep }: OnboardingPage) => {
  const [checkedPrompts, setCheckedPrompts] = useState<number[]>([]);
  const [interests] = useInterests();

  const [updateInterests] = useUpdateInterests();

  const handleContinue = async () => {
    await updateInterests(checkedPrompts);
    setStep(2);
  };



  // TODO: temporary hardcoded icons
  const getIconByName = useCallback((name: string): ReactElement => {
    return promptCards.find(card => card.name === name)?.icon || <ErrorOutlineIcon />;
  }, []);

  return (
    <Box
      display="flex"
      sx={{
        width: '100vw',
        minHeight: '100vh',
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        sx={{
          width: { xs: '100%', lg: '70%' },
          height: "100vh",
          justifyContent: "center"
        }}
      >
        <Box
          sx={{
            width: { xs: '70%', lg: '70%' },
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Link href="/">
            <Grid
              sx={{
                display: "flex",
              }}
            >
              <LogoApp />
            </Grid>
          </Link>

          <Typography
            sx={{
              mt: { xs: '2rem', md: '2rem', lg: '3rem', xl: '5rem' },
              fontWeight: 500,
              fontFamily: 'Poppins',
              fontStyle: 'normal',
              fontSize: '48px',
              lineHeight: '116.7%',
              display: 'flex',
              alignItems: 'center',
              color: '#1D2028',
            }}
          >
            Welcome to Promptify
          </Typography>
          <Typography
            sx={{
              mt: '0.5rem',
              fontFamily: 'Poppins',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '16px',
              lineHeight: '150%',
              display: 'flex',
              alignItems: 'center',
              letterSpacing: '0.15px',
              color: '#1D2028',
            }}
          >
            Please, specify what type of prompts you need
          </Typography>

          <Box
            display="flex"
            flexWrap="wrap"
            mt="1rem"
            justifyContent={{ xs: 'center', sm: 'flex-start' }}
            rowGap="0.5rem"
            columnGap="0.5rem"
          >
            <Grid container rowGap={{ xs: 1, sm: 2 }}>
              {interests.map(({ id, name }: IInterest) => {
                return (
                  <Grid item xs={12} sm={4} key={id}>
                    <PromptsCard
                      name={name}
                      icon={getIconByName(name)}
                      id={id}
                      checkedPrompts={checkedPrompts}
                      setCheckedPrompts={setCheckedPrompts}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </Box>

          <Button
            // disabled={!allowedToPass}
            onClick={handleContinue}
            sx={{
              bgcolor: '#D6D6D6',
              color: 'common.black',
              mt: '2rem',
              paddingLeft: '2rem',
              paddingRight: '2rem',
              textTransform: 'none',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '8px 22px',
              width: '100%',
              height: '42px',
              background: 'rgba(29, 32, 40, 0.12)',
              borderRadius: '100px',
            }}
          >
            Continue
          </Button>
        </Box>
      </Box>
      <Grid
        sx={{
          width: "30%",
          height: '100vh',
          display: { xs: 'none', lg: 'flex' },
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
        }}
      >
        <CardMedia
          component="img"
          image={Images.COVERLOGIN}
          alt="Cover SignIn"
          sx={{
            display: 'block',
            WebkitBackgroundSize: 'cover',
            backgroundSize: 'cover',
            objectFit: 'contain',
            height: '100vh',
            width: "fit-content"
          }}
        />
      </Grid>
    </Box>
  );
};

export default Prompts;
