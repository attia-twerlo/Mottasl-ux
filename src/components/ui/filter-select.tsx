import * as React from "react"
import { ChevronDown, Check, Search, X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { 
  Field, 
  FieldContent 
} from "@/components/ui/field"
import { 
  InputGroup, 
  InputGroupInput, 
  InputGroupAddon 
} from "@/components/ui/input-group"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
interface FilterOption {
  value: string
  label: string
}
interface FilterSelectProps {
  placeholder: string
  options: FilterOption[]
  selectedValues: string[]
  onSelectionChange: (values: string[]) => void
  onClear: () => void
  className?: string
  contentWidth?: string
  searchable?: boolean
  searchPlaceholder?: string
  onSearchChange?: (query: string) => void
  searchQuery?: string
  filteredOptions?: FilterOption[]
}
export function FilterSelect({
  placeholder,
  options,
  selectedValues,
  onSelectionChange,
  onClear,
  className,
  contentWidth = "w-48",
  searchable = false,
  searchPlaceholder = "Search...",
  onSearchChange,
  searchQuery = "",
  filteredOptions,
}: FilterSelectProps) {
  const displayOptions = searchable ? (filteredOptions || options) : options
  
  const toggleSelection = (value: string) => {
    const newSelection = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value]
    onSelectionChange(newSelection)
  }
  const getButtonText = () => {
    // Always show the default placeholder text (e.g., "Channels", "Status")
    return placeholder
  }
  const removeFilter = (value: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const newSelection = selectedValues.filter(v => v !== value)
    onSelectionChange(newSelection)
  }
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-between font-normal h-10 sm:h-9 px-3",
            "min-w-fit w-auto max-w-[300px]",
            "border-dashed border border-gray-300",
            "bg-transparent hover:bg-muted/50 hover:border-gray-400",
            "text-black hover:text-black",
            className
          )}
        >
          <div className="flex flex-wrap gap-1 items-center min-w-0 flex-1">
            <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
            </svg>
            <span className="truncate">{getButtonText()}</span>
            {selectedValues.length > 0 && (
              <>
                {selectedValues.length <= 2 ? (
                  selectedValues.map((value) => {
                    const option = options.find(opt => opt.value === value)
                    return (
                      <Badge
                        key={value}
                        variant="secondary"
                        className="flex items-center gap-1 px-2 py-0.5 text-xs h-5"
                      >
                        <span className="truncate max-w-[80px]">{option?.label || value}</span>
                        <div
                          className="h-3 w-3 p-0 hover:bg-transparent flex items-center justify-center rounded-sm hover:bg-gray-200 transition-colors cursor-pointer"
                          onClick={(e) => removeFilter(value, e)}
                        >
                          <X className="h-1.5 w-1.5" />
                        </div>
                      </Badge>
                    )
                  })
                ) : (
                  <>
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1 px-2 py-0.5 text-xs h-5"
                    >
                      <span className="truncate max-w-[80px]">
                        {options.find(opt => opt.value === selectedValues[0])?.label || selectedValues[0]}
                      </span>
                      <div
                        className="h-3 w-3 p-0 hover:bg-transparent flex items-center justify-center rounded-sm hover:bg-gray-200 transition-colors cursor-pointer"
                        onClick={(e) => removeFilter(selectedValues[0], e)}
                      >
                        <X className="h-2 w-2" />
                      </div>
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      +{selectedValues.length - 1} more
                    </span>
                  </>
                )}
              </>
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className={cn("p-0", contentWidth)} 
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="flex flex-col">
            {/* Search input at the top */}
            {searchable && onSearchChange ? (
              <div className="flex flex-col">
                <div>
                  <Field>
                    <FieldContent>
                      <InputGroup className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none">
                        <InputGroupAddon>
                          <Search className="h-3 w-3" />
                        </InputGroupAddon>
                        <InputGroupInput
                          placeholder={searchPlaceholder}
                          value={searchQuery}
                          onChange={(e) => onSearchChange(e.target.value)}
                          className="h-6 text-sm"
                          autoFocus={false}
                        />
                      </InputGroup>
                    </FieldContent>
                  </Field>
                </div>
                <div className="border-t border-border" />
              </div>
            ) : (
              /* Clear/All option - only show if not searchable */
              <div className="p-1">
                <div className="flex items-center space-x-2 p-2">
                  <Checkbox
                    id="select-all"
                    checked={selectedValues.length === 0}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        onClear()
                      }
                    }}
                  />
                  <label
                    htmlFor="select-all"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {placeholder}
                  </label>
                </div>
                <div className="border-t border-border" />
              </div>
            )}
            
            {/* Options with native checkboxes */}
            {displayOptions.length > 0 ? (
              <div className="max-h-48 overflow-y-auto p-1">
                {displayOptions.map((option) => {
                  const isSelected = selectedValues.includes(option.value)
                  return (
                    <div key={option.value} className="flex items-center space-x-2 p-2 hover:bg-accent rounded-sm">
                      <Checkbox
                        id={option.value}
                        checked={isSelected}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            onSelectionChange([...selectedValues, option.value])
                          } else {
                            onSelectionChange(selectedValues.filter(v => v !== option.value))
                          }
                        }}
                      />
                      <label
                        htmlFor={option.value}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                      >
                        {option.label}
                      </label>
                    </div>
                  )
                })}
              </div>
            ) : searchable ? (
              <div className="px-2 py-1 text-sm text-muted-foreground text-center">
                No results found
              </div>
            ) : null}
        </div>
      </PopoverContent>
    </Popover>
  )
}
