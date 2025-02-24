import { useState } from "react";
import { useDispatch, useSelector } from "react-redux"; 
import { loginComponent } from "@/config";
import CombinedForm from "@/components/auth/mainform";
import { loginUser } from "@/store/authslice"; // Import the login action
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth); // Access loading and error from the auth slice

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const resultAction = await dispatch(loginUser(formData));
      if (loginUser.fulfilled.match(resultAction)) {
        // If login is successful, set the token in sessionStorage
        sessionStorage.setItem('token', resultAction.payload.token);
        navigate('/home'); // Redirect to dashboard after successful login
      }
    } catch (error) {
      console.error(error); // Handle error if needed
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {error && <p className="text-red-500">{error}</p>} {/* Display error message if exists */}
      <CombinedForm
        formData={formData}
        setFormData={setFormData}
        formControls={loginComponent}
        buttonText={loading ? "Logging in..." : "Login"}
        onHandleSubmit={handleSubmit} // Pass the handleSubmit function
      />
    </div>
  );
};

export default Login;
