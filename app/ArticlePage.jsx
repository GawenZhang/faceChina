import React from 'react';
import {articlePaths} from './product-article-data.mjs';
import CapturedPage from './CapturedPage.jsx';
import capturedArticles from './captured-articles.json';

// Every article retains its own live-captured structure and responsive styles.
// The generated HTML is sanitized; shared app interactions remain local.
export default function ArticlePage({index}){
 const page=capturedArticles[articlePaths[index]];
 if(!page)throw new Error('Missing verified article capture: '+articlePaths[index]);
 return <CapturedPage html={page.html} template="article" className={'captured-article '+page.className}/>;
}
