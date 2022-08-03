import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import {
    View,
    VKCOM,
    ModalRoot,
    PanelHeader,
    SplitCol,
    SplitLayout,
    usePlatform
} from '@vkontakte/vkui';
import { useLocation, useRouter } from '@happysanta/router';

import { Imported } from './modals';
import { Creating } from './popouts';
import { Loading, Login, Preview } from './panels';

import { ModalId, PanelId, PopoutId, ViewId } from './router';

import { popoutState, snackbarState } from './store';

const popouts = new Map<PopoutId, JSX.Element>([
    [PopoutId.CREATING, <Creating key={PopoutId.CREATING}/>]
]);

export function Layout(): JSX.Element {
    const router = useRouter();
    const platform = usePlatform();
    const location = useLocation();

    const [popout] = useRecoilState(popoutState);
    const [, setSnackbar] = useRecoilState(snackbarState);

    const back = () => {
        router.popPage();
    };

    useEffect(() => {
        const popout = location.getPopupId();

        if (popout) {
            setSnackbar();
        }
    }, [location]);

    const isDesktop = platform === VKCOM;

    return (
        <SplitLayout
            modal={
                <ModalRoot
                    activeModal={location.getModalId()}
                    onClose={back}
                >
                    <Imported
                        nav={ModalId.IMPORTED}
                        onClose={back}
                        dynamicContentHeight
                    />
                </ModalRoot>
            }
            popout={popouts.get(location.getPopupId() as PopoutId) || popout || undefined}
            header={
                !isDesktop && (
                    <PanelHeader separator={false}/>
                )
            }
        >
            <SplitCol animate={false}>
                <View
                    nav={ViewId.MAIN}
                    history={
                        !location.hasOverlay() ?
                            location.getViewHistory(ViewId.MAIN)
                            :
                            []
                    }
                    activePanel={location.getViewActivePanel(ViewId.MAIN)!}
                >
                    <Login nav={PanelId.LOGIN}/>
                    <Loading nav={PanelId.LOADING}/>
                    <Preview nav={PanelId.PREVIEW}/>
                </View>
            </SplitCol>
        </SplitLayout>
    );
}
