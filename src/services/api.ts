import axios from 'axios';
import { 
  CreateTopicRequest, 
  CreateNewsRequest, 
  CreateModuleRequest, 
  UpdateTopicRequest,
  UpdateNewsRequest,
  UpdateModuleRequest,
  Topic, 
  News, 
  Module 
} from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const topicService = {
  createTopic: async (data: CreateTopicRequest) => {
    const response = await api.post('/topic/createTopic', data);
    return response.data;
  },
  
  getAllTopics: async (): Promise<Topic[]> => {
    const response = await api.get('/topic/getAllTopic');
    return response.data;
  },

  deleteTopicById: async (id: number) => {
    const response = await api.delete(`/topic/deleteTopicById?id=${id}`);
    return response.data;
  },

  updateTopicById: async (id: number, data: UpdateTopicRequest) => {
    const response = await api.patch(`/topic/patchTopicbyid?id=${id}`, data);
    return response.data;
  },
};

export const newsService = {
  createNews: async (data: CreateNewsRequest) => {
    const response = await api.post('/news/createNews', data);
    return response.data;
  },

  getAllNews: async (): Promise<News[]> => {
    const response = await api.get('/news/getAllNews');
    return response.data;
  },

  deleteNewsById: async (id: number) => {
    const response = await api.delete(`/news/deleteNewsById?id=${id}`);
    return response.data;
  },

  updateNewsById: async (id: number, data: UpdateNewsRequest) => {
    const response = await api.patch(`/news/updateNewsById?id=${id}`, data);
    return response.data;
  },
};

export const moduleService = {
  createModule: async (data: CreateModuleRequest) => {
    const response = await api.post('/module/createModule', data);
    return response.data;
  },

  getAllModules: async (): Promise<Module[]> => {
    const response = await api.get('/module/getAllModule');
    return response.data;
  },

  deleteModuleById: async (id: number) => {
    const response = await api.delete(`/module/deleteModuloById?id=${id}`);
    return response.data;
  },

  updateModuleById: async (id: number, data: UpdateModuleRequest) => {
    const response = await api.patch(`/module/updateModuleById?id=${id}`, data);
    return response.data;
  },
};