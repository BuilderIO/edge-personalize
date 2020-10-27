import cheerio from 'cheerio';
import { VM } from 'vm2';

type Primitive = number | null | string;
export type PersonalizationValue = Primitive | readonly Primitive[];

export type PersonalizeOptions = {
  readonly viewer?: { readonly [key: string]: PersonalizationValue };
  // TODO: JSON-LD of relevant tests? or maybe supply a/b test config with cookie and ratios and groups?
  readonly abTests?: { readonly [key: string]: string };

  /**
   * @default data-edge-personalize
   */
  readonly personalizationAttribute?: string;
  /**
   * @default data-edge-ab-test
   */
  readonly abTestAttribute?: string;
};

/**
 * A sample async function (to demo Typescript's es7 async/await down-leveling).
 *
 *
 * @returns a new HTML string
 */
export const personalize = (html: string, options: PersonalizeOptions = {}) => {
  const $ = cheerio.load(html);

  const personalizationAttribute =
    options.personalizationAttribute || 'data-edge-personalize';
  const abTestAttribute =
    options.personalizationAttribute || 'data-edge-ab-test';

  $(`template[${personalizationAttribute}]`).each((_index, el) => {
    const $el = $(el);
    const possibleMatches = $($el.html());
    const defaultMatch = $el.next();
    if (!defaultMatch.has(personalizationAttribute)) {
      throw new Error('No default personalization found');
    }
    let match: cheerio.Cheerio | null = null;
    const vm = new VM({
      sandbox: {
        viewer: options.viewer,
      },
    });

    for (const child of possibleMatches.toArray()) {
      const $child = $(child);
      const expression = $child.attr(personalizationAttribute);
      if (!expression) {
        console.warn('No expression found for element', $.html(child));
        continue;
      }
      if (vm.run(expression)) {
        match = $child;
        break;
      }
    }
    if (match) {
      defaultMatch.replaceWith($.html(match));
    }
    $el.remove();
  });
  $(`template[${abTestAttribute}]`).each((_index, el) => {
    $(el).remove();
  });

  return $.html();
};
