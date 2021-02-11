import buildClient from '../api/build-client'

const LandingPage = ({ currentUser }) => {
  return currentUser ? <h1>You are signed in</h1> : <h1>Landing page</h1>;
};

// This is executed just once on the server or on the client.
LandingPage.getInitialProps = async (context) => {
 const { data } = await buildClient(context).get('/api/users/currentuser');

 return data;
};

export default LandingPage;
