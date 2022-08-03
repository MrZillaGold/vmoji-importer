import VKBridge from '@vkontakte/vk-bridge';
import { useRecoilState } from 'recoil';
import { useEffect, useMemo, useState } from 'react';
import { Icon24BrushOutline, Icon28CancelCircleFillRed } from '@vkontakte/icons';
import {
    Button,
    Div,
    FixedLayout,
    Group,
    Header,
    Panel,
    PanelHeader,
    PanelProps,
    Placeholder,
    Separator, Snackbar,
    Spinner,
    Text
} from '@vkontakte/vkui';
import { useLocation } from '@happysanta/router';

import { Creating } from '../../popouts';
import { CharacterInfo, Grid } from '../../components';

import { ModalId, router } from '../../router';
import { VMOJI_CONSTRUCTOR_APP_ID, VMOJI_PACK_IDS } from '../../constants';
import { useFixedLayoutHeight, useIsDesktop, useYScroll } from '../../hooks';
import { popoutState, snackbarState, vkIdAccessTokenState } from '../../store';
import {
    API,
    backend,
    classNameBuilder,
    Sticker,
    StoreProductPreview,
    StoreProductType
} from '../../utils';

import { ReactComponent as Illustration } from '../../assets/illustration.svg';

import styles from './index.module.scss';

export function Preview(props: PanelProps): JSX.Element {
    const location = useLocation();
    const isDesktop = useIsDesktop();

    const [, setSnackbar] = useRecoilState(snackbarState);
    const [popout, setPopout] = useRecoilState(popoutState);
    const [vkIdAccessToken] = useRecoilState(vkIdAccessTokenState);

    const scroll = useYScroll({
        listening: !location.getPopupId() && !popout
    });

    const [link, setLink] = useState('');
    const [importedCharacterId, setImportedCharacterId] = useState('');
    const [product, setProduct] = useState<StoreProductPreview | null>();

    const { fixedLayoutRef, fixedLayoutHeight } = useFixedLayoutHeight([product]);

    const getProductVmojiCharacterId = (product?: StoreProductPreview | null) => (
        product?.stickers?.[0]?.vmoji?.character_id
    );

    const currentCharacterId = getProductVmojiCharacterId(product);

    const stickers = useMemo(() => (
        product?.stickers?.map(({ images_with_background }) => {
            const { url } = images_with_background.sort((a, b) => (
                a.width * a.height - b.width * b.height
            ))
                .pop()!;

            return url;
        })
    ), [product]);

    const goToConstructor = () => {
        const searchParams = new URLSearchParams([
            ['character_id', 'avatar'],
            ['autoclose', '1']
        ]);

        VKBridge.send('VKWebAppOpenApp', {
            app_id: VMOJI_CONSTRUCTOR_APP_ID,
            location: searchParams.toString()
        });
    };

    const getVmojiProduct = () => {
        const api = new API(vkIdAccessToken);

        api.store.getProducts({
            type: StoreProductType.STICKERS,
            product_ids: VMOJI_PACK_IDS,
            extended: true
        })
            .then(({ items: [vmojiBaseProduct, ...vmojiProducts] }) => {
                const currentCharacterId = getProductVmojiCharacterId(product);
                const responseCharacterId = getProductVmojiCharacterId(vmojiBaseProduct);

                if (currentCharacterId && currentCharacterId === responseCharacterId) {
                    return;
                }

                vmojiBaseProduct.stickers = vmojiProducts.reduce<Sticker[]>((vmojiStickers, { stickers }) => {
                    vmojiStickers = vmojiStickers.concat(stickers);

                    return vmojiStickers;
                }, vmojiBaseProduct.stickers);

                setProduct(vmojiBaseProduct);
            });
    };

    const importToTelegram = (characterId?: string) => async () => {
        if (!characterId) {
            return;
        }

        if (link) {
            return router.pushModal(ModalId.IMPORTED, {
                link
            });
        }

        setPopout(
            <Creating/>
        );

        await backend.stickers.importToTelegram({
            access_token: vkIdAccessToken
        })
            .then(({ link }) => {
                setLink(link);
                setImportedCharacterId(characterId);

                router.pushModal(ModalId.IMPORTED, {
                    link
                });
            })
            .catch((error) => {
                console.log(error);

                setSnackbar(
                    <Snackbar
                        before={
                            <Icon28CancelCircleFillRed/>
                        }
                        onClose={setSnackbar}
                    >
                        Произошла ошибка при создании набора
                    </Snackbar>
                );
            });

        setPopout();
    };

    useEffect(() => {
        if (!currentCharacterId) {
            return;
        }

        if (importedCharacterId !== currentCharacterId) {
            setLink('');
        }
    }, [importedCharacterId, currentCharacterId]);

    useEffect(() => {
        getVmojiProduct();

        const interval = setInterval(() => {
            getVmojiProduct();
        }, 3_000);

        return () => {
            clearInterval(interval);
        };
    }, [currentCharacterId]);

    const isProductLoading = product === undefined;
    const isVmojiCreated = Boolean(currentCharacterId);

    return (
        <Panel
            {...props}
            centered={isProductLoading || !isVmojiCreated}
        >
            {
                !isDesktop && !isProductLoading && (
                    <PanelHeader separator={false}>
                        {
                            scroll > 125 && (
                                <span className={styles.preview_title}>
                                    Мой персонаж
                                </span>
                            )
                        }
                    </PanelHeader>
                )
            }
            {
                isProductLoading && (
                    <Spinner/>
                )
            }
            {
                product === null && (
                    <Placeholder
                        header='Произошла ошибка'
                    >
                        Не&nbsp;удалось загрузить информацию о&nbsp;наборе&nbsp;vmoji
                    </Placeholder>
                )
            }
            {
                isVmojiCreated ?
                    <>
                        <CharacterInfo
                            src={stickers![3]}
                            title='Мой персонаж'
                            scroll={scroll}
                            action={
                                <Button
                                    size='m'
                                    mode='tertiary'
                                    before={
                                        <Icon24BrushOutline/>
                                    }
                                    onClick={goToConstructor}
                                >
                                    <Text weight='medium'>
                                         Редактировать
                                    </Text>
                                </Button>
                            }
                        />
                        <Separator wide/>
                        <Group
                            mode='plain'
                            header={
                                <Header mode={
                                    isDesktop ?
                                        'primary'
                                        :
                                        'secondary'
                                }>
                                     Стикеры
                                </Header>
                            }
                            style={{
                                paddingBottom: fixedLayoutHeight
                            }}
                        >
                            <Grid stickers={stickers}/>
                        </Group>
                        <FixedLayout
                            getRootRef={fixedLayoutRef}
                            vertical='bottom'
                            filled
                        >
                            <Separator wide/>
                            <Div className={classNameBuilder(
                                styles.preview_bottom,
                                {
                                    [styles.preview_bottom__desktop]: isDesktop
                                }
                            )}>
                                <Button
                                    size={
                                        isDesktop ?
                                            'm'
                                            :
                                            'l'
                                    }
                                    stretched={!isDesktop}
                                    onClick={importToTelegram(currentCharacterId)}
                                >
                                    Импортировать в Telegram
                                </Button>
                            </Div>
                        </FixedLayout>
                    </>
                    :
                    !isProductLoading && (
                        <Placeholder
                            icon={
                                <Illustration/>
                            }
                            action={
                                <Button
                                    mode='secondary'
                                    onClick={goToConstructor}
                                >
                                     Создать персонажа
                                </Button>
                            }
                        />
                    )
            }
        </Panel>
    );
}
