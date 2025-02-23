import express from "express";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/errorHandler";
import mathsRoutes from "./modules/maths/routes";
import authRoutes from "./modules/auth/routes";
import quizRoutes from "./modules/quiz/routes";
const cors = require("cors");

dotenv.config();

export class Server {
  private app: express.Application;
  private port: number;

  constructor(port: number) {
    this.port = port;
    this.app = express();
  }

  private enableMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cors());
  }
  private enableRoutes() {
    this.app.use("/api/auth", authRoutes);
    this.app.use("/api/quiz", quizRoutes);
    this.app.use("/api/maths", mathsRoutes);
    this.app.use(errorHandler);
  }

  public startApp() {
    this.enableMiddlewares();
    this.enableRoutes();
    this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }
}
