import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';
import store from './store';
import Header from './common/header';
import Content from './common/content';
import { GlobalIcon } from './statics/iconfont/iconfont';
import { Globalstyle } from './style';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div>
          <Globalstyle />
          <GlobalIcon/>
          <BrowserRouter>
            <div>
              <Header />
              <Route path='/create-request' exact component={Content}></Route>
              <Route path='/my-requests' exact render={()=><div>hahah</div>}></Route>
              {/* <Route path='/request' exact render={()=><div>hahah</div>}></Route> */}
            </div>
          </BrowserRouter>
        </div>
      </Provider>
    );
  }
}

export default App;
