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

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const topicService = {
  createTopic: async (data: CreateTopicRequest) => {
    const response = await api.post('/topics', data);
    return response.data;
  },
  
  getAllTopics: async (): Promise<Topic[]> => {
    const response = await api.get('/topics');
    return response.data;
  },

  deleteTopicById: async (id: number) => {
    const response = await api.delete(`/topics/${id}`);
    return response.data;
  },

  updateTopicById: async (id: number, data: UpdateTopicRequest) => {
    const response = await api.patch(`/topics/${id}`, data);
    return response.data;
  },
};

export const newsService = {
  createNews: async (data: CreateNewsRequest) => {
    const response = await api.post('/news', data);
    return response.data;
  },

  getAllNews: async (): Promise<News[]> => {
    const response = await api.get('/news');
    return response.data;
  },

  deleteNewsById: async (id: number) => {
    const response = await api.delete(`/news/${id}`);
    return response.data;
  },

  updateNewsById: async (id: number, data: UpdateNewsRequest) => {
    const response = await api.patch(`/news/${id}`, data);
    return response.data;
  },
};

export const moduleService = {
  createModule: async (data: CreateModuleRequest) => {
    const response = await api.post('/modules', data);
    return response.data;
  },

  getAllModules: async (): Promise<Module[]> => {
    const response = await api.get('/modules');
    return response.data;
  },

  getAllModulesWithTopics: async (): Promise<Module[]> => {
    const response = await api.get('/modules/with-topics');
    return response.data;
  },

  deleteModuleById: async (id: number) => {
    const response = await api.delete(`/modules/${id}`);
    return response.data;
  },

  updateModuleById: async (id: number, data: UpdateModuleRequest) => {
    const response = await api.patch(`/modules/${id}`, data);
    return response.data;
  },
};