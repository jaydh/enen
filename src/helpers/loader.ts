import * as Loadable from 'react-loadable';
import Loader from '../components/Loader';
export default (fun: () => Promise<any>) =>
  Loadable({ loader: fun, loading: Loader }) as any;
