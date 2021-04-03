export type ParsedDataType = {
  text: string;
  date: number;
  price: string | number;
  post: string;
  hrefImg?: string[];
};

export type ParsedGroupType = {
  group: string;
  data: ParsedDataType[];
}