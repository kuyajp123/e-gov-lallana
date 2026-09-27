import LandingPageController from './LandingPageController'
import InquiryController from './InquiryController'
import LocaleController from './LocaleController'
import PublicAnnouncementController from './PublicAnnouncementController'
import PublicDocumentVerificationController from './PublicDocumentVerificationController'
const Public = {
    LandingPageController: Object.assign(LandingPageController, LandingPageController),
InquiryController: Object.assign(InquiryController, InquiryController),
LocaleController: Object.assign(LocaleController, LocaleController),
PublicAnnouncementController: Object.assign(PublicAnnouncementController, PublicAnnouncementController),
PublicDocumentVerificationController: Object.assign(PublicDocumentVerificationController, PublicDocumentVerificationController),
}

export default Public