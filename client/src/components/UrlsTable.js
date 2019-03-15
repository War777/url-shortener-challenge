import React, { Component } from 'react';
import UrlForm from './UrlForm';

class UrlsTable extends Component {

    constructor(){

        super();

        this.state = {
            page: 1,        // Iniciamos de la pagina 1
            limit: 10,       // Definimos 5 documentos por pagina
            total: 0,       // Total de documentos, se ajusta despues del primer fetch
            pages: 0,       // Total de pagina, se ajusta despues del primer fetch
            urls: [],   // Documentos (Productos), se ajusta despues del primer fetch
        }

        // Configuramos los eventos
        this.handleLiClick = this.handleLiClick.bind(this);
        this.fetchDocs = this.fetchDocs.bind(this);
        this.getUrl = this.getUrl.bind(this);
        this.handleAddUrl = this.handleAddUrl.bind(this);
        this.changePage = this.changePage.bind(this);
    }

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

    /* Genera una URL valida para la API, incluyendo la pagina y el limite de documentos a partir del estado */
    getUrl(){
        var url = 'http://localhost:3000/?page=' + this.state.page + '&limit=' + this.state.limit;
        return url;
    }

    /* Agregamos los documentos, pagina y el total de paginas al estado despues de montar el componente */
    componentDidMount(){
        this.fetchDocs();
    }

    /* Evento que actualiza los documento al hacer click en cada elemnto de la pgainacion */
    handleLiClick(e){
        this.setState(
            {
                page: parseInt(e.target.getAttribute('value'))
            },
            () => {
                this.fetchDocs();
            }
        );
    }

    /* Funcion para agregar un producto */
    handleAddUrl(){
        this.fetchDocs();
    }

    /* Funcion que actualiza los documentos, pagina y total de paginas al estado */
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

    /* Presentamos los elementos */
    render(){

        // Construimos la tabla d eproductos
        var urlsHtml = [];

        this.state.urls.forEach((url, i) => {
            urlsHtml.push(
                <tr>
                    <td className="text-nowrap text-center">{ url.createdAt }</td>
                    <td className="text-nowrap text-center">{ url.visits }</td>
                    <td className="text-nowrap">
                        <a href={ url.shorten } target="_blank"> { url.shorten } </a>
                    </td>
                </tr>
            );
        });

        if(this.state.limit - this.state.urls.length > 0){

            for(let i = 0; i < this.state.limit - this.state.urls.length; i++){
                urlsHtml.push(
                    <tr>
                        <td className="text-nowrap text-center"> - </td>
                        <td className="text-nowrap text-center"> - </td>
                        <td className="text-nowrap text-center"> - </td>
                    </tr>
                );
            }

        }

        // Contruimos la navegacion
        var navPages = [];

        if(this.state.pages > 0){

            for(var i = 0; i < this.state.pages; i++){
                navPages[i] = <li onClick={this.handleLiClick} className="page-item"> <a className="page-link" value={i+1}> {i+1} </a>  </li>;
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

        // Contruimos el renderizado final de la tabla con navegacion
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
                            </tr>
                        </thead>

                        { urlsHtml }

                    </table>

                    { this.state.urls.length > 0 ? nav : <hr/> }

                </div>
            </div>

        )
    }

}

export default UrlsTable;
