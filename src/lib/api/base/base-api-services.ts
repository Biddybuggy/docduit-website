import axios, { AxiosResponse, AxiosStatic } from 'axios';
import qs from 'qs';
import { baseUrl, endpoints } from './base-api-endpoints';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

class BaseApiService {
  private axios: AxiosStatic;
  private baseURL: string;
  toastPresenter: (message: string) => void;

  constructor(baseURL: string, toastPresenter: (message: string) => void) {
    this.axios = axios;
    this.baseURL = baseURL;
    this.toastPresenter = toastPresenter;
  }

  private decodeJWT = (token: string) => {
    try {
      return JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
    } catch (e) {
      return null;
    }
  };

  private refreshToken = async (): Promise<string> => {
    const TOKEN_REFRESH_BUFFER = 60 * 1000; // 1 minute buffer
    const accessToken = localStorage.getItem('ACCESS_TOKEN');
    if (!accessToken) return '';

    const decoded = this.decodeJWT(accessToken || '');
    if (!decoded) return '';

    const expirationTime = decoded.exp * 1000; // Convert to milliseconds
    const isExpired = expirationTime - TOKEN_REFRESH_BUFFER < Date.now(); // Check with buffer time
    if (isExpired) {
      const refreshToken = localStorage.getItem('REFRESH_TOKEN');
      if (!refreshToken) return '';

      try {
        const response = await this.axios.post(
          `${apiUrl}${endpoints.auth.refresh}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          },
        );
        const newAccessToken = response.data.access_token;
        const newRefreshToken = response.data.refresh_token;
        localStorage.setItem('ACCESS_TOKEN', newAccessToken);
        localStorage.setItem('REFRESH_TOKEN', newRefreshToken);
        return newAccessToken;
      } catch (error) {
        console.error('Failed to refresh token:', error);
        return '';
      }
    }

    return accessToken;
  };

  async getHeaders(customHeaders = {}, useAuthorization = true) {
    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders,
    } as any;

    try {
      const accessToken = localStorage.getItem('ACCESS_TOKEN');
      if (!accessToken) return headers;

      const activeAccessToken = await this.refreshToken();
      if (!activeAccessToken) return headers;
      if (useAuthorization)
        headers.Authorization = `Bearer ${activeAccessToken}`;
      return headers;
    } catch (error) {
      console.error(error);
      return headers;
    }
  }

  public async get({
    endpoint,
    params,
    headers,
  }: {
    endpoint: string;
    params?: any;
    headers?: any;
  }): Promise<AxiosResponse> {
    try {
      let q = '';
      if (params) {
        q += `?${qs.stringify(params)}`;
      }
      const header = await this.getHeaders(headers);
      const response = await this.axios.get(`${this.baseURL}${endpoint}${q}`, {
        headers: header,
        responseType: 'json',
      });
      return response;
    } catch (error) {
      this.handleError(error);
      throw error; // Ensure the function always returns a value or throws an error
    }
  }

  public async getRaw({
    endpoint,
    params,
    headers,
  }: {
    endpoint: string;
    params?: any;
    headers?: any;
    overrideHeaders?: boolean;
  }): Promise<AxiosResponse> {
    try {
      let q = '';
      if (params) {
        q += `?${qs.stringify(params)}`;
      }
      const response = await this.axios.get(`${endpoint}${q}`, {
        headers,
        responseType: 'json',
      });
      return response;
    } catch (error) {
      this.handleError(error);
      throw error; // Ensure the function always returns a value or throws an error
    }
  }

  public async post({
    endpoint,
    params,
    data = {},
    headers,
    useAuthorization = true,
  }: {
    endpoint: string;
    params?: any;
    data?: any;
    headers?: any;
    useAuthorization?: boolean;
  }): Promise<AxiosResponse> {
    try {
      let q = '';
      if (params) {
        q += `?${qs.stringify(params)}`;
      }
      const header = await this.getHeaders(headers, useAuthorization);
      const response = await this.axios.post(
        `${baseUrl}${endpoint}${q}`,
        data,
        {
          headers: header,
        },
      );
      return response;
    } catch (error) {
      this.handleError(error);
      throw error; // Ensure the function always returns a value or throws an error
    }
  }

  public async put({
    endpoint,
    params,
    data = {},
    headers,
  }: {
    endpoint: string;
    params?: any;
    data?: any;
    headers?: any;
  }): Promise<AxiosResponse> {
    try {
      let q = '';
      if (params) {
        q += `?${qs.stringify(params)}`;
      }
      const header = await this.getHeaders(headers);
      const response = await this.axios.put(
        `${this.baseURL}${endpoint}${q}`,
        data,
        {
          headers: header,
        },
      );
      return response;
    } catch (error) {
      this.handleError(error);
      throw error; // Ensure the function always returns a value or throws an error
    }
  }

  private handleError(error: any): void {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // Handle 401 Unauthorized error specifically
      localStorage.removeItem('USER_INFO');
      localStorage.removeItem('ACCESS_TOKEN');
      localStorage.removeItem('REFRESH_TOKEN');
      return this.toastPresenter('Session expired. Please login again.');
    }
    return this.toastPresenter(
      'An error occurred. Please contact administrator.',
    );
  }
}

export default BaseApiService;
