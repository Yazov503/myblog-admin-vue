import axios from "axios";

export function getBlogsByPage({ userId, pageNum, pageSize, queryText, queryTags, isCollection = false, createTimeStart = null, createTimeEnd = null }) {
  return axios.get("/blog/page", {
    params: {
      userId,
      pageNum,
      pageSize,
      queryText,
      queryTags,
      isCollection,
      createTimeStart,
      createTimeEnd,
    },
  });
}

export function getPendingBlogsByPage({ userId, pageNum, pageSize, queryText, queryTags, isCollection = false, createTimeStart = null, createTimeEnd = null }) {
  return axios.get("/blog/pending/page", {
    params: {
      userId,
      pageNum,
      pageSize,
      queryText,
      queryTags,
      isCollection,
      createTimeStart,
      createTimeEnd,
    },
  });
}

export function drawbackBlog(blog) {
  return axios.post(`/blog/drawback`, blog);
}

export function accessBlog(blog) {
  return axios.post(`/blog/access`, blog);
}

export function getFollowerBlogs({ followId, pageNum, pageSize }) {
  return axios.get("/blog/follow/page", {
    params: {
      followId,
      pageNum,
      pageSize,
    },
  });
}

export function getBlogById(blogId) {
  return axios.get(`/blog/${blogId}`);
}

export function deleteBlog(blogId) {
  return axios.delete(`/blog/${blogId}`);
}

export function createOrUpdateBlog({ blogId, userId, title, content, tags }) {
  return axios.post(`/blog`, {
    id: blogId,
    userId,
    title,
    content,
    tags,
  });
}

export function likeBlog(blogId) {
  return axios.post(`/blog/like/${blogId}`)
}

export function collectBlog(blogId) {
  return axios.post(`/blog/collect/${blogId}`)
}
