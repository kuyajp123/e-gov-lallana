import AdminAuthController from './AdminAuthController'
import AdminDashboardController from './AdminDashboardController'
import AdminDocumentRequestController from './AdminDocumentRequestController'
import AdminHouseholdController from './AdminHouseholdController'
import AdminResidentProfileController from './AdminResidentProfileController'
import AdminDocumentTypeController from './AdminDocumentTypeController'
import AdminStaffController from './AdminStaffController'
import AdminAnnouncementController from './AdminAnnouncementController'
import AdminInquiryController from './AdminInquiryController'
import AdminQrScannerController from './AdminQrScannerController'
const Admin = {
    AdminAuthController: Object.assign(AdminAuthController, AdminAuthController),
AdminDashboardController: Object.assign(AdminDashboardController, AdminDashboardController),
AdminDocumentRequestController: Object.assign(AdminDocumentRequestController, AdminDocumentRequestController),
AdminHouseholdController: Object.assign(AdminHouseholdController, AdminHouseholdController),
AdminResidentProfileController: Object.assign(AdminResidentProfileController, AdminResidentProfileController),
AdminDocumentTypeController: Object.assign(AdminDocumentTypeController, AdminDocumentTypeController),
AdminStaffController: Object.assign(AdminStaffController, AdminStaffController),
AdminAnnouncementController: Object.assign(AdminAnnouncementController, AdminAnnouncementController),
AdminInquiryController: Object.assign(AdminInquiryController, AdminInquiryController),
AdminQrScannerController: Object.assign(AdminQrScannerController, AdminQrScannerController),
}

export default Admin