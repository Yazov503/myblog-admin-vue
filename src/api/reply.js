import axios from "axios";

export function createReply({ parentId, commentId, content }) {
  return axios.post("/blog/comment/reply", {
    parentId,
    commentId,
    content,
  });
}

export function likeReply(replyId) {
  return axios.post(`/blog/comment/reply/like/${replyId}`)
}

export function deleteReply(replyId) {
  return axios.delete(`/blog/comment/reply/${replyId}`)
}
