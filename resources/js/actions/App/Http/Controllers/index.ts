import Public from './Public'
import DashboardController from './DashboardController'
import Resident from './Resident'
import Household from './Household'
import Dev from './Dev'
import Settings from './Settings'
const Controllers = {
    Public: Object.assign(Public, Public),
DashboardController: Object.assign(DashboardController, DashboardController),
Resident: Object.assign(Resident, Resident),
Household: Object.assign(Household, Household),
Dev: Object.assign(Dev, Dev),
Settings: Object.assign(Settings, Settings),
}

export default Controllers