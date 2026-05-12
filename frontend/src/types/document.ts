export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface TemplateResponse {
  slug: string;
  name: string;
  description: string;
  fields: string[];
  template_content: string;
}

export interface DocumentChatRequest {
  history: ChatMessage[];
  message: string;
  fields: Record<string, string>;
}

export interface DocumentChatResponse {
  reply: string;
  fields: Record<string, string>;
  redirect_slug: string | null;
}

export interface CreateChatRequest {
  history: ChatMessage[];
  message: string;
}

export interface CreateChatResponse {
  reply: string;
  suggested_slug: string | null;
}
