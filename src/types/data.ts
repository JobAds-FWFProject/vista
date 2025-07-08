// types/data.ts

export type DataRow = {
  pub: string;
  pub_name: string;
  pub_date: number;
  page_num: number;
  uuid: string;
  label: string;
  text: string;
  iiif: string;
  positions: string[];
};

export type PubsRow = {
  pub: string;
  label: string;
};

export interface GraphNode {
  id: string;
  text?: string;
  positions?: string[];
  label: string;
  pub?: string;
  pub_name?: string;
  adtype?: string;
  colour?: string;
  size?: number;
  iiif?: string;
}
