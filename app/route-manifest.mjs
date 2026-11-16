import {productArticleRoutes} from './product-article-data.mjs';
import {independentRoutes} from './independent-data.mjs';
import {extendedRoutes} from './extended-data.mjs';
export const existingRoutes = [
 {path:'/',title:'OxyHealth | Hyperbaric Chambers',template:'home'},
 {path:'/hyperbarics',title:'Understanding Hyperbaric Therapy | OxyHealth',template:'hyperbarics'},
 {path:'/resources',title:'Videos, News & Resources | OxyHealth',template:'resources'},
 {path:'/blog',title:'The OxyHealth Blog',template:'blog-list'},
 {path:'/events/a4m-longevity-fest',title:'OxyHealth at Longevityfest 2026',template:'event-detail'},
];
export const allRoutes = [...existingRoutes,...productArticleRoutes,...independentRoutes,...extendedRoutes];
export {productArticleRoutes,independentRoutes,extendedRoutes};
