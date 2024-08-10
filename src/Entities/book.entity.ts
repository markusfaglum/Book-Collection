export interface Book {
  id: number;
  title: string;
  description: string | null;
  author: string | null;
  publishingDate: Date;
}
