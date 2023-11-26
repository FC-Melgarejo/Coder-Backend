const UserModel = require('../dao/models/userModel')

 class User {

    getUsers = async () => {
        try {
          let users = await UserModel.find();
          return users;
        } catch (error) {
          throw new Error(`Error al obtener usuarios: ${error.message}`);
        }
      }
      

    getUserById = async (id) => {
        try{
            let user = await UserModel.findOne({_id:id});
            return user;
        }catch(error){
            console.log(error);
            return null;
        }
    }

    saveUser = async (user) => {
        try {
          let result = await UserModel.create(user);
          return result;
        } catch (error) {
          console.log(error);
          return null;
        }
      }
      

      updateUser = async (id, user) => {
        try {
          let result = await UserModel.findByIdAndUpdate(id, { $set: user }, { new: true });
          return result;
        } catch (error) {
          console.log(error);
          return null;
        }
      }
      
}

module.exports = User