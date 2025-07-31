import Form from "../components/Forms";

const RegisterPage = () => {
  return (
    <div >
      <h1 >Register</h1>
      <Form route="users/register/" isLogin={false} />
    </div>
  );
};

export default RegisterPage;
