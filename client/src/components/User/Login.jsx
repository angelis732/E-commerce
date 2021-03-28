import React, {useEffect} from "react";
import styles from './login.module.scss'
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from 'react-redux';
import { loginUser } from "../../actions/userAction";
import { useHistory } from "react-router-dom";
import dotenv from "dotenv"
dotenv.config();

const validate = (input) => {
  let errors = {};
  if (!input.email) {
    errors.email = "*Requiere un correo";
  } else if (!/\S+@\S+\.\S+/.test(input.email)) {
    errors.email = "Ingresar un correo valido";
  }
  
  if (!input.password) {
    errors.password = '*Requiere una Contraseña';
  } else if (!/(?=.*[0-9])/.test(input.password)) {
    errors.password = '*La contraseña debe llevar letras y números';
  }
  return errors;
};

export default function Login() {
  
  const [user, setUser] = React.useState({email: "", password: ""});
  const [errors, setErrors] = React.useState({});
  const history = useHistory();
  const dispatch = useDispatch();
  const loginFailed = useSelector(store => store.auth.loginFailed)
  const userState = useSelector(store => store.auth.userInfo)
  
  
  const handleSubmit = (event) => {
    
    event.preventDefault();
    setUser({
      ...user,
      [event.target.name]: event.target.value
    });
    
    if (Object.keys(errors).length === 0 ) {
      dispatch(loginUser(user.email, user.password))
    }
    setUser({email: "", password: ""});
  }
  
  const handleInputChange = function (event) {
    setErrors(validate({
      ...user,
      [event.target.name]: event.target.value
    }))
    
    setUser({
      ...user,
      [event.target.name]: event.target.value
    });
  }
  
  useEffect(() => {
    if(userState){
      history.push('/')
    }
  }, [history, userState])
  
  return (
    <div className={'container ' + styles.globalContainer}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Iniciar sesión</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          { loginFailed && <div className="alert alert-danger" role="alert">
            Los datos ingresados son incorrectos. Por favor, intente de nuevo.
          </div>
          }
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">*Correo electrónico</label>
            <input
              type="email"
              name="email"
              className={"form-control " + styles.input + `${errors.email && ' is-invalid'}`}
              id="exampleInputEmail1" aria-describedby="emailHelp"
              value={user.email}
              error={errors.email}
              required
              onChange={handleInputChange}
            />
            {errors.email && (<p className="invalid-feedback">{errors.email}</p>)}
          </div>
          <div className="mb-3">
            <label
              htmlFor="exampleInputPassword1"
              className="form-label">*Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={user.password}
              error={errors.password}
              required
              className={"form-control " + styles.input + `${errors.password && ' is-invalid'}`}
              id="exampleInputPassword1"
              onChange={handleInputChange}
            />
            {errors.password && (<p className="invalid-feedback">{errors.password}</p>)}
          </div>
          <Link to="/user/getEmail/">
            <div className="form-text" title="¿Olvidaste tu contraseña?">¿Olvidaste tu contraseña?</div>
          </Link>
          <div className={"d-grid gap-2 " + styles.btnIniciarSesion}>
            <button type="submit" className={"btn " + styles.btnText}>Iniciar sesión</button>
            <a href={`${process.env.REACT_APP_API_URL}/auth/google`} type="submit" className={"btn " + styles.btnGoogle}>
              <img className={styles.imgGoogle} src="https://img.icons8.com/color/48/000000/google-logo.png" alt=""/>
              &nbsp;&nbsp;&nbsp;Iniciar sesión con Google</a>
            <a href={`${process.env.REACT_APP_API_URL}/auth/facebook`} type='submit' className={"btn " + styles.btnFacebook}>
              <i className={"fab fa-facebook-f " + styles.imgFacebook}/>&nbsp;
              Iniciar sesión con Facebook
            </a>
          </div>
        </form>
        <Link to="/user/signup">
          <div className={"form-text " + styles.linkRegistrarte} title="Regístrate">¿No tienes una cuenta? Regístrate
          </div>
        </Link>
      </div>
    </div>
  )
}


