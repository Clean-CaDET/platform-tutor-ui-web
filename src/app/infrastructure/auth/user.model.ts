export class User {
    id: number;
    learnerId: number;
    username: string;
    role: string;
  
    constructor(obj?: any) {
      if (obj) {
        this.id = obj.id;
        this.learnerId = obj.learnerId;
        this.username = obj.username;
        this.role = obj.role;
      }
    }
}  