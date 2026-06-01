export interface Article {
  uid: string;
  title: string;
  authors: string[];
  source: string;
  pubdate: string;
  abstract?: string;
  doi?: string;
}
