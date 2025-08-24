export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  children?: Category[];
  parent?: Category;
}
