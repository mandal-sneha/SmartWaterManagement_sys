import { Router } from 'express';
import { middleware } from '../middleware/auth.middleware.js';
import { createPayment, confirmPayment, getPaymentHistory } from '../controllers/payment.controller.js';

const router = Router();

router.post('/create-payment-intent', middleware, createPayment);
router.post('/confirm-payment', middleware, confirmPayment);
router.get('/:waterId/history', middleware, getPaymentHistory);

export default router;