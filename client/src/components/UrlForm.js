import React, {Component} from 'react';

class UrlForm extends Component{

    constructor(){

        super();

        this.state = {
            url: '',
            isShortened: false
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.copyToClipboard = this.copyToClipboard.bind(this);

    }

    /**
    * Copies the actual shortened url to clipboard
    */
    copyToClipboard(){

        let inputUrl = document.getElementById('inputUrl');
        inputUrl.focus();
        inputUrl.select();
        document.execCommand('copy');
        alert('Copied to clioboard!');
    }

    /**
    * Sends the url to endpoint
    * After a succesful response changes the original url
    * to the shorten inside the form input
    */
    handleSubmit(e){

        e.preventDefault();

        if(this.state.url.length === 0) {
            alert('Empty URL!');
            return false;
        }

        if(this.state.isShortened === false){

            let url = 'http://localhost:3000/';

            fetch(url, {
                method: 'post',
                body: JSON.stringify(this.state),
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-type': 'application/json'
                }
            })
            .then((res) => {
                if(!res.ok){
                    throw res;
                } else {
                    return res.json();
                }
            })
            .then((res) => {
                // alert(res.message);
                this.setState({
                    url: res.shortUrl.shorten,
                    isShortened: true
                }, () => {
                    this.props.onAddUrl();
                });

            })
            .catch((err) => {
                alert(err.statusText);
            });
        }


    }

    /*
    * Change the state with the actual input value
    * to send it to the endpoint later
    */
    handleChange(e){

        this.setState({
            isShortened: false,
            url: e.target.value
        });
    }

    /*
    * Renders the form.
    * Renders a button to short or a button to copy to clipboard
    * according to the state if it has been shortened
    */
    render(){

        return(

            <form action="" onSubmit={this.handleSubmit}>

                <div className="input-group">

                    <input type="text" id="inputUrl" value={this.state.url} onChange={this.handleChange}
                    className="form-control" placeholder="https://type.com/a-long-url-with-some-great-stuff-to-shorten" />

                    <div className="input-group-append">
                        {
                            this.state.isShortened
                            ? <button className="btn btn-outline-danger" type="button" id="shorten-button" onClick={this.copyToClipboard}> Copy </button>
                            : <button className="btn btn-outline-primary" type="submit" id="shorten-button">Shorten</button>
                        }
                    </div>

                </div>

            </form>

        )

    }

}

export default UrlForm;
