import axios from 'axios';


const API_URL = "http://localhost:8080/api"

class CommentsService {
  getAllCommentsBypost(postId) {
    return axios.get(API_URL + `/comments/${postId}`)
  }

  createPost(data) {
    return axios.post(API_URL + `/comments`, data)
  }

  deleteComment(postId, commentId) {
    return axios.delete(API_URL + `/comments/${postId}/${commentId}`)
  }

  updateComment(postId, commentId, data) {
    return axios.put(API_URL + `/comments/${postId}/${commentId}`, data)
  }

  getOneComment(postId, commentId) {
    return axios.get(API_URL + `/comments/${postId}/${commentId}`)
  }
}

export default new CommentsService()