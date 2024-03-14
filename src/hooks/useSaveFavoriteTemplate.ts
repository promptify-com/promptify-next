import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { isValidUserFn } from "@/core/store/userSlice";
import { useEffect, useState } from "react";
import { TemplatesProps, updateCurrentFavorite, updateCurrentLike } from "@/core/store/templatesSlice";
import { useAddToCollectionMutation, useRemoveFromCollectionMutation } from "@/core/api/collections";
import { useAppSelector } from "./useStore";
import { useAddTemplateLikeMutation, useRemoveTemplateLikeMutation } from "@/core/api/templates";
import { Templates } from "@/core/api/dto/templates";

const useSaveFavoriteTemplate = (template?: Templates) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isFetching, setIsFetching] = useState(false);
  const isValidUser = useAppSelector(isValidUserFn);
  const favoriteCollectionId = useAppSelector(state => state.user.currentUser?.favorite_collection_id);
  const selectedTemplate = useAppSelector(state => state.template);
  const [templateData, setTemplateData] = useState<Templates | TemplatesProps>(selectedTemplate);

  const [addToCollection] = useAddToCollectionMutation();
  const [removeFromCollection] = useRemoveFromCollectionMutation();
  const [likeTemplate] = useAddTemplateLikeMutation();
  const [removeTemplateLike] = useRemoveTemplateLikeMutation();

  useEffect(() => {
    if (template) setTemplateData(template);
    else setTemplateData(selectedTemplate);
  }, [template, selectedTemplate]);

  const saveFavorite = async (isVote?: boolean) => {
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
    setTemplateData(prev => ({ ...prev, is_liked: !templateData.is_liked }));
    if (!template) {
      dispatch(updateCurrentLike(!templateData.is_liked));
    }

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
    setTemplateData(prev => ({ ...prev, is_favorite: !templateData.is_favorite }));
    if (!template) {
      dispatch(updateCurrentFavorite(!templateData.is_favorite));
    }

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

  return { saveFavorite, templateData };
};

export default useSaveFavoriteTemplate;
