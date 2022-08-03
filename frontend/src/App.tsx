import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import {
    AdaptivityProvider,
    Appearance,
    AppRoot,
    ConfigProvider,
    platform,
    Scheme,
    ViewHeight,
    ViewWidth,
    VKCOM,
    WebviewType
} from '@vkontakte/vkui';
import VKBridge, { VKBridgeEventData, VKBridgeSubscribeHandler } from '@vkontakte/vk-bridge';

import { Layout } from './Layout';

import { useIsDesktop } from './hooks';
import { snackbarState } from './store';

import '@vkontakte/vkui/dist/vkui.css';
import '@vkontakte/vkui/dist/fonts.css';
import './styles/index.scss';

export function App(): JSX.Element {
    const [snackbar] = useRecoilState(snackbarState);

    const [appearance, setAppearance] = useState<Appearance>(Appearance.LIGHT);

    useEffect(() => {
        const handler: VKBridgeSubscribeHandler = ({ detail: { type, data } }) => {
            switch (type) {
                case 'VKWebAppUpdateConfig': {
                    const { scheme } = data as VKBridgeEventData<'VKWebAppUpdateConfig'>;

                    setAppearance(
                        scheme.includes(Appearance.DARK) || scheme === Scheme.SPACE_GRAY ?
                            Appearance.DARK
                            :
                            Appearance.LIGHT
                    );
                    break;
                }
            }
        };

        VKBridge.subscribe(handler);
        VKBridge.send('VKWebAppInit');

        return () => {
            VKBridge.unsubscribe(handler);
        };
    }, []);

    const isDesktop = useIsDesktop();

    return (
        <ConfigProvider
            appearance={appearance}
            platform={
                isDesktop ?
                    VKCOM
                    :
                    platform()
            }
            webviewType={WebviewType.INTERNAL}
            transitionMotionEnabled={false}
        >
            <AdaptivityProvider
                viewWidth={
                    isDesktop ?
                        ViewWidth.DESKTOP
                        :
                        undefined
                }
                viewHeight={
                    isDesktop ?
                        ViewHeight.MEDIUM
                        :
                        undefined
                }
            >
                <AppRoot>
                    <Layout/>
                    {snackbar}
                </AppRoot>
            </AdaptivityProvider>
        </ConfigProvider>
    );
}
