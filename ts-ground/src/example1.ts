type GroupTranslationsType = {
  [pageId: string]: {
    [locale: string]: {
      [key: string]: string;
    };
  };
};

function _sanitizeRecordValue(value: unknown): string {
  if (typeof value !== 'string') {
    return '';
  }
  return value.trim();
}

export function groupTranslations(
  records: Record<string, unknown>[],
): GroupTranslationsType {
  const groupedTranslations: GroupTranslationsType = {};

  records.forEach((record) => {
    const pageId = _sanitizeRecordValue(record.pageId);
    const locale = _sanitizeRecordValue(record.locale);
    const key = _sanitizeRecordValue(record.key);

    if (
      pageId === '' ||
      locale === '' ||
      key === '' ||
      typeof record.text !== 'string'
    ) {
      return;
    }

    groupedTranslations[pageId] ||= {};
    groupedTranslations[pageId][locale] ||= {};
    groupedTranslations[pageId][locale][key] = record.text;
  });

  return groupedTranslations;
}
