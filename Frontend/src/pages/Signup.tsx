import { useState } from "react";
import { Signup , VerifyOTP } from "../components/index";

interface UserData {
  email: string;
  fullName: string;
  password: string;
}

function SignupPage() {
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  const handleOTPSent = (data: UserData) => {
    setUserData(data);
    setShowOTPVerification(true);
  };

  const handleBackToSignup = () => {
    setShowOTPVerification(false);
    setUserData(null);
  };

  if (showOTPVerification && userData) {
    return <VerifyOTP userData={userData} onBack={handleBackToSignup} />;
  }

  return <Signup onOTPSent={handleOTPSent} />;
}

export default SignupPage;
