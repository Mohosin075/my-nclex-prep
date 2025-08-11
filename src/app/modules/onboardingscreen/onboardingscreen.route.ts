import express from 'express';
import { OnboardingscreenController } from './onboardingscreen.controller';
import validateRequest from '../../middleware/validateRequest';
import auth from '../../middleware/auth';
import { USER_ROLES } from '../../../enum/user';
import { createOnboardingSchema, updateOnboardingSchema } from './onboardingscreen.validation';
import fileUploadHandler from '../../middleware/fileUploadHandler';
import { fileAndBodyProcessor, fileAndBodyProcessorUsingDiskStorage } from '../../middleware/processReqBody';


const router = express.Router();

router.get(
  '/',
  OnboardingscreenController.getAllOnboardingscreens
);

router.get(
  '/:id',
  OnboardingscreenController.getSingleOnboardingscreen
);

router.post(
  '/',
  auth(
    USER_ROLES.ADMIN
  ),
  
  fileAndBodyProcessorUsingDiskStorage(),
  OnboardingscreenController.createOnboardingscreen
);


router.delete(
  '/:id',
  auth(
    USER_ROLES.ADMIN
  ),
  OnboardingscreenController.deleteOnboardingscreen
);

export const OnboardingscreenRoutes = router;