export type Category = {
  name: string;
  slug: string;
  description: string;
  children: Category[];
};
