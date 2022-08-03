import { HTMLAttributes, ImgHTMLAttributes, ReactEventHandler, useState } from 'react';

import { useIsDesktop } from '../../hooks';
import { classNameBuilder } from '../../utils';

import styles from './index.module.scss';

export interface StickerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'placeholder'>,
    Pick<ImgHTMLAttributes<HTMLDivElement>, 'src' | 'onError'> {
    /**
     * Sticker size
     */
    size: StickerSize;
    /**
     * Spacing status
     */
    spacing?: boolean;
    /**
     * Placeholder status
     */
    placeholder?: boolean;
}

export enum StickerSize {
    LARGE = 'l',
    MEDIUM = 'm',
    SMALL = 's'
}

export function Sticker({ size, placeholder, spacing, className, src, onLoad, onError, ...rest }: StickerProps): JSX.Element {
    const isDesktop = useIsDesktop();

    const [loading, setLoading] = useState(true);

    const handleError: ReactEventHandler<HTMLImageElement> = (event) => {
        onError?.(event);
    };

    const handleLoadStart = () => {
        setLoading(true);
    };

    const handleLoaded: ReactEventHandler<HTMLDivElement> = (event) => {
        onLoad?.(event);
        setLoading(false);
    };

    return (
        <div
            className={classNameBuilder(
                styles.sticker,
                styles.sticker__regular,
                // @ts-ignore
                styles[`sticker__regular${!loading && src ? '__loaded' : ''}`],
                // @ts-ignore
                styles[`sticker__regular__${size}`],
                // @ts-ignore
                styles[`sticker__regular__${size}${isDesktop ? '__desktop' : ''}`],
                className,
                {
                    [styles.sticker__spacing]: spacing
                }
            )}
            {...rest}
        >
            {
                src && (
                    <div className={styles.sticker_in}>
                        <img
                            className={classNameBuilder(
                                styles.sticker_image,
                                {
                                    [styles.sticker_image__hidden]: loading || placeholder
                                }
                            )}
                            alt=''
                            src={src}
                            onError={handleError}
                            onLoadStart={handleLoadStart}
                            onLoad={handleLoaded}
                        />
                    </div>
                )
            }
        </div>
    );
}
