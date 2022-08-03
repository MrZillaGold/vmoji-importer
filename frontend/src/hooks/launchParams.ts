import { useMemo } from 'react';

import { getLaunchParams } from '../utils';

export function useLaunchParams() {
    return useMemo(() => (
        getLaunchParams()
    ), []);
}
