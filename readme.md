Experimental Project for Scaffolding React Application

Created for the sole purpose to learn modern JavaScript Tooling.

## Table of Contents
- [Installation](#installation)
- [Dev Instructions](#dev-instructions)
    - [Initialize npm project and git Repository](#init)
    - [Setup Webpack](#setup-webpack)
    - [Setup Babel](#setup-babel)
    - [Add React](#add-react)
    - [Setup CSS](#setup-css)
    - [Setup Test with Jest](#setup-jest)
    - [Setup Linter](#setup-linter)
    - [Git Hooks](#git-hooks)
    - [Check for Accessiblity Issues](#a11y-issues)
	- [Miscellanous Settings](#misc-settings)

## Installation
```
git clone https://github.com/fshaikh/scaffold-react-app.git
cd scaffold-react-app
npm install
npm run dev -- Development build
npm run build - Production build
npm run dev-hot - Development build with Hot reloadings
```

## Dev Instructions
This describes how to create a React app boilerplate from scratch. For all scenarios we will always be using create-react-app.  This is more of an educational venture to really understand how to create something like create-react-app  from scratch. Along the way we will learn various concepts/tools like:
   git
   Github
   npm
   Webpack
   Babel
   React
   ESLint
Hopefully at the end of this, we will have a clear understanding of how these tools come together to create  a working software. We will also try and create some kind of a VS Code plugin "Create React App" which has a similar experience to VS Studio for scaffolding a new React App.

Let's get started !!


### Initialize npm project and git Repository
```
mkdir react-boilerplate
cd react-boilerplate
npm init
		○ Answer the questions
git init
		○  -Initialize a git repository
Add package.json to git repo
		○ git add package.json
git commit -m "Initial Commit"
```

### Setup Webpack
This section describes how to use webpack.

#### Install webpack
```
npm install webpack webpack-cli --save-dev
	- Webpack executable is available under node_modules/.bin/webpack
```
#### Create default bundle
Webpack follows a certain convention wherein no config files or other changes are required to produce bundles. Here we will see how webpack works with its defaults by creating a default bundle
	• mkdir src
	• Create "index.js" under "src" and put a simple console.log
	• Run webpack to create a default bundle
	  -  node_modules/.bin/webpack
		○ This will create a "dist" folder and with main.js file which is minified
		○ By default, webpack looks for "index.js" under "src" directory and creates a bundle in "dist" folder with "main.js"
		○ By default, webpack produces "production" build
	• Run the code
		node dist/main.js
	• Instead of always calling node_modules/.bin/webpack to execute webpack, we can create a scripts tag in package.json as below:
	scripts:{
	    "build": "webpack"
	}
By default, npm will resolve the commands in scripts tag to node_modules/.bin

#### webpack configuration file
	• Create a file "webpack.config.base.js" in project root
	• Add the following contents where we explicitly define entry and output
		const path = require('path');
		module.exports = {
		    entry: './src/index.js',
		    output: {
		             path: path.join(__dirname, 'dist'),
		             filename: 'app.bundle.js'
		    }
		};
		
		entry = relative path to entry file
		output - object which contains setting for output
			path - Must be an absolute path to where we want to output the files. path.join will create the absolute path
filename - output file name

#### Dev and Prod Configs
In real-world applications, one will have settings specific to dev/prod environments. If we follow the approach of having separate dev/prod configs, we should remove any duplications of settings and have only environment-specific settings in each config. For eg: we can have all common settings in a base configuration, define environment settings in each dev/prod config files and then merge the base settings.

	• npm i -D webpack-merge
	• Define all common settings in webpack.config.base.js file
	• Create separate config files for dev and prod:
		○  webpack.config.dev.js - For Dev
		const merge = require('webpack-merge');
		const BaseConfig = require('./webpack.config.base');
		• 
		module.exports = merge(BaseConfig, {
		       mode: 'development'
		});
		
		○  webpack.config.production.js - For Prod
		const merge = require('webpack-merge');
		const BaseConfig = require('./webpack.config.base');
		
		module.exports = merge(BaseConfig, {
		      mode: 'production'
		});
		
	• Create separate scripts for dev and production builds by passing the appropriate config file
	"build": "webpack --config webpack.config.production.js",
	"dev"  : "webpack --config webpack.config.dev.js"
By default, webpack produces "production" build. This can be configured by using "mode" setting. The supported values of mode are: 'production' , 'development'

#### Using webpack dev server and watch mode
	In create-react-app, on running npm run start, we see the following behaviour:
		• Build is executed
		• Webpack starts in watch mode
			○ Any changes done to the source code are automatically detected and build executes
		• React app is launched in a browser at a specified port
		• React app is served from a http location rather than a file location
	
	Let's achieve the same behaviour in our scaffolding project by following the steps below:
	
		○ npm i -D webpack-dev-server
		○ Make the following changes in webpack.config.dev.js
			const merge = require('webpack-merge');
			const BaseConfig = require('./webpack.config.base');
			
			module.exports = merge(BaseConfig, {
			        mode: 'development',
			        devServer: {
			            port: 3030
			        }
			});
		We are specifying a custom port where the React app will be served from
		○ Add "dev" script in package.json:
		"dev": " webpack-dev-server --open --config webpack.config.dev.js"
npm run dev

### Setup Babel
In modern applications, we would like to use the latest ES6 features. For eg: in our src/index.js, if we use features such as arrow functions, template strings, etc, using the current setup, these features will be emitted as is in the bundle. In order to compile these ES6 features to ES5, we will need to setup Babel. We will then add babel support into webpack so that the bundle file has the transpiled code.

#### Install Babel
	• npm install babel-cli babel-preset-env rimraf --save-dev
		○ babel-cli - Babel package which installs babel-core and other babel packages
		○ babel-preset-env - Babel preset for all ES6 and ESnext features. Instead of installing individual features via plugins, a preset is a collection of related plugins. This preset replaces all previous babel presets (babel-preset-2015, babel-preset-es2016, babel-preset-es2017 ,etc)
	• Create .babelrc file with the following content:
	    {
	      "presets": ["env"]
        }
	      - .babelrc is Babel's configuration file in which we can define all cli arguments. For eg: here we are defining env preset which will be used by babel when compiling source files
	
	NOTE: To see Babel in action, do the following:
			§ On command prompt, run: node_modules/.bin/babel ./src/index.js
This should output the ES5 code.

#### Setup Babel in webpack
To use Babel as part of our webpack setup, we will need to configure webpack loaders. Loader is how webpack learns new things.  Loaders are a key concept in Webpack . Loaders are used to load/process files. Anytime Webpack encounters JS/CSS files, it will invoke the appropriate loader and process the files

	• npm i -D babel-loader
	• Add 'module' property in webpack.config.js. This is used to define loaders in webpack
	module: {
	  rules: [
	   {
	      test: /\.(js|jsx)$/,
	      loader: 'babel-loader',
	      exclude: /node_modules/,
	   }
	 ]
	}
	We are defining babel-loader to process all *.js and *.jsx files and ignoring node_modules folder
	• npm run build
	The bundle will now have transpiled code since we are invoking babel as part of our webpack process.
	
	NOTE: If you encounter the following error when running "npm run build":
	Error: Cannot find module '@babel/core'
	 babel-loader@8 requires Babel 7.x (the package '@babel/core'). If you'd like to use Babel 6.x ('babel-core'), you should install 'babel-loader@7'.
	
		○ npm uninstall babel-loader
		○ npm I -D babel-loader@7
npm run build


### Add React
So far we have not written any React code or configured any react-related settings. This section will include the changes to work with React

#### Install React
	• npm i -S react react-dom prop-types
	• Add following 2 files under 'src' 
	
	App.js - Defines a simple React class component
	import React from 'react';
	class App extends React.Component {
	constructor(props){
	       super(props);
	}
	
	render(){
	    return (
	          <div>Hello {this.props.message}</div>
	        )
	   }
	}
	export default App;
	
	Index.js - Entry point for React app which mounts App component using ReactDOM
	import React from 'react';
	import ReactDOM from 'react-dom';
	
	import App from './App';
	
	ReactDOM.render(<App message='React Sacffolding'/>, 
	                document.querySelector('#app'));
	
	• npm run build
	We should get the error:
	
	ERROR in ./src/index.js
	Module build failed (from ./node_modules/babel-loader/lib/index.js):
	SyntaxError: C:/Development/React/react-boilerplate/src/index.js: Unexpected token (6:16)
	
	  4 | import App from './App';
	  5 |
	> 6 | ReactDOM.render(<App message='React Scaffolding'/>,
	    |                                         ^
	  7 |                 document.querySelector('#app'));
	
As can be seen above, Babel is unable to compile the JSX syntax where it first encounters it in <App ….>.  So we will need to configure a new preset in babel which allows babel to compile JSX

#### Setup Babel to compile JSX
	• npm i -D babel-preset-react   
	• Add the react preset in .babelrc
	{
	"presets": ["env", "react"]
	}
	• npm run build
	This should work now and the entire react code and compiled code should be in the bundle.
	
	NOTE:
	For Babel > 7.0:
	• npm i -D @babel/preset-react
	• .babelrc
	{
	    "presets": ["env", "@babel/preset-react"]
}

#### Create index.html to host React app
Since we are building a React app, we will need index.html to host our app. We will be using webpack to generate the file.
	• npm i -D html-webpack-plugin
                 -  html-webpack-plugin is a Webpack plugin. To know more about plugins, refer: 
	• Configure plugin in webpack.config.js
       const HtmlWebpackPlugin = require('html-webpack-plugin');
       plugins: [
            new HtmlWebpackPlugin()
       ]
	• npm run build
           This should now create "index.html" in "dist" folder. Our "dist" folder now has the JS bundle and index.html
	<!DOCTYPE html>
	<html>
	  <head>
	    <meta charset="UTF-8">
	    <title>Webpack App</title>
	  </head>
	  <body>
	    <script type="text/javascript" src="app.bundle.js"></script>
	     </body>
	</html>
	Webpack has added the app.bundle.js as a script tag in the generated index.html file. However, we will not be able to launch React app since we do not have a <div> to mount our React component. As you can see above, the <body> does not have any <div> tag. In our React code, we do
	ReactDOM.render(<App message='React Sacffolding'/>,    document.querySelector('#app'));
	We require a HTML element with id "app" so that React can render our App component on the element. Let's do that next.
	
	• Create a template index.html file under 'src'. We will add all our required content here and instruct Webpack plugin to use this html as the template to inject the JS bundle
	<!DOCTYPE html>
	<html>
	<head>
	<meta charset="utf-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title>React Scaffolding</title>
	</head>
	<body>
	<div id="app"></div>
	</body>
	</html>
	
	• Configure options for HtmlWebpackPlugin. We are using  "template" option to specify the location of our html template
	plugins: [
	   new HtmlWebpackPlugin({
	         template: './src/index.html'
	    })
	]
	• npm run build
Open the index.html from dist and you should now see the React app running

#### Debugging with source-map
We now have a working React setup with the app being launched in browser in watch mode. Let's see what the debugging experience looks like. Open App.js and add a "debugger" statement in render function.   Open Chrome DevTools (pressing F12) and hit refresh to relaunch the app.
![](https://github.com/fshaikh/scaffold-react-app/blob/master/images/Debugging1.png)

As you can see , our debugger is hit in the render function as expected. However, the code we are looking at is the code generated by webpack build. For e.g.: _createClass function instead of ES6 class which we write during development. For a better debugging experience, it would be better if we can debug our code in the browser. Enter Source Maps
   Source Maps provide a mapping between transformed file and original source file. Add the following setting in webpack.config.dev.js to enable source map: 
devtool: 'source-map'

Now when you hit the debugger in Chrome DevTools, you will see the original source code for debugging.
![](https://github.com/fshaikh/scaffold-react-app/blob/master/images/Debugging2.png)

You can see the source map added in the bundle JS : 
//# sourceURL=webpack:///./src/index.js?

For further reading please see : https://bendyworks.com/blog/getting-started-with-webpack-source-maps

#### Using Proposed JS Features
Let's convert our App component to be a simple Counter component where user can increment/decrement the counter value. 

class App extends React.Component {
    constructor(props){
       super(props);

       
       this.state = {
          counter: 0
       }
       this.increment = this.increment.bind(this);
}

increment() {
     this.setState(prevState => ({counter: prevState.counter + 1}));
}

render(){
    return (
       <React.Fragment>
         <div>Counter Example</div>
         <h3>{this.state.counter}</h3>
         <button onClick={this.increment} >+</button>
       </React.Fragment>
    )
  }
}
export default App;

In this example we are defining state in the constructor and explicitly binding the "increment" function to ensure "this" is correctly set to App instance.  Instead we can make use of new JavaScript Proposal namely: Property Initializer syntax.  This is usually preferred by React community for cleaner React components.
![](https://github.com/fshaikh/scaffold-react-app/blob/master/images/ProposedFeatures.png)


We will need to use babel plugin to enable support for the above syntax. If we try to build the new syntax , the build will fail with the following error.
![](https://github.com/fshaikh/scaffold-react-app/blob/master/images/ProposedFeatures-Error.png)
npm i -D babel-plugin-transform-class-properties
	• Add the new plugin in .babelrc:
	   "plugins": ["transform-class-properties"]
	• npm run dev


NOTE: Instructions when using Babel >= 7
	• npm i -D @babel/plugin-proposal-class-properties
	• Add the new plugin in .babelrc:
	   "plugins": ["@babel/plugin-proposal-class-properties"]
	• npm run dev

References: https://www.fullstackreact.com/articles/use-property-initializers-for-cleaner-react-components/

#### React hot loading
	• npm i react-hot-loader
	• Add the following to .babelrc:
	"plugins": ["react-hot-loader/babel"]
	• Add following to the component which needs to be hot reloaded. In our case App.jsx
		○ import { hot } from 'react-hot-loader/root'
		○ export default hot(App);
	• Create a new script dev-hot in package.json:
	"dev": " webpack-dev-server --open --config webpack.config.dev.js",
	"dev-hot": "npm run dev -- --hot"
	• npm run dev-hot
	

References: https://github.com/gaearon/react-hot-loader

### Setup CSS
	• Install CSS Loaders
	 npm i -D style-loader css-loader
	• Configure loaders in webpack.config.base.js
	{
	  test: /\.css$/,
	  loader: ['style-loader', 'css-loader'],
	  exclude: /node_modules/,
	}
	
	• Add CSS files in your project
	• Import CSS files in entry JS file.
			import './app.css';
			 
	• npm run dev
		NOTE: You can see in the above steps that we haven’t included css files in index.html. The loaders inject the CSS in <style> tags in HTML file
		 
Run webpack in production mode to minify CSS files
### Setup Test with Jest
We will be using Jest to write and run our tests. Jest is recommended to be used with React

#### Install Jest
npm  i -D jest-cli jest

#### Write and run tests
By convention, Jest will look for tests in "__tests__" directory or files with "*.spec.js" or "test.js" extensions. We can either create a separate "__tests__" directory and place all our tests there or co-locate them with  the component being tested.

Let's follow the approach of co-locating the test file. Name the test file as "App.test.js"
import React from 'react';
import App from './App';

describe("Run App tests", ()=>{
   it("should run App test", () => {
     expect(true).toEqual(true);
   })
});

Add test script in package.json
"test": "jest"

Run : npm run test
This will run the tests and should display that all tests have passed
![](https://github.com/fshaikh/scaffold-react-app/blob/master/images/ProposedFeatures-Error.png)

#### Testing React Components
We will be using react-testing-library is used for testing React components. Works with Jest and can be used as a replacement for Enzyme

	• npm i -D react-testing-library jest-dom
	• Add testSetup.js file to root directory which will contain code which applies to all Jest test files.
	
	import 'jest-dom/extend-expect'
	import 'react-testing-library/cleanup-after-each'
	
	• Add jest.config.js to root directory. This is the configuration file for Jest
	module.exports = {
	setupTestFrameworkScriptFile: '<rootDir>/testSetup.js'
	}
	
	• Changes App.spec.js as below:
	import React from 'react';
	import App from './App';
	import { render } from 'react-testing-library'
	
	describe("Run App tests", ()=>{
	    it("should run App test", () => {
	       render(<App />)
	    })
	});
    npm run test

#### Mocking assets
When testing components which import css/scss or other static assets like images, Jest tests will fail since Jest cannot understand how to import CSS/images. This section explains the steps to make tests work with such components

	• Create a folder __mocks__ in root directory
	• Create 2 files as described below:
			§ __mocks__/styleMock.js
				□ module.exports = {};
			§ __mocks__/fileMock.js
				□ module.exports = 'test-file-stub';
	• Add "moduleNameMapper" in jest.config.js as below:
	moduleNameMapper: {
	"\\.(css|less|sass|scss)$": "<rootDir>/__mocks__/styleMock.js",
	"\\.(gif|ttf|eot|svg|png)$": "<rootDir>/__mocks__/fileMock.js"
	}
	• npm run test

References:
https://github.com/facebook/jest/issues/3094

### Setup Linter
Linter is a code quality tool that analyses your code without executing it to find common JS errors. Common JS Linters are: ESLint, JSLint , JSHint, TSLint . We will be using ESLint. ESLint allows writing custom rules which can be shared within a team.

![](https://github.com/fshaikh/scaffold-react-app/blob/master/images/eslint-arch.png)

A ESLint Plugin is a set of custom rules.  It is usually installed as a NPM package. The name format is "eslint-plugin-<name>"

#### Setup ESLint
	• npm i -D eslint eslint-plugin-react eslint-plugin-babel
		○ eslint - Core package
		○ eslint-plugin-react - ESLint plugin for React rules
		○ eslint-plugin-babel - ESLint plugin for Proposal JS Features
	• npx eslint --init
		○ Prompts a series of questions
		○ Creates a ESLint configuration file .eslintrc.json
	• Add "lint" script in package.json
		"lint": "eslint ./"
		./ tells eslint to lint all our JavaScript files
	• Add .eslintignore file to add directories/files to ignore 
		dist
		webpack.config.base.js
		webpack.config.dev.js
		webpack.config.production.js
		jest.config.js
		testSetup.js
		
	• Add following in .eslintrc.json
	"extends": ["eslint:recommended", "plugin:react/recommended"],
	"parser": "babel-eslint",
	"plugins": [
	    "react"
	],
	"settings": {
	  "react" : {
	    "version": "16.7.0"
	  }
	}
	Add the following under "env" section to lint the test files 
	"jest": true
npm run lint

#### Detect Deprecated React APIs
React has deprecated some APIswhich will eventually be removed, so it makes sense to avoid them in new code and move away from them in existing code.  There are 2 approaches:
	• ESLint React plugin can help in detecting these deprecated APIs when running lint on our React code.
	• Using <React.StrictMode>
	StrictMode is a tool for highlighting potential problems in an application. Like Fragment, StrictMode does not render any visible UI. It activates additional checks and warnings for its descendants.
	In index.js:
	ReactDOM.render(<React.StrictMode><App message='React Scaffolding'/></React.StrictMode>, 
	document.querySelector('#app'));
	
We are wrapping our entire React app in <React.StrictMode> which will detect all the potential problems and show them as warnings in Dev Console. They will be ignored in production build.
![](https://github.com/fshaikh/scaffold-react-app/blob/master/images/reactdeprecatedapis.png)
	
	References:
	https://github.com/yannickcr/eslint-plugin-react#configuration
	https://astexplorer.net/
	https://reactjs.org/docs/strict-mode.html


### Git Hooks
A git hook is a script that git will run at specific time. For e.g.: before/after commit. Typical use cases for using git hooks are to ensure code quality, code consistency, tests being passed. In this section, we will setup a pre-commit git hook which will run linter and tests. If any of them fail, the commit will not be done

	• npm i -D husky
		○ Husky is a npm package which makes it easy to work with git hooks. https://github.com/typicode/husky
	• In package.json, create a separate section for husky
	"husky": {
	   "hooks": {
	     "pre-commit": "npm run lint && npm run test"
	   }
	},
	• When we do a git commit, husky will run the lint and test hooks and prevent the commit if any of them fail

### Check for Accessiblity Issues
This section describes various ways of checking for Accessibility issues in our React application.
#### Using ESLint
ESLint is great at catching potential bugs in our code, but we can also use it to detect accessibility issues. Since we are using JSX for our markup, we can use ESLint to check our markup for potential     accessibility issues based on static analysis of the code.

	• npm i -D eslint-plugin-jsx-a11y
		○  This is the accessibility plugin that's going to check our JSX for potential accessibility issues
	• Make the following chagnges to .eslintrc.json
	"plugins": [
	     ….
	     "jsx-a11y"
	],
	"extends": [
	    …
	    "plugin:jsx-a11y/recommended"
	]
	• npm run lint

#### Using react-axe
The jsx-a11y lint plugin is a great first line of defence to prevent accessibility issues, but no tool can cover everything. React-axe gives us a runtime check on our rendered DOM, and by adding it to our boilerplate, we’ll ensure that all our future projects have accessibility covered from multiple angles. . There may be issues that aren't detectable until the app has finished rendering. We should add a way to detect issues in the browser.

	• npm i -D react-axe
	• index.js
      if (process.env.NODE_ENV === 'development') {
          const axe = require('react-axe')
          axe(React, ReactDOM, 1000)
      }
		○ Run axe only in development mode by checking for process.env.NODE_ENV environment variable which will be set by webpack. 
		○ We are passing  in React, ReactDOM and a delay (1000 ms). We'll give it one second to render, and then it'll run this evaluation and look for accessibility violations in our rendered DOM.

	• npm run dev
Open Dev Tools and check for potential accessibility issues.
![](https://github.com/fshaikh/scaffold-react-app/blob/master/images/react-axe.png)
NOTE: react-axe does not get included in the production build.

#### Using assistive technology
We'll never be able to detect all accessibility issues without testing our app using assistive technology like screen readers. This is beyond the scope of this article.

### Miscellanous Settings
#### Inspect bundle with Webpack bundle analyzer
Bundles generated by our application need to be analyzed for their sizes. Production bundles are what we will ship to our customers and the bundle size can have significant impact on performance. Minification and compressing will help reduce latency to download the JavaScript files, however, its the parsing and compiling of our JavaScript code that needs to be considered for better performance. This can be done by analyzing our app bundles to ensure that we are not shipping bloated code. 
In this section we will see how to analyze our bundles to look for potential bloats. We will be using webpack-bundle-analyzer npm package.

```
npm i -D webpack-bundle-analyzer
```

In webpack.config.production.js, add the plugin:
```
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
module.exports = merge(BaseConfig, {
    plugins: [
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            reportFilename: 'appBundle_Analyzer.html'
        })
    ]
});
```
This will create a report html file as configured in reportFileName in 'dist' folder. 

```
npm run build
```
This will do production build and open the report in browser.
![](https://github.com/fshaikh/scaffold-react-app/blob/master/images/webpack-bundle-analyzer.jpg)
The various bundle sizes for our entire bundle can be seen by hovering over app.bundle.js at the top.
* Stat size is 168.36 KB
* Parsed size is 149.33 KB. This is highlighted as this is the one that's going to impact our performance.
* Gzipped size is 61.19 KB. This is what gets transmitted over the network
