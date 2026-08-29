import LandingPageController from './LandingPageController';
import InquiryController from './InquiryController';
import LocaleController from './LocaleController';
const Public = {
    LandingPageController: Object.assign(
        LandingPageController,
        LandingPageController,
    ),
    InquiryController: Object.assign(InquiryController, InquiryController),
    LocaleController: Object.assign(LocaleController, LocaleController),
};

export default Public;
