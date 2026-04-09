import React, { useEffect, useState } from "react";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import app from "../config/firebase.config";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Input,
} from "@mui/material";

const db = getFirestore(app);
const storage = getStorage(app);

const Customization = () => {
  const [theme, setTheme] = useState("");
  const [favicon, setFavicon] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchCustomization = async () => {
      try {
        const docRef = doc(db, "settings", "customization");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setTheme(docSnap.data().theme);
          setFavicon(docSnap.data().favicon);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        setError("Erro ao buscar customização");
        console.error("Erro ao buscar customização:", error);
      }
    };
    fetchCustomization();
  }, []);

  const handleThemeChange = (e) => {
    setTheme(e.target.value);
  };

  const handleFaviconChange = (e) => {
    if (e.target.files.length > 0) {
      setFavicon(e.target.files[0]);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      let faviconURL = favicon;
      if (favicon && typeof favicon !== "string") {
        const storageRef = ref(storage, `favicons/${favicon.name}`);
        await uploadBytes(storageRef, favicon);
        faviconURL = await getDownloadURL(storageRef);
      }
      await setDoc(doc(db, "settings", "customization"), {
        theme,
        favicon: faviconURL,
      });
      setSuccess("Customização atualizada com sucesso");
    } catch (error) {
      setError("Erro ao atualizar customização");
      console.error("Erro ao atualizar customização:", error);
    }
  };

  return (
    <Container maxWidth="md">
      <Box mt={4}>
            <Typography variant="h4" component="h1" gutterBottom>
              Personalização
            </Typography>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}
            <Box component="form" onSubmit={handleSave} mt={2}>
              <TextField
                label="Tema"
                value={theme}
                onChange={handleThemeChange}
                fullWidth
                margin="normal"
                required
              />
              <Input
                type="file"
                onChange={handleFaviconChange}
                fullWidth
                margin="normal"
                required
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Atualizar Customização
              </Button>
            </Box>
      </Box>
    </Container>
  );
};

export default Customization;
