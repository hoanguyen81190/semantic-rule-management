// core components/views
import ConsumerSystems from '../containers/consumersystems/ConsumerSystems'
import KnowledgeBase from '../containers/knowledgebase/KnowledgeBase'
import Queries from '../containers/queries/Queries'
import Rules from '../containers/rules/Rules'
import Ontology from '../containers/ontology/Ontology'

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
  },
  {
    path: '/rules',
    sidebarName: 'Rules',
    navbarName: 'Rules',
    //icon: DeviceHub,
    component: Rules
  },
  {
    path: '/ontology',
    sidebarName: 'Ontology',
    navbarName: 'Ontology',
    //icon: DeviceHub,
    component: Ontology
  },
  {
    redirect: true,
    path: '/',
    to: '/consumersystems',
    navbarName: 'Redirect'
  }
]

export default dashboardRoutes
