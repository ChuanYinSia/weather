import React, { Component } from "react";
import axios from "axios";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import SearchIcon from "@mui/icons-material/Search";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import IconButton from "@mui/material/IconButton";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

class Analysis_Banner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: { city: "", country: "" },
      history: [],
      isQuery: false,
      jData: null,
      error: null,
    };
  }

  getRecord = async () => {
    const { formData, history } = this.state;
    let city = formData.city;
    let country = formData.country;

    let apiLink = `https://api.openweathermap.org/data/2.5/forecast?q=${city},${country}&cnt=1&appid=ac89e9dd882789fdd1d328a3af56b8e2`;
    const request = axios.get(apiLink);
    await axios
      .all([request])
      .then(
        axios.spread((...responses) => {
          var today = new Date();
          var dateTimeNow = today.toLocaleString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });

          if (responses[0].status === 200) {
            const historyRecorrd = {
              city: responses[0].data.city.name,
              country: responses[0].data.city.country,
              time: dateTimeNow,
            };
            this.setState({
              jData: responses[0].data,
              history: [historyRecorrd, ...history],
              error: null,
              isQuery: false,
            });
          }
        })
      )
      .catch((errors) => {
        this.setState({
          isQuery: false,
          error: errors.response.data.message,
        });
      });
  };

  handleSearch = () => {
    this.setState(
      {
        isQuery: true,
      },
      () => this.getRecord()
    );
  };

  handleSearchHistory = (data) => {
    this.setState(
      {
        formData: { city: data.city, country: data.country },
        isQuery: true,
      },
      () => this.getRecord()
    );
  };

  handleDeleteHistory = (i) => {
    const { history } = this.state;
    history.splice(i, 1);
    this.setState({
      history: history,
    });
  };

  handleClearBtn = () => {
    this.setState({
      formData: { city: "", country: "" },
      jData: null,
    });
  };

  handleInput = (e) => {
    const { formData } = this.state;
    formData[e.target.name] = e.target.value;
    this.setState({
      formData: formData,
    });
  };

  render() {
    const { formData, history, jData, error, isQuery } = this.state;

    if (jData) {
      var today = new Date(jData.list[0].dt * 1000);
      var resultDateTimeNow = today.toLocaleString("en-CA", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: true });
    }

    const DisplayWeather = () => (
      <Box>
        {jData && (
          <Card variant="outlined">
            <CardContent>
              <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }} component="nav">
                <ListItem>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    {`${jData.city.name}. ${jData.city.country}`}
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography variant="h5" component="div">
                    {jData.list[0].weather[0].main}
                  </Typography>
                </ListItem>
                <TableContainer>
                  <Table>
                    <TableHead></TableHead>
                    <TableBody>
                      <TableRow sx={{ " td,  th": { border: 0 } }}>
                        <TableCell component="th" scope="row">
                          Description
                        </TableCell>
                        <TableCell align="left">{jData.list[0].weather[0].description}</TableCell>
                      </TableRow>
                      <TableRow sx={{ " td,  th": { border: 0 } }}>
                        <TableCell component="th" scope="row">
                          Temperature
                        </TableCell>
                        <TableCell align="left">{`${jData.list[0].main.temp_min}°C ~ ${jData.list[0].main.temp_max}°C`}</TableCell>
                      </TableRow>{" "}
                      <TableRow sx={{ " td,  th": { border: 0 } }}>
                        <TableCell component="th" scope="row">
                          Humidity
                        </TableCell>
                        <TableCell align="left">{`${jData.list[0].main.humidity}%`}</TableCell>
                      </TableRow>{" "}
                      <TableRow sx={{ "td,  th": { border: 0 } }}>
                        <TableCell component="th" scope="row">
                          Time
                        </TableCell>
                        <TableCell align="left">{resultDateTimeNow}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </List>
            </CardContent>
          </Card>
        )}
      </Box>
    );

    const DisplayHistory = () => (
      <Box>
        <Typography variant="p" component="div" gutterBottom>
          Search History
        </Typography>
        <Divider />
        <Box m={2} />

        {history.length > 0 ? (
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead></TableHead>
              <TableBody>
                {history.map((value, i) => (
                  <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }} key={i}>
                    <TableCell component="th" scope="row">
                      {i + 1}. {value.city}, {value.country}
                    </TableCell>
                    <TableCell align="right">
                      {value.time}
                      <IconButton color="primary" component="span" onClick={() => this.handleSearchHistory(value)}>
                        <SearchIcon />
                      </IconButton>
                      <IconButton color="primary" component="span" onClick={() => this.handleDeleteHistory(i)}>
                        <DeleteOutlineIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <h1>No Record</h1>
        )}
      </Box>
    );

    return (
      <Container>
        <Grid container justifyContent="space-between" spacing={1}>
          <Grid item sm={12} xs={12}>
            <Typography variant="p" component="div" gutterBottom>
              Today's Weather
            </Typography>
            <Divider />
            <Box m={2} />
          </Grid>
          <Grid item sm={3} xs={12}>
            <TextField label="City" size={"small"} value={formData.city} name={"city"} onChange={(e) => this.handleInput(e)} fullWidth />
          </Grid>
          <Grid item sm={3} xs={12}>
            <TextField label="Country" size={"small"} value={formData.country} name={"country"} onChange={(e) => this.handleInput(e)} fullWidth />
          </Grid>
          <Grid item sm={6} xs={12}>
            <Stack spacing={1} direction="row">
              <Button variant="outlined" onClick={() => this.handleSearch()}>
                Search
              </Button>
              <Button variant="outlined" onClick={() => this.handleClearBtn()}>
                Clear
              </Button>
            </Stack>
          </Grid>

          <Box m={2} />

          <Grid item xs={12}>
            {error ? <Alert severity="error">{error}</Alert> : <DisplayWeather />}
          </Grid>
          <Box m={2} />

          <Grid item xs={12}>
            <DisplayHistory />
          </Grid>
        </Grid>
        <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isQuery}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </Container>
    );
  }
}

export default Analysis_Banner;
