import {ScullyConfig} from '@scullyio/scully';

/** this loads the default render plugin, remove when switching to something else. */
import '@scullyio/scully-plugin-puppeteer'

export const config: ScullyConfig = {
  maxRenderThreads: 2,
  projectRoot: "./src",
  projectName: "biz-landing",
  // add spsModulePath when using de Scully Platform Server,
  outDir: './dist/static',
  routes: {},
  extraRoutes: [
    '/pl',
    '/en',
    '/uk',
    '/da',
  ]
};
