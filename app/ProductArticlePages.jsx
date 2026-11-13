import React from 'react';
import Article from './ArticlePage.jsx';
import Product from './ProductPage.jsx';
import {articlePaths, productDetails} from './product-article-data.mjs';
import './product-article.css';

export default function ProductArticlePages({path}){
 const product=productDetails.find(p=>path==='/products/'+p.slug);
 if(product)return <Product product={product}/>;
 const index=articlePaths.indexOf(path);
 return index===-1?null:<Article index={index}/>;
}
