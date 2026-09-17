import AdminDashboardController from './AdminDashboardController'
import AdminDocumentRequestController from './AdminDocumentRequestController'
import AdminHouseholdController from './AdminHouseholdController'
import AdminResidentProfileController from './AdminResidentProfileController'
import AdminDocumentTypeController from './AdminDocumentTypeController'
import AdminStaffController from './AdminStaffController'
const Admin = {
    AdminDashboardController: Object.assign(AdminDashboardController, AdminDashboardController),
AdminDocumentRequestController: Object.assign(AdminDocumentRequestController, AdminDocumentRequestController),
AdminHouseholdController: Object.assign(AdminHouseholdController, AdminHouseholdController),
AdminResidentProfileController: Object.assign(AdminResidentProfileController, AdminResidentProfileController),
AdminDocumentTypeController: Object.assign(AdminDocumentTypeController, AdminDocumentTypeController),
AdminStaffController: Object.assign(AdminStaffController, AdminStaffController),
}

export default Admin