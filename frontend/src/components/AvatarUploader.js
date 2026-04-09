import React, { useState } from "react";
import { Button } from "@mui/material";
import defaultAvatar from "../assets/images/defaultAvatar.png"; // Importando a imagem padrão

const AvatarUploader = ({ avatarUrl, onUpload }) => {
  const [preview, setPreview] = useState(avatarUrl || defaultAvatar); // Usando a imagem padrão

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        onUpload(reader.result); // Passa o arquivo carregado para o callback onUpload
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <img
        src={preview}
        alt="Avatar Preview"
        style={{ inlineSize: "100px", blockSize: "100px", borderRadius: "50%" }}
      />
      <input
        accept="image/*"
        style={{ display: "none" }}
        id="avatar-upload"
        type="file"
        onChange={handleFileChange}
      />
      <label htmlFor="avatar-upload">
        <Button variant="outlined" component="span">
          Upload Avatar
        </Button>
      </label>
    </div>
  );
};

export default AvatarUploader;
