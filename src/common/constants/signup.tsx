import React from "react";
import {
  Code,
  ModelTraining,
  TextFields,
  PersonalVideo,
  LibraryMusic,
  Pets,
  Yard,
  BugReport,
  Forest,
} from "@mui/icons-material";

export const promptCards = [
  { name: "Code Snippets", icon: <Code />, id: 0 },
  { name: "Model Training", icon: <ModelTraining />, id: 1 },
  { name: "Text Content", icon: <TextFields />, id: 2 },
  { name: "Visual Content", icon: <PersonalVideo />, id: 3 },
  { name: "Sound & Music", icon: <LibraryMusic />, id: 4 },
];

export const animalCards = [
  { name: "Lion", icon: <Pets />, id: 0 },
  { name: "Dolphin", icon: <Yard />, id: 1 },
  { name: "Owl", icon: <BugReport />, id: 2 },
  { name: "Elefant", icon: <Forest />, id: 3 },
];
