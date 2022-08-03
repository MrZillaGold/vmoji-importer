import { useLaunchParams } from './launchParams';

import { Platform } from '../utils';

export function useIsDesktop(): boolean {
    const { platform } = useLaunchParams();

    return platform === Platform.DESKTOP_WEB;
}
