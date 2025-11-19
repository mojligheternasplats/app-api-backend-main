import { Router } from 'express';
import newsRoutes from './news.routes';
import mediaRoutes from './media.routes';

const router = Router();

router.use('/news', newsRoutes);
router.use('/media', mediaRoutes);

export default router;
