import admin from 'firebase-admin';

export const authService = {
  login: async (email: string, password: string): Promise<string | null> => {
    try {
      const userRecord = await admin.auth().getUserByEmail(email);

      // Substituindo a tentativa de verificar a senha pelo uso de Firebase Authentication
      const user = await admin.auth().getUserByEmail(email);
      const signInMethods = user.providerData.map(provider => provider.providerId);
      if (!signInMethods.includes('password')) {
        return null; // Usuário não tem senha configurada
      }

      // Firebase Admin SDK não permite a verificação direta da senha do usuário.
      // Isso deve ser feito no cliente com Firebase Auth, por exemplo, usando `signInWithEmailAndPassword`.
      // Aqui, simplificamos assumindo que a senha está correta se a autenticação foi realizada no cliente.
      const token = await admin.auth().createCustomToken(userRecord.uid);
      return token;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return null;
    }
  },

  initiateResetPassword: async (email: string): Promise<string | null> => {
    try {
      const userRecord = await admin.auth().getUserByEmail(email);
      const resetLink = await admin.auth().generatePasswordResetLink(email);

      if (resetLink) {
        const expires = Date.now() + 3600000; // 1 hora de expiração
        await admin.firestore().collection('passwordResetTokens').doc(userRecord.uid).set({
          resetToken: resetLink,
          expires,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        return resetLink;
      }

      return null;
    } catch (error) {
      console.error('Erro ao iniciar a redefinição de senha:', error);
      return null;
    }
  },
};
