import React, { Component } from 'react';
import './App.css';

export default class App extends Component {
  state = {
    value: '',
    emails: [],
    error: null,
  };

  handleChange = event => {
    const value = event.target.value;
    this.setState({ value, error: null });
  };

  handleKeyDown = event => {  
    
    if (['Enter', 'Tab', ','].includes(event.key)) { 
      event.preventDefault();
      const value = this.state.value.trim();

      if (value && this.isValid(value)){
        this.setState({
          emails: [...this.state.emails, this.state.value], value: ''
        });
      }
    }
  };

  handleDelete = eMail => {
    this.setState({
      emails: this.state.emails.filter(email => email !== eMail )
    });
  }

  handlePaste = evt => {
    evt.preventDefault();

    const paste = evt.clipboardData.getData('text');
    // eslint-disable-next-line no-useless-escape
    const emails = paste.match(/[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/g);

    if (emails) {
      const toBeAdded = emails.filter(email => !this.isInList(email));

      this.setState({
        emails: [...this.state.emails, ...toBeAdded]
      });
    }
  };

  // eslint-disable-next-line no-useless-escape
  isEmail = email => /[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/.test(email);

  isInList = email => this.state.emails.includes(email);

  isValid = email => {
    let error = null;

    if (!this.isEmail(email)) {
      error = `${email} is not a valid email address.`;
    }

    if (this.isInList(email)){
      error = `${email} has already been added.`;
    }

    if (error) {
      this.setState({ error });
      
      return false;
    }

    return true;

  }


  render() {    
    return (
      <main className="wrapper">
        
        <input 
          className={'input ' + (this.state.error && ' has-error')}
          placeholder='Type or paste email addresses and press `Enter`' 
          value={this.state.value} 
          onChange={this.handleChange} 
          onKeyDown={this.handleKeyDown}
          onPaste={this.handlePaste}
        />
        {
          this.state.emails.map(email => 
            <div className="tag-item" key={email}>
              {email}
              <button
                className="button"
                type="button"      
                onClick={() => this.handleDelete(email)}> ×
              </button>
            </div>)
        }
        {this.state.error && <p className="error">{this.state.error}</p>}
      </main>
    );
  }
}
