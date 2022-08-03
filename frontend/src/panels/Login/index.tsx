import VKBridge from '@vkontakte/vk-bridge';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { Appearance, Panel, PanelProps, Placeholder, Scheme, Spinner, useAppearance } from '@vkontakte/vkui';
import {
    Connect,
    ConnectEvents,
    ButtonOneTapSkin,
    VKSilentAuthPayload,
    VKAuthButtonCallbackResult
} from '@vkontakte/superappkit';

import { PageId, router } from '../../router';
import { vkIdAccessTokenState } from '../../store';
import { API, backend, StoreProductFilter, StoreProductType } from '../../utils';

import { ReactComponent as Illustration } from '../../assets/illustration.svg';

import styles from './index.module.scss';

export function Login(props: PanelProps): JSX.Element {
    const appearance = useAppearance();

    const [vkIdAccessToken, setVkIdAccessToken] = useRecoilState(vkIdAccessTokenState);

    const [loading, setLoading] = useState(!vkIdAccessToken);

    const exchangeSilentToken = ({ uuid, token }: VKSilentAuthPayload) => {
        backend.auth.exchangeSilentAuthToken({
            uuid,
            token
        })
            .then(({ access_token }) => (
                setVkIdAccessToken(access_token)
            ));
    };

    const handleAuthCallback = ({ type, payload }: VKAuthButtonCallbackResult) => {
        if (!type) {
            return;
        }

        switch (type) {
            case ConnectEvents.OneTapAuthEventsSDK.LOGIN_SUCCESS:
                return exchangeSilentToken(payload as VKSilentAuthPayload);
            case ConnectEvents.OneTapAuthEventsSDK.FULL_AUTH_NEEDED:
            case ConnectEvents.OneTapAuthEventsSDK.PHONE_VALIDATION_NEEDED:
                return Connect.redirectAuth({
                    url: window.location.href
                });
        }
    };

    const handleSession = async () => {
        const api = new API(vkIdAccessToken);

        if (vkIdAccessToken) {
            const products = await api.store.getProducts({
                type: StoreProductType.STICKERS,
                filters: [StoreProductFilter.ACTIVE]
            })
                .catch(() => null);

            if (!products) {
                return setLoading(false);
            }

            VKBridge.send('VKWebAppStorageSet', {
                key: 'token',
                value: vkIdAccessToken
            });

            router.replacePage(PageId.PREVIEW);
        } else {
            const accessToken = await VKBridge.send('VKWebAppStorageGet', {
                keys: ['token']
            })
                .then(({ keys }) => {
                    const key = keys[0];

                    if (key) {
                        return key.value;
                    }

                    return;
                });

            if (accessToken) {
                return setVkIdAccessToken(accessToken);
            }

            setLoading(false);
        }
    };

    useEffect(() => {
        handleSession();
    }, [vkIdAccessToken]);

    useEffect(() => {
        const container = document.getElementById('login');

        const button = Connect.buttonOneTapAuth({
            callback: handleAuthCallback,
            options: {
                showAlternativeLogin: false,
                showAgreements: true,
                displayMode: 'default',
                buttonSkin: (
                    appearance === Appearance.LIGHT ?
                        'flat'
                        :
                        'primary'
                ) as ButtonOneTapSkin,
                scheme: appearance === Appearance.LIGHT ?
                    Scheme.BRIGHT_LIGHT
                    :
                    Scheme.SPACE_GRAY
            },
            container
        });

        return () => {
            button?.destroy?.();
        };
    }, [loading, appearance]);

    return (
        <Panel
            {...props}
            style={{
                colorScheme: 'light'
            }}
            centered
        >
            {
                loading ?
                    <Spinner/>
                    :
                    <Placeholder
                        header='Авторизация'
                        icon={
                            <div className={styles.login_illustration}>
                                <Illustration/>
                            </div>
                        }
                        action={
                            <div
                                id='login'
                                className={styles.login_button}
                            />
                        }
                    >
                        Для получения информации о&nbsp;наборе vmoji
                        <br/>
                        необходима авторизация через VK&nbsp;ID
                    </Placeholder>
            }
        </Panel>
    );
}
