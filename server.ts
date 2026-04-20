// @ts-nocheck
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

const app = express();
const port = Number(process.env.PORT) || 4000;
const swaggerDocument = YAML.load(path.join(__dirname, "swagger.yaml"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));

app.get("/", (_req, res) => {
  res.json({ message: "API is running" });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
