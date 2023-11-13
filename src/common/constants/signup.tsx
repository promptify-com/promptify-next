import React from "react";
import Code from "@mui/icons-material/Code";
import ModelTraining from "@mui/icons-material/ModelTraining";
import TextFields from "@mui/icons-material/TextFields";
import PersonalVideo from "@mui/icons-material/PersonalVideo";
import LibraryMusic from "@mui/icons-material/LibraryMusic";
import Pets from "@mui/icons-material/Pets";
import Yard from "@mui/icons-material/Yard";
import BugReport from "@mui/icons-material/BugReport";
import Forest from "@mui/icons-material/Forest";
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
