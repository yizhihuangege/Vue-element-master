import router from '@/router/index.js';

import { allRoutes,errorRoutes } from "@/router/allRoutes"


import { setAuth } from "./setAuth.js";
import bus from '@/plugin/box_bus';

const setRoutes=()=>{
  let path="/";
  let curRouter=[ ...allRoutes ];
  
  curRouter = setAuth(curRouter);
  //设置默认页
  path='game-config';

  let error = setAuth(errorRoutes);

  router.addRoutes(curRouter);
  router.addRoutes(error);

  
  setTimeout(()=>{
    bus.$emit("updateLoadingText", "页面载入完毕");
  },200)
  setTimeout(()=>{
    bus.$emit("unLoadAnime");
  },1000)

  return path;
}
export {setRoutes};

