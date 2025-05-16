import { Router } from "express";

const router = Router();

router.post("/");

router.patch("/:listId");

router.delete("/:listId");

router.post("/:listId/todos");

export default router;
