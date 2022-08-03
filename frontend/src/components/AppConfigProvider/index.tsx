import { PropsWithChildren, useEffect, useState } from 'react';
import VKBridge, { VKBridgeSubscribeHandler } from '@vkontakte/vk-bridge';

import { AppConfig, AppConfigContext, defaultAppConfig } from '../../hooks';

export function AppConfigProvider(props: PropsWithChildren<Record<string, any>>): JSX.Element {
    const [appConfig, setAppConfig] = useState<AppConfig>(defaultAppConfig);

    useEffect(() => {
        const handler: VKBridgeSubscribeHandler = ({ detail: { type, data } }) => {
            switch (type) {
                case 'VKWebAppUpdateConfig': {
                    setAppConfig(data as AppConfig);
                    break;
                }
            }
        };

        VKBridge.subscribe(handler);

        return () => {
            VKBridge.unsubscribe(handler);
        };
    }, []);

    return (
        <AppConfigContext.Provider
            value={appConfig}
            {...props}
        />
    );
}
