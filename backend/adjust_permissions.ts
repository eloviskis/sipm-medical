import { promises as fs } from 'fs';

const adjustPermissions = async (filePath: string): Promise<void> => {
    try {
        await fs.chmod(filePath, 0o755);
        console.log('Permissões ajustadas com sucesso!');
    } catch (error) {
        console.error('Erro ao ajustar permissões:', error);
        throw new Error(`Falha ao ajustar permissões para o arquivo: ${filePath}`);
    }
};

// Caminho para o arquivo cujo as permissões serão ajustadas
const filePath = './node_modules/.bin/tsc';

// Chamada para ajustar permissões
adjustPermissions(filePath)
    .then(() => console.log('Processo concluído com sucesso'))
    .catch(error => console.error('Erro no processo:', error));
