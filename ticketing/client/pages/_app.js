import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <h1>Header, {currentUser?.email}</h1>
      <Component {...pageProps} />
    </div>
  );
};

// the _app component receives the props here as (Component, ctx: {...ctx, req})
// The getInitialProps is executed just once on the server or on the client.
AppComponent.getInitialProps = async ({ Component, ctx }) => {
  const { data } = await buildClient(ctx).get('/api/users/currentuser');
  // call the getInitialProps and pass the context otherwise if we call it in the AppComponent 
  // it does not automatically get called

  const pageProps = (Component.getInitialProps && await Component.getInitialProps(ctx)) || {};

  return { pageProps, currentUser: data.currentUser };
};

export default AppComponent;
