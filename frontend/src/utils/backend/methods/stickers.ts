export interface StickersMethod {
    importToTelegram(params: {
        access_token: string;
    }): Promise<{
        link: string;
    }>;
}
