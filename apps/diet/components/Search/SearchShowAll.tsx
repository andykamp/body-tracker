import * as t from "@/diet-server/diet.types";
import { makeOptionBySource } from "./search.utils";

type SearchShowAllProps = {
  results: any[];
  onSelect: (item: t.Product | t.Meal) => void;
}

function SearchShowAll({
  results,
  onSelect,
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
            {makeOptionBySource(item.value, item.source, item.item)}
          </div>
        ))}
      </div>
    </>
  );
};

export default SearchShowAll;
