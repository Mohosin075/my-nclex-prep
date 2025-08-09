import express from 'express';
import { ReviewController } from './review.controller';
import auth from '../../middleware/auth';
import { USER_ROLES } from '../../../enum/user';
import validateRequest from '../../middleware/validateRequest';
import { ReviewValidations } from './review.validation';

const router = express.Router();

router.post('/',auth(USER_ROLES.STUDENT,USER_ROLES.GUEST,USER_ROLES.ADMIN, USER_ROLES.CUSTOMER, USER_ROLES.ADMIN),validateRequest(ReviewValidations.create), ReviewController.createReview);
router.get('/:type',auth(USER_ROLES.STUDENT,USER_ROLES.GUEST,USER_ROLES.ADMIN, USER_ROLES.CUSTOMER, USER_ROLES.ADMIN), ReviewController.getAllReviews);
router.patch('/:id',auth(USER_ROLES.STUDENT,USER_ROLES.GUEST,USER_ROLES.ADMIN, USER_ROLES.CUSTOMER, USER_ROLES.ADMIN),validateRequest(ReviewValidations.update), ReviewController.updateReview);
router.delete('/:id',auth(USER_ROLES.STUDENT,USER_ROLES.GUEST,USER_ROLES.ADMIN, USER_ROLES.CUSTOMER, USER_ROLES.ADMIN), ReviewController.deleteReview);

export const ReviewRoutes = router;
