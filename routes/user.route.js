
import { Router } from "express";
import { getUsers } from "../services/user.service.js";
import { createUser } from "../services/user.service.js";

const router = Router();

router.get('/getUser', getUsers)
router.post('/createUser', createUser)

export default router;