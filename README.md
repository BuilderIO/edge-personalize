# Edge-personalize

Personalize and a/b test static generated pages at the edge. Get the performance and uptime of static
generation, with the personalization of server side rendering

## Usage

E.g. in an AWS lambda `viewer response` function over your static site or page

```ts
import { personalize } from '@builder.io/edge-personalize';

export const handler = (ctx) => {
  const { request, response } = event.Records[0].cf;
  const html = response.body;
  const newHtml = personalize(html, {
    // E.g. parse these from cookie header - request.headers.cookie?.[0]?.Value
    viewer: { gender: 'male' },
    abTests: { 'cta-test': 'free-promo' },
  });
  response.body = newHtml;
  return response;
};
```

### Personalizations

This turns static markup like:

```html
<div class="foo">
  <template data-edge-personalize>
    <div data-edge-personalize="viewer.gender === 'woman'">Hello mam</div>
    <div data-edge-personalize="viewer.gender === 'man'">Hello sir</div>
    <div data-edge-personalize="viewer.gender === 'other'">Hello there</div>
  </template>
  <div data-edge-personalize="default">Hello there</div>
</div>
```

into:

```html
<div class="foo">
  <div>Hello sir</div>
</div>
```

### A/B tests:

Turns

```html
<button class="foo">
  <template data-edge-ab-test="cta-test" duration="30d">
    <div data-edge-ab-test="free-promo" data-edge-ab-test-percent="20">
      Sign up free
    </div>
    <div data-edge-ab-test="fast-promo" data-edge-ab-test-percent="20">
      Sign up fast
    </div>
  </template>
  <div data-edge-ab-test="default">Sign up now</div>
</button>
```

Into

```html
<button class="foo"><div>Sign up free</div></button>
```

## React support (WIP)

To generate (and hydrate) in this format, e.g. for Gatsby, Next.js, or other React frameworks, you can create your own custom renderer, or use your React component

```tsx
import {
  EdgePersonalize,
  When,
  Default,
} from '@builder.io/edge-personalize/react';

export const PersonalizedComponent = () => (
  <EdgePersonalize id="gendered-greeting">
    <When expr="viewer.gender === 'men'">Mens content</When>
    <Default>Default content</Default>
  </EdgePersonalize>
);
```

A/B tests:

```tsx
import { EdgeABTest, Group, Default } from '@builder.io/edge-personalize/react';

export const ABTestedComponent = () => (
  <EdgeABTest
    id="cta-test"
    duration="30d"
    onLoad={({ group }) => {
      // Track which test group was viewed
    }}
  >
    <Group percent={20} name="free-promo">
      Sign up free
    </Group>
    <Group percent={20} name="fast-promo">
      Sign up fast
    </Group>
    <Default>Sign up now</Default>
  </EdgeABTest>
);
```

<br />
<p align="center">
  Made with ❤️ by <a target="_blank" href="https://www.builder.io/">Builder.io</a>
</p>
