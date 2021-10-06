// core components/views
import KnowledgeBase from '../containers/knowledgebase/KnowledgeBase'
import Queries from '../containers/queries/Queries'
import Rules from '../containers/rules/Rules'
import Ontology from '../containers/ontology/Ontology'

const dashboardRoutes = [
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
    to: '/rules',
    navbarName: 'Redirect'
  }
]

export default dashboardRoutes
