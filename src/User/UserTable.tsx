import { FC, ChangeEvent, useState, useEffect } from 'react';
import {
  Divider,
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  Typography,
  CardHeader,
  Button,
  ButtonGroup,
  Grid,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import api from "../services/api";

const UserTable: FC = () => {

  const [allUsers, setAllUsers] = useState([]);
  const [userList, setUserList] = useState([]);
  const [pUserList, setPUserList] = useState([]);
  const [nUserList, setNUserList] = useState([]);
  const [aPage, setAPage] = useState<number>(0);
  const [aLimit, setALimit] = useState<number>(10);
  const [pPage, setPPage] = useState<number>(0);
  const [pLimit, setPLimit] = useState<number>(5);
  const [nPage, setNPage] = useState<number>(0);
  const [nLimit, setNLimit] = useState<number>(5);
  const [showPModal, setShowPModal] = useState(false);
  const [showNModal, setShowNModal] = useState(false);
  const [clickedId, setClickedId] = useState();

  const handleClosePModal = () => setShowPModal(false);
  const handleShowPModal = () => setShowPModal(true);

  const handleCloseNModal = () => setShowNModal(false);
  const handleShowNModal = () => setShowNModal(true);

  const handleClickPModalOk = () => {
    const clickedUser = pUserList.filter(user => user.id === clickedId);
    const removeLevelUser = clickedUser.map(({level, ...rest}) => rest);
    const filteredUsers = pUserList.filter(user =>  user.id !== clickedId);
    allUsers.push(...removeLevelUser);
    setPUserList(filteredUsers);
    setShowPModal(false);
  };

  const handleClickNModalOk = () => {
    const clickedUser = nUserList.filter(user => user.id === clickedId);
    const removeLevelUser = clickedUser.map(({level, ...rest}) => rest);
    const filteredUsers = nUserList.filter(user =>  user.id !== clickedId);
    allUsers.push(...removeLevelUser);
    setNUserList(filteredUsers);
    setShowNModal(false);
  }

  const handleAPageChange = (event: any, newPage: number): void => {
    setAPage(newPage);
  };

  const handleALimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setALimit(parseInt(event.target.value));
  };

  const handlePPageChange = (event: any, newPage: number): void => {
    setPPage(newPage);
  };

  const handlePLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setPLimit(parseInt(event.target.value));
  };

  const handleNPageChange = (event: any, newPage: number): void => {
    setNPage(newPage);
  };

  const handleNLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setNLimit(parseInt(event.target.value));
  };

  async function getUserData() {
    const response = await api.get('/');
    setAllUsers(response.data);
  }

  async function getNextUserData() {
    const response = await api.get('/');
    setUserList(response.data);
  }

  const handleClickRefresh = () => {
    getUserData();
  }

  const handleClickNext = () => {
    getNextUserData();
  }

  const handleClickAdd = (id) => {
    setAllUsers(allUsers.filter(user => user.id !== id));
    const filteredUsers = allUsers.filter(user => user.id === id);
    const updatedUsers = filteredUsers.map(user => ({ ...user, level: 1 }));
    pUserList.push(...updatedUsers);
    pUserList.sort((a, b) => b.level - a.level);
  }

  const handleClickRemove = (id) => {
    setAllUsers(allUsers.filter(user => user.id !== id));
    const filteredUsers = allUsers.filter(user => user.id === id);
    const updatedUsers = filteredUsers.map(user => ({ ...user, level: -1 }));
    nUserList.push(...updatedUsers);
    nUserList.sort((a, b) => a.level - b.level);
  }

  const handleClickPAdd = (id) => {
    const clickedUser = pUserList.find(user => user.id === id);
    if(clickedUser.level == 5){
      setClickedId(id);
      handleShowPModal();
    }else{
      const updatedUser = { ...clickedUser, level: clickedUser.level + 1 };
      const updatedList = [
        ...pUserList.filter(user => user.id !== id), 
        updatedUser
      ];
      updatedList.sort((a, b) => b.level - a.level);
      setPUserList(updatedList);
    }
  }

  const handleClickPRemove = (id) => {
    const clickedUser = pUserList.find(user => user.id === id);
    if(clickedUser.level == 1){
      setClickedId(id);
      handleShowPModal();
    }else{
      const updatedUser = { ...clickedUser, level: clickedUser.level - 1 };
      const updatedList = [
        ...pUserList.filter(user => user.id !== id), 
        updatedUser
      ];
      updatedList.sort((a, b) => b.level - a.level);
      setPUserList(updatedList);
    }
  }

  const handleClickNAdd = (id) => {
    const clickedUser = nUserList.find(user => user.id === id);
    if(clickedUser.level == -1){
      setClickedId(id);
      handleShowNModal();
    }else{
      const updatedUser = { ...clickedUser, level: clickedUser.level + 1 };
      const updatedList = [
        ...nUserList.filter(user => user.id !== id), 
        updatedUser
      ];
      updatedList.sort((a, b) => a.level - b.level);
      setNUserList(updatedList);
    }
  }

  const handleClickNRemove = (id) => {
    const clickedUser = nUserList.find(user => user.id === id);
    if(clickedUser.level == -5){
      setClickedId(id);
      handleShowNModal();
    }else{
      const updatedUser = { ...clickedUser, level: clickedUser.level - 1 };
      const updatedList = [
        ...nUserList.filter(user => user.id !== id), 
        updatedUser
      ];
      updatedList.sort((a, b) => a.level - b.level);
      setNUserList(updatedList);
    }
  }

  useEffect(() => {
    setAllUsers((prevUsers) => [...prevUsers, ...userList]);
  }, [userList]);

  useEffect(() => {
    const savedAllUsers = localStorage.getItem('allUsers');
    const savedPUsers = localStorage.getItem('positiveUsers');
    const savedNUsers = localStorage.getItem('negativeUsers');
    
    if (savedAllUsers) {
      setAllUsers(JSON.parse(savedAllUsers));
    }
    if (savedPUsers) {
      setPUserList(JSON.parse(savedPUsers));
    }
    if (savedNUsers) {
      setNUserList(JSON.parse(savedNUsers));
    }

    const handleBeforeUnload = () => {
      localStorage.setItem('allUsers', JSON.stringify(allUsers));
      localStorage.setItem('positiveUsers', JSON.stringify(pUserList));
      localStorage.setItem('negativeUsers', JSON.stringify(nUserList));
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      localStorage.setItem('allUsers', '');
      localStorage.setItem('positiveUsers', '');
      localStorage.setItem('negativeUsers', '');
    };
  }, [JSON.stringify(allUsers), JSON.stringify(pUserList), JSON.stringify(nUserList)]);

  return (
    <Container maxWidth="xl">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={6} md={6} lg={6} sm={6}>
            <Card>
              <CardHeader
                action={
                  <Box width={150}>
                    <Button onClick={handleClickRefresh}>Refresh</Button>
                    <Button onClick={handleClickNext}>Next</Button>
                  </Box>
                }
                title="User List"
              />
              <Divider />
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>User Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {allUsers.slice(aPage * aLimit, aPage * aLimit + aLimit).map((user, index) => {
                      return (  
                        <TableRow 
                          hover
                          key = {index}
                        >
                          <TableCell>
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {user.first_name + ' ' + user.last_name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {user.email}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <ButtonGroup>
                              <Button
                                onClick={() => {
                                  handleClickRemove(user.id)
                                }}
                              >
                                <RemoveIcon fontSize="small" />
                              </Button>
                              <Button
                                onClick={() => {
                                  handleClickAdd(user.id);
                                }}
                              >
                                <AddIcon fontSize="small" />
                              </Button>
                            </ButtonGroup>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    
                  </TableBody>
                </Table>
              </TableContainer>
              <Box p={2}>
                <TablePagination
                  component="div"
                  count={allUsers.length}
                  onPageChange={handleAPageChange}
                  onRowsPerPageChange={handleALimitChange}
                  page={aPage}
                  rowsPerPage={aLimit}
                  rowsPerPageOptions={[5, 10, 25, 30]}
                />
              </Box>
            </Card>
          </Grid>
          <Grid item xs={6} md={6} lg={6} sm={6}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12} lg={12} sm={12}>
                <Card>
                  <CardHeader
                    title="Positive User List"
                  />
                  <Divider />
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Level</TableCell>
                          <TableCell>User Name</TableCell>
                          <TableCell>Email</TableCell>
                          <TableCell>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {pUserList.slice(pPage * pLimit, pPage * pLimit + pLimit).map((user, index) => {
                          return (  
                            <TableRow 
                              hover
                              key = {index}
                            >
                              <TableCell>
                                <Typography variant="body2" color="text.secondary" noWrap>
                                  {user.level}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" color="text.secondary" noWrap>
                                  {user.first_name + ' ' + user.last_name}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" color="text.secondary" noWrap>
                                  {user.email}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <ButtonGroup>
                                  <Button
                                    onClick={() => {
                                      handleClickPRemove(user.id)
                                    }}
                                  >
                                    <RemoveIcon fontSize="small" />
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      handleClickPAdd(user.id);
                                    }}
                                  >
                                    <AddIcon fontSize="small" />
                                  </Button>
                                </ButtonGroup>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Box p={2}>
                    <TablePagination
                      component="div"
                      count={pUserList.length}
                      onPageChange={handlePPageChange}
                      onRowsPerPageChange={handlePLimitChange}
                      page={pPage}
                      rowsPerPage={pLimit}
                      rowsPerPageOptions={[5, 10, 25, 30]}
                    />
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={12} md={12} lg={12} sm={12}>
                <Card>
                  <CardHeader
                    title="Negative User List"
                  />
                <Divider />
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Level</TableCell>
                        <TableCell>User Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {nUserList.slice(nPage * nLimit, nPage * nLimit + nLimit).map((user, index) => {
                        return (  
                          <TableRow 
                            hover
                            key = {index}
                          >
                            <TableCell>
                              <Typography variant="body2" color="text.secondary" noWrap>
                                {user.level}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" color="text.secondary" noWrap>
                                {user.first_name + ' ' + user.last_name}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" color="text.secondary" noWrap>
                                {user.email}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <ButtonGroup>
                                <Button
                                  aria-label="reduce"
                                  onClick={() => {
                                    handleClickNRemove(user.id)
                                  }}
                                >
                                  <RemoveIcon fontSize="small" />
                                </Button>
                                <Button
                                  aria-label="increase"
                                  onClick={() => {
                                    handleClickNAdd(user.id);
                                  }}
                                >
                                  <AddIcon fontSize="small" />
                                </Button>
                              </ButtonGroup>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box p={2}>
                  <TablePagination
                    component="div"
                    count={nUserList.length}
                    onPageChange={handleNPageChange}
                    onRowsPerPageChange={handleNLimitChange}
                    page={nPage}
                    rowsPerPage={nLimit}
                    rowsPerPageOptions={[5, 10, 25, 30]}
                  />
                </Box>
              </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Dialog open={showPModal} onClose={handleClosePModal}>
          <DialogTitle>Warning</DialogTitle>
          <DialogContent>Do you ?</DialogContent>
          <DialogActions>
            <Button onClick={handleClickPModalOk}>Ok</Button>
            <Button onClick={handleClosePModal}>Close</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={showNModal} onClose={handleCloseNModal}>
          <DialogTitle>Warning</DialogTitle>
          <DialogContent>Do you ?</DialogContent>
          <DialogActions>
            <Button onClick={handleClickNModalOk}>Ok</Button>
            <Button onClick={handleCloseNModal}>Close</Button>
          </DialogActions>
        </Dialog>
      </Container>
  );
};

export default UserTable;