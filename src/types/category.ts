export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string;
  children: Category[];
};
