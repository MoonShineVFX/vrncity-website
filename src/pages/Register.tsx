import { useState, useEffect } from "react";
import liffService from "../services/liffService";
import apiService from "../services/apiService";

function Register() {
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [userPicture, setUserPicture] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userExists, setUserExists] = useState(false);
  const [isCheckingUser, setIsCheckingUser] = useState(false);

  useEffect(() => {
    const initializeLiff = async () => {
      try {
        setIsLoading(true);

        // 初始化 LIFF
        const isInitialized = await liffService.initLiff(
          liffService.LIFF_IDS.register
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
        const userEmail = await liffService.getUserEmail();

        if (userEmail) {
          setEmail(userEmail);
          // 檢查用戶是否已存在
          await checkUserExistence(userEmail);
        }

        // 獲取用戶資料
        const profile = await liffService.getUserProfile();
        if (profile) {
          setUserName(profile.displayName);
          setUserPicture(profile.pictureUrl || "");
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

  // 檢查用戶是否已存在
  const checkUserExistence = async (emailToCheck: string) => {
    if (!emailToCheck) return;

    try {
      setIsCheckingUser(true);
      const userData = await apiService.checkUserExists(emailToCheck);
      setUserExists(userData.exists);
      setIsCheckingUser(false);
    } catch (error) {
      console.error("檢查用戶失敗:", error);
      setIsCheckingUser(false);
    }
  };

  // 當用戶更改電子郵件時檢查是否存在
  // const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const newEmail = e.target.value;
  //   setEmail(newEmail);

  //   // 如果輸入有效的電子郵件，檢查是否存在
  //   if (newEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
  //     checkUserExistence(newEmail);
  //   } else {
  //     setUserExists(false);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      alert("請輸入電子郵件");
      return;
    }

    // 如果用戶已存在，直接跳轉到掃描頁面
    if (userExists) {
      liffService.redirectToLiff("passport");
      return;
    }

    setIsSubmitting(true);

    try {
      // 獲取 LINE 用戶 ID
      const profile = await liffService.getUserProfile();

      if (!profile) {
        throw new Error("無法獲取用戶資料");
      }

      // 註冊用戶
      await apiService.registerUser(
        profile.displayName,
        profile.userId,
        email,
        profile.userId
      );

      // 註冊成功後導航到掃描頁面
      liffService.redirectToLiff("passport");
    } catch (error) {
      console.error("註冊失敗:", error);
      alert("註冊失敗，請稍後再試");
    } finally {
      setIsSubmitting(false);
    }
  };

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
      className="flex justify-center min-h-screen bg-gray-50  bg-no-repeat text-[#753100] font-noto-serif-tc"
      style={{
        backgroundImage: "url('./images/bg02.png')",
        backgroundPosition: "top",
        backgroundSize: "100%",
      }}
    >
      <div className="w-full p-8 ">
        <h2 className="text-3xl   font-black mb-4">註冊 SIGN UP</h2>

        {/* 顯示用戶資料 */}
        {userPicture && (
          <div className="flex items-center mb-6">
            <img
              src={userPicture}
              alt={userName}
              className="w-16 h-16 rounded-full mr-4 border-2 border-white"
            />
            <div>
              <p className="font-bold">{userName}</p>
              <p className="text-sm ">LINE 用戶</p>
            </div>
          </div>
        )}

        <p className="text-sm mb-2 font-bold">
          提供信箱資料予本服務建立帳號
          <br />
          連結您的數位分身綁定並開始體驗
        </p>

        <p className="text-[10px] mb-6 ">
          Provide your email information to establish an account
          <br />
          for this service. Bind your digital identity to experience.
        </p>

        {userExists ? (
          <div className="mb-6 p-4 bg-[#753100]/10 rounded-xl border border-[#753100]/30">
            <p className="text-center font-bold">此電子郵件已註冊</p>
            <p className="text-center text-sm mt-2">
              您可以直接點擊下方按鈕繼續
            </p>
            <button
              onClick={() => liffService.redirectToLiff("passport")}
              className="w-full mt-4 py-2 px-4  bg-opacity-20 hover:bg-opacity-30 rounded-xl border-2 border-[#753100] text-[#753100] font-medium transition duration-200 ease-in-out"
            >
              前往掃描頁面
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm mb-2 font-bold">
                信箱 Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                placeholder="請輸入您的電子郵件"
                className="w-full p-3 rounded-xl border-2 border-[#753100] bg-white text-[#753100] focus:outline-none focus:ring-2 focus:ring-[#a67c52] placeholder:text-[#75310080]"
                required
                disabled={isCheckingUser}
              />
              {isCheckingUser && (
                <p className="text-xs mt-1 text-gray-200">檢查中...</p>
              )}
            </div>
            <div className="mt-14">
              <div className="text-left mb-4 ">
                <p className="text-xs mb-1 font-bold">
                  創建帳號即表示您同意本網站使用條款
                </p>
                <p className="text-[10px] ">
                  By creating an account you agree to the terms of use.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-2 px-4  bg-[#753100] hover:bg-opacity-30 rounded-xl  text-white   font-medium transition duration-200 ease-in-out disabled:opacity-50"
                disabled={isSubmitting || isCheckingUser}
              >
                {isSubmitting ? "處理中..." : "註冊 SIGN UP"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Register;
