import express from "express";
import whatsappRoutes from "./routes/whatsapp.routes.js";

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api", whatsappRoutes);

export default app;