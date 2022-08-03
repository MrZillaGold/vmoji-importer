import VKQR from '@vkontakte/vk-qr';
import {
    Div,
    Button,
    ModalPage,
    ModalPageHeader,
    ModalPageProps,
    PanelHeaderButton,
    Platform,
    Subhead,
    useAdaptivity,
    usePlatform,
    ViewWidth
} from '@vkontakte/vkui';
import { useParams } from '@happysanta/router';
import { Icon24Dismiss, Icon24ScanViewfinderOutline } from '@vkontakte/icons';

import { useIsDesktop } from '../../hooks';
import { classNameBuilder } from '../../utils';

import { ReactComponent as Illustration } from '../../assets/illustration.svg';

import styles from './index.module.scss';

export function Imported(props: ModalPageProps): JSX.Element {
    const { onClose } = props;

    const { link } = useParams();
    const { viewWidth } = useAdaptivity();
    const platform = usePlatform();
    const isDesktop = useIsDesktop();

    const qr = VKQR.createQR(link, {
        qrSize: 122,
        isShowLogo: true,
        foregroundColor: 'var(--text_primary)',
        ecc: 1
    });

    return (
        <ModalPage
            {...props}
            className={classNameBuilder(
                styles.imported,
                {
                    [styles.imported__desktop]: isDesktop
                }
            )}
            header={
                <ModalPageHeader
                    className={styles.imported__header}
                    after={
                        platform === Platform.IOS &&
                        Number(viewWidth) < ViewWidth.SMALL_TABLET &&
                        (
                            <PanelHeaderButton onClick={onClose}>
                                <Icon24Dismiss/>
                            </PanelHeaderButton>
                        )
                    }
                >
                    Набор создан
                </ModalPageHeader>
            }
        >
            <div className={styles.imported_in}>
                {
                    isDesktop ?
                        <div className={styles.imported_content}>
                            <div className={styles.imported_code}>
                                <div
                                    className={styles.imported_code_in}
                                    dangerouslySetInnerHTML={{
                                        __html: qr
                                    }}
                                />
                            </div>
                            <span className={styles.imported_caption}>
                                <Icon24ScanViewfinderOutline/>
                                <Subhead weight='regular'>
                                    Отсканируйте этот код
                                    <br/>
                                    камерой ВКонтакте
                                </Subhead>
                            </span>
                        </div>
                        :
                        <div className={classNameBuilder(
                            styles.imported_in,
                            styles.imported_illustration
                        )}>
                            <Illustration/>
                        </div>
                }
            </div>
            <Div>
                <Button
                    href={link}
                    target='_blank'
                    size={
                        isDesktop ?
                            'm'
                            :
                            'l'
                    }
                    stretched
                >
                    Открыть в Telegram
                </Button>
            </Div>
        </ModalPage>
    );
}
