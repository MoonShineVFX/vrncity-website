import liff from "@line/liff";

// LIFF IDs
const LIFF_IDS = {
  register: "2007001518-p1BJbZ5G",
  passport: "2007001518-vAMAWYj3",
  preview: "2007001518-glpMaZVE",
};

// LIFF URLs
const LIFF_URLS = {
  register: "https://liff.line.me/2007001518-p1BJbZ5G",
  passport: "https://liff.line.me/2007001518-vAMAWYj3",
  preview: "https://liff.line.me/2007001518-glpMaZVE",
};

// 初始化 LIFF
export const initLiff = async (liffId: string) => {
  try {
    await liff.init({ liffId });
    console.log("LIFF 初始化成功");
    return true;
  } catch (error) {
    console.error("LIFF 初始化失敗:", error);
    return false;
  }
};

// 檢查是否在 LIFF 環境中
export const isInLiffBrowser = () => {
  return liff.isInClient();
};

// 檢查用戶是否已登入
export const isLoggedIn = () => {
  return liff.isLoggedIn();
};

// 獲取用戶資料
export const getUserProfile = async () => {
  if (!liff.isLoggedIn()) {
    return null;
  }

  try {
    return await liff.getProfile();
  } catch (error) {
    console.error("獲取用戶資料失敗:", error);
    return null;
  }
};

// 獲取用戶 email
export const getUserEmail = async () => {
  if (!liff.isLoggedIn()) {
    return null;
  }

  try {
    const profile = await liff.getDecodedIDToken();
    return profile?.email || null;
  } catch (error) {
    console.error("獲取用戶 email 失敗:", error);
    return null;
  }
};

// LINE 登入
export const login = () => {
  if (!liff.isLoggedIn()) {
    liff.login();
  }
};

// LINE 登出
export const logout = () => {
  if (liff.isLoggedIn()) {
    liff.logout();
    window.location.reload();
  }
};

// 跳轉到其他 LIFF 頁面
export const redirectToLiff = (page: keyof typeof LIFF_URLS) => {
  window.location.href = LIFF_URLS[page];
};

export default {
  LIFF_IDS,
  LIFF_URLS,
  initLiff,
  isInLiffBrowser,
  isLoggedIn,
  getUserProfile,
  getUserEmail,
  login,
  logout,
  redirectToLiff,
};
