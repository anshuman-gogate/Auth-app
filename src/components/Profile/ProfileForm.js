import { useRef, useContext } from 'react';
import classes from './ProfileForm.module.css';
import AuthContext from '../../store/auth-context';
import { useHistory } from 'react-router-dom'

const API_KEY = 'AIzaSyDtLjxafYN0TGamcO2J2nRxoxCpdsplH08';

const ProfileForm = () => {
  const { token } = useContext(AuthContext)
  const newPasswordInputRef = useRef();
  const history = useHistory();

  function submitHandler (e) {
    e.preventDefault();
    const enteredNewPassword = newPasswordInputRef.current.value;

    // add validation here
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${API_KEY}`
    fetch(url , {
      method: 'POST',
      body: JSON.stringify({
        idToken: token,
        password: enteredNewPassword,
        returnSecureToken: false
      }),
      'Content-Type': 'application/json'
    })
    .then (res => {
      if (res.ok) return res.json();
      throw new Error('Password change failed!')
    })
    .then (data => history.push('/'))
    .catch (err => alert(err))
  }

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input 
          type='password' 
          id='new-password' 
          ref={newPasswordInputRef} 
          minLength={7}
        />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
