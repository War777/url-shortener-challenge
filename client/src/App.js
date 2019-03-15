import React, { Component } from 'react';

import UrlsTable from './components/UrlsTable';

class App extends Component{

    render(){
        return (
            <div className="container">
                <br/>
                <h1>Url Shortener</h1>
                <br/>
                <UrlsTable />
            </div>
        )
    }

}

export default App;
