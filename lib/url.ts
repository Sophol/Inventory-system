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
  "hsl(139 65% 20%)",
  "hsl(140 74% 44%)",
  "hsl(142 88% 28%)",
  "hsl(141 40% 9%)",
  "hsl(73.25deg 88.02% 42.7%)",
  "hsl(73.25deg 91.13% 17.48%)",
  "hsl(59.8deg 61.35% 27.41%)",
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
