import { ReactNode } from 'react';
import { atom } from 'recoil';

export const snackbarState = atom<ReactNode | void>({
    key: 'snackbar',
    default: undefined
});
