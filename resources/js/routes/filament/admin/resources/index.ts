import documentRequests from './document-requests'
import documentTypes from './document-types'
import householdMembers from './household-members'
import households from './households'
import residentProfiles from './resident-profiles'
import staff from './staff'
const resources = {
    documentRequests: Object.assign(documentRequests, documentRequests),
documentTypes: Object.assign(documentTypes, documentTypes),
householdMembers: Object.assign(householdMembers, householdMembers),
households: Object.assign(households, households),
residentProfiles: Object.assign(residentProfiles, residentProfiles),
staff: Object.assign(staff, staff),
}

export default resources