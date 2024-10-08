import axios from "axios";

export function adminLogin({ username, password }) {
  return axios.post(`/admin/login?username=${username}&password=${password}`)
}

export function mute({ userId, muteDay }) {
  return axios.post(`/admin/mute?userId=${userId}&muteDay=${muteDay}`)
}

export function cancelMute(userId) {
  return axios.post(`/admin/cancelMute?userId=${userId}`)
}

export function createOrUpdateBulletin(bulletin) {
  return axios.post(`/admin/bulletin`, bulletin)
}

export function getBulletinsByPage({ pageNum, pageSize, userId, queryText }) {
  return axios.get("/admin/bulletin/page", {
    params: {
      pageNum,
      pageSize,
      userId,
      queryText
    },
  });
}

export function deleteBulletinById(bulletinId) {
  return axios.delete(`/admin/bulletin/${bulletinId}`)
}
