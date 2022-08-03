import Lottie from 'lottie-react';
import { FixedLayout, PopoutWrapper, Title, PopoutWrapperProps } from '@vkontakte/vkui';

import { useIsDesktop } from '../../hooks';
import { classNameBuilder } from '../../utils';

import styles from './index.module.scss';
import animation from './animation.json';

export function Creating(props: PopoutWrapperProps): JSX.Element {
    const isDesktop = useIsDesktop();

    return (
        <PopoutWrapper
            {...props}
            hasMask={false}
        >
            <div className={classNameBuilder(
                styles.creating,
                {
                    [styles.creating__desktop]: isDesktop
                }
            )}>
                <Lottie
                    className={classNameBuilder(
                        styles.creating_animation,
                        {
                            [styles.creating_animation__desktop]: isDesktop
                        }
                    )}
                    animationData={animation}
                    autoplay
                    loop
                />
                <FixedLayout vertical='bottom'>
                    <Title
                        className={styles.creating_title}
                        level={isDesktop ? '2' : '3'}
                        weight='3'
                    >
                        Создание набора
                    </Title>
                </FixedLayout>
            </div>
        </PopoutWrapper>
    );
}
