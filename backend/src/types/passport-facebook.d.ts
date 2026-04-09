declare module 'passport-facebook' {
    import { Request } from 'express';
    import { Strategy as PassportStrategy } from 'passport';
    
    interface Profile {
        id: string;
        displayName: string;
        name?: {
            familyName: string;
            givenName: string;
            middleName?: string;
        };
        gender?: string;
        profileUrl?: string;
        emails?: Array<{ value: string }>;
        photos?: Array<{ value: string }>;
        provider: string;
        _raw: string;
        _json: any;
    }
    
    interface StrategyOption {
        clientID: string;
        clientSecret: string;
        callbackURL: string;
        passReqToCallback?: false;
        profileFields?: string[];
        enableProof?: boolean;
        authType?: string;
        display?: 'page' | 'popup' | 'touch' | 'wap';
    }
    
    interface StrategyOptionWithRequest extends Omit<StrategyOption, 'passReqToCallback'> {
        passReqToCallback: true;
    }
    
    interface VerifyFunction {
        (accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: any) => void): void;
    }
    
    interface VerifyFunctionWithRequest {
        (req: Request, accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: any) => void): void;
    }
    
    class Strategy extends PassportStrategy {
        constructor(options: StrategyOption, verify: VerifyFunction);
        constructor(options: StrategyOptionWithRequest, verify: VerifyFunctionWithRequest);
        name: string;
    }
}
