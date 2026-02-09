export interface Category {
  categoryId: number;
  categoryName: string;
}

export interface CategoryResponse {
  content: Category[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  lastPage: boolean;
}
