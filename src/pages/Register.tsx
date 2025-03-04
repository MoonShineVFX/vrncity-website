import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      alert("請輸入電子郵件");
      return;
    }

    setIsSubmitting(true);

    try {
      // 這裡添加您的註冊邏輯
      console.log("註冊電子郵件:", email);

      // 註冊成功後導航到下一頁
      navigate("/verification"); // 或其他適合的頁面
    } catch (error) {
      console.error("註冊失敗:", error);
      alert("註冊失敗，請稍後再試");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center  min-h-screen bg-gray-100 ">
      <div className="w-full  p-8  bg-[#8b6142] text-white ">
        <h2 className="text-2xl font-semibold mb-4">註冊 SIGN UP</h2>

        <p className="text-sm mb-2 font-bold">
          提供信箱資料予本服務建立帳號
          <br />
          連結您的數位分身綁定並開始體驗
        </p>

        <p className="text-xs mb-6 text-gray-200">
          Provide your email information to establish an account
          <br />
          for this service. Bind your digital identity to experience.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm mb-2">
              信箱 Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="請輸入您的電子郵件"
              className="w-full p-1 rounded-xl border-2 border-gray-200 text-white focus:outline-none focus:ring-2 focus:ring-[#a67c52]"
              required
            />
          </div>
          <div className="mt-14">
            <div className="text-left mb-4 ">
              <p className="text-xs mb-1">創建帳號即表示您同意本網站使用條款</p>
              <p className="text-xs text-gray-200">
                By creating an account you agree to the terms of use.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4  bg-opacity-20 hover:bg-opacity-30 rounded-xl border-2 border-white text-white font-medium transition duration-200 ease-in-out disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "處理中..." : "註冊 SIGN UP"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
