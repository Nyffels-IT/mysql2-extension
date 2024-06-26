# NodeJS-Mysql2 Wrapper By Nyffels BV

The NodeJS MySql2 wrapper is a wrapper that simplified the usage of the MySql2 npm package and extends it with usefull functions, mappings and generations.\
The Wrapper and extensions can be used sseperate from each other.

## Installation

Use the npm package manager to install the mysql2 wrapper by running the command

```bash
npm install @nyffels/nodejs-mysql2-wrapper
```

## Usage

Usage information coming soon!

## Contributing

Pull requests are welcome.\
For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Release Notes

### UNRELEASED
- Added propertyType type for property top introduce type decorator limitations.

### 1.9.0
- Added type parameter for defining the return type for queryResultToObject function.
- Updated used dependencies. 

### 1.8.0
- Added getDeleteQuery function. 

### 1.7.1
- Bugfix for bulk insert function.

### 1.7.0
- Added query function 'getBulkInsertQuery' for bulk insert query generation. 
- Added commentary to functions (incomplete)

### 1.6.1
- Bugfix for the new ComparePropertiesArray producing an incorrect query.

### 1.6.0
- Added query creator for comparing arrays called 'comparePropertiesArray'.

### 1.5.0
- Added option to compare new target with a old one on the 'getUpdateValuesFromTarget' function.
- Added option to skip keys for 'getUpdateValuesFromTarget' function.

### 1.4.0

- Removed possibility te use empty properties for 'getInsertQuery' in favor of the new value generation funtions.
- Added 'getInsertValuesFromTarget' function.
- Added 'getUpdateValuesFromTarget' function.

### 1.3.0

- Updated package versions
- Updated 'getInsertQuery' to allow empty properties to insert all properties.

### 1.2.0

- Added 'getUpdateQuery' function.

### 1.1.3

- Fixed build issues from 1.1.2

### 1.1.2

- Fixed incorrect order by on "getSelectQuery" function.
- Minor package updates.

### 1.1.1

- Fixed naming typo in function.

### 1.1.0

- Added "queryResultToObject" function.

### 1.0.2

- Prevent duplicated error notifications.

### 1.0.1

- Updated annotations getters to prevents unwanted errors.

### 1.0.0

- Initial release of the extension library.
- Added parser logics for the types (string, number, boolean and datetime).
- Added query generation functions for insert & select.
- Added annotations for classes / table mapping.
- Added annotations for class property / table column mapping.
- Addoded annotations for class variable type / table column type / parsing mapping.
