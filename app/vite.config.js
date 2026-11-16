import {defineConfig} from 'vite';
import {fileURLToPath} from 'node:url';
const vendor=name=>fileURLToPath(new URL(`./vendor/${name}.js`,import.meta.url));
export default defineConfig({resolve:{alias:[{find:/^react$/,replacement:vendor('react')},{find:/^react-dom\/client$/,replacement:vendor('react-dom-client')},{find:/^react-dom$/,replacement:vendor('react-dom')}]}});
