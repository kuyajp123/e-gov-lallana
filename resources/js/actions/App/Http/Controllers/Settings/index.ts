import ProfileController from './ProfileController'
import SecurityController from './SecurityController'
import NotificationPreferenceController from './NotificationPreferenceController'
import SystemSettingController from './SystemSettingController'
const Settings = {
    ProfileController: Object.assign(ProfileController, ProfileController),
SecurityController: Object.assign(SecurityController, SecurityController),
NotificationPreferenceController: Object.assign(NotificationPreferenceController, NotificationPreferenceController),
SystemSettingController: Object.assign(SystemSettingController, SystemSettingController),
}

export default Settings