import DocumentRequests from './DocumentRequests'
import DocumentTypes from './DocumentTypes'
import HouseholdMembers from './HouseholdMembers'
import Households from './Households'
import ResidentProfiles from './ResidentProfiles'
import Staff from './Staff'
const Resources = {
    DocumentRequests: Object.assign(DocumentRequests, DocumentRequests),
DocumentTypes: Object.assign(DocumentTypes, DocumentTypes),
HouseholdMembers: Object.assign(HouseholdMembers, HouseholdMembers),
Households: Object.assign(Households, Households),
ResidentProfiles: Object.assign(ResidentProfiles, ResidentProfiles),
Staff: Object.assign(Staff, Staff),
}

export default Resources