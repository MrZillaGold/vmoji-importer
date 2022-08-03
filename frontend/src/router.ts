import { Page, Router } from '@happysanta/router';

export enum PageId {
    LOADING = '/',
    HOME = '/home',
    LOGIN = '/login',
    PREVIEW = '/preview'
}

export enum PanelId {
    HOME = 'home',
    LOGIN = 'login',
    LOADING = 'loading',
    PREVIEW = 'preview'
}

export enum ViewId {
    MAIN = 'main'
}

export enum ModalId {
    IMPORTED = 'imported'
}

export enum PopoutId {
    CREATING = 'creating'
}

const routes = {
    [PageId.HOME]: new Page(PanelId.HOME, ViewId.MAIN),
    [PageId.LOGIN]: new Page(PanelId.LOGIN, ViewId.MAIN),
    [PageId.LOADING]: new Page(PanelId.LOADING, ViewId.MAIN),
    [PageId.PREVIEW]: new Page(PanelId.PREVIEW, ViewId.MAIN)
};

export const router = new Router(routes);

router.start();
