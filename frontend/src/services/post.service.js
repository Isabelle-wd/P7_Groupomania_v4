import axios from 'axios';


const API_URL = "http://localhost:8080/api"

class PostsDataServices {
  getAll() {
    return axios.get(API_URL + '/posts')
  }

  get(id) {
    return axios.get(API_URL + `/posts/${id}`)
  }

  getPostsByUser(userId) {
    return axios.get(API_URL + `/posts/user/${userId}`)
  }

  create(data) {
    return axios.post(API_URL + "/posts", data, {
      headers: {"Content-Type" : "multipart/form-data"}
    })
  }

  update(id, data) {
    return axios.put(API_URL + `/posts/${id}`, data)
  }

  delete(id) {
    return axios.delete(API_URL + `/posts/${id}`)
  }

  deleteAll() {
    return axios.delete(API_URL + `/posts`)
  }

  findByTitle(title) {
    return axios.get(API_URL + `/posts?title=${title}`)
  }

  // postLike(userId, postId) {
  //   return axios.post(API_URL + `/posts/like`, userId, postId)
  // }

  postLike(id, like) {
    return axios.post(API_URL + `/posts/${id}/like`, like)
  }

}

export default new PostsDataServices();