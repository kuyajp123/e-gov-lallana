import householdMembers from './household-members'
import households from './households'
import residentProfiles from './resident-profiles'
const resources = {
    householdMembers: Object.assign(householdMembers, householdMembers),
households: Object.assign(households, households),
residentProfiles: Object.assign(residentProfiles, residentProfiles),
}

export default resources