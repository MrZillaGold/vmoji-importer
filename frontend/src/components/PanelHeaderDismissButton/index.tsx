import { PanelHeaderButton, PanelHeaderButtonProps } from '@vkontakte/vkui';
import { Icon24Dismiss } from '@vkontakte/icons';

export interface PanelHeaderDismissButtonProps extends PanelHeaderButtonProps {}

export function PanelHeaderDismissButton(props: PanelHeaderDismissButtonProps): JSX.Element {

    return (
        <PanelHeaderButton {...props}>
            <Icon24Dismiss/>
        </PanelHeaderButton>
    );
}
