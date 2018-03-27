import React, { Component } from 'react';
import io from 'socket.io-client'
import {USER_CONNECTED,LOGOUT} from '../Events'
import LoginForm from './LoginForm'

const socketUrl = "http://10.13.6.33:3231"

export default class Layout extends Component {
	constructor(props){
		super(props);
		this.state={
			socket:null,
			user:null
		};
	}

	componentWillMount() {
		this.initSocket()
	}
	/*
	*	Connect to and initializes the socket.
	*/
	initSocket = ()=>{
			const socket = io(socketUrl)
			socket.on('connect', ()=>{
				console.log("connected");
			})
			this.setState({socket})
	}
	/*
	* Sets the user property in state
	*	@param user {id:number, name:string}
	*/
	setUser = (user)=>{
			console.log(user);
			const { socket } = this.state
			socket.emit(USER_CONNECTED, user);
			this.setState({user})
	}

	/*
	*	Sets the user property in state to null.
	*/
	logout = ()=>{
			const { socket } = this.state
			socket.emit(LOGOUT)
			this.setState({user:null})

	}


	render() {
		const {socket} = this.state
		return (
			<div className="container">
				<LoginForm socket={socket} setUser={this.setUser}/>
			</div>
		);
	}
}
