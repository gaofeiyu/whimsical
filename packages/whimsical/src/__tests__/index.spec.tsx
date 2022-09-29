import { test, expect } from 'vitest';
import renderer from 'react-test-renderer';
import App from '../pages/playground';

function toJson(component: renderer.ReactTestRenderer) {
  const result = component.toJSON();
  expect(result).toBeDefined();
  expect(result).not.toBeInstanceOf(Array);
  return result as renderer.ReactTestRendererJSON;
}

test('App changes the class when hovered', () => {
  const component = renderer.create(<App />);
  let tree: renderer.ReactTestRendererJSON = toJson(component);
  expect(tree).toMatchSnapshot();

  // manually trigger the callback
  tree.props.onMouseEnter();

  // re-rendering
  tree = toJson(component);
  expect(tree).toMatchSnapshot();

  // manually trigger the callback
  tree.props.onMouseLeave();
  // re-rendering
  tree = toJson(component);
  expect(tree).toMatchSnapshot();
});
