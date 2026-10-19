import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'./tests/e2e',fullyParallel:false,workers:1,use:{baseURL:process.env.E2E_BASE_URL||'http://localhost:3000',trace:'retain-on-failure'},reporter:[['list'],['html',{open:'never'}]],projects:[320,375,390,768,1024,1440,1920].map(width=>({name:`width-${width}`,use:{viewport:{width,height:950}}}))});
