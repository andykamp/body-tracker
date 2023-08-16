# BodyTracker

### Setup
- frontend: nextjs and sanity 
- auth: firebase google
- database: firestore
- cache: redis (kv vercel)
- server:
    - no server atm but full support for migrating there
    - common-api handles CRUD database operations only
        - chooses what  DB to use via environmental variable
        - create, update, delete
        - delete is just update with isDeleted=true so we have a archive
        - ideealy only 4 functions (CRUD) in total, but we create for different needs (e.g createMeal) to keep totally agnostic to the server-api. If not we to pass path etc from server-api, which could be different for each DB. And thus would no be agnostic.
    - server-api handles business logic and calls to common-api
        - can therefore easily change by environmental variable
    - frontend can call server-api directly, or we can add a server as a proxy

## State management
- some tsconfig names are wrong!!!
- how to handle adjustable products/meals
    - meals consist of existing products
    - grouped into breakfast, lunsh, dinner
- should all state be normalized? for quick searches?
    - normalize at in fetch funciton. not in backend
    - so all database is arrays
    - 
- SWR vs react-query ?
- state management
    - make each page/tab render declarativly from a root useQuery
    - use @tanstack/react (https://tanstack.com/query/v4/docs/react/adapters/react-query) to refetch and invaliate cache just like apollo 
        - e.g daily is set and updated
            - then i rename a meal in the other tab
            - then i need to invalidate daily and efech
        - e.g i update/add a item
            - then i could invalidate and refetch
            - OR i could use the setQuerData to update the cache directly and save network call
            - see https://tanstack.com/query/latest/docs/react/guides/updates-from-mutation-responses
    - only need a few cache-keys
        - daily
        - meals (any change invalidates daily)
        - products (any change invalidates daily)
        - profile
        - .... (stats etc)
- database
    - use the actual calls to database in the common lib (re-usable for exercise also)
    - firebase
        - user spesific stuff
        - blob storage
        - persistant products & exercises
    - redis
        - cache the product & exercise
        - add a caching middleware that can add/fetch any result to cache (see https://www.digitalocean.com/community/tutorials/how-to-implement-caching-in-node-js-using-redis)
            - but only get cached content for product & exercise 
        - saves reads in the databse for stale content
        - 10000 rows of a dict with 3 keys is 48B per dict. Total of 468
- pwa
    - manifest
    - service worker
- theme and component library
    - headless ui | geist | pure tailwind | antd
- logs
    - axiom vs vercel analystics?
    - grafana?
    - logtail? https://betterstack.com/logtail
    - sentry?
    - mixpanel?
    - vercel analytics

# why dailyItems is not a collection
- DailyDiet.dailyItems does not accumulate over time
- this it is easyer to manage updates in state and save time
- all other collections accumulate over time. eg. products, meals etc. since daily is limitet to a daily scope. we dont have that issue

# Commits

Added husky with commitlint:

- see husky init docs
- OPS: neeed to add this pacage yarn -D add  @commitlint/cli @commitlint/config-conventional
- and then make the pre-push executable by
```
chmod ug+x .husky/*
chmod ug+x .git/hooks/*
```


Allowed commits: 
- **feat**: A new feature implemented in the code.
- **fix**: A bug fix.
- **docs**: Changes to the documentation.
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc.).
- **refactor**: A code change that neither fixes a bug nor adds a feature.
- **perf**: A code change that improves performance.
- **test**: Adding missing tests or correcting existing tests.
- **chore**: Changes to the build process or auxiliary tools and libraries such as documentation generation.
- **build**: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm).
- **ci**: Changes to your CI configuration files and scripts (example scopes: Circle, BrowserStack, SauceLabs).
- **revert**: Reverts a previous commit.

## NOTES
-added the following scrips

    "dev": "nx run-many --target=serve --projects=diet",
    "build": "nx run-many --target=build --parallel",
    "test": "nx run-many --target=test --exclude=workspace --parallel",
    "lint": "nx run-many --target=lint --parallel --exclude=workspace",
    "type-check": "nx run-many --target=type-check --parallel --exclude=workspace"
Should also start the emulator on yarn dev!!

- yarn lint --fix is a muuuust

- TODO add prettyfier
- added type-check to not be supreised by build failures in verscel. (added in project.json)

```
    "type-check": {
      "command": "tsc -b ./libs/ui/tsconfig.json --incremental --pretty"
    },
```

- added a script that starts emulators and runs app 
    - yarn add --dev concurrently (too run multiple scripts)
    - yarn add --dev wait-on (to wait for a port, in this case emulator port, to start)

    - 

## Todo
- external apis
    - create test & tytpes for oura and withing to know each rest call is vaid
    - create graphApi in oura and whiting to make it simple to write test and use graph parsing
        - write test
        - use graphApi in diet
- scraping 
    - create a diet-scraper in node and run in grithub actions as cron-jos
 
 - workflow
     - clean up UI
     - add storybook figma 
     - move all components into UI
     - create input fields and rows as described in figma
     - create own meals/products
     - add custom meal into daily
         - need to find a way to distinguish between custom and non-custom meals/product

