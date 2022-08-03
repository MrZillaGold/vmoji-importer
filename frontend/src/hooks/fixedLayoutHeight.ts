import { DependencyList, Ref, RefObject, useEffect, useRef, useState } from 'react';

export interface FixedLayoutHeight<E extends HTMLElement = HTMLDivElement> {
    fixedLayoutRef: Ref<E>;
    fixedLayoutHeight: number;
}

export function useFixedLayoutHeight<E extends HTMLElement = HTMLDivElement>(deps: DependencyList = []): FixedLayoutHeight<E> {
    const fixedLayoutRef = useRef<E>() as RefObject<E>;
    const [fixedLayoutHeight, setFixedLayoutHeight] = useState(0);

    const current = fixedLayoutRef?.current;

    useEffect(() => {
        const current = fixedLayoutRef?.current;

        if (current) {
            return setFixedLayoutHeight(current.offsetHeight);
        }

        setFixedLayoutHeight(0);
    }, [current, ...deps]);

    return {
        fixedLayoutRef,
        fixedLayoutHeight
    };
}
