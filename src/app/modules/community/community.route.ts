import express from 'express';
import { CommunityController } from './community.controller';
import { createCommunitySchema, updateCommunitySchema } from './community.validation';
import validateRequest from '../../middleware/validateRequest';
import auth from '../../middleware/auth';
import { USER_ROLES } from '../../../enum/user';


const router = express.Router();

router.get(
  '/',
  CommunityController.getAllCommunitys
);

router.get(
  '/:id',
  CommunityController.getSingleCommunity
);

router.post(
  '/',
  auth(
    USER_ROLES.ADMIN,  USER_ROLES.STUDENT, USER_ROLES.TEACHER, USER_ROLES.GUEST
  ),
  
  validateRequest(createCommunitySchema),
  CommunityController.createCommunity
);

router.patch(
  '/:id',
  auth(
    USER_ROLES.ADMIN,  USER_ROLES.STUDENT, USER_ROLES.TEACHER, USER_ROLES.GUEST
  ),

  validateRequest(updateCommunitySchema),
  CommunityController.updateCommunity
);

router.delete(
  '/:id',
  auth(
    USER_ROLES.ADMIN, USER_ROLES.STUDENT, USER_ROLES.TEACHER, USER_ROLES.GUEST
  ),
  CommunityController.deleteCommunity
);

export const CommunityRoutes = router;