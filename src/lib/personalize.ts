import cheerio from 'cheerio';

type Primitive = number | null | string;
export type PersonalizationValue = Primitive | readonly Primitive[];

export type PersonalizeOptions = {
  readonly userAttributes?: { readonly [key: string]: PersonalizationValue };
  // TODO: JSON-LD of relevant tests? or maybe supply a/b test config with cookie and ratios and groups?
  readonly abTests?: { readonly [key: string]: string };

  readonly personalizationSelector?: string;
  readonly abTestSelector?: string;
};

/**
 * A sample async function (to demo Typescript's es7 async/await down-leveling).
 *
 *
 * @returns a new HTML string
 */
export const personalize = (html: string, options: PersonalizeOptions = {}) => {
  const $ = cheerio.load(html);

  const personalizationSelector =
    options.personalizationSelector || '[data-edge-personalize]';
  const abTestSelector =
    options.personalizationSelector || '[data-edge-ab-test]';

  $(`template${personalizationSelector}`).each((_index, el) => {
    $(el).remove();
  });
  $(`template${abTestSelector}`).each((_index, el) => {
    $(el).remove();
  });

  return $.html();
};
