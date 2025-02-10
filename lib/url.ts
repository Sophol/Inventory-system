import qs from "query-string";

interface UrlQueryParams {
  params: string;
  key: string;
  value: string;
}
interface RemoveQueryParams {
  params: string;
  keyToRemove: string[];
}
export const formUrlQuery = ({ params, key, value }: UrlQueryParams) => {
  const queryString = qs.parse(params);
  queryString[key] = value;
  return qs.stringifyUrl({
    url: window.location.pathname,
    query: queryString,
  });
};
export const removeKeyFromUrlQuery = ({
  params,
  keyToRemove,
}: RemoveQueryParams) => {
  const queryString = qs.parse(params);
  keyToRemove.forEach((key) => {
    delete queryString[key];
  });
  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: queryString,
    },
    { skipNull: true }
  );
};
const colors = [
  "hsl(197 37% 24%)",
  "hsl(11.92deg 75.88% 60.98%)",
  "hsl(26.71deg 86.9% 67.06%)",
  "hsl(43 74% 66%)",
  "hsl(120 57% 40%)",
  "hsl(240 100% 50%)",
  "hsl(300 76% 72%)",
  "hsl(60 100% 50%)",
  "hsl(180 100% 37%)",
  "hsl(0 100% 50%)",
  "hsl(90 100% 50%)",
  "hsl(210 100% 50%)",
  "hsl(330 100% 50%)",
  "hsl(30 100% 50%)",
  "hsl(150 100% 50%)",
  "hsl(270 100% 50%)",
  "hsl(360 100% 50%)",
  "hsl(75 100% 50%)",
  "hsl(195 100% 50%)",
  "hsl(15 100% 50%)",
];

export function getUniqueRandomColors(index: number): string {
  return colors[index] ? colors[index] : colors[0];
}
