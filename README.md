#### Development server

Run `npm start` for a dev server. Navigate to `http://localhost:8080/`. The app will automatically reload if you change 
any of the source files.
* Use the `npm run start:prod` command for a production dev server.

#### Build

Run `npm run build` to build the project. The build artifacts will be stored in the `public/` directory.
* Use the `npm run build:prod` command for a production build.
* Use the `npm run build:sourcemap` command for a build with sourcemap.
* Use the `npm run build:prod:sourcemap` command for a production build with sourcemap.

#### Watch

Run `npm run watch` to watch the project. The build artifacts will be stored in the `public/` directory.
* Use the `npm run watch:prod` command for a production watch.
* Use the `npm run watch:sourcemap` command for a watch with sourcemap.
* Use the `npm run watch:prod:sourcemap` command for a production watch with sourcemap.

#### Linters

Run `npm run lint` to find problematic patterns or code that doesn’t adhere to certain style guidelines in the 
project. You can also use `npm run lint-fix` to fix them.


#### Code scaffolding

* Anchor - https://gitlab.com/izumi-it-company/webpack-iic/snippets/1874134
* LazyLoad - https://gitlab.com/izumi-it-company/webpack-iic/snippets/1873799

#### Here's an example how to use
<hr/>

##### How to configure html tracking

By default, html files are tracking in the `src` directory.

**webpack.config.js**
```javascript
const indexChunk = getHtmlWebpackPlugins( './src', 'html' );
const allHtmlChunk = [ ...indexChunk ];
```

For example, add tracking of html files in the `src/work` directory.

**webpack.config.js**
```javascript
const indexChunk = getHtmlWebpackPlugins( './src', 'html' );
const workChunk = getHtmlWebpackPlugins( './src/work', 'html' );
const allHtmlChunk = [ ...indexChunk, ...workChunk ];
``` 

##### Metatags description and keywords are in webpack.config.js in the variable DEFAULTS
```html
<meta name="description" content="<%= htmlWebpackPlugin.options.description %>">
<meta name="keywords" content="<%= htmlWebpackPlugin.options.keywords %>">
```
**webpack.config.js**
```javascript
const DEFAULTS = { description: 'description', keywords: 'keywords' };
```

##### How to use some library

Use commonJs or ES module

* CommonJs  
https://requirejs.org/docs/commonjs.html
* ES module  
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import  
https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export

For example, download *Swiper* `npm i swiper` and use them in js file.

```javascript
import Swiper from 'swiper';
const mySwiper = new Swiper('.swiper-container', { /* ... */ });
```

##### How to open development server on remote device

Paste `YOUR_LOCAL_IP` address to host property as string. Navigate to `http://YOUR_LOCAL_IP:8080/`  
Run `npm run ip` to see your local addresses

**webpack.config**
```javascript
/* devServer */
config.devServer = {
 contentBase: path.resolve(__dirname, './src'),
 host: 'YOUR_LOCAL_IP',
 port: 8080,
 stats: 'minimal',
 overlay: true,
 hot: IS_HOST,
 watchContentBase: true,
 open: true,
};
```
