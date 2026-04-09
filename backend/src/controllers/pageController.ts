import { Request, Response } from 'express';
import admin from 'firebase-admin';
import logger from '../middlewares/logger'; // Adicionando middleware de logger

const db = admin.firestore();
const pagesCollection = db.collection('pages');

// Função para validar dados da página
const validatePageData = (page: any): void => {
    if (!page.title || typeof page.title !== 'string') {
        throw new Error('O título da página é obrigatório e deve ser uma string.');
    }
    if (!page.content || typeof page.content !== 'string') {
        throw new Error('O conteúdo da página é obrigatório e deve ser uma string.');
    }
    // Adicione outras validações necessárias
};

// Função para criar uma nova página
export const createPage = async (req: Request, res: Response) => {
    try {
        const page = req.body;

        // Validação dos dados da página
        validatePageData(page);

        const docRef = await pagesCollection.add(page);
        const savedPage = await docRef.get();

        logger('info', `Página criada: ${docRef.id}`); // Adicionando log de criação de página
        res.status(201).send({ id: docRef.id, ...savedPage.data() });
    } catch (error: any) {
        logger('error', `Erro ao criar página: ${error.message}`); // Adicionando log de erro
        res.status(400).send({ error: error.message });
    }
};

// Função para obter todas as páginas
export const getPages = async (req: Request, res: Response) => {
    try {
        const snapshot = await pagesCollection.get();
        const pages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.send(pages);
    } catch (error: any) {
        logger('error', `Erro ao obter páginas: ${error.message}`); // Adicionando log de erro
        res.status(500).send({ error: error.message });
    }
};

// Função para obter uma página específica
export const getPage = async (req: Request, res: Response) => {
    try {
        const doc = await pagesCollection.doc(req.params.id).get();
        if (!doc.exists) {
            logger('error', `Página não encontrada: ${req.params.id}`); // Adicionando log de erro
            return res.status(404).send({ error: 'Página não encontrada' });
        }
        res.send({ id: doc.id, ...doc.data() });
    } catch (error: any) {
        logger('error', `Erro ao obter página: ${error.message}`); // Adicionando log de erro
        res.status(500).send({ error: error.message });
    }
};

// Função para atualizar uma página específica
export const updatePage = async (req: Request, res: Response) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'content'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Atualizações inválidas!' });
    }

    try {
        const docRef = pagesCollection.doc(req.params.id);
        const doc = await docRef.get();
        if (!doc.exists) {
            logger('error', `Página não encontrada: ${req.params.id}`); // Adicionando log de erro
            return res.status(404).send({ error: 'Página não encontrada' });
        }

        const page = doc.data();
        updates.forEach((update) => {
            if (page && update in page) {
                (page as any)[update] = req.body[update];
            }
        });
        await docRef.update(page!);

        logger('info', `Página atualizada: ${docRef.id}`); // Adicionando log de atualização de página
        res.send({ id: docRef.id, ...page });
    } catch (error: any) {
        logger('error', `Erro ao atualizar página: ${error.message}`); // Adicionando log de erro
        res.status(400).send({ error: error.message });
    }
};

// Função para deletar uma página específica
export const deletePage = async (req: Request, res: Response) => {
    try {
        const docRef = pagesCollection.doc(req.params.id);
        const doc = await docRef.get();
        if (!doc.exists) {
            logger('error', `Página não encontrada: ${req.params.id}`); // Adicionando log de erro
            return res.status(404).send({ error: 'Página não encontrada' });
        }
        await docRef.delete();

        logger('info', `Página deletada: ${docRef.id}`); // Adicionando log de deleção de página
        res.send({ id: docRef.id, ...doc.data() });
    } catch (error: any) {
        logger('error', `Erro ao deletar página: ${error.message}`); // Adicionando log de erro
        res.status(500).send({ error: error.message });
    }
};
