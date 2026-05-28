import { Request, Response, NextFunction } from 'express';
import { obterUtente } from '../services/patientService';
import { getMedicoIdPorUtilizadorId } from '../services/doctorService';
import { guardarExame, listarExames, tipoExameExiste } from '../services/exameRepository';

export function submeter(req: Request, res: Response, next: NextFunction) {
    try {
        const { tipoExameId, data, resultado, observacoes } = req.body;
        const tipoExameIdNum = Number(tipoExameId)
        const utilizadorId = (req as any).utilizador.id;
        const medicoId = getMedicoIdPorUtilizadorId(utilizadorId);
        const utenteId = Number(req.params.id);
        obterUtente(utenteId);
        

        if (!data || typeof data !== 'string' || isNaN(Date.parse(data))) {
            const erro: any = new Error('Data é obrigatória e deve ser uma data válida');
            erro.status = 400;
            return next(erro);
        }
        
        if (!resultado || typeof resultado !== 'string') {
            const erro: any = new Error('Resultado é obrigatório e deve ser uma string');
            erro.status = 400;
            return next(erro);
        }
        
        if (observacoes && typeof observacoes !== 'string') {
            const erro: any = new Error('Observações deve ser uma string ou nula');
            erro.status = 400;
            return next(erro);
        }

        
    
        if (!Number.isInteger(tipoExameIdNum) || tipoExameIdNum <= 0) {
            const erro: any = new Error('Tipo de Exame é obrigatório e deve ser um número');
            erro.status = 400;
            return next(erro);
        }

        if (!tipoExameExiste(tipoExameIdNum)){
            const erro: any = new Error('O Id do tipo de exame deve existir')
            erro.status = 404;
            return next(erro);
        }

        guardarExame(utenteId, medicoId!, tipoExameIdNum, data, resultado, observacoes);

        res.status(201).json({ message: 'Exame submetido com sucesso' });   
    } catch (erro) { next(erro); }
    }


export function listar(req: Request, res: Response, next: NextFunction) {
    try {
        const utenteId = Number(req.params.id);
        obterUtente(utenteId);
        const exames = listarExames(utenteId);
        res.json(exames);
    } catch (erro) { next(erro); }
}