import { ISparkWithExecution, ISparkWithTemplate, ITemplateExecutionPut, Spark } from '@/core/api/dto/templates';
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

export const createSpark = async (data: ISparkWithTemplate) : Promise<Spark> => {
  return await authClient
    .post(
      `/api/meta/sparks/`,
      { ...data },
      { headers: { 'Content-Type': 'application/json' } }
    )
    .then(response => {
      return response.data;
    });
};

export const createSparkWithExecution = async (data: ISparkWithExecution) : Promise<Spark> => {
  return await authClient
    .post(
      `/api/meta/sparks/create_with_execution/`,
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

export const pinSpark = async (sparkId: number) => {
  return await authClient
    .post(`/api/meta/sparks/${sparkId}/favorite/`)
    .then(response => {
      return response.data;
    });
};

export const unpinSpark = async (sparkId: number) => {
  return await authClient
    .delete(`/api/meta/sparks/${sparkId}/favorite/`)
    .then(response => {
      return response.data;
    });
};