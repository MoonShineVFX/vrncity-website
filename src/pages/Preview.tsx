import { useEffect, useState } from "react";
import liffService from "../services/liffService";
import apiService from "../services/apiService";
import "@google/model-viewer";

// {
//   "success": true,
//   "photo_id": "16448",
//   "models": {
//       "android": {
//           "url": "/api/getModelFiles?uuid=Ub1eb8f7afc947c886255deef9e4ea160&type=android",
//           "type": "glb"
//       },
//       "ios": {
//           "url": "/api/getModelFiles?uuid=Ub1eb8f7afc947c886255deef9e4ea160&type=ios",
//           "type": "usdz"
//       }
//   },
//   "original_urls": {
//       "android": "https://fullbodyscan-dev.msvfx.com/api/guest_animated_models/14298/model.glb?download=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQxNjkyNjk0LCJqdGkiOiJmZmY5MWFhZjhmNjU0OTE2YjA1MzRjYmJkOGYzMTM3YSIsInVzZXJfaWQiOiJOb25lIiwic2NvcGUiOiJkb3dubG9hZCIsInR5cGUiOiJBbmltYXRlZE1vZGVsIiwiZmJzX3Bob3RvX2lkIjoxNjQ0OH0.DN5f59X3jWYhL_i6-IFAk_xyoDY65ab9hASAmw_k_dg",
//       "ios": "https://fullbodyscan-dev.msvfx.com/api/guest_rigged_usdzs/11872/model.usdz?download=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQxNjkyNjk0LCJqdGkiOiJmNGRmMDljMjdlMDg0OTMwODY4ZTJlNjIwNTc5MzdjZCIsInVzZXJfaWQiOiJOb25lIiwic2NvcGUiOiJkb3dubG9hZCIsInR5cGUiOiJSaWdnZWRVU0RaIiwiZmJzX3Bob3RvX2lkIjoxNjQ0OH0.fZRlKUDgNDNG9oRGrLSBMMxZ32GdI5SC9_baCqCH3yg"
//   },
//   "user_uuid": "Ub1eb8f7afc947c886255deef9e4ea160"
// }
interface ModelInfo {
  success: boolean;
  photo_id: string;
  models: {
    android: {
      url: string;
      type: string;
    };
    ios: {
      url: string;
      type: string;
    };
  };
  original_urls: {
    android: string;
    ios: string;
  };
  user_uuid: string;
}

