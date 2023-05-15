import React, { useState } from "react";
import * as t from "@/diet-server/diet.types";
import { getStockItems, getStockSearchResults } from "@/diet-server/stock/stock.api";

type SearchInputProps = {
  onSelect: (item: t.StockItem) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ onSelect }) => {
  const [search, setSearch] = useState("");
  const [type, setType] = useState<"product" | "meal" | "both">("both");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setType(e.target.value as typeof type);
  };

  const handleSelect = (itemId: string) => {
    const item = getStockItems({ type }).byIds[itemId];
    onSelect(item);
  };

  const searchResults = getStockSearchResults({ type, search });

  return (
    <div>
      <input type="text" value={search} onChange={handleSearchChange} />
      <select value={type} onChange={handleTypeChange}>
        <option value="both">Both</option>
        <option value="product">Product</option>
        <option value="meal">Meal</option>
      </select>
      <ul>
        {searchResults.map((itemId) => (
          <li key={itemId} onClick={() => handleSelect(itemId)}>
            {getStockItems({ type }).byIds[itemId].name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchInput;
 
