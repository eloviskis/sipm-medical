// src/routes/customization.ts
import { Router, Request, Response } from 'express';
import upload from '../upload';
import { Firestore } from '@google-cloud/firestore';

// Inicializar Firestore
const firestore = new Firestore();

const router = Router();

interface CustomizationBody {
  theme: string;
}

router.post('/customization', upload.single('favicon'), async (req: Request, res: Response) => {
  try {
    const { theme } = req.body as CustomizationBody;
    let faviconUrl = '';

    if (req.file) {
      // Se o arquivo favicon foi enviado, crie a URL do favicon
      faviconUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    // Atualizar Firestore com o tema e o favicon
    await firestore.collection('settings').doc('customization').set(
      {
        theme,
        ...(faviconUrl && { favicon: faviconUrl }),
      },
      { merge: true }
    );

    res.status(200).json({ message: 'Customização atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar customização:', error);
    res.status(500).json({ message: 'Erro ao atualizar customização' });
  }
});

export default router;
