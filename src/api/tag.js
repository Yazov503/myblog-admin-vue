import axios from "axios";

export function getTags() {
  return axios.get('/tag');
}

export function getTagsByPage({ pageNum, pageSize, queryText }) {
  return axios.get('/tag/page', {
    params: {
      pageNum,
      pageSize,
      queryText,
    },
  });
}

export function createOrUpdateTag(tag) {
  return axios.post(`/tag`, tag)
}

export function deleteTag(tagId) {
  return axios.delete(`/tag/${tagId}`)
}