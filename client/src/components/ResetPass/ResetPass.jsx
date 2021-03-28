import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Modal, ModalHeader } from 'reactstrap'
import { connect } from 'react-redux'
import { updatePassword} from '../../actions/userAction'
import { useHistory } from 'react-router-dom'
import styles from './resetPass.module.scss'
import {Link} from "react-router-dom";

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
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
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
  if (!input.newPass) {
    errors.password = '**Requiere una Contraseña';

  } else if (input.newPass.length < 8) {
    errors.newPass = '**La contraseña debe tener minimo 8 caracteres';
  } else if (!/(?=.*[0-9])/.test(input.newPass)) {
    errors.newPass = '**La contraseña debe llevar letras y números';
  }
  if (!input.verifyPass) {
    errors.verifyPass = "**Escribe nuevamente la contraseña"
  }
  if (input.newPass !== input.verifyPass) {
    errors.verifyPass = "**Los campos no coinciden, favor escribir nuevamente"
  }

  return errors;
}

function ResetPass(props) {
  
  const classes = useStyles();
  const history = useHistory()

  const [input, setInput] = useState({
    newPass: '',
    verifyPass: '',
  })
  const [modal, setModal] = useState(true);
  const toggle = () => {
    history.push("/");
    setModal(!modal);
  }
  //estado errores
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

const handleEdit = function (password) {
  props.updatePassword(password);
}

  return (
    <Modal isOpen={modal} toggle={toggle}>

      <ModalHeader toggle={toggle}>
        <h1>Nueva Contraseña</h1>
      </ModalHeader>

      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <form onSubmit={(e) => handleSubmit(e)}>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField

                  variant="outlined"
                  required
                  fullWidth
                  id="newPass"
                  label="Nueva Contraseña"
                  name="newPass"
                  type="password"
                  value={input.newPass}
                  onChange={handleChange}
                />
              </Grid>
              {errors.newPass && (
                <p className={styles.danger}>{errors.newPass}</p>
              )}

              <Grid item xs={12}>
                <TextField

                  variant="outlined"
                  required
                  fullWidth
                  name="verifyPass"
                  label="Verificación"
                  type="password"
                  id="verifyPass"
                  value={input.verifyPass}
                  onChange={handleChange}
                />
              </Grid>
              {errors.verifyPass && (
                <p className={styles.danger}>{errors.verifyPass}</p>
              )}
            </Grid>

            {errors.newPass || errors.verifyPass ?

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled
              >
                Cambiar Contraseña
          </Button>
              : props.errors === true ?

              <Container  className={props.className}>
        
        <div className={classes.paper}><strong>Hubo un error al intentar cambiar tu contraseña, porfavor comunícate con administración</strong></div>
     
              <div>
                <div className={classes.row}>
                <Link to="/">
                <div className={styles.link}><strong>Volver a Inicio</strong></div></Link>
                </div>
              </div>
              <br/>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled
              >
                Cambiar Contraseña
          </Button>
          </Container>
        : props.error === false ?
        <Container className={props.className}>
        
        <div className={classes.paper}><strong>Tu contraseña se ha cambiado!</strong></div>

         <div className={classes.paper}>
          <Link to="/" >
          <div className={styles.link}> <strong>Volver a Inicio </strong></div></Link>
          </div>
          <br/>
          <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled
              >
                Cambiar Contraseña
          </Button>
      
    </Container>
    :
    <Button
    type="submit"
    fullWidth
    variant="contained"
    color="primary"
    onClick={() => handleEdit({id: props.id, newPassword: input.newPass})}
    className={classes.submit}>
    Cambiar Contraseña
</Button>
     }

          </form>
        </div>
        <Box mt={5}>
          <Copyright />
        </Box>

      </Container>
    </Modal >
  );
}

function mapStateToProps(state) {
  return {
    user: state.product.user,
    error: state.product.error,
    loading: state.product.loading
  }
}
function mapDispatchToProps(dispatch) {
  return {
    updatePassword: (id, payload) => dispatch(updatePassword(id, payload))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(ResetPass)
