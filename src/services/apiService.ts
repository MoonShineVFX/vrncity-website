// 這裡是您的 API 服務
// 您需要根據實際 API 進行調整

// 定義用戶資料介面
export interface UserData {
  exists: boolean;
  user?: {
    id: number;
    username: string;
    uuid: string;
    email: string;
  };
}

const API_BASE_URL =
  "https://vrnortherncity-line-api.divine-wave-35ee.workers.dev/api";

// 檢查用戶是否存在並獲取用戶資料
// {
//   "email": "user@example.com"
// }
export const checkUserExists = async (email: string): Promise<UserData> => {
  try {
    // 使用 URL 參數而不是請求體
    const response = await fetch(
      `${API_BASE_URL}/checkUser?email=${encodeURIComponent(email)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API 錯誤: ${response.status}`);
    }

    const data = await response.json();
    return data as UserData;
  } catch (error) {
    console.error("檢查用戶失敗:", error);
    // 發生錯誤時返回默認值
    return { exists: false };
  }
};

// 註冊用戶
// register /api/register
// {
// "username": "測試使用者",
// "uuid": "U1234567890abcdef",
// "email": "test@example.com",
// "passport": "test-passport"
// }
export const registerUser = async (
  username: string,
  uuid: string,
  email: string,
  passport: string
): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST", // POST 請求可以有請求體
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, uuid, email, passport }),
    });

    if (!response.ok) {
      throw new Error(`API 錯誤: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("註冊用戶失敗:", error);
    throw error; // 重新拋出錯誤以便調用者處理
  }
};

// 方法：GET
// URL：https://[your-worker].workers.dev/api/getmodelid?uuid=LINE用戶ID
export const getModelId = async (uuid: string): Promise<any> => {
  try {
    // 使用 URL 參數而不是請求體
    const response = await fetch(
      `${API_BASE_URL}/getmodelid?uuid=${encodeURIComponent(uuid)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API 錯誤: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("獲取模型 ID 失敗:", error);
    throw error;
  }
};

// /api/getPhotoProfile API 使用方式：
// 基本資訊
// 方法：GET
// URL：https://[your-worker].workers.dev/api/getPhotoProfile?photoId=12345
export const getPhotoProfile = async (modelId: string): Promise<any> => {
  try {
    // 使用 URL 參數而不是請求體
    const response = await fetch(
      `${API_BASE_URL}/getPhotoProfile?photoId=${encodeURIComponent(modelId)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API 錯誤: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("獲取照片資料失敗:", error);
    throw error;
  }
};

//getModelInfo
// 獲取模型資訊
export const getmodelfiles = async (uuid: string): Promise<any> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/getmodelfiles?uuid=${encodeURIComponent(uuid)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API 錯誤: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("獲取模型資訊失敗:", error);
    throw error;
  }
};

export default {
  checkUserExists,
  registerUser,
  getModelId,
  getPhotoProfile,
  getmodelfiles,
};
