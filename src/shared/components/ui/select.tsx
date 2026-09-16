"use client";

import React, { useId, useState } from "react";
import { Select as AntSelect } from "antd";
import { FiChevronDown } from "react-icons/fi";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectChangeEvent {
  target: {
    name: string;
    value: string | string[] | undefined;
  };
}

export interface SelectProps {
  label?: React.ReactNode;
  value?: string | string[];
  onChange?: (e: SelectChangeEvent) => void;
  options?: (string | number | SelectOption)[];
  placeholder?: string;
  searchPlaceholder?: string;
  error?: string;
  helperText?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  multiple?: boolean;
  size?: "sm" | "md" | "lg";
  containerClassName?: string;
  className?: string;
  popupClassName?: string;
  popupMatchSelectWidth?: boolean | number;
  id?: string;
  name?: string;
  loading?: boolean;
  notFoundContent?: React.ReactNode;
  maxTagCount?: number | "responsive";
  maxTagTextLength?: number;
  showSearch?: boolean;
  onSearch?: (value: string) => void;
  searchValue?: string;
  filterOption?: boolean | ((input: string, option?: SelectOption) => boolean);
  allowClear?: boolean;
  autoComplete?: string;
}

export const Select: React.FC<SelectProps> = ({
  className = "",
  containerClassName = "",
  popupClassName = "",
  popupMatchSelectWidth,
  label,
  error,
  helperText,
  options = [],
  placeholder = "Select",
  searchPlaceholder,
  id,
  name,
  value,
  onChange,
  disabled = false,
  multiple = false,
  required = false,
  size = "md",
  loading = false,
  notFoundContent,
  maxTagCount,
  maxTagTextLength = 22,
  showSearch,
  onSearch,
  searchValue,
  filterOption,
  allowClear,
  autoComplete = "off",
}) => {
  const reactId = useId();
  const [internalSearch, setInternalSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const dropdownSearch = searchValue !== undefined ? searchValue : internalSearch;
  const selectId = id || reactId;

  const normalizedOptions: SelectOption[] = React.useMemo(() => {
    return options.map((opt) =>
      typeof opt === "string" || typeof opt === "number"
        ? { label: String(opt), value: String(opt) }
        : {
            label: opt?.label !== undefined ? String(opt.label) : "",
            value: opt?.value !== undefined ? String(opt.value) : "",
          }
    );
  }, [options]);

  const shouldShowSearch =
    !loading &&
    (showSearch === true ||
      Boolean(searchPlaceholder) ||
      (showSearch !== false && normalizedOptions.length >= 6));

  const antFilterOption = React.useCallback(
    (input: string, option?: SelectOption) => {
      if (filterOption === false) return true;
      if (typeof filterOption === "function") {
        return filterOption(input, option);
      }
      const labelStr = (option?.label || "").toLowerCase();
      const valStr = (option?.value || "").toLowerCase();
      const q = input.toLowerCase();
      return labelStr.includes(q) || valStr.includes(q);
    },
    [filterOption]
  );

  const handleChange = (newVal: string | string[] | undefined) => {
    if (!onChange) return;
    onChange({ target: { name: name || "", value: newVal } });
  };

  const handleSearch = (val: string) => {
    setInternalSearch(val);
    onSearch?.(val);
  };

  const isRawId = (val?: string) => {
    if (!val || typeof val !== "string") return false;
    return /^[0-9A-Z]{20,}$/i.test(val) || /^[0-9a-f]{8}-[0-9a-f]{4}/i.test(val);
  };

  const matchesAnyOption = (val?: string | number | null): boolean => {
    if (val === undefined || val === null || val === "") return false;
    return normalizedOptions.some(
      (o) => o.value === val || String(o.value) === String(val) || o.label === val || String(o.label) === String(val)
    );
  };

  const antValue: string | string[] | null | undefined = loading
    ? undefined
    : multiple
      ? Array.isArray(value)
        ? value
        : typeof value === "string" && value
          ? value.split(", ").filter(Boolean)
          : []
      : typeof value === "string" && value
        ? isRawId(value) && !matchesAnyOption(value)
          ? null
          : value
        : null;

  const errorClass = error ? "!border-primary-solid !ring-2 !ring-border-secondary" : "";

  const hasCustomWidth =
    containerClassName.includes("w-") ||
    containerClassName.includes("flex-1") ||
    containerClassName.includes("min-w") ||
    containerClassName.includes("max-w");

  return (
    <div className={`flex flex-col gap-1.5 ${hasCustomWidth ? "" : "w-full"} relative ${containerClassName}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="font-sans text-text-dark font-medium text-xs xl:text-sm leading-[1.4] select-none"
        >
          {label}
          {required && <span className="text-primary-solid ml-0.5">*</span>}
        </label>
      )}

      <AntSelect
        id={selectId}
        mode={multiple ? "multiple" : undefined}
        value={antValue}
        placeholder={loading ? "Loading..." : isOpen && shouldShowSearch && searchPlaceholder ? searchPlaceholder : placeholder}
        disabled={disabled}
        loading={loading}
        showSearch={shouldShowSearch}
        {...(shouldShowSearch ? { searchValue: dropdownSearch, onSearch: handleSearch } : {})}
        allowClear={allowClear}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) {
            setInternalSearch("");
            onSearch?.("");
          }
        }}
        {...({ autoComplete: autoComplete || "off" } as Record<string, string>)}
        filterOption={antFilterOption}
        maxTagCount={maxTagCount !== undefined ? maxTagCount : multiple ? "responsive" : undefined}
        maxTagTextLength={maxTagTextLength}
        notFoundContent={
          loading ? (
            <div className="py-4 px-3 text-center text-xs xl:text-sm text-gray-500 font-medium flex items-center justify-center gap-2 select-none">
              <span className="w-4 h-4 border-2 border-primary-solid border-t-transparent rounded-full animate-spin shrink-0" />
              <span>Loading...</span>
            </div>
          ) : notFoundContent !== undefined ? (
            <div className="py-4 px-3 text-center text-xs xl:text-sm text-gray-500 font-medium select-none">
              {notFoundContent}
            </div>
          ) : (
            <div className="py-5 px-3 text-center text-xs xl:text-sm text-gray-400 font-normal select-none">
              No options found
            </div>
          )
        }
        onChange={handleChange}
        options={normalizedOptions}
        className={`w-full ${className}`}
        popupMatchSelectWidth={
          popupMatchSelectWidth !== undefined ? popupMatchSelectWidth : size === "sm" ? false : true
        }
        suffixIcon={
          <FiChevronDown className="w-4 h-4 text-text-dark stroke-[2.5] opacity-90 transition-transform duration-200" />
        }
        classNames={{
          popup: {
            root: `rounded-2xl shadow-2xl border border-gray-100 overflow-hidden ${popupClassName}`,
          },
        }}
        status={error ? "error" : undefined}
        styles={{
          popup: {
            root: {
              padding: "4px",
              borderRadius: "16px",
              minWidth: size === "sm" ? 100 : undefined,
            },
          },
        }}
        style={{ width: "100%" }}
        rootClassName={`elimi-select ${errorClass}`}
      />

      {error && <span className="text-primary-solid text-xs font-semibold leading-[1.4]">{error}</span>}
      {!error && helperText && <div className="text-neutral-secondary text-xs leading-[1.4]">{helperText}</div>}
    </div>
  );
};
