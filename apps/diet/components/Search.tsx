import React, { useEffect, useRef, useState } from "react";
import { Modal, AutoComplete } from "@geist-ui/core";
import { useDebounce } from "@/diet/utils/misc";
import { parseSearchResultToOptions, makeOptionBySource } from "./search.utils";
import SearchShowAll from "./SearchShowAll";

const MAX_DISPLAY_NUMBER = 5

type SearchInputProps = {
  placeholder?: string;
  initialValue?: string;
  onSelect: (item: any) => void;
  onChange?: (value: string) => void;
}

function SearchInput({
  placeholder,
  initialValue = "",
  onSelect,
  onChange,
}: SearchInputProps) {

  const [searchValue, setSearchValue] = useState<string>(initialValue || "");
  const [results, setResults] = useState<any[]>([]);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [keyCounter, setKeyCounter] = useState(0);
  const latestSearchValue = useRef<string>("");
  // @note: needed because the onSelect is not updated with the correct data
  const latestResult = useRef<any[]>([]);

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
          latestResult.current = options
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
      const selectedItem = latestResult.current.find((o: any) => o.value === value)?.item
      console.log('selectedItem', results, value, selectedItem);
      if (selectedItem) {
        console.log('onSelected', selectedItem);
        onSelect(selectedItem);
      }
    }
  }

  const onInputChange = (search: string) => {
    console.log('onInputChange', );
    onChange?.(search)
    setSearchValue(search)
  }

  const numberOfResults = results.length;
  const displayResults = results.slice(0, MAX_DISPLAY_NUMBER);
  const options = displayResults.length > 0 ?
    displayResults.map(item => makeOptionBySource(item.value, item.source, item.item))
    : []
  if (results.length > MAX_DISPLAY_NUMBER) {
    options.push({ label: `Show all(${numberOfResults})`, value: 'show_more' } as any)
  }

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
          <SearchShowAll
            results={results}
            onSelect={onSelect}
          />
        </Modal.Content>
        <Modal.Action passive onClick={() => setIsModalVisible(false)}>
          Cancel
        </Modal.Action>
      </Modal>
    </>
  );
};

export default SearchInput;
