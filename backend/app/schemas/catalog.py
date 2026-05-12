from pydantic import BaseModel


class CatalogTemplate(BaseModel):
    name: str
    description: str
    filename: str


class CatalogResponse(BaseModel):
    templates: list[CatalogTemplate]
