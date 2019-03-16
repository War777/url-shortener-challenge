import React, { Component } from 'react';

class DeleteUrl extends Component{

    constructor(props){

        super();

        this.deleteUrl = this.deleteUrl.bind(this);

    }

    /*
    * Deletes the url according the hash and remove remove token.
    * Fires an event to render the docs inside the parent table
    * after removing the shorten url.
    */
    deleteUrl(){

        if(!window.confirm('Are you sure to delete this URL?')){
            return false;
        }

        let url = `http://localhost:3000/${this.props.hash}/${this.props.removeToken}`;

        fetch(url, {
            method: 'delete',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-type': 'application/json'
            }
        })
        .then(res => res.json())
        .then((res) => {
            this.props.onDelete();
        })
        .catch((err)=> {
            console.log('error: ', err);
        });
    }

    /*
    * It renders a simple delete button.
    * Delets the shorten url on click
    */
    render(){

        return(

            <button className="btn btn-sm btn-outline-danger" onClick={this.deleteUrl}>
                X
            </button>

        )

    }

}

export default DeleteUrl;
