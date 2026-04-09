import admin from 'firebase-admin';

export const mfaService = {
  enrollMfa: async (uid: string, phoneNumber: string): Promise<void> => {
    try {
      const userRecord = await admin.auth().getUser(uid);
      if (!userRecord) {
        throw new Error('Usuário não encontrado');
      }

      // Adiciona ou atualiza o número de telefone do usuário
      await admin.auth().updateUser(uid, {
        phoneNumber,
      });

      console.log('Número de telefone adicionado/atualizado para MFA');
    } catch (error) {
      console.error('Erro ao inscrever MFA:', error);
      throw error;
    }
  },

  verifyMfaToken: async (token: string): Promise<boolean> => {
    try {
      const sessionInfo = await admin.auth().verifySessionCookie(token);
      return sessionInfo ? true : false;
    } catch (error) {
      console.error('Erro ao verificar token MFA:', error);
      return false;
    }
  },
};
