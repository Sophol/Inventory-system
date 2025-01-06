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
  console.log(queryString);
  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: queryString,
    },
    { skipNull: true }
  );
};
