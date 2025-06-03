export interface ILongText {
  ok: 1 | number;
  data: {
    longTextContent: string;
    url_struct: any[];
  };
}
