import { BaseQueryFn } from '@reduxjs/toolkit/query';
import axios from 'axios';
import { AxiosError, AxiosRequestConfig } from 'axios';
import useToken from '../../hooks/useToken';

export const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: '' },
  ): BaseQueryFn<
    {
      url: string;
      method: AxiosRequestConfig['method'];
      data?: AxiosRequestConfig['data'];
      params?: AxiosRequestConfig['params'];
      headers?: AxiosRequestConfig['headers'];
    },
    unknown,
    unknown
  > =>
    async ({ url, method, data, params, headers }) => {
      // If access token exists send the Authorization header
      const token = useToken();
      if (token)
        headers = { ...headers, Authorization: `Token ${token}` }

      try {
        const result = await axios({
          url: baseUrl + url,
          method,
          data,
          params,
          headers,
        });
        return { data: result.data };
      } catch (axiosError) {
        const err = axiosError as AxiosError;
        return {
          error: {
            status: err.response?.status,
            data: err.response?.data || err.message,
          },
        };
      }
    };
