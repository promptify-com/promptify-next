//
import { inputsCustomizations } from "./input";
import { surfacesCustomizations } from "./surfaces";
import { navigationCustomizations } from "./navigation";
import { feedbackCustomizations } from "./feedback";
import { dataDisplayCustomizations } from "./data-display";
import { Theme } from "@mui/material/styles";

// ----------------------------------------------------------------------

export default function ComponentsOverrides(theme: Theme) {
  return Object.assign(
    inputsCustomizations,
    surfacesCustomizations,
    navigationCustomizations,
    feedbackCustomizations,
    dataDisplayCustomizations,
  );
}
