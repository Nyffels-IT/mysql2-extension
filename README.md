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