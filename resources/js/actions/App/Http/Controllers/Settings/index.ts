import ProfileController from './ProfileController'
import SecurityController from './SecurityController'
import NotificationPreferenceController from './NotificationPreferenceController'
const Settings = {
    ProfileController: Object.assign(ProfileController, ProfileController),
SecurityController: Object.assign(SecurityController, SecurityController),
NotificationPreferenceController: Object.assign(NotificationPreferenceController, NotificationPreferenceController),
}

export default Settings