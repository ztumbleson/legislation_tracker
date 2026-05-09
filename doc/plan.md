# Implementation Plan

## 1. Create the legislator front-end scaffolding
- Create a page for viewing legislators (simple HTML table with some styling should do)
- Create a data type (probably JS) representing a legislator
- Create a page presented from the main view that holds the "Create a legislator form"
- Store an array locally of created legislators 
- Placeholder for a backend call
- Refresh table data source when new legislator is added

## 2. Create the legislation front-end scaffolding
- Create a page for viewing legislation (hover over et al for more than 3/4 sponsors)
- Create a page presented from the main view for creating new legislation
- Store an array locally of created legislators
- Placeholder for a backend call
- Refresh table data source when new legislation is added

## 3. Navigation/Data connection for legislators/legislation
- Link up JS data for legislators to show sponsors in legislation dropdowns/table

## 4. Backend - Create legislators back-end scaffolding
- Legislators table in postgres
  - Primary key - ID
  - Foreign keys/Relations - N/A
- Legislators CRUD endpoints

## 5. Backend - Create legislation back-end scaffolding
- Legislation SQL table in postgres
  - Primary key - ID
  - Foreign keys/Relations - 1->Many (LegislatorIDs)
- Legislators CRUD endpoints

## 6. Linkup - connect front-end and backend
- Wire up CRUD calls for legislators
- Wire up CRUD calls for legislation

## 7. Styling and extras
- Styling for both pages to be uniform and presentable
- Backend Unit tests
- Front-end unit tests