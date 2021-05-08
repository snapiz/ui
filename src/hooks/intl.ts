import { useCallback } from "react";
import { proxy, useSnapshot, subscribe, DeepResolveType } from "valtio";

const LANG_KEY = "__ui_lazy_intl_lang";

export interface LazyIntlState {
  lang: string;
}

const state = proxy<LazyIntlState>({
  lang:
    localStorage.getItem(LANG_KEY) ||
    navigator.language?.split(/-|_/)[0] ||
    "en",
});

subscribe(state, () => localStorage.setItem(LANG_KEY, state.lang));

export function useLazyIntl(): [
  DeepResolveType<LazyIntlState>,
  (lng: string) => void
] {
  const changeLanguage = useCallback((lng: string) => {
    state.lang = lng;
  }, []);

  return [useSnapshot(state), changeLanguage];
}
