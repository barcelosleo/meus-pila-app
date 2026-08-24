import { useCallback, useEffect, useRef, useState } from "react";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import type { PaginatedEntity } from "../../data/paginated-entity";

export interface AsyncPaginatedAutocompleteFetchParams {
  page: number;
  pageSize: number;
  searchQuery: string;
}

export interface AsyncPaginatedAutocompleteProps<T> {
  label: string;
  value: T | null;
  onChange: (value: T | null) => void;
  fetchOptions: (
    params: AsyncPaginatedAutocompleteFetchParams,
  ) => Promise<PaginatedEntity<T>>;
  getOptionLabel: (option: T) => string;
  isOptionEqualToValue?: (option: T, value: T) => boolean;
  placeholder?: string;
  pageSize?: number;
  debounceMs?: number;
  error?: boolean;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_DEBOUNCE_MS = 300;
const SCROLL_THRESHOLD_PX = 32;

// Autocomplete that fetches its options from a paginated API endpoint, with search and infinite scroll.
export const AsyncPaginatedAutocomplete = <T,>({
  label,
  value,
  onChange,
  fetchOptions,
  getOptionLabel,
  isOptionEqualToValue,
  placeholder,
  pageSize = DEFAULT_PAGE_SIZE,
  debounceMs = DEFAULT_DEBOUNCE_MS,
  error,
  helperText,
  required,
  disabled,
  fullWidth = true,
}: AsyncPaginatedAutocompleteProps<T>) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [options, setOptions] = useState<T[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  // Guards against stale responses when a newer request has already started.
  const requestIdRef = useRef(0);

  const loadPage = useCallback(
    async (targetPage: number, searchQuery: string, append: boolean) => {
      const requestId = ++requestIdRef.current;
      setLoading(true);

      try {
        const result = await fetchOptions({
          page: targetPage,
          pageSize,
          searchQuery,
        });

        if (requestId !== requestIdRef.current) return;

        setOptions((prev) =>
          append ? [...prev, ...result.items] : result.items,
        );
        setPage(targetPage);
        setHasMore(targetPage + 1 < result.totalPages);
      } finally {
        if (requestId === requestIdRef.current) setLoading(false);
      }
    },
    [fetchOptions, pageSize],
  );

  useEffect(() => {
    if (!open) return;

    const timeout = setTimeout(() => {
      loadPage(0, searchQuery, false);
    }, debounceMs);

    return () => clearTimeout(timeout);
  }, [open, searchQuery, debounceMs, loadPage]);

  useEffect(() => {
    setInputValue(value ? getOptionLabel(value) : "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleListboxScroll = (event: React.UIEvent<HTMLUListElement>) => {
    const listbox = event.currentTarget;
    const reachedBottom =
      listbox.scrollTop + listbox.clientHeight >=
      listbox.scrollHeight - SCROLL_THRESHOLD_PX;

    if (reachedBottom && hasMore && !loading) {
      loadPage(page + 1, searchQuery, true);
    }
  };

  return (
    <Autocomplete
      fullWidth={fullWidth}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      inputValue={inputValue}
      onInputChange={(_, newInputValue, reason) => {
        setInputValue(newInputValue);
        if (reason === "input" || reason === "clear") {
          setSearchQuery(newInputValue);
        }
      }}
      options={options}
      loading={loading}
      filterOptions={(opts) => opts}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={isOptionEqualToValue}
      disabled={disabled}
      slotProps={{
        listbox: {
          onScroll: handleListboxScroll,
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          required={required}
          error={error}
          helperText={helperText}
          slotProps={{
            input: {
              ...params.slotProps.input,
              endAdornment: (
                <>
                  {loading ? (
                    <CircularProgress color="inherit" size={16} />
                  ) : null}
                  {params.slotProps.input.endAdornment}
                </>
              ),
            },
            inputLabel: params.slotProps.inputLabel,
            htmlInput: params.slotProps.htmlInput,
          }}
        />
      )}
    />
  );
};
