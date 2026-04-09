import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Button, Container, Typography, Box, Alert, TextField, CircularProgress } from "@mui/material";
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { gapi } from "gapi-script";
import { Videocam as GoogleMeetIcon } from "@mui/icons-material"; // Ícone do Google Meet

// Configuração do Firebase
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Credenciais da API do Google
const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/calendar.events";

const Telemedicine = () => {
  const user = useSelector((state) => state.auth.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [eventLink, setEventLink] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const userWithTemporaryPermission = {
    ...user,
    permissions: user?.permissions ? [...user.permissions, "AccessTelemedicine"] : ["AccessTelemedicine"]
  };

  if (!userWithTemporaryPermission?.permissions?.includes("AccessTelemedicine")) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Alert severity="error">
          Acesso negado. Você não tem permissão para acessar esta funcionalidade.
        </Alert>
      </Container>
    );
  }

  const initClient = () => {
    gapi.load("client:auth2", () => {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      })
        .then(() => {
          const authInstance = gapi.auth2.getAuthInstance();
          if (authInstance) {
            setIsSignedIn(authInstance.isSignedIn.get());
            authInstance.isSignedIn.listen(setIsSignedIn);
          } else {
            setErrorMessage("Erro ao inicializar o cliente Google.");
          }
        })
        .catch((error) => {
          setErrorMessage("Erro ao inicializar o cliente Google: " + error);
        });
    });
  };

  useEffect(() => {
    initClient();
  }, []);

  const handleAuthClick = () => {
    const authInstance = gapi.auth2.getAuthInstance();
    if (authInstance) {
      authInstance.signIn();
    } else {
      setErrorMessage("Erro: instância de autenticação não está disponível.");
    }
  };

  const createEvent = async (patientEmail) => {
    setLoading(true);

    const event = {
      summary: "Sessão de Telemedicina",
      location: "Online",
      description: "Consulta online com o médico",
      start: {
        dateTime: new Date().toISOString(),
        timeZone: "America/Sao_Paulo",
      },
      end: {
        dateTime: new Date(new Date().getTime() + 30 * 60 * 1000).toISOString(),
        timeZone: "America/Sao_Paulo",
      },
      attendees: [{ email: patientEmail }],
      conferenceData: {
        createRequest: {
          requestId: "some-random-string",
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    };

    try {
      const response = await gapi.client.calendar.events.insert({
        calendarId: "primary",
        resource: event,
        conferenceDataVersion: 1,
        sendUpdates: "all",
      });

      setEventLink(response.result.hangoutLink);
    } catch (error) {
      setErrorMessage("Erro ao criar evento: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "patients"), where("name", "==", searchTerm));
      const querySnapshot = await getDocs(q);

      const patientsList = [];
      querySnapshot.forEach((doc) => {
        patientsList.push({ id: doc.id, ...doc.data() });
      });

      setPatients(patientsList);
    } catch (error) {
      console.error("Erro ao buscar pacientes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartCall = async (patientId, patientEmail) => {
    try {
      await createEvent(patientEmail);

      const docRef = doc(db, "telemedicineCalls", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Dados da chamada de telemedicina:", docSnap.data());
      } else {
        console.log("Nenhum dado encontrado para esta chamada.");
      }
    } catch (error) {
      setErrorMessage("Erro ao iniciar chamada: " + error.message);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Box sx={{ textAlign: "center", p: 3, bgcolor: "background.paper", borderRadius: 1, boxShadow: 1 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Telemedicina
        </Typography>

        {!isSignedIn ? (
          <Button variant="contained" color="primary" onClick={handleAuthClick}>
            Fazer Login com Google
          </Button>
        ) : (
          <>
            <TextField
              label="Buscar paciente"
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearch}
              disabled={loading || !searchTerm}
            >
              {loading ? <CircularProgress size={24} /> : "Procurar Paciente"}
            </Button>

            {patients.length > 0 && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Resultados da busca:
                </Typography>
                {patients.map((patient) => (
                  <Box key={patient.id} sx={{ mb: 2, p: 2, border: "1px solid #ccc", borderRadius: 1 }}>
                    <Typography variant="body1">
                      {patient.name}
                    </Typography>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleStartCall(patient.id, patient.email)}
                      sx={{ mt: 1 }}
                    >
                      Iniciar Chamada com {patient.name}
                    </Button>
                  </Box>
                ))}
              </Box>
            )}

            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={() => createEvent('paciente_email@gmail.com')}
              startIcon={<GoogleMeetIcon />}
            >
              Adicionar videoconferência do Google Meet
            </Button>

            {eventLink && (
              <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                Link da Sessão: <a href={eventLink} target="_blank" rel="noopener noreferrer">{eventLink}</a>
              </Typography>
            )}

            {errorMessage && (
              <Typography variant="body1" color="error" sx={{ mt: 2 }}>
                {errorMessage}
              </Typography>
            )}
          </>
        )}
      </Box>
    </Container>
  );
};

export default Telemedicine;
