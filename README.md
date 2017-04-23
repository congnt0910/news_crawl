## Requirements
[NodeJS](https://nodejs.org/en/) v6 or newer

[Yarn](https://yarnpkg.com/en/)


## Structure

```
.
├── /docs/                          # Documentation files for the project
├── /node_modules/                  # 3rd-party libraries
├── /src/                  
│   ├── /libs/                      # Library for crawl data
│   ├──── /core/                    # Core of crawl lib
│   ├──── ...                       # Extends of core to dealing for specific site
│   ├──── /dantri/                  # Extend of core to dealing for specific site
│   ├── /helper/                    # Helper function
│   ├── /models/                    # Data models
│   ├── /main/                      # Crawler 
│   ├──── /Job.js                   # Store information required to crawl
│   ├──── /worker.js                # The Process to call the library to dealing a job corresponding 
│   ├──── /ProcessManage.js         # Manage all child process 
│   ├──── /ProcessWrapper.js        # wrapper to communication between worker and ProcessManage
│   ├──── /run.js                   # Crawler startup script 
│   ├── /routers/                   # 
│   └── /index.js                   # HTTP Server startup script
├── package.json                    # The list of 3rd party libraries and utilities
└── yarn.lock                       # 
```


## Quick Start
1. Run `yarn install`

	This will install project dependencies

1. Run `yarn crawl`

	This will run crawler

1. Run `yarn server`

	This will run http server
