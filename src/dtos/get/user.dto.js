export default class UserDto {
  constructor(user) {
    this.users = user;
  }
  all() {
    const userDto = this.users.map((e) => {
      return {
        id: e._id,
        name: e.first_name + " " + e.last_name,
        email: e.email,
        role: e.role,
      };
    });
    return userDto;
  }
  one() {
    return {
      id: this.users._id,
      name: this.users.first_name + " " + this.users.last_name,
      email: this.users.email,
      role: this.users.role,
    };
  }
}
