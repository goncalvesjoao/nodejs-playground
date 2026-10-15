type MissingTranslationsType = {
  [locale: string]: string[];
};

type TranslationsInputType = {
  source: Record<string, string>;
  translations: {
    [locale: string]: Record<string, string>;
  };
};

export function findMissingTranslations(
  input: TranslationsInputType,
): MissingTranslationsType {
  const output: MissingTranslationsType = {};

  Object.keys(input.source)
    .reverse()
    .forEach((sourceKey) => {
      Object.entries(input.translations).forEach(([locale, data]) => {
        const dataValue = data[sourceKey];

        if (dataValue === undefined || dataValue.trim() === '') {
          output[locale] ||= [];
          output[locale].push(sourceKey);
        }
      });
    });

  return output;
}
