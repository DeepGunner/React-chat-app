import React, { Component } from 'react';
import { VERIFY_USER } from '../Events'

export default class LoginForm extends Component {
	constructor(props){
		super(props)

		this.state = {
			nickname:"",
			error:""
		}
		this.handleSubmit = this.handleSubmit.bind(this);
		this.setUser = this.setUser.bind(this);
	}
	setUser(response){
		if(!response.isUser){
			this.props.setUser(response.user)
		}
		else{
			this.setError("User name taken.")
		}

	}
	setError(error){
		this.setState({error});
	}

	//updates form inputs
	handleChange = (e)=>{
		this.setState({ nickname:e.target.value })
	}

//Sends emit to socket for verification
	handleSubmit(event){
		event.preventDefault()
		const { socket } = this.props
		const { nickname } = this.state
		socket.emit(VERIFY_USER, nickname, this.setUser)

	}
	render() {
		const {nickname,error} = this.state
		return (
			<div className="login">
				<form onSubmit={this.handleSubmit} className="login-form">
					<label htmlFor="nickname">
						<h2>Got a nickname?</h2>
					</label>
					<input
						ref={(input)=>{this.textInput= input}}
						type="text"
						id="nickname"
						value={nickname}
						onChange={this.handleChange}
						placeholder={"Myusername"}
					/>
					<div className="error">{error ? error:null}</div>
				</form>
			</div>
		);
	}
}
