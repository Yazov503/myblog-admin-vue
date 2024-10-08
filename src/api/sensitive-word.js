import axios from "axios";

export function getBlackWordsByPage({ pageNum, pageSize, queryText }) {
  return axios.get('/sensitive-word/black/page', {
    params: {
      pageNum,
      pageSize,
      queryText,
    },
  });
}

export function getWhiteWordsByPage({ pageNum, pageSize, queryText }) {
  return axios.get('/sensitive-word/white/page', {
    params: {
      pageNum,
      pageSize,
      queryText,
    },
  });
}

export function createOrUpdateSensitiveWord(newSensitiveWord) {
  return axios.post('/sensitive-word', newSensitiveWord);
}

export function deleteSensitiveword(sensitiveWordId) {
  return axios.delete(`/sensitive-word/${sensitiveWordId}`);
}
