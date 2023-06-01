import React, { useState } from "react";
import * as t from "@/diet-server/diet.types";
import { getStockItems, getStockSearchResults } from "@/diet-server/stock/stock.api";
import { AutoComplete, Select } from "@geist-ui/core";

type SearchInputProps = {
  onSelect: (item: t.StockItem) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ onSelect }) => {
  const [search, setSearch] = useState("");
  const [type, setType] = useState<"product" | "meal" | "both">("both");

  const handleSearchChange = (string: string) => {
    setSearch(string);
  };

  const handleTypeChange = (val: string | string[]) => {
    console.log('val', );
    setType(val as typeof type);
  };

  const handleSelect = (itemId: string) => {
    const item = getStockItems({ type }).byIds[itemId];
    onSelect(item);
  };


  const searchResults = getStockSearchResults({ type, search });

  const stockItems = getStockItems({ type })

  const options = searchResults.map((itemId) => {
    const item = stockItems.byIds[itemId]
    return { label: item.name, value: item.id }
  })

  return (
    <div className="flex">

      <AutoComplete
        clearable
        value={search}
        placeholder="Search meal/product"
        options={options}
        onChange={handleSearchChange}
        onSelect={handleSelect}
      />

      <Select
        width="100px"
        value={type}
        onChange={handleTypeChange}>
        <Select.Option value="both">Both</Select.Option>
        <Select.Option value="product">Product</Select.Option>
        <Select.Option value="meal">Meal</Select.Option>
      </Select>

    </div>
  );
};

export default SearchInput;

