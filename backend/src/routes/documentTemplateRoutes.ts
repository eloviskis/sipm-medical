import { Router, Request, Response, NextFunction } from 'express';
import { createDocumentTemplate, getDocumentTemplates, getDocumentTemplate, updateDocumentTemplate, deleteDocumentTemplate } from '../controllers/documentTemplateController';
import { verifyFirebaseToken } from '../middlewares/verifyFirebaseToken';

const router = Router();

router.post('/document-templates', 
  verifyFirebaseToken,
  createDocumentTemplate
);

router.get('/document-templates', 
  verifyFirebaseToken,
  getDocumentTemplates
);

router.get('/document-templates/:id', 
  verifyFirebaseToken,
  getDocumentTemplate
);

router.patch('/document-templates/:id', 
  verifyFirebaseToken,
  updateDocumentTemplate
);

router.delete('/document-templates/:id', 
  verifyFirebaseToken,
  deleteDocumentTemplate
);

export default router;
