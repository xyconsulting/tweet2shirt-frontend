/* global Stripe */
import React from 'react';
import './Product.css';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUB_KEY);
const serverUrl = process.env.REACT_APP_SERVER_API_URL;

export class Product extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            priceData: {},
            size: "",
            errorMsg:""
        };
        this.componentDidMount = this.componentDidMount.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    componentDidMount(){
        console.log(serverUrl);
        console.log(process.env.REACT_APP_STRIPE_PUB_KEY);
        let id = this.props.match.params.id;
        fetch(`${serverUrl}/price`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({id:id})
        })
        .then((response) => response.json())
        .then((jsonData) => this.setState({priceData:jsonData}));
    }
    async handleClick(event){
        if(this.state.size){
            const stripe = await stripePromise;
            let data = this.state.priceData;
            data.size = this.state.size;
            const response = await fetch(`${serverUrl}/create-checkout-session`,{
                method:'POST',
                mode: 'cors',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(data)
            });

            const session = await response.json();

            const result = await stripe.redirectToCheckout({
                sessionId: session.id,
            });
        }
        else{
            this.setState({errorMsg:"Please select a size first."})
        }
    }
    render(){
        return(
            <div className="Product">
                <img src={this.state.priceData.product ? this.state.priceData.product.images[0]:""}/>
                <h1>{this.state.priceData.product ? this.state.priceData.product.name:""}</h1>
                <p className="error">{this.state.errorMsg}</p>
                <select name="size" id="size" value={this.state.size} onChange={
                    (e) => this.setState({size:e.target.value})}>
                    <option value="" hidden>Pick a Size</option>
                    <option value="4011">Small</option>
                    <option value="4012">Medium</option>
                    <option value="4013">Large</option>
                    <option value="4014">Extra Large</option>
                </select>
                <button onClick={this.handleClick} size={this.state.size}>Buy Now</button>
            </div>
        )
    }
}