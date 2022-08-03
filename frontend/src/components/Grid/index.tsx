import { HTMLAttributes, useEffect, useMemo, useRef, useState } from 'react';

import { Sticker, StickerSize } from '../Sticker';

import { useEventListener } from '../../hooks';
import { classNameBuilder } from '../../utils';

import styles from './index.module.scss';

export interface GridProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
    /**
     * Stickers sources for preview
     */
    stickers?: string[];
}

export const placeholders = new Array(18)
    .fill(undefined);

export function Grid({ stickers = placeholders, className, ...rest }: GridProps): JSX.Element {
    const ref = useRef<HTMLDivElement>(null);
    const [stickersMinRowCount, setStickersMinRowCount] = useState(0);
    const [stickersRowGap, setStickersRowGap] = useState(0);

    const renders = useMemo(() => (
        stickers.map((sticker) => (
            <Sticker
                key={sticker}
                src={sticker}
                size={StickerSize.LARGE}
            />
        ))
    ), [stickers]);

    const spacing = useMemo(() => {
        const stickersCount = renders.length;
        const lastRowStickersCount = stickersCount % stickersMinRowCount || stickersMinRowCount;

        if (lastRowStickersCount < stickersMinRowCount) {
            const spacingStickersCount = stickersMinRowCount - lastRowStickersCount;

            return [...Array(spacingStickersCount)]
                .map((_, i) => (
                    <Sticker
                        key={i}
                        size={StickerSize.LARGE}
                        spacing
                    />
                ));
        }

        return [];
    }, [stickersMinRowCount, renders]);

    const compute = () => {
        const gridRef = ref.current;
        const children = gridRef?.children;

        if (!gridRef || !children || !children.length) {
            return;
        }

        const stickerWidth = (children[0] as HTMLDivElement).offsetWidth;
        const gridWidth = gridRef.offsetWidth;

        if (!stickerWidth) {
            return;
        }

        const stickersRowMinCount = Math.floor(gridWidth / stickerWidth);

        setStickersMinRowCount(stickersRowMinCount);

        let prevStickerOffsetTop = 0;
        let firstStickerOffsetLeft;
        let secondStickerOffsetLeft;
        for (const child of children) {
            const { offsetTop, offsetLeft } = (child as HTMLDivElement);

            const hasFirstStickerOffset = typeof firstStickerOffsetLeft !== 'undefined';

            if (!hasFirstStickerOffset) {
                firstStickerOffsetLeft = offsetLeft;
            }

            if (hasFirstStickerOffset && typeof secondStickerOffsetLeft === 'undefined') {
                secondStickerOffsetLeft = offsetLeft;
            }

            if (prevStickerOffsetTop && prevStickerOffsetTop !== offsetTop) {
                break;
            }

            prevStickerOffsetTop = offsetTop;
        }

        const rowGap = Number(secondStickerOffsetLeft) - Number(firstStickerOffsetLeft) - stickerWidth;

        setStickersRowGap(rowGap);
    };

    useEffect(compute, [ref, stickers, spacing]);
    useEventListener('resize', compute);

    return (
        <div
            ref={ref}
            className={classNameBuilder(
                styles.grid,
                className
            )}
            style={{
                '--grid-row-gap': `${stickersRowGap}px`
            }}
            {...rest}
        >
            {renders}
            {spacing}
        </div>
    );
}
