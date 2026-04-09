import React, { useState } from "react";
import { Button } from "@mui/material";

const CompanyLogoUploader = ({ logoUrl, onUpload }) => {
  const [preview, setPreview] = useState(logoUrl || "");

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
        src={preview || "/path/to/default-logo.png"}
        alt="Logo Preview"
        style={{
          inlineSize: "100px",
          blockSize: "100px",
          borderRadius: "10px",
        }}
      />
      <input
        accept="image/*"
        style={{ display: "none" }}
        id="logo-upload"
        type="file"
        onChange={handleFileChange}
      />
      <label htmlFor="logo-upload">
        <Button variant="outlined" component="span">
          Upload Logo
        </Button>
      </label>
    </div>
  );
};

export default CompanyLogoUploader;
