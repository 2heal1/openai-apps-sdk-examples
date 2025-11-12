import { Helmet } from '@modern-js/runtime/head';
import './index.css';
import MapProvider from '../components/MapProvider';
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
      <MapProvider markers={data.places} />
    </div>
  </div>
);

export default Index;
