import axios from 'axios';

export default ({ req }) => {
  let baseURL = '/';

  // when executed on the server as it is ran inside a container it needs to reach out to nginx
  // so we need to point it to the corect service in the ingress-nginx namespace with the correct headers
  // as this service is the same for all domains
  if (typeof window === 'undefined') {
    baseURL = 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/';
  }

  // just pass the headers from the req where are all the cookies and the Host header
  return axios.create({
    baseURL,
    headers: req && req.headers,
  });
};
