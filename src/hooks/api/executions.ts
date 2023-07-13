import { ITemplateExecutionPut } from '@/core/api/dto/templates';
import { authClient } from '../../common/axios';

export const updateExecution = async (templateExecutionId: number, data: ITemplateExecutionPut) => {
  return await authClient
    .put(
      `/api/meta/template-executions/${templateExecutionId}/`,
      { ...data },
      { headers: { 'Content-Type': 'application/json' } }
    )
    .then(response => {
      return response.data;
    });
};

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
