import { definePlugin } from '@halo-dev/ui-shared'
import SiteStatistics from './views/dataStatistics'
import UmamiStatistics from './views/umamiStatistics'
import GithubStatistics from './views/githubStatistics'

export default definePlugin({
  components: {},
  routes: [],
  extensionPoints: {
    'default:editor:extension:create': () => [
      SiteStatistics,
      UmamiStatistics,
      GithubStatistics
    ],
  },
})
