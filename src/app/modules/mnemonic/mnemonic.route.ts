import express from 'express'
import { MnemonicController } from './mnemonic.controller'
import { MnemonicValidations } from './mnemonic.validation'
import validateRequest from '../../middleware/validateRequest'
import auth from '../../middleware/auth'
import { USER_ROLES } from '../../../enum/user'

const router = express.Router()

router.get('/', auth(USER_ROLES.ADMIN), MnemonicController.getAllMnemonics)

router.get('/:id', auth(USER_ROLES.ADMIN), MnemonicController.getSingleMnemonic)

router.post(
  '/',
  auth(USER_ROLES.ADMIN),

  validateRequest(MnemonicValidations.create),
  MnemonicController.createMnemonic,
)

router.patch(
  '/:id',
  auth(USER_ROLES.ADMIN),

  validateRequest(MnemonicValidations.update),
  MnemonicController.updateMnemonic,
)

router.delete('/:id', auth(USER_ROLES.ADMIN), MnemonicController.deleteMnemonic)

export const MnemonicRoutes = router
