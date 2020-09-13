/* global Stripe */
import React from 'react';
import './Product.css';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';

const stripePromise = loadStripe('pk_test_51HQdWeASgcEJxMSWHww676gu5QpI4su56BeH7QOi5wS4H5aJO4YMA2AvLPfIfJGfW5anU82hweD1azW1iXZmeixH00DgWCGqk4');

export class Product extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            product: {}
        };
        this.componentDidMount = this.componentDidMount.bind(this);
    }
    componentDidMount(){
        let id = this.props.match.params.id;
        fetch('http://localhost:4242/product', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({id:id})
        })
        .then((response) => response.json())
        .then((jsonData) => this.setState({product:jsonData}));
    }
    render(){
        if (this.state.product === {}) return null;
        return(
            <div className="Product">
                <img src={this.state.product.images ? this.state.product.images[0]:""}/>
                <h1>{this.state.product.name}</h1>
                <Elements stripe={stripePromise}>
                    <CheckoutForm product={this.state.product} stripe={stripePromise} />
                </Elements>
            </div>
        )
    }
}