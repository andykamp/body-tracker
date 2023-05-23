# BodyTracker

## Todo
- create UX kit in figma
    - add app UX overview
    - add powerpoint kepler slide with UX overview that we can use on website

- add e2e and component tests
- 

- api.firebase needs to be moved to diet-server (because it needs the types)
- split it up and put it under each daily/product ... folder
- create a api util that basically does what makeRequest does not. can maybe even export it from common???
- then each api does not have to call baseApi makeRequest and exec but rather call the crud function makeRequest that calls makeReqAndExec?? or something. it is still based on ENV variable
    - but getting all functions into a object might be tricky so need to do it per api (daily, product.... etc)? that is a hazzle
- best would be a CRUD api with read, create, delete update but with path etc it becomes difficult

- search should have acceess to all stock and personal products/meals...
- 
- todays and yesterdays dauly should always be in daily object in additon to the daily collection??
- !!!!IMPORTANT dont have duplicated diet.types in firebase.api and diet.api
- remove explixit exports in the .apis
- 
- add "timestamp" to meals added to daily
- 
- delete should only set isDelete and not actually delete. you can setup custom ttl in firestore https://firebase.google.com/docs/firestore/ttl. it will still show up in queries (unless you demand the isDeleted should not be returned)
-
- make sure nothing is using the auth until it is valid
- remove auth.hooks?
- https://firebase.google.com/docs/emulator-suite/connect_auth
- add re-route param to signing/signout so i dont have to re-define it all the time 
- 
- add created/updated at server-api
- test delete
- move auth 

- move updateStockProduct and updateProductForCurrentUser to seperate apis?
- rename updateProduct (to stock) 
- rename updateProductTo user to updateProductForCurrentUser
- decide how to manage xxforCurrentUser and if that is neccesarry
- should use create, update, delete instead of add, update, remove
- delete should just re-use update. 
- delete subcollections  on delete
- test emulatinon https://firebase.google.com/docs/emulator-suite 


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



### Setup
- frontend: nextjs
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



# Commits

Added husky with commitlint:

- see husky init docs
- OPS: neeed to add this pacage yarn -D add  @commitlint/cli @commitlint/config-conventional

Allowed commits: 
feat: A new feature implemented in the code.
fix: A bug fix.
docs: Changes to the documentation.
style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc.).
refactor: A code change that neither fixes a bug nor adds a feature.
perf: A code change that improves performance.
test: Adding missing tests or correcting existing tests.
chore: Changes to the build process or auxiliary tools and libraries such as documentation generation.
build: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm).
ci: Changes to your CI configuration files and scripts (example scopes: Circle, BrowserStack, SauceLabs).
revert: Reverts a previous commit.

