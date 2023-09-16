- [X] fix daily macros
- [X] fix custom meals
- [X] fix search to also have custom products and custom meals
- cleanup
    - [X] rename and move input types to own .types file
    - [X] move non-user-facing-stuff to utils file so it dont pollute the api file
        - [X] can add it to the api but it should be defined in the util
        - [X] try to re-use e.g populatedaily/meal
        - try to re-use update/add reference
        - try to re-use soft-delete?
        - try to re-use convertCustomProductToItem and convertItemToCustomProduct
    - [X] retype the createEmptyobejct sto make the prop optional. Ref best practice
    - rename functions for consistency
    - delete all referanes correctly
        - [X] update/delete all product references on meal delete
        - restore meal
        - confirm delete on item and meal with references
        - update all references on change/delete

- [o] multiple dailies
    - [X] fix go back to previous dailies and update them
        - [X] need to update the yesterdays on next-days daily
    - fix daily cache updates

- UX neeeded fixes
    - [X] FIX search bug (item.name is never updated)
        - [X] seperate a updateFieldName and updateFieldName  and updateItemItemField
    - [X] dont allow lock when gram is null
    - fix drag on each item
        - need to debounce, optimistic update or local update state
        - mutation cancel etc so it does not wait until first comes back?
        - daily drag is slower becaues it has to refetch everything...
    - round numbers to ints
    - make sure that proteins,calories and grams are require in product
    - convert all .apis spread parameters inside the function
    - loading state on item on selection (currently shit)
    - 
    - [X] fix lock /grams
        - decide when/what should be locked
        - maybe have a figme 'relation' icon at the end?
        - decide if it should be a own .api calll
        - clean up the Item.ts function props
        - one cannot change the name of a not-custom item. so make it clear??
        - @todo:
            - locking makes NAN values
            - make sure that proteins,calories and grams are require in product
            - drag creates shitload of writes. need to debouce DB call

- WRAP items in a local state with debounce..... only lock,toggle etc should happen instantly
- !!!! render meals in daily
    - [X] fix restore/delete on meal
    - 
- Dont allow products to be added to meals
- dont allow meal to be added to product or atleast fix it
    - maybe set searchtype to item.itemType
- [ ] !!! fix daily references
- what happends if i cange a product/meal. will all dailies and be updated?
    - no but the cach is invalidated so next time it will be 
    - but the old dailies will NOT be updated...... TODO
    - should follow the path and update last weeks daily i guess
    - write tests......
 
 
- puth to master
    - then structure storybook and start preview branches

- add water as a own type of product
    - different sizes with zero calories
    - not gram but liters
    - maybe a own drink type?
    - BUT producta from oda is valid and more detailed
    - BUT might want to add coffe, tea etc as own products
    - AND then the user might not now how much a cup is?
        - so a 'isLiquid' prop on product? to render a cup icon?

- analytics
    - apple healt?
    - only allow daily edits for last week
    - store "cached" analytics on daily before that and render/fetch the rest on-the-fly? or cache
    - should be updated with the weight no? weekly average?
    - notify when u bump it
    - need to store goaldiff on daily
    - then i need to update the next dayly every time i change the previous
    - figure out how to store analytics!!!

- [X] scrape mattabellen 
- search on category aswell
- fix search display
    - show tabs based on source in the "show all section"
        - alle
        - dine producter
        - dine meals
        - oda
        - mattabellen
        - ....
    - trigger targetted search with :o(da) or :t(abell)


- goal settings 
    - if i change the goal, prev dailies should not be affected
    - the goal should be part of daily?
    - store goals so the user can switch between them?
    - have some stock goal per weight etc?
  
- UI and storybook 
    - read up on the side-project boookmark about all the cool stuff there
    - properly setup storybook with style
    - fix responsive UI
    - fix draggable mobile
    - theme
        - ADD geist colors to tailwind
        - add a setTheme on body based on localstorage/database
        - document process in the issue section 
        - ADD storybook theme toggle so one can test properly there
    - Create a PWA

- chatbot
- ai autocomplete/generated meals/products
- scrape mattabellen 
- chart/analytic intergratino
    - oura
    - withings
    - apple health

