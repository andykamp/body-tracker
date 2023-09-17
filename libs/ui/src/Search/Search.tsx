import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Modal, AutoComplete } from "@geist-ui/core";
// eslint-disable-next-line @nx/enforce-module-boundaries
import { useDebounce } from "@/common-client/utils/misc";

export type ShowAllProps = {
  results: any[], onSelect: (item: any) => void
}

export type SearchInputControlledProps = {
  value: string;
  placeholder?: string;
  onSelect: (item: any) => void;
  onChange?: (value: string) => void;
  onSearch: (value: string) => Promise<any[]>;
  showAll: (props:ShowAllProps) => ReactNode;
  parseOptions: (results: any[]) => any[];
  maxDisplayNumber?: number;
}

export function SearchInputControlled(props: SearchInputControlledProps) {
  const {
    value: controlledValue,
    placeholder,
    onSelect,
    onChange,
    onSearch,
    showAll,
    parseOptions,
    maxDisplayNumber=5
  } = props

  const [results, setResults] = useState<any[]>([]);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [keyCounter, setKeyCounter] = useState(0);
  const latestSearchValue = useRef<string>("");
  // @note: needed because the onSelect is not updated with the correct data
  const latestResult = useRef<any[]>([]);

  const searchFromItems = useCallback(async (value: string) => {
    if (value && value !== "") {
      try {
        const options = await onSearch(value);
        if (latestSearchValue.current === value) {
          setResults(options);
          latestResult.current = options
        }
      } catch (err) {
        console.error("Failed to fetch search results", err);
      }
    } else {
      setResults([]);
    }
    setIsSearching(false);
  }, [onSearch]);

  const debouncedSearch = useDebounce(searchFromItems, 350);

  useEffect(() => {
    if (!hasInteracted) {
      return;
    }
    latestSearchValue.current = controlledValue; // update the ref with the current value

    if (!controlledValue.trim()) {
      setResults([]);
      return;

    }
    setIsSearching(true);
    debouncedSearch(controlledValue);
  }, [controlledValue, debouncedSearch, hasInteracted]);

  //

  const onInputSelect = (value: any) => {
    if (value === 'show_more') {
      setIsModalVisible(true);
      setKeyCounter(prev => prev + 1); // increment the key counter to remount the component
    } else {
      const selectedItem = latestResult.current.find((o: any) => o.value === value)?.item
      if (selectedItem) {
        onSelect(selectedItem);
      }
    }
  }

  const onInputChange = (search: string) => {
    onChange?.(search)
  }

  const numberOfResults = results.length;
  const displayResults = results.slice(0, maxDisplayNumber);
  const options = displayResults.length > 0 ? parseOptions(displayResults) : []
  if (results.length > maxDisplayNumber) {
    options.push({ label: `Show all(${numberOfResults})`, value: 'show_more' } as any)
  }

  return (
    <>
      <AutoComplete
        key={keyCounter}
        value={controlledValue}
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
          {
            showAll({results, onSelect})
          }
        </Modal.Content>
        <Modal.Action passive onClick={() => setIsModalVisible(false)}>
          Cancel
        </Modal.Action>
      </Modal>
    </>
  );
};

type SearchInputProps = {
  placeholder?: string;
  onSelect: (item: any) => void;
  onChange?: (value: string) => void;
  onSearch: (value: string) => Promise<any[]>;
  showAll: (props:ShowAllProps) => ReactNode;
  parseOptions: (results: any[]) => any[];
}

function SearchInput(props: SearchInputProps) {
  const {
    placeholder,
    onSelect: onSelectExternal,
    onChange: onChangeExternal,
    onSearch,
    showAll,
    parseOptions
  } = props

  const [searchValue, setSearchValue] = useState<string>("");

  const onSelect = (item: any) => {
    onSelectExternal?.(item)
  }
  const onChange = (string: any) => {
    setSearchValue(string)
    onChangeExternal?.(string)
  }

  return (
    <SearchInputControlled
      value={searchValue}
      placeholder={placeholder}
      onSelect={onSelect}
      onChange={onChange}
      onSearch={onSearch}
      showAll={showAll}
      parseOptions={parseOptions}
    />
  );
}
export default SearchInput;
