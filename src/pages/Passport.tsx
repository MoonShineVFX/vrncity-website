import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import liffService from "../services/liffService";
import apiService from "../services/apiService";

function Passport() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userUuid, setUserUuid] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeLiff = async () => {
      try {
        setIsLoading(true);

        // 初始化 LIFF
        const isInitialized = await liffService.initLiff(
          liffService.LIFF_IDS.passport
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
        // const profile = await liffService.getUserProfile();

        // 檢查用戶是否存在並獲取 UUID
        try {
          const userData = await apiService.checkUserExists(email);

          if (userData.exists && userData.user?.uuid) {
            setUserUuid(userData.user.uuid);
          } else {
            // 用戶不存在，跳轉到註冊頁面
            liffService.redirectToLiff("register");
            return;
          }
        } catch (error) {
          console.error("獲取用戶信息失敗:", error);
          setError("獲取用戶信息失敗");
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
  }, [navigate]);

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
      <div className="flex justify-center items-center min-h-screen bg-[#8b6142] text-white">
        <div className="text-center p-4">
          <p className="text-xl mb-4">發生錯誤</p>
          <p className="mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-white/20 rounded-xl border border-white hover:bg-white/30"
          >
            重試
          </button>
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
      <div className="w-10/12 mx-auto pt-[10%]  ">
        {/* 標題區域 */}
        <div className="text-center mb-4 mx-auto w-10/12">
          <img src="./images/passporttitle.png" alt="logo" />
        </div>
        {/* QR碼掃描區域 */}
        <div className="w-64 h-64 mx-auto border-2 border-white/50 flex items-center justify-center mb-8 bg-white p-4 rounded-lg">
          {userUuid ? (
            <QRCodeSVG
              value={userUuid}
              size={220}
              level="H"
              includeMargin={false}
              bgColor="#FFFFFF"
              fgColor="#000000"
            />
          ) : (
            <div className="text-2xl font-bold tracking-widest text-gray-800">
              QR CODE
            </div>
          )}
        </div>

        {/* 提示文字 */}
        <p className="text-center text-sm mb-10">
          請將您的 QR Code 出示給掃描人員
        </p>
      </div>
    </div>
  );
}

export default Passport;
