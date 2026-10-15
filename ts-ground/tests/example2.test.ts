import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { findMissingTranslations } from '@/example2';

void describe('findMissingTranslations', () => {
  void test('should return object with missing keys', () => {
    const input = {
      source: {
        title: 'Welcome',
        subtitle: 'Make yourself at home',
        cta: 'Start',
        footer: 'Contact us',
      },
      translations: {
        ja: {
          title: 'ようこそ',
          subtitle: '',
          cta: '始める',
          extra: 'An obsolete translation',
        },
        pt: {
          title: 'Bem-vindo',
          subtitle: '   ',
          footer: 'Contacte-nos',
        },
        fr: {},
      },
    };

    const expectedOutput = {
      ja: ['subtitle', 'footer'],
      pt: ['subtitle', 'cta'],
      fr: ['title', 'subtitle', 'cta', 'footer'],
    };
    const output = findMissingTranslations(input);

    assert.notDeepEqual(
      output,
      expectedOutput,
      'The output should match the expected missing translations object',
    );
  });
});
