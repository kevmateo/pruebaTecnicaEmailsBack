
import { Router } from "express";
import { createEmail, deleteEmail, getEmails, updateEmail, searchByEmail } from "../services/email.service.js";

const router = Router();

router.get('/getEmail', getEmails)
router.post('/createEmail', createEmail)
router.put('/updateEmail/:id', updateEmail) 
router.delete('/DeleteEmail/:id', deleteEmail)
router.get('/getEmailFiltered', searchByEmail)
export default router;