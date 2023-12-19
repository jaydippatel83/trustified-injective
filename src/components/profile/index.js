import React, { useEffect, useState } from "react";
import { FormatListBulletedSharp, PhotoCamera } from "@mui/icons-material";
import {
  Avatar,
  Badge,
  Box,
  CardContent,
  CircularProgress,
  IconButton,
  Input,
  Stack,
  TextField,
  Typography,
  Radio,
  RadioGroup,
  FormGroup,
  FormControlLabel,
  FormControl,
  Checkbox,
  FormLabel,
  FormHelperText,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "react-toastify";
import { Web3Context } from "../../context/Web3Context";
import MyCollection from "../myCollection";
import { firebaseDataContext } from "../../context/FirebaseDataContext";
import { multiChains } from "../../config";

import { Card, Container, Row, Col } from "react-bootstrap";
import web3 from "web3";
import { useFormik } from "formik";
import * as yup from "yup";

function User() {
  const web3Context = React.useContext(Web3Context);
  const { shortAddress, setUpdate, update } = web3Context;
  const [loading, setLoading] = useState(false);
  const storage = getStorage();

  const validationSchema = yup.object({
    name: yup.string("Enter your Name").required("Name is required"),
    email: yup
      .string("Enter your email")
      .email("Enter a valid email")
      .required("Email is required"),
    purpose: yup.string("Enter your purpose").required("purpose is required"),
  });

  const formik = useFormik({
    initialValues: {
      avatar: "",
      name: "",
      email: "",
      bio: "",
      purpose: "",
      address: "",
      url: "",
      type: "individual",
      networks: [],
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (error) {
        toast.error("Please select network!");
      } else {
        updateProfile();
      }
    },
  });

  useEffect(() => {
    if (!formik.isSubmitting) return;
    if (Object.keys(formik.errors).length > 0) {
      document.getElementsByName(Object.keys(formik.errors)[0])[0].focus();
    }
  }, [formik]);

  const [state, setState] = React.useState({ 
    injective: {
      label: "Injective",
      value: "injective",
      image: "/assets/logo/injective.webp",
      chainId: 1738,
      priority: 1,
      checked: false,
      transferred: false,
    }, 
    mumbai: {
      label: "Polygon Mumbai",
      value: "mumbai",
      image: "/assets/coin.png",
      chainId: 80001,
      priority: 1,
      checked: false,
      transferred: false,
    }, 
    ethereumtestnet: {
      label: "Ethereum Sepolia",
      value: "ethereumtestnet",
      image: "https://request-icons.s3.eu-west-1.amazonaws.com/eth.svg",
      chainId: 11155111,
      priority: 0,
      checked: false,
      transferred: false,
    },
  });

  const handleChange = (key) => {
    setState({
      ...state,
      [key]: {
        ...state[key],
        checked: !state[key].checked,
      },
    });
  };

  const error = Object.values(state).filter((v) => v.checked).length < 1;

  const firebaseContext = React.useContext(firebaseDataContext);
  const { getMyCollection, message, open, handleClose } = firebaseContext;

  useEffect(() => {
    let add = localStorage.getItem("address");
    getMyCollection(web3.utils.toChecksumAddress(add));
  }, []);

  useEffect(() => {
    const init = async () => {
      const add = window.localStorage.getItem("address");
      const q = query(
        collection(db, "UserProfile"),
        where("Address", "==", add)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((fire) => {
        formik.setValues({
          avatar: fire.data().Photo,
          name: fire.data().Name,
          email: fire.data().email,
          bio: fire.data().Bio,
          purpose: fire.data().purpose,
          address: fire.data().Address,
          verified: fire.data().verified,
          status: fire.data().status,
          type: fire.data().type,
          url: fire.data().url,
          networks: fire.data().networks ? fire.data().networks : [],
        });
        fire.data().networks && setState(fire.data().networks);
      });
    };
    init();
  }, [update]);

  async function onChangeAvatar(e) {
    setLoading(true);
    const file = e.target.files[0];
    const storageRef = ref(storage, `Photo/${file.name}`);
    uploadBytes(storageRef, file).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        formik.setValues({ ...formik.values, avatar: url });
      });
    });
    setLoading(false);
  }

  const updateProfile = async () => {
    const add = window.localStorage.getItem("address");

    const data = {
      Name: formik.values.name,
      email: formik.values.email,
      Bio: formik.values.bio,
      Photo: formik.values.avatar,
      Address: add,
      verified: 0,
      CreatedAt: new Date(),
      purpose: formik.values.purpose,
      status: "requested",
      type: formik.values.type,
      url: formik.values.url,
      networks: state,
    };
    const q = query(collection(db, "UserProfile"), where("Address", "==", add));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      addDoc(collection(db, "UserProfile"), data);
      setUpdate(!update);
      toast.success("Requested Access successfully!!");
    } else {
      querySnapshot.forEach((fire) => {
        const data = {
          Name:
            formik.values.name !== "" ? formik.values.name : fire.data().Name,
          email:
            formik.values.email !== ""
              ? formik.values.email
              : fire.data().email,
          Bio: formik.values.bio !== "" ? formik.values.bio : fire.data().Bio,
          Photo:
            formik.values.avatar !== ""
              ? formik.values.avatar
              : fire.data().Photo,
          Address: add,
          verified: fire.data().verified,
          UpdatedAt: new Date(),
          purpose:
            formik.values.purpose !== ""
              ? formik.values.purpose
              : fire.data().purpose,
          status: fire.data().status,
          type:
            formik.values.type !== "" ? formik.values.type : fire.data().type,
          url: formik.values.url !== "" ? formik.values.url : fire.data().url,
          networks: state,
        };
        const dataref = doc(db, "UserProfile", fire.id);
        updateDoc(dataref, data);
        setUpdate(!update);
        toast.success("Profile successfully updated!!");
      });
    }
  };

  return (
    <>
      <Container fluid>
        <Row>
          <Col md="7">
            <form onSubmit={formik.handleSubmit}>
              <Card>
                <Card.Header>
                  <Card.Title as="h4">Request Access</Card.Title>
                </Card.Header>
                <Card.Body style={{ padding: "20px" }}>
                  <Box
                    sx={{
                      alignItems: "center",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={3}
                      style={{ justifyContent: "center", display: "flex" }}
                    >
                      <Badge
                        overlap="circular"
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        badgeContent={
                          <label htmlFor="icon-button-file">
                            <Input
                              onChange={(e) => onChangeAvatar(e)}
                              className="d-none"
                              accept="image/*"
                              id="icon-button-file"
                              type="file"
                            />
                            <IconButton
                              color="primary"
                              aria-label="upload picture"
                              component="span"
                            >
                              <PhotoCamera />
                            </IconButton>
                          </label>
                        }
                      >
                        <Avatar
                          sx={{ width: 100, height: 100 }}
                          src={
                            formik.values.avatar
                              ? formik.values.avatar
                              : "/assets/logo.png"
                          }
                        />
                      </Badge>
                    </Stack>

                    <Typography
                      color="textSecondary"
                      variant="body"
                      style={{
                        border: "1px solid #eee",
                        padding: "3px 15px",
                        borderRadius: "20px",
                        fontWeight: "bolder",
                        color: "black",
                        width: "fit-content",
                        marginTop: "20px",
                      }}
                    >
                      {formik.values
                        ? shortAddress(formik.values.address)
                        : shortAddress(window.localStorage.getItem("address"))}
                    </Typography>
                    <TextField
                      sx={{ m: 2 }}
                      id="outlined-multiline-flexible"
                      label="Name"
                      name="name"
                      type="text"
                      fullWidth
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.name && Boolean(formik.errors.name)}
                      helperText={formik.touched.name && formik.errors.name}
                    />
                    <TextField
                      sx={{ m: 2 }}
                      id="outlined-multiline-flexible"
                      label="Email"
                      name="email"
                      type="email"
                      fullWidth
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.email && Boolean(formik.errors.email)
                      }
                      helperText={formik.touched.email && formik.errors.email}
                    />

                    <TextField
                      sx={{ m: 2 }}
                      id="outlined-multiline-flexible"
                      label={
                        "Tell us a bit more about your project or community..."
                      }
                      name="bio"
                      type="text"
                      value={formik.values.bio}
                      onChange={formik.handleChange}
                      fullWidth
                      multiline
                      maxRows={4}
                      minRows={3}
                    />

                    <TextField
                      sx={{ m: 2 }}
                      id="outlined-multiline-flexible"
                      label="Please share a link to your project..."
                      name="url"
                      type="text"
                      value={formik.values.url}
                      onChange={formik.handleChange}
                      fullWidth
                    />

                    <TextField
                      sx={{ m: 2 }}
                      id="outlined-multiline-flexible"
                      label="Purpose of Issue"
                      name="purpose"
                      type="text"
                      value={formik.values.purpose}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.purpose && Boolean(formik.errors.purpose)
                      }
                      helperText={
                        formik.touched.purpose && formik.errors.purpose
                      }
                      fullWidth
                      multiline
                      maxRows={4}
                      minRows={3}
                    />

                    <RadioGroup
                      aria-labelledby="demo-controlled-radio-buttons-group "
                      name="controlled-radio-buttons-group"
                      sx={{ display: "inline" }}
                      value={formik.values.type}
                      onChange={formik.handleChange}
                    >
                      <FormControlLabel
                        value="individual"
                        control={<Radio />}
                        label="Individual"
                      />
                      <FormControlLabel
                        value="community"
                        control={<Radio />}
                        label="Community"
                      />
                    </RadioGroup>

                    <FormControl component="fieldset" error={error}>
                      <FormLabel component="legend">Select Networks</FormLabel>
                      <FormGroup aria-label="position" row>
                        {Object.keys(state).map((key) => {
                          const checkbox = state[key];
                          return (
                            <div key={key}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={checkbox.checked}
                                    onChange={() => handleChange(key)}
                                    name={checkbox.key}
                                  />
                                }
                                label={checkbox.label}
                                labelPlacement="end"
                              />
                            </div>
                          );
                        })}
                      </FormGroup>

                      <FormHelperText>
                        {error
                          ? "Please select networks"
                          : "Note: Networks, on which you would like to issue badges or certificates"}
                      </FormHelperText>
                    </FormControl>
                  </Box>
                </Card.Body>
                <Card.Footer>
                  <button
                    className="thm-btn header__cta-btn"
                    // onClick={updateProfile}
                    type="submit"
                  >
                    <span>Save</span>
                  </button>
                </Card.Footer>
              </Card>
            </form>
          </Col>
          <Col md="5">
            <Card sx={{ border: "1px solid #eee" }}>
              <CardContent>
                <Box
                  sx={{
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Avatar
                    src={formik.values.avatar}
                    sx={{
                      height: 100,
                      mb: 2,
                      width: 100,
                    }}
                  />
                  <Typography
                    color="textSecondary"
                    variant="body"
                    style={{
                      border: "1px solid #eee",
                      padding: "3px 15px",
                      borderRadius: "20px",
                      fontWeight: "bolder",
                      color: "black",
                      width: "fit-content",
                      marginTop: "20px",
                    }}
                  >
                    {formik.values.address !== ""
                      ? shortAddress(formik.values.address)
                      : shortAddress(window.localStorage.getItem("address"))}
                  </Typography>
                  <div
                    style={{
                      margin: "10px",
                      textAlign: "center",
                    }}
                  >
                    <h3>
                      <a href="#none">
                        {formik.values.name !== ""
                          ? formik.values.name
                          : "@name"}
                      </a>
                    </h3>
                    <p>
                      {formik.values.bio !== "" ? formik.values.bio : "Bio"}
                    </p>
                  </div>
                </Box>
              </CardContent>
            </Card>
          </Col>
        </Row>
        {/* <Row className="mt-5">
          <MyCollection show={true}></MyCollection>
        </Row> */}
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Alert</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {message}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}

export default User;
