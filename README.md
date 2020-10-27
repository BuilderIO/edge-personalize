# Edge-personalize

Personalize static generated pages at the edge. Get the performance and uptime of static
generation, with the personalization of server side rendering

## Usage

E.g. in an AWS lambda `viewer response` function over your static site or page

```ts
export const handler = (ctx) => {
  const response = event.Records[0].cf.response;
  const html = response.body;
  const newHtml = personalize(html, userAttributes: { gender: 'male' })
  response.body = newHtml
  return response;
}
```

This turns static markup like

```html
<div class="foo">
  <template data-edge-personalize>
    <div data-edge-personalize="userAttributes.gender === 'woman'">
      Hello mam
    </div>
    <div data-edge-personalize="userAttributes.gender === 'man'">Hello sir</div>
    <div data-edge-personalize="userAttributes.gender === 'other'">
      Hello there
    </div>
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

To generate in this format, you can create your own custom renderer, or use your React component

```tsx
import { EdgePersonalize, When, Default } from '@builder.io/edge-personalize/react';

<EdgePersonalize>
  <When expr="userAttributes.gender === 'men'">
    Mens content
  </When>
  <Default>
    Default content
  <Default>
</EdgePersonalize>
```
