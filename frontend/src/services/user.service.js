import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/userService/"

class UserService {
  getPublicContent() {
    return axios.get(API_URL + 'all');
  }

  getUserBoard() {
    return axios.get(API_URL + 'user', { headers: authHeader() });
  }

  getModeratorBoard () {
    return axios.get(API_URL + "mod", { headers: authHeader() })
  }

  getAdminBoard () {
    return axios.get(API_URL + "admin", { headers: authHeader() })
  }

  getAllUsers () {
    return axios.get(API_URL + "users", { headers: authHeader() })
  }

  getUser (id) {
    return axios.get(API_URL + `users/${id}`)
  }

  deleteUser (id) {
    return axios.delete(API_URL + `users/${id}`)
  }

  deleteAll () {
    return axios.delete(API_URL + "users/")
  }

  update (id, data) {
    return axios.put(API_URL + `users/${id}`, data)
  }

  findByName (name) {
    return axios.get(API_URL + `users?firstName=${name}`)
  }
}

export default new UserService();