import {ScullyConfig} from '@scullyio/scully';

/** this loads the default render plugin, remove when switching to something else. */
import '@scullyio/scully-plugin-puppeteer'

export const config: ScullyConfig = {
  maxRenderThreads: 4,
  projectRoot: "./src",
  projectName: "biz-landing",
  // add spsModulePath when using de Scully Platform Server,
  outDir: '/firebase/develop/dist/static',
  distFolder: './firebase/develop/dist/biz-landing',
  routes: {},
  extraRoutes: [
    '/pl/beeoclock',
    '/en/beeoclock',
    '/uk/beeoclock',
    '/da/beeoclock',
    '/beeoclock',
  ]
};
