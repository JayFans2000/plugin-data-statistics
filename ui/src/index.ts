import { definePlugin } from '@halo-dev/console-shared'
import SiteStatistics from './views/dataStatistics'
import UmamiStatistics from './views/umamiStatistics'
import GithubPin from './views/githubPin'
import GithubStats from './views/githubStats'
import GithubTopLangs from './views/githubTopLangs'
import GithubGraph from './views/githubGraph'

export default definePlugin({
  components: {},
  routes: [],
  extensionPoints: {
    'default:editor:extension:create': () => [
      SiteStatistics,
      UmamiStatistics,
      GithubPin,
      GithubStats,
      GithubTopLangs,
      GithubGraph
    ],
  },
})
