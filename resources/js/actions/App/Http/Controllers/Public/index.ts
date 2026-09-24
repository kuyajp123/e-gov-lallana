import LandingPageController from './LandingPageController'
import InquiryController from './InquiryController'
import LocaleController from './LocaleController'
import PublicAnnouncementController from './PublicAnnouncementController'
const Public = {
    LandingPageController: Object.assign(LandingPageController, LandingPageController),
InquiryController: Object.assign(InquiryController, InquiryController),
LocaleController: Object.assign(LocaleController, LocaleController),
PublicAnnouncementController: Object.assign(PublicAnnouncementController, PublicAnnouncementController),
}

export default Public