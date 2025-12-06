import React, { useState } from "react";
import Swal from "sweetalert2";
import { Button, TextField, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bcrypt from "bcryptjs";

const salt = bcrypt.genSaltSync(10);

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.name === "username") setUsername(e.target.value);
    if (e.target.name === "password") setPassword(e.target.value);
  };

  const login = async () => {
    const hashedPassword = bcrypt.hashSync(password, salt);

    try {
      const res = await axios.post("http://localhost:2000/login", {
        username,
        password: hashedPassword,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user_id", res.data.id);
      navigate("/dashboard");
    } catch (err) {
      const errorMessage = err?.response?.data?.errorMessage;
      if (errorMessage) {
        Swal.fire({ title: errorMessage, icon: 'error' });
      }
    }
  };

  return (
    <div style={{ marginTop: "200px" }}>
      <h2>Login</h2>

      <TextField
        type="text"
        name="username"
        value={username}
        onChange={handleChange}
        placeholder="User Name"
        required
        variant="outlined"
        margin="normal"
      />
      <br />
      <TextField
        type="password"
        name="password"
        value={password}
        onChange={handleChange}
        placeholder="Password"
        required
        variant="outlined"
        margin="normal"
      />
      <br />
      <Button
        variant="contained"
        color="primary"
        size="small"
        disabled={!username || !password}
        onClick={login}
        sx={{ mt: 2, mr: 2 }}
      >
        Login
      </Button>

      <Link
        component="button"
        underline="none"
        sx={{ fontFamily: "inherit", fontSize: "inherit" }}
        onClick={() => navigate("/register")}
      >
        Register
      </Link>
    </div>
  );
};

export default Login;
