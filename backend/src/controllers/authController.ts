import { Request, Response } from 'express';
import { authService } from '../services/authService'; // Certifique-se de que o authService está usando Firebase Authentication

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Chama o serviço para fazer login utilizando Firebase Authentication
    const token = await authService.login(email, password);
    if (!token) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    // Chama o serviço para iniciar o processo de redefinição de senha utilizando Firebase Authentication
    const resetToken = await authService.initiateResetPassword(email);
    if (!resetToken) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Enviar e-mail para o usuário com o token de redefinição
    res.json({ message: 'Token de redefinição enviado para o e-mail' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao solicitar redefinição de senha' });
  }
};

export const checkAuth = async (req: Request, res: Response) => {
  res.json({ message: 'Autenticado com sucesso!' });
};
