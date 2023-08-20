import React, { useEffect, useRef, useState } from "react";
import { Modal, AutoComplete } from "@geist-ui/core";
import { useDebounce } from "@/diet/utils/misc";
import { parseSearchResultToOptions, makeOptionBySource } from "./search.utils";

type SearchInputProps = {
  placeholder?: string;
  initialValue?: string;
  onSelect: (item: any) => void;
  onInputChange?: (value: string) => void;
  type?: "product" | "meal" | "both";
}

function SearchInput({
  placeholder,
  initialValue = "",
  onSelect,
}: SearchInputProps) {

  const [searchValue, setSearchValue] = useState<string>(initialValue || "");
  const [results, setResults] = useState<any[]>([]);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [keyCounter, setKeyCounter] = useState(0);
  const latestSearchValue = useRef<string>("");


  const searchFromItems = async (value: string) => {
    if (value && value !== "") {
      try {
        console.log('value', value);
        const response = await fetch(`/api/searchStockItems?search=${value}`);
        const data = await response.json();
        const options = parseSearchResultToOptions(data, 'oda')
        console.log('data', data, options);
        if (latestSearchValue.current === value) {
          setResults(options);
        }
      } catch (err) {
        console.error("Failed to fetch search results", err);
      }
    } else {
      console.log('hi',);
      setResults([]);
    }
    setIsSearching(false);
  };

  const debouncedSearch = useDebounce(searchFromItems, 350);

  useEffect(() => {
    if (!hasInteracted) {
      return;
    }
    latestSearchValue.current = searchValue; // update the ref with the current value

    if (!searchValue.trim()) {
      setResults([]);
      return;

    }
    console.log('seaaaa', searchValue);
    setIsSearching(true);
    debouncedSearch(searchValue);
  }, [searchValue, debouncedSearch, hasInteracted]);


  //

  const onInputSelect = (value: any) => {
    console.log('onSelect', value);
    if (value === 'show_more') {
      setIsModalVisible(true);
      setSearchValue(latestSearchValue.current); // revert to the last valid search value
      setKeyCounter(prev => prev + 1); // increment the key counter to remount the component
    } else {
      // const selectedItem = results.find(item => item.id === value);
      const selectedItem = results.find((o: any) => o.value === value)?.item
      if (selectedItem) {
        onSelect(selectedItem);
      }
    }
  }

  const onInputChange = (value: string) => {
    setSearchValue(value)
  }

  const numberOfResults = results.length;
  const displayResults = results.slice(0, 5);
  const options = displayResults.length > 0 ? [
    ...displayResults.map(item => makeOptionBySource(item.value, item.source, item.item)),
    { label: `Show all(${numberOfResults})`, value: 'show_more' }
  ] : []

  return (
    <>
      <AutoComplete
        key={keyCounter}

        value={searchValue}
        placeholder={placeholder || "Search..."}
        searching={isSearching}
        // disableFreeSolo
        disableMatchWidth={true}
        onFocus={() => setHasInteracted(true)}
        options={options}
        onSearch={onInputChange}
        onSelect={onInputSelect}
      />
      <Modal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        width="50%"
      >
        <Modal.Title>Select an Item</Modal.Title>
        <Modal.Content>
          <div
            className="h-40 overflow-y-scroll"
          >
            {results.map(item => (
              <div
                onClick={() => onSelect(item.item)}
              >
                {makeOptionBySource(item.value, item.source, item.item)}
              </div>
            ))}
          </div>
        </Modal.Content>
        <Modal.Action passive onClick={() => setIsModalVisible(false)}>
          Cancel
        </Modal.Action>
      </Modal>
    </>
  );
};

export default SearchInput;
