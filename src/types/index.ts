export interface Topic {
  idtopic: number;
  name: string;
  description: string;
}

export interface News {
  idnews: number;
  title: string;
  content: string;
  image_path: string;
}

export interface Module {
  idmodule: number;
  title: string;
  content: string;
  date_create: string;
  date_delete: string;
  image_path: string;
  topic_idtopic: number;
  topicName: string;
}

export interface CreateTopicRequest {
  name: string;
  description: string;
}

export interface CreateNewsRequest {
  title: string;
  content: string;
  image_path: string;
}

export interface CreateModuleRequest {
  title: string;
  content: string;
  date_create: string;
  date_delete: string;
  image_path: string;
  topic_idtopic: number;
}

export interface UpdateTopicRequest {
  name: string;
  description: string;
}

export interface UpdateNewsRequest {
  title: string;
  content: string;
  image_path: string;
}

export interface UpdateModuleRequest {
  title: string;
  content: string;
  date_create: string;
  date_delete: string;
  image_path: string;
  topic_idtopic: number;
}