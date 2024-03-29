import { Templates } from "@/core/api/dto/templates";

type OrderBy = keyof Templates;

export interface SortOption {
  label: string;
  orderby: string;
}