function Preview() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState("");
  const [modelInfoData, setModelInfoData] = useState<ModelInfo | null>(null);
  // const [modelId, setModelId] = useState<string | null>(null);
  // const [showAR, setShowAR] = useState(false);

  useEffect(() => {
    const initializeLiff = async () => {
      try {
        setIsLoading(true);

        // 初始化 LIFF
        const isInitialized = await liffService.initLiff(
          liffService.LIFF_IDS.preview
        );

        if (!isInitialized) {
          setError("LIFF 初始化失敗");
          setIsLoading(false);
          return;
        }

        // 檢查是否已登入
        if (!liffService.isLoggedIn()) {
          // 未登入，進行登入
          liffService.login();
          return;
        }

        // 獲取用戶 email
        const email = await liffService.getUserEmail();

        if (!email) {
          setError("無法獲取用戶 email");
          setIsLoading(false);
          return;
        }

        // 獲取用戶資料
        const profile = await liffService.getUserProfile();
        if (profile) {
          setUserName(profile.displayName);
          console.log("profile", userName);
        }

        // 檢查用戶是否存在並獲取 UUID
        try {
          const userData = await apiService.checkUserExists(email);

          if (userData.exists && userData.user?.uuid) {
            // 獲取用戶的模型 ID
            try {
              const modelInfo = await apiService.getmodelfiles(
                userData.user.uuid
              );
              console.log("modelInfo", modelInfo);
              if (modelInfo.success) {
                setModelInfoData(modelInfo);
                // const modelViewer = document.querySelector("model-viewer");
                // if (modelViewer) {
                //   modelViewer.src =
                //     "https://vrnortherncity-line-api.divine-wave-35ee.workers.dev" +
                //     modelInfo.models.android.url;
                //   modelViewer.iosSrc =
                //     "https://vrnortherncity-line-api.divine-wave-35ee.workers.dev" +
                //     modelInfo.models.ios.url;
                // }
              }
            } catch (error) {
              console.error("獲取模型 ID 失敗:", error);
              setError("獲取預覽模型失敗，請先確認已經建立分身");
            }
          } else {
            // 用戶不存在，跳轉到註冊頁面
            liffService.redirectToLiff("register");
            return;
          }
        } catch (error) {
          console.error("獲取用戶信息失敗:", error);
          setError("獲取用戶信息失敗，請先確認已經註冊");
          setIsLoading(false);
          return;
        }

        setIsLoading(false);
      } catch (error) {
        console.error("初始化過程出錯:", error);
        setError("初始化過程出錯");
        setIsLoading(false);
      }
    };

    initializeLiff();
  }, []);

  // 切換 AR 模式
  // const toggleAR = () => {
  //   setShowAR(!showAR);
  // };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#8b6142] text-white">
        <div className="text-center">
          <p className="text-xl mb-4">載入中...</p>
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex justify-center items-center min-h-screen bg-gray-50 font-noto-serif-tc  bg-no-repeat text-[#753100]"
        style={{
          backgroundImage: "url('./images/bg02.png')",
          backgroundPosition: "top",
          backgroundSize: "100%",
        }}
      >
        <div className="text-center mb-4 mx-auto w-10/12">
          <img src="./images/nopreview.png" alt="logo" />
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex justify-center min-h-screen bg-gray-50 font-noto-serif-tc  bg-no-repeat text-[#753100]"
      style={{
        backgroundImage: "url('./images/bg02.png')",
        backgroundPosition: "top",
        backgroundSize: "100%",
      }}
    >
      <div className="w-10/12 mx-auto pt-[5%]  ">
        <div className="text-center mb-4 mx-auto w-10/12">
          <img src="./images/previewtitle.png" alt="logo" />
        </div>

        {/* 照片預覽或 AR 模型 */}
        <div className=" my-4">
          {modelInfoData?.success ? (
            <div className="flex flex-col items-center">
              <div className="w-10/12 mx-auto h-[60vh]">
                {/* @ts-ignore */}
                <model-viewer
                  src={
                    "https://vrnortherncity-line-api.divine-wave-35ee.workers.dev" +
                    modelInfoData.models.android.url
                  }
                  ios-src={
                    "https://vrnortherncity-line-api.divine-wave-35ee.workers.dev" +
                    modelInfoData.models.ios.url
                  }
                  alt="您的 3D 數位分身"
                  shadow-intensity="1"
                  autoplay
                  interaction-prompt="auto"
                  magic-leap
                  id="modelViewer"
                  animation-name="talk"
                  xr-environment
                  ar
                  camera-controls
                  touch-action="pan-y"
                  style={{ width: "100%", height: "100%" }}
                >
                  <button
                    slot="ar-button"
                    id="ar-button"
                    className="px-4 py-2 bg-[#753100] rounded-lg text-[#fff] font-bold"
                  >
                    AR 模式
                  </button>

                  {/* @ts-ignore */}
                </model-viewer>
              </div>
            </div>
          ) : (
            <div className="text-center p-8 bg-white/10 rounded-lg">
              <p className="text-lg mb-2">尚未建立數位分身</p>
              <p className="text-sm text-gray-200">
                請先完成掃描流程以建立您的數位分身
              </p>
            </div>
          )}
        </div>

        {/* 返回按鈕 */}
        <div className="text-center">
          <button
            onClick={() => liffService.redirectToLiff("passport")}
            className="px-6 py-2 bg-[#753100] text-[#fff]  rounded-xl  hover:bg-[#753100]/80 transition"
          >
            返回掃描頁面
          </button>
        </div>
      </div>
    </div>
  );
}

export default Preview;
