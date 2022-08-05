import Main from './Main.svelte';
import { render } from '@testing-library/svelte';
import { create[ToolName]SveltePropertiesFixture } from '@src/helpers/fixture-generators';

describe('[Tool-name]', () => {
  it('shows the component correctly', () => {
    const componentProps = create[ToolName]SveltePropertiesFixture();

    const { container } = render(Main, { props: { componentProps } });

    const el = container.getElementsByClassName('s-q-item')[0];

    expect(el).toBeInstanceOf(HTMLDivElement);
  });
});
