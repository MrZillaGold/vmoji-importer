import { useLaunchParams } from './launchParams';

import { Platform } from '../utils';

export function useIsWeb(): boolean {
    const { platform } = useLaunchParams();

    return platform === Platform.DESKTOP_WEB || platform === Platform.MOBILE_WEB;
}
