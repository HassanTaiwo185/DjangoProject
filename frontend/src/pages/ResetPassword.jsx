import Form from "../components/Forms";

const ResetPasswordPage = () => {
  return (
    <div >
      <h1 >Reset Password</h1>
      <Form route="users/reset/" isLogin={false} />
    </div>
  );
};

export default ResetPasswordPage;
