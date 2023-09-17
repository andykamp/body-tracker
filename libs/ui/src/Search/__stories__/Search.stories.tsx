import { StoryFn, Meta } from '@storybook/react';
import Search, { type ShowAllProps } from '@/ui/Search/Search';
import * as f from '../__fixtures__/search.fixtures'

export default {
  title: 'Components/Search',
  component: Search
} as Meta;


type SearchItem = {
  id: number;
  name: string;
}
function onSearch(value: string) {
  console.log('searchedOn', value);

  const results: SearchItem[] = f.searchResults
  return results
}

function showAll(props: ShowAllProps) {
  const { results, onSelect } = props
  console.log('showAll', results, onSelect);
  return (
    <>
      <div>showAll</div>
      {parseOptions(results)}
    </>
  )
}

function parseOptions(results: SearchItem[]) {
  return results.map((r: SearchItem) => <div>{r.name}</div>)

}

const Template: StoryFn = (props: any) => <Search {...props} />;

export const Default = Template.bind({});
Default.args = {
  showAll,
  parseOptions,
  onSearch,
};

