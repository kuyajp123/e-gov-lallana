import ProfileController from './ProfileController'
import ProfileAvatarController from './ProfileAvatarController'
const Resident = {
    ProfileController: Object.assign(ProfileController, ProfileController),
ProfileAvatarController: Object.assign(ProfileAvatarController, ProfileAvatarController),
}

export default Resident