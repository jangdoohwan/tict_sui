import RouterSection from '@/Layout/components/RouterSection'

export default {
  path: '/opensvc',
  name: 'opensvc-index',
  component: RouterSection,
  redirect: { name: 'OpenApiSvc' },
  children: [
    {
      path: 'openApi',
      name: 'OpenApiSvc',
      component: () => import('@/views/opensvc/OpenApiSvc.vue')
    },
    {
      path: 'openSvc',
      name: 'OpenSvc',
      component: () => import('@/views/opensvc/OpenSvc.vue')
    }
  ]

}
