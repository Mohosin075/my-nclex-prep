import { UserRoutes } from '../app/modules/user/user.route'
import { AuthRoutes } from '../app/modules/auth/auth.route'
import express, { Router } from 'express'
import { NotificationRoutes } from '../app/modules/notifications/notifications.route'
import { PublicRoutes } from '../app/modules/public/public.route'
import { SupportRoutes } from '../app/modules/support/support.route'
import { OnboardingscreenRoutes } from '../app/modules/onboardingscreen/onboardingscreen.route'
import { CommunityRoutes } from '../app/modules/community/community.route'
import { ReviewRoutes } from '../app/modules/review/review.route'
import { StudymaterialRoutes } from '../app/modules/studymaterial/studymaterial.route'
import { StudyscheduleRoutes } from '../app/modules/studyschedule/studyschedule.route'
import { LessonRoutes } from '../app/modules/lesson/lesson.route'

const router = express.Router()

const apiRoutes: { path: string; route: Router }[] = [
  { path: '/user', route: UserRoutes },
  { path: '/auth', route: AuthRoutes },

  { path: '/notifications', route: NotificationRoutes },

  { path: '/public', route: PublicRoutes },

  { path: '/support', route: SupportRoutes },
  { path: '/onboardingscreen', route: OnboardingscreenRoutes },
  { path: '/community', route: CommunityRoutes },
  { path: '/review', route: ReviewRoutes },
  { path: '/studymaterial', route: StudymaterialRoutes },
  { path: '/studyschedule', route: StudyscheduleRoutes },
  { path: '/lesson', route: LessonRoutes },
]

apiRoutes.forEach(route => {
  router.use(route.path, route.route)
})

export default router
