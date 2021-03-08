// core components/views
import ConsumerSystems from '../containers/consumersystems/ConsumerSystems'
import KnowledgeBase from '../containers/knowledgebase/KnowledgeBase'
import Queries from '../containers/queries/Queries'

const dashboardRoutes = [
  {
    path: '/consumersystems',
    sidebarName: 'Consumer Systems',
    navbarName: 'Consumer Systems',
    //icon: Description,
    component: ConsumerSystems
  },
  {
    path: '/knowledgebase',
    sidebarName: 'Knowledge Base',
    navbarName: 'Knowledge Base',
    //icon: DeviceHub,
    component: KnowledgeBase
  },
  {
    path: '/queries',
    sidebarName: 'Queries',
    navbarName: 'Queries',
    //icon: DeviceHub,
    component: Queries
  }
]

export default dashboardRoutes
