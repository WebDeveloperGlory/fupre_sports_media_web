import { useCallback, useRef } from "react";
import { debounce, DebounceSettings } from "lodash";

interface DebounceOptions extends DebounceSettings {
    wait?: number;
}

export function useDebounce<T extends (...args: any[]) => void>(
    callback: T,
    options: DebounceOptions = {}
): (...args: Parameters<T>) => void {
    const { wait = 300, ...debounceOptions } = options;

    // Store the debounced function in a ref, initialize with null
    const debouncedRef = useRef<(...args: Parameters<T>) => void | null>(null);

    // Create or reuse the debounced function
    const debouncedCallback = useCallback(
        debounce(callback, wait, debounceOptions),
        [callback, wait]
    );

    // Update the ref
    debouncedRef.current = debouncedCallback;

    return debouncedCallback;
}
