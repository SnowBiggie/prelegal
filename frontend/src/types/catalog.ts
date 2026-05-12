export interface CatalogTemplate {
  name: string;
  description: string;
  filename: string;
}

export interface CatalogResponse {
  templates: CatalogTemplate[];
}
