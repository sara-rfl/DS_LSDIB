import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { Request, Response, NextFunction } from 'express';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

export function validateBody(schema: object) {
    const validate = ajv.compile(schema);
    return (req: Request, res: Response, next: NextFunction) => {
        if (!validate(req.body)) {
            const mensagem = ajv.errorsText(validate.errors, { separator: '; ' });
            const erro: any = new Error(mensagem);
            erro.status = 400;
            return next(erro);
        }
        next();
    };
}
