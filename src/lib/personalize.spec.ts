import test from 'ava';
import * as prettier from 'prettier';

import { personalize } from './personalize';

const normalize = (str: string) =>
  prettier.format(str, {
    parser: 'html',
  });

const wrapTemplate = (str: string) =>
  `<html><head></head><body>${str}</body></html>`;

test('personalize', async (t) => {
  t.deepEqual(
    normalize(
      personalize(
        wrapTemplate(
          `
            <div class="foo">
              <template data-edge-personalize>
                <div data-edge-personalize="userAttributes.gender === 'woman'">
                  Hello mam
                </div>
                <div data-edge-personalize="userAttributes.gender === 'man'">
                  Hello sir
                </div>
                <div data-edge-personalize="userAttributes.gender === 'other'">
                  Hello there
                </div>
              </template>
              <div data-edge-personalize="default">
                Hello there
              </div>
            </div>
          `
        ),
        {
          userAttributes: {
            gender: 'man',
          },
        }
      )
    ),
    normalize(
      wrapTemplate(`
        <div class="foo">
          <div data-edge-personalize="userAttributes.gender === 'man'">Hello sir</div>
        </div>
      `)
    )
  );
});
