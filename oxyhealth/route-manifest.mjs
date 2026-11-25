import {productArticleRoutes} from './product-article-data.mjs';
import {independentRoutes} from './independent-data.mjs';
import {extendedRoutes} from './extended-data.mjs';
export const existingRoutes = [
 {path:'/',title:'macy-pan | Hyperbaric Chambers',template:'home'},
 {path:'/hyperbarics',title:'Understanding Hyperbaric Therapy | macy-pan',template:'hyperbarics'},
 {path:'/resources',title:'Videos, News & Resources | macy-pan',template:'resources'},
 {path:'/blog',title:'The macy-pan Blog',template:'blog-list'},
 {path:'/events/a4m-longevity-fest',title:'macy-pan at Longevityfest 2026',template:'event-detail'},
];
export const allRoutes = [...existingRoutes,...productArticleRoutes,...independentRoutes,...extendedRoutes];
export {productArticleRoutes,independentRoutes,extendedRoutes};
