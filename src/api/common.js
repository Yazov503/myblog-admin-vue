import axios from "axios";

export function uploadImg(formData) {
  return axios.post("/upload", formData)
}

export function sendCode(email, type) {
  return axios.post(`/user/code?email=${email}&type=${type}`)
}

export function getBlogCount({ startDate, endDate }) {
  return axios.get('/statistics/blog-count', {
    params: {
      startDate,
      endDate
    }
  })
}

export function getCommentCount({ startDate, endDate }) {
  return axios.get('/statistics/comment-count', {
    params: {
      startDate,
      endDate
    }
  })
}
