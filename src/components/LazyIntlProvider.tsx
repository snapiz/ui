import { useLazyIntl } from "hooks/intl";
import React from "react";
import { IntlProvider } from "react-intl";

const cache = new Map();

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
  const [snap] = useLazyIntl();

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
