import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { isValidUserFn } from "@/core/store/userSlice";
import { savePathURL } from "@/common/utils";
import { useState } from "react";
import { updateCurrentFavorite, TemplatesProps } from "@/core/store/templatesSlice";
import { RootState } from "@/core/store";
import { useAddToCollectionMutation, useRemoveFromCollectionMutation } from "@/core/api/collections";

type ReturnProps = [() => Promise<undefined | boolean>, { templateData: TemplatesProps }];

const useSaveFavoriteTemplate = (): ReturnProps => {
  const router = useRouter();
  const isValidUser = useSelector(isValidUserFn);
  const templateData = useSelector((state: RootState) => state.template);
  const favoriteCollectionId = useSelector((state: RootState) => state.user.currentUser?.favorite_collection_id);
  const [isFetching, setIsFetching] = useState(false);
  const dispatch = useDispatch();
  const [addToCollection] = useAddToCollectionMutation();
  const [removeFromCollection] = useRemoveFromCollectionMutation();

  const saveFavorite = async () => {
    if (!isValidUser) {
      return router.push("/signin");
    }

    if (!templateData) {
      console.warn("No template data available to save this template to favorites!");
      return;
    }

    if (!isFetching) {
      setIsFetching(true);

      dispatch(updateCurrentFavorite(!templateData.is_favorite));

      try {
        if (!favoriteCollectionId) {
          throw new Error("user's 'favorite_collection_id' field does not exist!");
        }

        if (!templateData.is_favorite) {
          await addToCollection({
            collectionId: favoriteCollectionId,
            templateId: templateData.id,
          });
        } else {
          await removeFromCollection({
            collectionId: favoriteCollectionId,
            templateId: templateData.id,
          });
        }
      } catch (err: any) {
        console.error(err);
      } finally {
        setIsFetching(false);
      }
    }
  };

  return [saveFavorite, { templateData }];
};

export default useSaveFavoriteTemplate;
