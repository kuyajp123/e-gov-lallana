import verify from './verify'
const publicMethod = {
    verify: Object.assign(verify, verify),
}

export default publicMethod