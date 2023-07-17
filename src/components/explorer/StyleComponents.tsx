// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { CardMedia, Grid, styled } from '@mui/material';

interface CardMediaProps {
  alt?: string;
  component?: string;
}

export const CardContainerGrid = styled(Grid)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: '235px',
  },
  height: '343px',
  background: 'transparent',
  borderRadius: '1em',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  gap: '1em',
  '&:hover': {
    transform: 'scale(1.005)',
    cursor: 'pointer',
  },
}));

export const ImgCardContainerGrid = styled(Grid)({
  display: 'flex',
  borderRadius: '1em',
  overflow: 'hidden',
  height: '183px',
  position: 'relative',
});

export const BodyCardContainerGrid = styled(Grid)(({ theme }) => ({
  height: 'fit-content',
  [theme.breakpoints.up('sm')]: {
    height: '4em',
  },
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5em',
}));

export const TitleCardGrid = styled(Grid)({
  fontFamily: 'Poppins',
  fontStyle: 'normal',
  fontWeight: 500,
  fontSize: '18px',
  lineHeight: '140%',
  letterSpacing: '0.15px',
  color: '#1B1B1E',
});

export const TitleCardContainerGrid = styled(Grid)({
  height: '2.5em',
  display: 'flex',
  alignItems: 'center',
});

export const TagsCardContainerGrid = styled(Grid)({
  display: 'flex',
  padding: '0.5em 0em',
  gap: '1em',
});

export const TagCardGrid = styled(Grid)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '4px 9px',
  gap: '10px',
  width: 'fit-content',
  background: '#FFFFFF',
  borderRadius: '3em',
  fontSize: '0.6em',
});

export const FooterCardContainerGrid = styled(Grid)({
  display: 'flex',
  //   padding: '0em 1em',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
});

export const CardMediaContainer = styled(Grid)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.4em',
}));

export const WriterImgCardMedia = styled(CardMedia)<CardMediaProps>(() => ({
  width: '1.5em',
}));

export const WriterNameCardMedia = styled(Grid)(() => ({
  fontSize: '12px',
}));

export const WishCardContainer = styled(CardMedia)(() => ({
  display: 'flex',
  gap: '0.4em',
}));

export const WishCardTotalGrid = styled(Grid)(() => ({
  display: 'flex',
  fontSize: '0.7em',
  alignItems: 'center',
  color: '#8c8b8e',
}));
