import { HTMLAttributes, ReactNode, useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Avatar, AvatarProps, Title } from '@vkontakte/vkui';

import { ANIMATION_DURATION } from '../';
import { useIsDesktop } from '../../hooks';
import { classNameBuilder } from '../../utils';

import styles from './index.module.scss';

export interface CharacterInfoProps extends HTMLAttributes<HTMLDivElement>, Pick<AvatarProps, 'src'> {
    /**
     * Title
     */
    title: string;
    /**
     * Action element
     */
    action?: ReactNode;
    /**
     * Scroll position
     */
    scroll?: number;
}

export function CharacterInfo({ src, title, action, scroll = 0, className, ...rest }: CharacterInfoProps): JSX.Element {
    const isDesktop = useIsDesktop();
    const scrollYProgress = useMotionValue(scroll);
    const yOffset = useTransform(scrollYProgress, [0, 150], [0, 70]);
    const scale = useTransform(scrollYProgress, [0, 150], [1, 0.6]);
    const opacity = useTransform(scrollYProgress, [55, 150], [1, 0]);

    const [loading, setLoading] = useState(true);

    const handleLoadStart = () => {
        setLoading(true);
    };

    const handleLoaded = () => {
        setLoading(false);
    };

    useEffect(() => {
        scrollYProgress.set(scroll);
    }, [scroll]);

    return (
        <div
            className={classNameBuilder(
                styles.characterInfo,
                className,
                {
                    [styles.characterInfo__desktop]: isDesktop
                }
            )}
            {...rest}
        >
            <motion.div
                style={{
                    transformOrigin: 'top'
                }}
                animate={
                    !isDesktop ?
                        {
                            y: yOffset.get(),
                            scale: scale.get(),
                            opacity: opacity.get()
                        }
                        :
                        undefined
                }
                transition={{
                    ease: 'easeOut',
                    duration: ANIMATION_DURATION / 2
                }}
            >
                <Avatar
                    className={classNameBuilder(
                        styles.characterInfo_avatar,
                        {
                            [styles.characterInfo_avatar__hidden]: loading
                        }
                    )}
                    onLoad={handleLoaded}
                    onLoadStart={handleLoadStart}
                    mode='app'
                    src={src}
                    aria-hidden
                />
            </motion.div>
            <Title
                className={styles.characterInfo_title}
                level='2'
                weight='3'
            >
                {title}
            </Title>
            {
                action && (
                    <div className={styles.characterInfo_action}>
                        {action}
                    </div>
                )
            }
        </div>
    );
}
