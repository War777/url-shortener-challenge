import React, { Component } from 'react';

import UrlForm from './UrlForm';
import DeleteUrl from './DeleteUrl';

class UrlsTable extends Component {

    constructor(){

        super();

        this.state = {
            page: 1,        // Starts in the page 1, it changes with every changePage() call.
            limit: 10,      // Docs per page
            total: 0,       // Total docs in the urls collection, it sets with each fetchDocs() call
            pages: 0,       // Available pages in the urls collection, it sets with each fetchDocs() call
            urls: [],       // Current urls to show inside the table
        }

        this.changePage = this.changePage.bind(this);

        this.fetchDocs = this.fetchDocs.bind(this);

        this.getUrl = this.getUrl.bind(this);

        this.handleClick = this.handleClick.bind(this);

        this.handleAddUrl = this.handleAddUrl.bind(this);

    }

    /**
    * Changes the previous/next page
    * Evaluates the anchor that calls this function
    * @params e
    */
    changePage(e){

        e.preventDefault();

        let currentPage = this.state.page;

        let direction = e.target.getAttribute('direction');

        if(direction === 'previous'){

            if(currentPage > 1){

                currentPage--;

                this.setState({
                    page: currentPage
                }, () => {
                    this.fetchDocs();
                });

            }

        } else {

            if(this.state.pages > currentPage){

                currentPage++;

                this.setState({
                    page: currentPage
                }, () => {
                    this.fetchDocs();
                });
            }

        }

    }

    /**
    * Generates the url that is going to be fetched
    * according the current page and documents limit per page
    */
    getUrl(){
        var url = 'http://localhost:3000/?page=' + this.state.page + '&limit=' + this.state.limit;
        return url;
    }

    /*
    * Fetches the docs to be rendered inside the table
    * after the component is mounted
    */
    componentDidMount(){
        this.fetchDocs();
    }

    /*
    * Change the current page by clicking nav buttons
    * Renders the docs in the page inside the table
    */
    handleClick(e){
        this.setState(
            {
                page: parseInt(e.target.getAttribute('value'))
            },
            () => {
                this.fetchDocs();
            }
        );
    }

    /*
    * Fires fetchDocs() event
    * It's called inside the UrlForm component after each url creation
    */
    handleAddUrl(){
        this.fetchDocs();
    }

    /*
    * Fetches url inside the urls collection
    * Set urls to render inside the table with the documents
    * inside the current page
    */
    fetchDocs(){

        var url = this.getUrl();

        fetch(url)
        .catch(err => console.log(err))
        .then(res => res.json())
        .then(res =>
            this.setState({
                urls: res.docs,
                total: res.total,
                pages: res.pages
            })
        );
    }

    /*
    * Renders a table with the urls
    * with nav pagination separating each page
    * with the number of urls per page
    */
    render(){

        // Urls in table row format
        var urlsHtml = [];

        this.state.urls.forEach((url, i) => {

            urlsHtml.push(

                <tr id={url._id}>
                    <td className="text-nowrap text-center">{ url.createdAt }</td>
                    <td className="text-nowrap text-center">{ url.visits }</td>
                    <td className="text-nowrap">
                        <a href={ url.shorten } target="_blank"> { url.shorten } </a>
                    </td>

                    // Puts the delete button inside the table row
                    <td className="text-nowrap text-center">
                        <DeleteUrl onDelete={this.fetchDocs} hash={url.hash} removeToken={url.removeToken} />
                    </td>

                </tr>

            );
        });

        // Fills the page with empty rows in case the number of url is less than the urls per page
        if(this.state.limit - this.state.urls.length > 0){

            for(let i = 0; i < this.state.limit - this.state.urls.length; i++){

                urlsHtml.push(

                    <tr id={i}>
                        <td className="text-nowrap text-center"> - </td>
                        <td className="text-nowrap text-center"> - </td>
                        <td className="text-nowrap text-center"> - </td>
                        <td className="text-nowrap text-center"> - </td>
                    </tr>

                );

            }

        }

        // It builds the nav pagination
        var navPages = [];

        if(this.state.pages > 0){

            for(var i = 0; i < this.state.pages; i++){
                navPages[i] = <li onClick={this.handleClick} className="page-item"> <a className="page-link" value={i+1}> {i+1} </a>  </li>;
            }

        }

        var nav =
            <ul className="pagination justify-content-center">

                <li className="page-item">
                    <a className="page-link" href="#" direction="previous" onClick={this.changePage}>
                        &laquo;
                    </a>
                </li>

                { navPages }

                <li className="page-item">
                    <a className="page-link" href="#" direction="next" onClick={this.changePage}>
                        &raquo;
                    </a>
                </li>

            </ul>;

        // It renders the table nesting the previus built html elements
        return(

            <div>

                <UrlForm onAddUrl={this.handleAddUrl}/>

                { this.state.urls.length === 0 ? <div className="mt-3 text-right font-weight-bold">No URLs added yet :( </div> : <br/> }

                <br/>

                <div className="table-responsive">

                    <table className="table  table-sm table-bordered" >

                        <thead>
                            <tr>
                                <td className="text-center font-weight-bold">Date</td>
                                <td className="text-center font-weight-bold">Visits</td>
                                <td className="text-center font-weight-bold">Short Url</td>
                                <td className="text-center font-weight-bold">Delete</td>
                            </tr>
                        </thead>

                        <tbody>
                            { urlsHtml }
                        </tbody>

                    </table>

                    { this.state.urls.length > 0 ? nav : <hr/> }

                </div>
            </div>

        )
    }

}

export default UrlsTable;
