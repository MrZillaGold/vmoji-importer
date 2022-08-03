import { useState } from 'react';

import { useEventListener } from './eventListener';

export interface UseYScrollOptions {
    listening?: boolean;
    element?: HTMLElement | null;
}

export function useYScroll(options?: UseYScrollOptions) {
    const [scroll, setScroll] = useState(0);

    const element = options?.element;
    const target = element || window;
    const isListening = options?.listening;

    useEventListener('scroll', () => {
        if (typeof isListening === 'boolean' && !isListening) {
            return;
        }

        const targetScroll = element ?
            element.scrollTop
            :
            window.scrollY;

        setScroll(targetScroll);
    }, target, [isListening]);

    return scroll;
}
