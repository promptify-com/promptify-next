import { useGetCollectionTemplatesQuery } from "@/core/api/collections";
import { isValidUserFn } from "@/core/store/userSlice";
import { useAppSelector } from "@/hooks/useStore";
import { CollectionItem } from "./CollectionItem";
import { redirectToPath } from "@/common/helpers";
import ListItemPlaceholder from "@/components/placeholders/ListItemPlaceholder";

interface Props {
  sidebarOpen?: boolean;
}

export default function CollectionsList({ sidebarOpen }: Props) {
  const isValidUser = useAppSelector(isValidUserFn);
  const currentUser = useAppSelector(state => state.user.currentUser);
  const { data: collections } = useGetCollectionTemplatesQuery(currentUser?.favorite_collection_id as number, {
    skip: !isValidUser,
  });

  return !collections ? (
    <ListItemPlaceholder />
  ) : (
    collections.prompt_templates.map(item => (
      <CollectionItem
        key={item.id}
        template={item}
        expanded={sidebarOpen}
        onClick={() => {
          redirectToPath(`/prompt/${item.slug}`);
        }}
      />
    ))
  );
}
