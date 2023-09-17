import { ReactNode } from "react";
import * as t from "@/diet-server/diet.types";

export type SearchShowAllProps = {
  results: any[];
  onSelect: (item: t.Product | t.Meal) => void;
  parseOption: (value:string, source:string, item:t.Item) => ReactNode;
}

function SearchShowAll({
  results,
  onSelect,
  parseOption,
}: SearchShowAllProps) {


  const numberOfResults = results.length;

  return (
    <>
      <div>{`Showing a total of ${numberOfResults} items:`}</div>
      <div
        className="h-40 overflow-y-scroll"
      >
        {results.map((item: any) => (
          <div
            key={item.value}
            className="whitespace-nowrap"
            onClick={() => onSelect(item.item)}
          >
            {parseOption(item.value, item.source, item.item)}
          </div>
        ))}
      </div>
    </>
  );
};

export default SearchShowAll;
