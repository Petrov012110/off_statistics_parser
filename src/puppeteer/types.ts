export type ParsedDataType = {
  postId: string;
  text: string;
  date: number;
  price: string | number;
  post: string;
  hrefImg?: string[];
};

export type ParsedGroupType = {
  name: string;
  data: ParsedDataType[];
}

export type ModelType = {
  name: string;
  regexp?: string[];
};

export type SeriesType = {
  name: string;
  regexp?: string[];
  models?: ModelType[];
};

export type BrandType = {
  id: string;
  name: string;
  brand?: string[];
  series?: SeriesType[];
};

export type ClassificatorType = BrandType[];