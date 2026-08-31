import HouseholdController from './HouseholdController'
import HouseholdRegistrationController from './HouseholdRegistrationController'
import HouseholdMemberController from './HouseholdMemberController'
import HouseholdHeadTransferController from './HouseholdHeadTransferController'
const Household = {
    HouseholdController: Object.assign(HouseholdController, HouseholdController),
HouseholdRegistrationController: Object.assign(HouseholdRegistrationController, HouseholdRegistrationController),
HouseholdMemberController: Object.assign(HouseholdMemberController, HouseholdMemberController),
HouseholdHeadTransferController: Object.assign(HouseholdHeadTransferController, HouseholdHeadTransferController),
}

export default Household