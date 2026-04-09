const patientsData = [
    {
        id: 1,
        isMedico: false,
        nome: 'João da Silva',
        nomeSocial: 'Joãozinho Silva',
        dataNascimento: '1985-07-15',
        idade: 39,
        sexo: 'Masculino',
        cpf: '123.456.789-00',
        nomeMae: 'Maria da Silva',
        telefone: '5511999999999',
        celular: '5511998888888',
        email: 'joao@example.com',
        cep: '12345-678',
        endereco: 'Rua das Flores',
        numero: '100',
        complemento: 'Apto 12',
        bairro: 'Centro',
        cidade: 'São Paulo',
        possuiConvenio: 'Unimed',
        estadoCivil: 'Solteiro(a)',
        filhos: 1,
        irmaos: 2,
        pessoasMorando: 4,
        moraCom: 'Esposa e filhos',
        moradia: 'Urbana',
        ocupacao: 'Autônomo',
        profissao: 'Designer Gráfico',
        nomeEmpresa: 'Design Criativo',
        nivelEscolar: 'Superior Completo',
        linkedin: 'https://linkedin.com/in/joao-da-silva',
        facebook: 'https://facebook.com/joaodesigner',
        instagram: 'https://instagram.com/joaodesigner',
        twitter: 'https://twitter.com/joaodesigner',
        tiktok: 'https://tiktok.com/@joaodesigner',
        raca: 'Branca',
        religiao: 'Católica',
        hasDebt: true,
        photoUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
        avatarUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
        hasTelemedicine: true,
        meetLink: 'https://meet.google.com/fake-meet-link-1',
        especialidade: 'Cardiologia',
        servico: 'Consulta de rotina',
        modalidade: 'Presencial',
        tempoPrevisto: 30,
        ultimaAtualizacao: '2023-07-15',
        lastConsultationDate: '2024-08-11',
        medicoResponsavel: 'Dr. João Silva',
        comoNosConheceu: 'Indicação de um amigo',
        encaminhadoPor: 'Dr. Pedro Almeida',
        contatosUrgencia: [
            { nome: 'Maria Silva', telefone: '5511987654321', parentesco: 'Esposa' }
        ],
        tipoUsuario: 'paciente',
        setorTrabalho: 'Design Gráfico',
        ensinoSuperior: 'Sim',
        logoEmpresa: 'https://logo-placeholder.com/empresa1.png',
        historico: [
            { descricao: "Paciente submetido a exame de sangue", data: "12/09/2023" },
            { descricao: "Prescrito: Paracetamol - 2 unidades por 7 dias", data: "11/09/2023" },
            { descricao: "Paciente submetido a ultrassom abdominal", data: "10/09/2023" }
        ],
        exames: [
            { nome: "exame_sangue.pdf", data: "12/09/2023", descricao: "Exame de sangue completo" },
            { nome: "ultrassom_abdomen.pdf", data: "10/09/2023", descricao: "Ultrassom do abdômen" },
            { nome: "raio_x_torax.pdf", data: "08/09/2023", descricao: "Raio-X do tórax" }
        ],
        prescricoes: [
            { medicamento: "Paracetamol", quantidade: "2", dias: "7" }
        ],
        soap: {
            subjetivo: "",
            objetivo: "",
            avaliacao: "",
            plano: ""
        },
        encaminhamentos: [
            { especialidade: "Neurologista", motivo: "Avaliação de dor de cabeça persistente." }
        ],
        atestados: [
            { diasAfastamento: 7, justificativa: "Afastamento necessário para recuperação de cirurgia." }
        ],
        relatorios: [
            { relatorioMedico: "Paciente apresenta quadro de melhora significativa." }
        ],
        recibos: [
            { descricao: "Consulta de Cardiologia", valor: "R$ 300,00", data: "15/09/2023" },
            { descricao: "Exame de Sangue", valor: "R$ 80,00", data: "14/09/2023" }
        ],
        appointments: [
            {
                date: '24/11/2024',
                time: '09:00',
                patient: 'João da Silva',
                consultation: 'Consulta de Rotina',
                status: 'Confirmado',
                color: 'green'
            },
            {
                date: '25/12/2024',
                time: '10:30',
                patient: 'João da Silva',
                consultation: 'Consulta de Emergência',
                status: 'Pendente',
                color: 'red'
            }
        ]
    },
    {
        id: 2,
        isMedico: false,
        nome: 'Maria Oliveira',
        nomeSocial: 'Mariazinha Oliveira',
        dataNascimento: '1990-05-12',
        idade: 34,
        sexo: 'Feminino',
        cpf: '987.654.321-11',
        nomeMae: 'Clara Souza',
        telefone: '5511976543212',
        celular: '5511977543212',
        email: 'carlos@example.com',
        cep: '54321-876',
        endereco: 'Rua das Palmeiras',
        numero: '234',
        complemento: 'Apto 3',
        bairro: 'Vila Nova',
        cidade: 'Rio de Janeiro',
        possuiConvenio: 'Amil',
        estadoCivil: 'Casado(a)',
        filhos: 2,
        irmaos: 1,
        pessoasMorando: 4,
        moraCom: 'Esposa e filhos',
        moradia: 'Urbana',
        ocupacao: 'Professor',
        profissao: 'Professor de História',
        nomeEmpresa: 'Escola Estadual',
        nivelEscolar: 'Mestrado',
        linkedin: 'https://linkedin.com/in/carlos-souza',
        facebook: 'https://facebook.com/carlos.souza',
        instagram: 'https://instagram.com/carlos.souza',
        twitter: 'https://twitter.com/carlossouza',
        raca: 'Pardo',
        religiao: 'Evangélico',
        hasDebt: false,
        photoUrl: 'https://randomuser.me/api/portraits/men/2.jpg',
        avatarUrl: "https://randomuser.me/api/portraits/men/2.jpg",
        hasTelemedicine: true,
        meetLink: 'https://meet.google.com/fake-meet-link-2',
        especialidade: 'Psiquiatria',
        servico: 'Acompanhamento psicológico',
        modalidade: 'Remoto',
        tempoPrevisto: 45,
        ultimaAtualizacao: '2023-08-12',
        lastConsultationDate: '2024-07-20',
        medicoResponsavel: 'Dra. Ana Lima',
        comoNosConheceu: 'Publicidade no Google',
        encaminhadoPor: 'Dr. Ricardo Oliveira',
        contatosUrgencia: [
            { nome: 'Carlos Oliveira', telefone: '5511976543210', parentesco: 'Marido' }
        ],
        tipoUsuario: 'paciente',
        setorTrabalho: 'Direito',
        ensinoSuperior: 'Sim',
        logoEmpresa: 'https://logo-placeholder.com/empresa2.png',
        historico: [
            { descricao: "Paciente submetido a exame de pele", data: "20/08/2023" }
        ],
        exames: [
            { nome: "exame_pele.pdf", data: "20/08/2023", descricao: "Exame de pele" }
        ],
        prescricoes: [
            { medicamento: "Cetoconazol", quantidade: "1", dias: "10" }
        ],
        soap: {
            subjetivo: "Paciente relata coceira intensa na pele.",
            objetivo: "Presença de erupções na pele.",
            avaliacao: "Dermatite de contato.",
            plano: "Iniciar tratamento com antifúngico."
        },
        appointments: [
            {
                date: '26/11/2024',
                time: '11:00',
                patient: 'Maria Oliveira',
                consultation: 'Acompanhamento psicológico',
                status: 'Confirmado',
                color: 'green'
            }
        ]
    },
    {
        id: 3,
        isMedico: false,
        nome: 'Roberta Mendes',
        nomeSocial: 'Roberta Silva',
        dataNascimento: '1995-11-23',
        idade: 28,
        sexo: 'Feminino',
        cpf: '789.123.456-00',
        nomeMae: 'Lucia Mendes',
        telefone: '5511976541234',
        celular: '5511977541234',
        email: 'roberta@example.com',
        cep: '54321-456',
        endereco: 'Avenida Paulista',
        numero: '900',
        complemento: 'Apto 10',
        bairro: 'Jardim Paulista',
        cidade: 'São Paulo',
        possuiConvenio: 'Bradesco Saúde',
        estadoCivil: 'Solteiro(a)',
        filhos: 0,
        irmaos: 1,
        pessoasMorando: 1,
        moraCom: 'Sozinha',
        moradia: 'Urbana',
        ocupacao: 'Desenvolvedora de Software',
        profissao: 'Engenheira de Software',
        nomeEmpresa: 'Tech Solutions',
        nivelEscolar: 'Superior Completo',
        linkedin: 'https://linkedin.com/in/roberta-mendes',
        facebook: 'https://facebook.com/roberta.mendes',
        instagram: 'https://instagram.com/roberta.mendes',
        twitter: 'https://twitter.com/roberta_mendes',
        raca: 'Parda',
        religiao: 'Agnóstica',
        hasDebt: false,
        photoUrl: 'https://randomuser.me/api/portraits/women/3.jpg',
        avatarUrl: 'https://randomuser.me/api/portraits/women/3.jpg',
        hasTelemedicine: true,
        meetLink: 'https://meet.google.com/fake-meet-link-3',
        especialidade: 'Dermatologia',
        servico: 'Consulta Dermatológica',
        modalidade: 'Remoto',
        tempoPrevisto: 30,
        ultimaAtualizacao: '2023-11-15',
        lastConsultationDate: '2024-02-15',
        medicoResponsavel: 'Dr. Carlos Mendes',
        comoNosConheceu: 'Indicação de um amigo',
        encaminhadoPor: 'Dr. Pedro Almeida',
        contatosUrgencia: [
            { nome: 'Lucia Mendes', telefone: '5511977654321', parentesco: 'Mãe' }
        ],
        tipoUsuario: 'paciente',
        setorTrabalho: 'Tecnologia',
        ensinoSuperior: 'Sim',
        logoEmpresa: 'https://logo-placeholder.com/empresa3.png',
        historico: [
            { descricao: 'Paciente realizou consulta dermatológica', data: '12/10/2023' }
        ],
        exames: [],
        prescricoes: [
            { medicamento: 'Cetoconazol', quantidade: '1', dias: '10' }
        ],
        soap: {
            subjetivo: '',
            objetivo: '',
            avaliacao: '',
            plano: ''
        },
        appointments: [
            {
                date: '28/12/2024',
                time: '14:00',
                patient: 'Roberta Mendes',
                consultation: 'Consulta Dermatológica',
                status: 'Confirmado',
                color: 'green'
            }
        ]
    },
    // Médico 7
    {
        id: 7,
        isMedico: true,
        nome: 'Dr. Mariana Lopes',
        nomeSocial: 'Mariana Lopes',
        dataNascimento: '1982-05-05',
        idade: 42,
        sexo: 'Feminino',
        cpf: '987.321.456-99',
        telefone: '5511987654325',
        celular: '5511988765435',
        email: 'dramariana@example.com',
        crm: '456123-SP',
        cnpj: '12.456.789/0001-11',
        nomeClinica: 'Clínica Lopes',
        logoClinica: 'https://logo-placeholder.com/clinica4.png',
        photoUrl: 'https://randomuser.me/api/portraits/women/7.jpg',
        avatarUrl: 'https://randomuser.me/api/portraits/women/7.jpg',
        endereco: 'Rua das Figueiras',
        numero: '80',
        complemento: '',
        bairro: 'Centro',
        cidade: 'Belo Horizonte',
        estadoCivil: 'Casado(a)',
        especialidade: 'Pediatria',
        moradia: 'Urbana',
        tempoPrevisto: 40,
        ultimaAtualizacao: '2023-08-12',
        comoNosConheceu: 'Indicação de paciente',
        encaminhadoPor: 'Dr. Pedro Lopes',
        contatosUrgencia: [
            { nome: 'Carlos Lopes', telefone: '5511987654326', parentesco: 'Esposo' }
        ],
        tipoUsuario: 'medico',
        setorTrabalho: 'Saúde',
        ensinoSuperior: 'Sim',
        logoEmpresa: 'https://logo-placeholder.com/clinica4.png',
        historico: [
            { descricao: 'Atendimento pediátrico realizado', data: '12/08/2023' }
        ],
        recibos: [
            { descricao: 'Consulta Pediátrica', valor: 'R$ 350,00', data: '12/08/2023' }
        ],
        appointments: [
            {
                date: '27/11/2024',
                time: '10:00',
                patient: 'Dr. Mariana Lopes',
                consultation: 'Consulta Pediátrica',
                status: 'Confirmado',
                color: 'green'
            }
        ]
    },
    {
        id: 8,
        isMedico: true,
        nome: 'Dr. Thiago Santos',
        nomeSocial: 'Thiago Santos',
        dataNascimento: '1975-04-30',
        idade: 49,
        sexo: 'Masculino',
        cpf: '654.987.321-88',
        telefone: '5511987654327',
        celular: '5511988765437',
        email: 'drthiago@example.com',
        crm: '654321-RJ',
        cnpj: '22.345.678/0001-22',
        nomeClinica: 'Clínica Santos',
        logoClinica: 'https://logo-placeholder.com/clinica5.png',
        photoUrl: 'https://randomuser.me/api/portraits/men/8.jpg',
        avatarUrl: 'https://randomuser.me/api/portraits/men/8.jpg',
        endereco: 'Rua das Laranjeiras',
        numero: '120',
        complemento: '',
        bairro: 'Zona Sul',
        cidade: 'Rio de Janeiro',
        estadoCivil: 'Divorciado(a)',
        especialidade: 'Neurologia',
        moradia: 'Urbana',
        tempoPrevisto: 50,
        ultimaAtualizacao: '2023-09-05',
        comoNosConheceu: 'Indicação de paciente',
        encaminhadoPor: 'Dr. Ricardo Oliveira',
        contatosUrgencia: [
            { nome: 'Maria Santos', telefone: '5511987654328', parentesco: 'Filha' }
        ],
        tipoUsuario: 'medico',
        setorTrabalho: 'Saúde',
        ensinoSuperior: 'Sim',
        logoEmpresa: 'https://logo-placeholder.com/clinica5.png',
        historico: [
            { descricao: 'Consulta neurológica realizada', data: '05/09/2023' }
        ],
        recibos: [
            { descricao: 'Consulta Neurológica', valor: 'R$ 500,00', data: '05/09/2023' }
        ],
        appointments: [
            {
                date: '28/09/2024',
                time: '09:00',
                patient: 'Dr. Thiago Santos',
                consultation: 'Consulta Neurológica',
                status: 'Confirmado',
                color: 'green'
            }
        ]
    },
    {
        id: 9,
        isMedico: true,
        nome: 'Dra. Fernanda Ribeiro',
        nomeSocial: 'Fernanda Ribeiro',
        dataNascimento: '1985-08-15',
        idade: 39,
        sexo: 'Feminino',
        cpf: '789.654.321-66',
        telefone: '5511987654329',
        celular: '5511988765439',
        email: 'drafernanda@example.com',
        crm: '789123-MG',
        cnpj: '34.567.890/0001-33',
        nomeClinica: 'Clínica Ribeiro',
        logoClinica: 'https://logo-placeholder.com/clinica6.png',
        photoUrl: 'https://randomuser.me/api/portraits/women/9.jpg',
        avatarUrl: 'https://randomuser.me/api/portraits/women/9.jpg',
        endereco: 'Rua das Palmeiras',
        numero: '200',
        complemento: '',
        bairro: 'Centro',
        cidade: 'Belo Horizonte',
        estadoCivil: 'Casado(a)',
        especialidade: 'Ginecologia',
        moradia: 'Urbana',
        tempoPrevisto: 60,
        ultimaAtualizacao: '2023-10-01',
        comoNosConheceu: 'Indicação de um amigo',
        encaminhadoPor: 'Dra. Ana Souza',
        contatosUrgencia: [
            { nome: 'João Ribeiro', telefone: '5511987654320', parentesco: 'Esposo' }
        ],
        tipoUsuario: 'medico',
        setorTrabalho: 'Saúde',
        ensinoSuperior: 'Sim',
        logoEmpresa: 'https://logo-placeholder.com/clinica6.png',
        historico: [
            { descricao: 'Atendimento ginecológico realizado', data: '01/10/2023' }
        ],
        recibos: [
            { descricao: 'Consulta Ginecológica', valor: 'R$ 400,00', data: '01/10/2023' }
        ],
        appointments: [
            {
                date: '29/09/2024',
                time: '16:00',
                patient: 'Dra. Fernanda Ribeiro',
                consultation: 'Consulta Ginecológica',
                status: 'Confirmado',
                color: 'green'
            }
        ]
    }
];

export default patientsData;
