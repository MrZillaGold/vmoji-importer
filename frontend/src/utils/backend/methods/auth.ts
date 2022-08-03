export interface AuthMethod {
    exchangeSilentAuthToken(params: {
        token: string;
        uuid: string;
    }): Promise<{
        access_token: string;
    }>;
}
