const inquirer = require('inquirer');
const consola = require('consola')

enum Action {
  List = 'list',
  Add = 'add',
  Remove = 'remove',
  Quit = 'quit',
  Edit = 'edit'
}

type InquirerAnswers = {
  action: Action
}

enum Result {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info'
}

class Message {
  constructor(private content: string) {}

  public show() {
    console.log(this.content);
  }

  public capitalize() {
    this.content.charAt(0).toUpperCase() + this.content.slice(1);
  }

  public toUpperCase() {
    this.content.toUpperCase();
  }

  public toLowerCase() {
    this.content.toLowerCase();
  }

  static showColorized(Result: string, msg: string) {
    if(Result === 'success') {
      consola.success(msg);
    } else if (Result === 'error') {
      consola.error(msg);
    } else{
      consola.info(msg);
    }
  }
}

interface User {
  name: string,
  age: number
}

class UserData {

  data: User[] = [];

  public showAll() {
    Message.showColorized(Result.INFO, 'Users data');
    this.data.length === 0 ?  console.log('NO DATA') : console.table(this.data);
  }

  public add(user: User) {
    if(user.name.length > 0 && user.age > 0) {
      Message.showColorized(Result.SUCCESS, 'User has been added');
      this.data.push(user);
    } else {
      Message.showColorized(Result.ERROR, 'Wrong data');
    }
  }

  public remove(username: string) {
    if(this.data.find((u) => u.name === username)) {
      this.data = this.data.filter((u) => u.name !== username);
      Message.showColorized(Result.SUCCESS, 'User deleted')
    } else {
      Message.showColorized(Result.ERROR, 'Wrong data');
    }
  }

  public edit(editName: string, user: User) {
    const index = this.data.findIndex((obj => obj.name == editName))
    this.data[index].name = user.name;
    this.data[index].age = user.age;
  }
}

const users = new UserData();
console.log("\n");
console.info("???? Welcome to the UsersApp!");
console.log("====================================");
Message.showColorized(Result.INFO, "Available actions");
console.log("\n");
console.log("list – show all users");
console.log("add – add new user to the list");
console.log("remove – remove user from the list");
console.log("quit – quit the app");
console.log("edit - edit user");
console.log("\n");


const startApp = () => {
  inquirer.prompt([{
    name: 'action',
    type: 'input',
    message: 'How can I help you?',
  }]).then(async (answers: InquirerAnswers) => {
    switch (answers.action) {
      case Action.List:
        users.showAll();
        break;
      case Action.Add:
        const user = await inquirer.prompt([{
          name: 'name',
          type: 'input',
          message: 'Enter name',
        }, {
          name: 'age',
          type: 'number',
          message: 'Enter age',
        }]);
        users.add(user);
        break;
      case Action.Remove:
        const name = await inquirer.prompt([{
          name: 'name',
          type: 'input',
          message: 'Enter name',
        }]);
        users.remove(name.name);
        break;
      case Action.Edit:
        const toEditName = await inquirer.prompt([{
          name: 'editName',
          type: 'input',
          message: 'Enter name to edit'
        }]);
        const editData = await inquirer.prompt([{
          name: 'name',
          type: 'input',
          message: 'Enter name'
        },
        {
          name: 'age',
          type: 'number',
          message: 'Enter age'
        }]);
        users.edit(toEditName.editName, editData);
        break
      case Action.Quit:
        Message.showColorized(Result.INFO, "Bye bye!");
        return;
      default:
        Message.showColorized(Result.ERROR, 'WRONG COMMAND')
        break
    }

    startApp();
  });
}

startApp();