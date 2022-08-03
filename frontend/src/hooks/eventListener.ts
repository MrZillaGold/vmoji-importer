import { DependencyList, useEffect } from 'react';

export function useEventListener(eventName: string, handler: (event: Event) => unknown, element: HTMLElement | Window | null = window, deps: DependencyList = []) {
    useEffect(() => {
        const isSupported = element?.addEventListener;

        if (!isSupported) {
            return;
        }

        element.addEventListener(eventName, handler);

        return () => {
            element.removeEventListener(eventName, handler);
        };
    }, [eventName, element, ...deps]);
}
