// @ts-nocheck
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./_middleware/error-handler";
import accountsControler from "./accounts/accounts.controller";
import swaggerDocs from './_helpers/swagger';
import path from "path";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

const app = express();
// const port = Number(process.env.PORT) || 4000;
// const swaggerDocument = YAML.load(path.join(__dirname, "swagger.yaml"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(cors({origin: (origin, callback) => callback(null, true), credentials: true}));

app.use('/accounts', accountsControler);

app.use('api-docs', swaggerDocs);

app.use(errorHandler);

const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});


// app.get("/", (_req, res) => {
//   res.json({ message: "API is running" });
// });

// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// app.listen(port, () => {
//   console.log(`Server listening on http://localhost:${port}`);
// });
