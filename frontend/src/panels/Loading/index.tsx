import VKBridge from '@vkontakte/vk-bridge';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { Panel, PanelProps, Spinner } from '@vkontakte/vkui';

import { PageId, router } from '../../router';
import { accessTokenState } from '../../store';

import { APP_ID } from '../../constants';

export function Loading(props: PanelProps): JSX.Element {
    const [accessToken, setAccessToken] = useRecoilState(accessTokenState);

    const requestUserAccessToken = () => {
        VKBridge.send('VKWebAppGetAuthToken', {
            app_id: APP_ID,
            scope: ''
        })
            .then(({ access_token }) => (
                setAccessToken(access_token)
            ))
            .catch(requestUserAccessToken);
    };

    useEffect(() => {
        if (!accessToken) {
            return;
        }

        router.replacePage(PageId.LOGIN);
    }, [accessToken]);

    useEffect(() => {
        requestUserAccessToken();
    }, []);

    return (
        <Panel
            {...props}
            centered
        >
            <Spinner/>
        </Panel>
    );
}
