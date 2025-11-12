import { Helmet } from '@modern-js/runtime/head';
import './index.css';
import AlbumsProvider from '../components/AlbumsProvider';
import data from '../components/markers.json';

const Index = () => (
  <div className="container-box">
    <Helmet>
      <link
        rel="icon"
        type="image/x-icon"
        href="https://lf3-static.bytednsdoc.com/obj/eden-cn/uhbfnupenuhf/favicon.ico"
      />
    </Helmet>

    <div className="landing-page">
      <AlbumsProvider albums={data.albums} />
    </div>
  </div>
);

export default Index;
