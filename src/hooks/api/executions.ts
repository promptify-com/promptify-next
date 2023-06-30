import { authClient } from '../../common/axios';

export const addToFavorite = async (templateExecutionId: number) => {
  return await authClient
    .post(`/api/meta/template-executions/${templateExecutionId}/favorite/`)
    .then(response => {
      return response.data;
    });
};

export const removeFromFavorite = async (templateExecutionId: number) => {
  return await authClient
    .delete(`/api/meta/template-executions/${templateExecutionId}/favorite/`)
    .then(response => {
      return response.data;
    });
};
