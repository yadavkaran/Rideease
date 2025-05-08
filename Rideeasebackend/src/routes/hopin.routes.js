import express from 'express';
import hopinController from '../controllers/hopinController.js';
const router = express.Router();

router.post('/carpool',hopinController.carpool);
router.post('/joincarpool',hopinController.joincarpool);
router.post('/getroutes',hopinController.maproute);
router.post('/review',hopinController.writeReview);
router.post('/getreview',hopinController.getReviewsGiven);
router.post('/activeride',hopinController.activeride);
router.post('/ridestatus',hopinController.updateridestatus);
router.post('/ridehistory',hopinController.ridehistory);
router.post('/search-active-rides', hopinController.searchActiveRides);

export default router;