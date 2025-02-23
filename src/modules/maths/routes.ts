import { quizController } from "./controller";
import { Router } from "express";

const router = Router();

router.post("/quiz", quizController);

export default router;