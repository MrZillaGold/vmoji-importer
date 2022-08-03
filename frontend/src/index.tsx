import 'core-js/actual';

import { RecoilRoot } from 'recoil';
import { createRoot } from 'react-dom/client';
import { Platform, platform } from '@vkontakte/vkui';
import { RouterContext } from '@happysanta/router';
import { Config } from '@vkontakte/superappkit';
import ScrollHelper from '@vkontakte/mvk-mini-apps-scroll-helper';

import { AppConfigProvider } from './components';

import { App } from './App';

import { router } from './router';
import { AUTH_APP_ID } from './constants';

Config.init({
    appId: AUTH_APP_ID
});

const rootElement = document.getElementById('root');
const root = createRoot(
    rootElement!
);

if (platform() === Platform.IOS) {
    ScrollHelper(rootElement);
}

root.render(
    <RouterContext.Provider value={router}>
        <RecoilRoot>
            <AppConfigProvider>
                <App/>
            </AppConfigProvider>
        </RecoilRoot>
    </RouterContext.Provider>
);