- storybook 
    - add manager
    - add theme and setup

- docs
    - add developer docs where i can add actual todos etc
    - use docusaurus or mkdir

 - general
    - remove stupid try catches
    - always return updated object and full object exept on delete
        - will enable uptimistic udpates??
    - FIX invalidateing userProvider so it updates children!!!!
    - update cache rather than refetch
    - use react-query on useMeasurements....
    - use a rest api for error handling
    - look at tailwind templates or markus library
    - protein/calory targets should adjust to the average weight!
        - maybe put in provider??
    - add light/dark theme
    - fix auth loading state
    - fix loading state while user is loggin in
    - so that the user is never null. add types for this
    - user-server should be a sepearea lib
        - should import types from diet, oura and withing
        - their types etc should be in a common lib
    - determine data or measurements
    - use chatGPT to generate input/output forn whitings and oura
    - create fixtures and tests
    - add weeksly average
    - add sleep diff on weekends and weekdays
    - add gradient pointers to graph
    - add "custom daily" entry
    - add "custom product" entry
    - scrape ODA and add to firestore
    - add redis cache to stock 
    - create PWA
    - 
    - flush react query cache when loggin out. if not all data is cached
    - move "meals" etc into contsant and set a standard for capital/lowercase names
    - add id instead of names to meals etc. will fuck up stock atm
    - CANNOT ADD MULTIPLE EGGS :(
    - decide on pascal case etc
    - 
    - create UX kit in figma
        - add app UX overview
        - add powerpoint kepler slide with UX overview that we can use on website
        - 
    - add e2e and component tests
    - search should have acceess to all stock and personal products/meals...
    - remove explixit exports in the .apis
    - add "timestamp" to meals added to daily
    - 
    - Delete 
        - delete should only set isDelete and not actually delete. you can setup custom ttl in firestore https://firebase.google.com/docs/firestore/ttl. it will still show up in queries (unless you demand the isDeleted should not be returned)
        - delete should just re-use update. 

    - add re-route param to signing/signout so i dont have to re-define it all the time 
    - 
    - rename updateProductTo user to updateProductForCurrentUser
    - decide how to manage xxforCurrentUser and if that is neccesarry
    - should use create, update, delete instead of add, update, remove
    - delete subcollections on delete


## Next up
- TODO
- topology
    - cache updates
        - updat all references when changing and deleteing
        - replace all cache stuff
            - finish item + meal
            - add daily cache
        - fix delte/archive/references
    - clean api and rename names
        - own lib for diet-client
        - own cache key variables
        - make sure the return names e.g customProductToDelete is the same for al
        - clear up use of customProduct and item and product
    - clean routes
    - create mocks
    - fix UI
- todos
    - [X] decide how to calculate the daily protein. on the fly or store it. at some point one needs it for stats/analytics also
    - [X] check dependency when i delete an item
    - [X] fixed delete product and addProductToMeal caching!!! 
    - create a "bring back" button on products instead of current delete
    - fix cache for adding new meal
    - fix cache for updateing meal, products and items
    - devide into routes and not tabs..
    - fix  inital re-render that causes page to refresh
    - update the stock seach cache when adding meal and product
    - fix daily itemMinimal
    - search outside of stock
        - maybe the stock search of products can be done seperatly on the server :o
    - add AI created meal
  
- remove calories/grams/protein form meal storage
- create items and not products in meal
- update how to calculate/populate the meal based on items (with the percentage)
- rename item to refereneItem and move percentage out.
    - then it can be re-used for the workout?

- move stuff to storybook to make it clean
- create skeleton loaders

- distinguish between a store product which have a set nutrition, and the actual product (that has nutrients pr 100g)


- oda-scraping
    - [X] write to csv
    - [X] make the scraper recursive
    - [X] whiteliset kategories so i dont get to much
    - [ ] see how many items it becomes
        - 6mb ish
    - [X] local script for querying the json fil
        - [X] local script to query the local json filen
        - [X] create a repl script that lets you query the json file
    - 
    - store in redis-lab 
    - query based on key (which is the name)
    - 
    - consider bundeling it with the app
    - 
    - condider adding it to redis mannually (dont store in firestore)
    - hope the thumbnail is available and does not expire 

## notes

    - remove daily references at some point?
        - maybe at some point the daily should remove all references and only be stored flat with the result values. i guess i want to adjust the lst week but after that i should not be able to. Then i can loop and update the product
        - if i store the reference to the daily/meal, i can go in and upddate the daily/meal and then update the product. if daily is changed, i need to re-run the getAnalytics (if applicable) then all analytics will also be up-to-date
    - caching straegy to update at all places
        - use prefetch [link](https://tanstack.com/query/v4/docs/react/guides/prefetching) in root for:
            - products
            - meals
            - daily
        -  use optimistic updates https://tanstack.com/query/v4/docs/react/guides/optimistic-updates 

