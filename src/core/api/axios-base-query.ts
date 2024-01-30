import axios, { AxiosError, type AxiosRequestConfig, type ResponseType } from "axios";
import { BaseQueryFn } from "@reduxjs/toolkit/dist/query";

import useToken from "@/hooks/useToken";
import RetryRequestError from "./errors/RetryRequestError";

const IGNORED_RESPONSE_STATUS_CODES = [401, 403, 404];

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const attemptRequest = async ({
  attempt = 0,
  url,
  responseType,
  baseUrl,
  method,
  data,
  params,
  headers,
  maxRetries,
  retryDelay,
}: {
  attempt: number;
  url: string;
  responseType?: ResponseType;
  baseUrl: string;
  method?: string;
  data: any;
  params: any;
  headers: any;
  maxRetries: number;
  retryDelay: number;
}): Promise<{ data: any } | { error: any }> => {
  try {
    const pathname = url.endsWith("/") || url.includes("?") ? url : `${url}/`;
    const axiosReq: AxiosRequestConfig = {
      url: baseUrl + pathname,
      method,
      data,
      params,
      headers,
    };

    if (responseType) {
      axiosReq.responseType = responseType;
    }

    if (attempt !== 0) {
      await sleep(retryDelay * attempt);
    }

    const result = await axios(axiosReq);

    return { data: result.data };
  } catch (error) {
    const _err = error as AxiosError;

    if (_err.response?.status && IGNORED_RESPONSE_STATUS_CODES.includes(_err.response.status)) {
      throw error;
    }

    if (attempt < maxRetries) {
      return attemptRequest({
        attempt: attempt + 1,
        url,
        responseType,
        baseUrl,
        method,
        data,
        params,
        headers,
        maxRetries,
        retryDelay,
      });
    }

    throw new RetryRequestError("Request failed after all retry attempts.");
  }
};

export const axiosBaseQuery =
  ({
    baseUrl = "",
    maxRetries = 3,
    retryDelay = 1000,
  }: {
    baseUrl: string;
    maxRetries?: number;
    retryDelay?: number;
  }): BaseQueryFn<
    {
      url: string;
      method: AxiosRequestConfig["method"];
      data?: AxiosRequestConfig["data"];
      params?: AxiosRequestConfig["params"];
      headers?: AxiosRequestConfig["headers"];
      responseType?: ResponseType;
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, params, headers = {}, responseType }) => {
    const token = useToken();

    if (token) {
      headers.Authorization = `Token ${token}`;
    }

    if (!headers?.["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }

    try {
      return await attemptRequest({
        attempt: 0,
        url,
        responseType,
        baseUrl,
        method,
        data,
        params,
        headers,
        maxRetries,
        retryDelay,
      });
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      const isRetryRequestError = err instanceof RetryRequestError;

      return {
        error: {
          status: err.response?.status || err.status,
          data: {
            message: err.response?.data || err.message,
            retryRequestError: isRetryRequestError,
          },
        },
      };
    }
  };
