declare module 'passport-linkedin-oauth2' {
    import { Request } from 'express';
    import { Strategy as PassportStrategy } from 'passport';

    interface Profile {
        id: string;
        displayName: string;
        name?: {
            familyName: string;
            givenName: string;
        };
        emails?: Array<{ value: string }>;
        photos?: Array<{ value: string }>;
        provider: string;
        _raw: string;
        _json: any;
    }

    interface StrategyOptions {
        clientID: string;
        clientSecret: string;
        callbackURL: string;
        scope?: string[];
        state?: boolean;
        passReqToCallback?: false;
    }

    interface StrategyOptionsWithRequest extends Omit<StrategyOptions, 'passReqToCallback'> {
        passReqToCallback: true;
    }

    interface VerifyFunction {
        (accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: any) => void): void;
    }

    interface VerifyFunctionWithRequest {
        (req: Request, accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: any) => void): void;
    }

    class Strategy extends PassportStrategy {
        constructor(options: StrategyOptions, verify: VerifyFunction);
        constructor(options: StrategyOptionsWithRequest, verify: VerifyFunctionWithRequest);
        name: string;
    }
}
