import { createContext, useContext } from 'react';
import { Appearance, Scheme } from '@vkontakte/vkui';
import { Insets } from '@vkontakte/vk-bridge';

import { APP_ID } from '../constants';

export enum Client {
    VK = 'vkclient',
    VK_ME = 'vkme'
}

export interface AppConfig {
    app: Client;
    app_id: number;
    appearance: Appearance;
    insets: Insets;
    scheme: Scheme;
    start_time: number;
    viewport_height: number;
    viewport_width: number;
    api_host: string;
    is_layer: boolean;
}

export const defaultAppConfig = {
    app: Client.VK,
    app_id: APP_ID,
    appearance: Appearance.LIGHT,
    insets: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    scheme: Scheme.BRIGHT_LIGHT,
    start_time: 0,
    viewport_height: 0,
    viewport_width: 0,
    api_host: '',
    is_layer: false,
    setAppConfig: () => undefined
};

export const AppConfigContext = createContext<AppConfig>(defaultAppConfig);

export function useAppConfig(): AppConfig {
    return useContext(AppConfigContext);
}
