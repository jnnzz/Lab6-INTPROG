// @ts-nocheck
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
const port = Number(process.env.PORT) || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));

app.get("/", (_req, res) => {
  res.json({ message: "API is running" });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
