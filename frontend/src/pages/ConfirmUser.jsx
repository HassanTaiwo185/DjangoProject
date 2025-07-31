import Form from "../components/Forms";

const ConfirmUserPage = () => {
  return (
    <div >
      <h1>Confirm Your Account</h1>
      <Form route="users/confirm/" isLogin={false} />
    </div>
  );
};

export default ConfirmUserPage;
