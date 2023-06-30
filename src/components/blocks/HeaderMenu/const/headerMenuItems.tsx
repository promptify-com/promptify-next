import React from 'react';
import { Home } from '../../../../assets/icons/Home';
import { Connection } from '../../../../assets/icons/Connection';
import { User } from '../../../../assets/icons/user';
import { Prompt } from '../../../../assets/icons/prompts';

export const headerMenuItems = [
  { name: 'Home ', icon: <Home />, id: 0, link: 'home' },
  { name: 'Connections ', icon: <Connection />, id: 1, link: 'connections' },
  { name: 'Identity Setup ', icon: <User />, id: 2, link: 'identy' },
  // { name: 'Data Privacy ', icon: <Code />, id: 3, link: 'privacy' },
  // { name: 'My Content ', icon: <Code />, id: 4, link: 'content' },
  { name: 'Prompts ', icon: <Prompt />, id: 6, link: 'prompts' },
  // { name: 'Payment Info ', icon: <Code />, id: 5, link: 'payment' },
];

export const headerMenuItemsMobile = [
  { name: 'Home ', icon: <Home />, id: 0, link: 'home' },
  { name: 'Connections ', icon: <Connection />, id: 1, link: 'connections' },
  { name: 'Identity Setup ', icon: <User />, id: 2, link: 'identy' },
  // { name: 'Data Privacy ', icon: <Code />, id: 3, link: 'privacy' },
  // { name: 'My Content ', icon: <Code />, id: 4, link: 'content' },
  // { name: 'Prompts ', icon: <Prompt />, id: 6, link: 'prompts' },
  // { name: 'Payment Info ', icon: <Code />, id: 5, link: 'payment' },
];
