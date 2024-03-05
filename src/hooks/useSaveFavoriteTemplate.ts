import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { isValidUserFn } from "@/core/store/userSlice";
import { useState } from "react";
import { updateCurrentFavorite, TemplatesProps, updateCurrentLike } from "@/core/store/templatesSlice";
import { useAddToCollectionMutation, useRemoveFromCollectionMutation } from "@/core/api/collections";
import { useAppSelector } from "./useStore";
import { useAddTemplateLikeMutation, useRemoveTemplateLikeMutation } from "@/core/api/templates";

type ReturnProps = [() => Promise<undefined | boolean>, { templateData: TemplatesProps }];

const useSaveFavoriteTemplate = (isVote?: boolean): ReturnProps => {
  const router = useRouter();
  const isValidUser = useAppSelector(isValidUserFn);
  const templateData = useAppSelector(state => state.template);
  const favoriteCollectionId = useAppSelector(state => state.user.currentUser?.favorite_collection_id);
  const [isFetching, setIsFetching] = useState(false);
  const dispatch = useDispatch();
  const [addToCollection] = useAddToCollectionMutation();
  const [removeFromCollection] = useRemoveFromCollectionMutation();
  const [likeTemplate] = useAddTemplateLikeMutation();
  const [removeTemplateLike] = useRemoveTemplateLikeMutation();

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

      try {
        if (isVote) await like();
        else await favorite();
      } finally {
        setIsFetching(false);
      }
    }
  };

  const like = async () => {
    dispatch(updateCurrentLike(!templateData.is_liked));

    try {
      if (!templateData.is_liked) {
        await likeTemplate(templateData.id);
      } else {
        await removeTemplateLike(templateData.id);
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const favorite = async () => {
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
    }
  };

  return [saveFavorite, { templateData }];
};

export default useSaveFavoriteTemplate;
