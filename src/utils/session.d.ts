import { Request, Response, NextFunction } from 'express';
export declare const generaToken: (userId: number) => string;
export declare const autenticaUtente: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=session.d.ts.map