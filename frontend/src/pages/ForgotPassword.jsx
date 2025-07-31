import Form from "../components/Forms";

const ForgotPasswordPage = () => {
  return (
    <div >
      <h1>Forgot Password</h1>
      <Form route="users/forgot/" isLogin={false} />
    </div>
  );
};

export default ForgotPasswordPage;
