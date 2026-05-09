# Prompt:
Develop a data entry web application that:
- Has two entry forms
- Has views to display the created/entered data

## Entry Form One - Legislators
### Description
- The first entry form is used to create Legislators. It powers a data view that shows all created legislators.

### Requirements 
- Legislator form fields:
  - First Name* - First name of the legistlator (Single line text field -> String)
  - Last Name* - Last name of the legislator (Single line text field -> String)
  - Hometown* - Name of the legislator's hometown (Single line text field -> String)
- ***All fields are required**
- Display an error message/highlight empty required fields
- Form has a submit button
- Successfully submitting the form dismisses it and shows the table of all created legislators

## Entry Form Two - Legislation
### Description 
- The second entry form is used to create Legislation. It powers another data view that shows all created legislation and sponsors

### Requirements

- Legislation form fields:
  - Title* - Title of the legislation (Single line text field -> String)
  - Text* - Full text of the legislation (Short/Long Answer response text field -> String)
  - Sponsors - All sponsors of this piece of legislation (TBD -> [Legislator IDs])
- ***Title and Text are required**
- If the user attempts to submit the form with title or text, display an error message/highlight fields to notify the user that required fields are not yet filled in 
- The Sponsors field should list all available "Legislators" as choice options using a list-friendly input (e.g. MultiSelect Dropdown, Checkbox, etc). 
- This entry field will allow selection of zero - all available legislators as selection options
- Each selection option is displayed in the format of: "legislator_first_name legislator_last_name" (e.g. "John Doe")
- Form has a submit button
- Successfully submitting the form takes the user to a view/page where all Legislation entries are on display, presenting the Legislation Title, Legislation Text, and names of selected formatted Sponsors if any (i.e. John Doe, Jane Doe), for each existing Legislation entry. 

## Important Notes:
- It is not expected to implement update/delete operations for created legislators or legislation. (but it will be helpful for testing so we'll probably do it anyway)
- Include some basic CSS styling on the page to make it look presentable. (CSS libraries are allowed)