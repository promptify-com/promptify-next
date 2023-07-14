import { authClient } from '../../common/axios';
import { IEditTemplate } from '../../common/types/editTemplate';

export const updateTemplate = async (id: number, data: IEditTemplate) => {
  return await authClient
    .put(
      `/api/meta/templates/${id}/`,
      {
        ...data,
      },
      { headers: { 'Content-Type': 'application/json' } },
    )
    .then(response => {
      return response.data;
    });
};

export const createTemplate = async (data: IEditTemplate) => {
  return await authClient
    .post(`/api/meta/templates/`, { ...data }, { headers: { 'Content-Type': 'application/json' } })
    .then(response => {
      return response.data;
    });
};

export const importTemplate = async (data: IEditTemplate) => {
  return await authClient
    .post(`/api/meta/templates/import/`, { ...data }, { headers: { 'Content-Type': 'application/json' } })
    .then(response => {
      return response.data;
    });
};

export const deletePrompt = async (id: number) => {
  return await authClient.delete(`/api/meta/prompts/${id}/`).then(response => {
    return response.data;
  });
}

export const likeTemplate = async (templateId: number) => {
  return await authClient
    .post(`/api/meta/templates/${templateId}/like/`)
    .then(response => {
      return response.data;
    });
}

export const removeTemplateLike = async (templateId: number) => {
  return await authClient
    .delete(`/api/meta/templates/${templateId}/like/`)
    .then(response => {
      return response.data;
    });
}

export const addToCollection = async (collectionId: number, templateId: number) => {
  return await authClient
    .post(`/api/meta/collections/${collectionId}/add/${templateId}/`)
    .then(response => {
      return response.data;
    });
}

export const removeFromCollection = async (collectionId: number, templateId: number) => {
  return await authClient
    .post(`/api/meta/collections/${collectionId}/remove/${templateId}/`)
    .then(response => {
      return response.data;
    });
}