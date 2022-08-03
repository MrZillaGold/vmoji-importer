import { Platform, usePlatform } from '@vkontakte/vkui';
import VKBridge from '@vkontakte/vk-bridge';

export function useTapticEngine() {
    const platform = usePlatform();

    const callTapticEngine = () => {
        const isTapticMethodSupports = VKBridge.supports('VKWebAppTapticSelectionChanged');

        if (isTapticMethodSupports && platform === Platform.IOS) {
            VKBridge.send('VKWebAppTapticSelectionChanged');
        }
    };

    return {
        callTapticEngine
    };
}
