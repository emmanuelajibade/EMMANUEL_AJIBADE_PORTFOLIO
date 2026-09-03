export interface AIKnowledge {
  id: string;
  category: string;
  title: string;
  content: string;
  visibility: 'public' | 'private';
  importance: number;
  tags: string[];
  active: boolean;
}

export interface AIChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}