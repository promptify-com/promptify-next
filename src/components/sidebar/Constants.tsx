import { Item } from "./Collapsible";
import Bolt from "@mui/icons-material/Bolt";
import Campaign from "@mui/icons-material/Campaign";
import FilterHdr from "@mui/icons-material/FilterHdr";
import Videocam from "@mui/icons-material/Videocam";

export const contentTypeItems: Item[] = [
  { id: 0, name: "Text", icon: <Bolt />, type: "EngineType" },
  { id: 1, name: "Image", icon: <FilterHdr />, type: "EngineType" },
  { id: 2, name: "Audio", icon: <Campaign />, type: "EngineType" },
  { id: 3, name: "Video", icon: <Videocam />, type: "EngineType" },
];
