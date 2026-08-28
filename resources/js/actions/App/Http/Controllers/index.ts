import Public from './Public'
import Dev from './Dev'
import Settings from './Settings'
const Controllers = {
    Public: Object.assign(Public, Public),
Dev: Object.assign(Dev, Dev),
Settings: Object.assign(Settings, Settings),
}

export default Controllers