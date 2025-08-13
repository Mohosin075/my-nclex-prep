import express from 'express';
import { StudymaterialController } from './studymaterial.controller';
import { StudymaterialValidations } from './studymaterial.validation';
import validateRequest from '../../middleware/validateRequest';
import auth from '../../middleware/auth';
import { USER_ROLES } from '../../../enum/user';


const router = express.Router();

router.get(
  '/',
  auth(
    USER_ROLES.ADMIN
  ),
  StudymaterialController.getAllStudymaterials
);

router.get(
  '/:id',
  auth(
    USER_ROLES.ADMIN
  ),
  StudymaterialController.getSingleStudymaterial
);

router.post(
  '/',
  auth(
    USER_ROLES.ADMIN
  ),

  validateRequest(StudymaterialValidations.create),
  StudymaterialController.createStudymaterial
);

router.patch(
  '/:id',
  auth(
    USER_ROLES.ADMIN
  ),

  validateRequest(StudymaterialValidations.update),
  StudymaterialController.updateStudymaterial
);

router.delete(
  '/:id',
  auth(
    USER_ROLES.ADMIN
  ),
  StudymaterialController.deleteStudymaterial
);

export const StudymaterialRoutes = router;