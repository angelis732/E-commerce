import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import {Link} from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {Modal, ModalHeader} from 'reactstrap'
import { connect } from 'react-redux'
import { forgotPassword } from '../../actions/userAction'
import { useHistory } from 'react-router-dom'
import styles from './resetPass.module.scss'

function Copyright() {

  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
     
        Kitty's Shop
        {' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textSizeAdjust: 12
  },
  row: {
    marginTop: theme.spacing(4),
    marginRight: theme.spacing(4),
    display: 'flex',
    flexDirection: 'row',
    float:'right',
    textSizeAdjust: 12
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    color: 'black',
    backgroundColor: '#f5b453',
    fontWeight: 'bold'
  },
}));

 function validate(input) {
  let errors = {};
  
  if (!input.email) {
    errors.email = "**Requiere un correo";
  } else if (!/\S+@\S+\.\S+/.test(input.email)) {
    errors.email = "**Ingresar un correo valido";
  }
  return errors;
}

 function GetEmail(props) {
  const classes = useStyles();
  const history = useHistory()
  
  console.log(props)

  const [input, setInput] = useState({
    email: '',
  })

  const [modal, setModal] = useState(true);
  const toggle = () => {
    history.push("/");
    setModal(!modal);
  }

   const [errors, setErrors] = useState({});

  const handleChange = e => {
    setInput({
      ...input,
      [e.target.name]: e.target.value
    });
    setErrors(validate({
      ...input,
      [e.target.name]: e.target.value
    }));
  }


const handleSubmit = (e) => {
  e.preventDefault();
}

const handleSend = async function (email) {
 try{ await props.forgotPassword(email);
 }
 catch(error){
   console.log(error)
 }
}

  return (
    <Modal isOpen={modal} toggle={toggle}>

      <ModalHeader toggle={toggle}>
        <h2>Recuperar Contraseña</h2>
      </ModalHeader>
 
      <Container component="main" maxWidth="xs">
     
        <div className={classes.paper}>
        <h3>Ingresa tu Mail</h3>
        <br/>
          <form onSubmit={(e) => handleSubmit(e)}>
           
              <Grid item xs={12}>
                <TextField
               
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  name="email"
                  label="Correo Electrónico"
                  value={input.email}
                  onChange={handleChange}
                />
              </Grid>
              {errors.email && (
                    <p className={styles.danger}>{errors.email}</p>
                  )}
        
            
            {errors.email ?
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled
              >
              Enviar
          </Button>
              : props.error === true ?
              <Container  className={props.className}>
        
        <div className={classes.paper}><strong>Este usuario no se encuentra registrado!</strong></div>
     
              <div>
                <div className={classes.row}>
                <Link to="/">
                <div className={styles.link}><strong>Inicio</strong></div></Link>
                </div>
                <div className={classes.row}>
                <Link to="/user/signup">
                <div className={styles.link}> <strong>Regístrate</strong></div></Link>
                </div>
              </div>
             
          </Container>
           : props.error === false ?
           <Container className={props.className}>
        
           <div className={classes.paper}><strong>Correo enviado! Sigue las instrucciones para cambiar tu contraseña</strong></div>
  
            <div className={classes.paper}>
             <Link to="/" >
             <div className={styles.link}> <strong>Inicio</strong></div></Link>
             </div>
             <br/>
             <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled>
              Enviar
          </Button>
         
       </Container>
             :
            <Button
              type="submit"
              fullWidth
              color="primary"
              variant="contained"
              onClick={() => handleSend({email: input.email})}
              className={classes.submit}>
              Enviar
          </Button>
            }
            
          </form>
        </div>
        <Box mt={3}>
          <Copyright />
        </Box>
        
      </Container>
     
    
    </Modal >
    
  );
}

function mapStateToProps(state) {
  return {
    error: state.product.error,
    loading: state.product.loading
  }
}
function mapDispatchToProps(dispatch) {
  return {
    forgotPassword: (email) => dispatch(forgotPassword(email))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(GetEmail)
