import React from 'react';

const isServer = typeof global !== 'undefined';

const findByType = (children: React.ReactNode, component: React.Component) => {
  const result = [];
  const type = [component.displayName];

  React.Children.forEach(children, (child) => {
    const childType =
      child && child.type && (child.type.displayName || child.type.name);
    if (type.includes(childType)) {
      result.push(child);
    }
  });

  return result;
};

const generateId = Math.random().toString(36).split('.')[1];

export function When(props: React.PropsWithChildren<{ expr: string }>) {
  return null;
}

export function Default(props: React.PropsWithChildren<{}>) {
  return null;
}

export function EdgePersonalize(
  props: React.PropsWithChildren<{ id: string }>
) {
  const children = React.Children.toArray(props.children);
  const theDefault = children.pop();
  const whens = children;

  if (isServer) {
    return (
      <>
        <template data-edge-personalize>
          {whens.map((item) => (
            <div data-edge-personalize={item}>{item.children}</div>
          ))}
        </template>
        <div data-edge-personalize="default">{theDefault}</div>
      </>
    );
  }

  // TODO: extract unique value, match it to the right component, and return that component
  const winningValue = document.querySelector(
    `[data-edge-personalize="${props.id}"]`
  );

  // For browser, only return the matching When. need to pass up
  return null;
}
