import React from "react";
import { IntlProvider } from "react-intl";
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

const cache = new Map();

export function changeLanguage(lng: string): void {
  state.lang = lng;
}

export function useLazyIntl(): DeepResolveType<LazyIntlState> {
  return useSnapshot(state);
}

export interface LazyIntlProviderProps {
  ckey: string;
  translations: {
    [locale: string]: () => Promise<{ default: { [id: string]: string } }>;
  };
}

const LazyIntlProvider: React.FC<LazyIntlProviderProps> = ({
  ckey,
  translations,
  children,
}) => {
  const snap = useSnapshot(state);

  if (!cache.has(ckey)) {
    cache.set(ckey, new Map());
  }

  const translationCache = cache.get(ckey);
  const locale = translations[snap.lang] ? snap.lang : "en";

  if (!translationCache.has(locale) && translations[locale]) {
    throw translations[locale]().then((resp) => {
      translationCache.set(locale, resp.default);
    });
  }

  return (
    <IntlProvider
      messages={translationCache.get(locale)}
      locale={locale}
      defaultLocale="en"
    >
      {children}
    </IntlProvider>
  );
};

export default LazyIntlProvider;
