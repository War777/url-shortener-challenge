import React, { Component } from 'react';

import UrlsTable from './components/UrlsTable';

class App extends Component{

    render(){
        return (
            <div className="container">

                <br/>

                <h1>Url Shortener</h1>

                <p>
                    This is a very basic tool to shorten your very very large URLs with cool stuff ready to share
                    everything you want! :)
                </p>

                <UrlsTable />

                <div className="text-center font-weight-light mt-2 mb-2">
                    Created by <a href="https://github.com/War777" target="_blank"> Oscar Mendoza </a>
                </div>

            </div>
        )
    }

}

export default App;
