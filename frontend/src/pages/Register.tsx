import { useState } from "react";
import { useDispatch, useSelector } from "react-redux"; 
import { useNavigate } from "react-router-dom"; // Import useNavigate
import CombinedForm from "@/components/auth/mainform";
import { registerUser } from "@/store/authslice";
import { registerComponent } from "@/config";

const Register: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize navigate
  const { loading, error } = useSelector((state) => state.auth); // Access loading and error from the auth slice

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(formData);
    // Dispatch the registerUser action with formData
    const resultAction = await dispatch(registerUser(formData));

    // Check if registration was successful
    if (registerUser.fulfilled.match(resultAction)) {
      navigate('/auth/login'); // Navigate to login page on successful registration
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {error && <p className="text-red-500">{error}</p>} {/* Display error message if exists */}
      <CombinedForm
        formData={formData}
        setFormData={setFormData}
        formControls={registerComponent}
        buttonText={loading ? "Registering..." : "Register"} // Show loading state
        onHandleSubmit={handleSubmit} // Pass the handleSubmit function
      />
    </div>
  );
};

export default Register;
