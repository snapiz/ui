import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
} from "react-query";
import { LayoutNavBarData } from "components/Layout";
import { useLazyIntl } from "./intl";
import { useEffect } from "react";

export interface fetchNavbarDataOptions {
  url?: string;
  defaultLang?: string;
  debug?: string;
}

const cache = new Map();

async function fetchNavbarData(
  lang: string,
  options?: fetchNavbarDataOptions
): Promise<LayoutNavBarData> {
  if (cache.has(lang)) {
    return cache.get(lang);
  }

  const dataUrl = options?.url || "/navbar_data_lng.json";

  try {
    const resp = await fetch(dataUrl.replace("lng", lang));

    if (resp.status !== 200) {
      throw new Error(`Missing navbar data for ${lang}`);
    }

    const data = await resp.json();

    cache.set(lang, data);

    return data;
  } catch (error) {
    if (options?.debug) {
      console.error(error);
    }
  }

  const resp = await fetch(
    dataUrl.replace("lng", options?.defaultLang || "en")
  );

  const data = await resp.json();

  cache.set(lang, data);

  return data;
}

export function useQueryNavbarData(
  queryKey: string,
  options?: fetchNavbarDataOptions
): UseQueryResult<LayoutNavBarData, unknown> {
  const [{ lang }] = useLazyIntl();
  const queryClient = useQueryClient();
  const query = useQuery(queryKey, () => fetchNavbarData(lang, options));
  const mutation = useMutation(fetchNavbarData, {
    onSuccess: (result) => {
      queryClient.setQueryData(queryKey, result);
    },
  });

  const { isLoading } = query;

  useEffect(() => {
    if (!isLoading) {
      mutation.mutate(lang);
    }
  }, [lang, isLoading]);

  return query;
}
