import test from 'ava';

import { asyncABC } from './personalize';

test('getABC', async (t) => {
  t.deepEqual(await asyncABC(), ['a', 'b', 'c']);
});
