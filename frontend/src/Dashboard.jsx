import React, { Component } from 'react';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  LinearProgress,
  DialogTitle,
  DialogContent,
  TableBody,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
} from '@mui/material';
import Pagination from '@mui/material/Pagination';
import Swal from 'sweetalert2';
import axios from 'axios';
import { withRouter } from './utils';

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
      openProductModal: false,
      openProductEditModal: false,
      id: '',
      name: '',
      desc: '',
      price: '',
      discount: '',
      file: '',
      fileName: '',
      page: 1,
      search: '',
      products: [],
      pages: 0,
      loading: false,
    };
  }

  componentDidMount = () => {
    const token = localStorage.getItem('token');

    if (!token) {
      this.props.navigate('/login');
    } else {
      this.setState({ token }, () => this.getProduct());
    }
  };

  getProduct = () => {
    this.setState({ loading: true });

    let query = `?page=${this.state.page}`;
    if (this.state.search) {
      query += `&search=${this.state.search}`;
    }

    axios
      .get(`http://localhost:2000/get-product${query}`, {
        headers: { token: this.state.token },
      })
      .then((res) => {
        this.setState({
          loading: false,
          products: res.data.products,
          pages: res.data.pages,
        });
      })
      .catch((err) => {
        Swal.fire({
          text: err?.response?.data?.errorMessage || 'Error',
          icon: 'error',
        });
        this.setState({ loading: false, products: [], pages: 0 });
      });
  };

  deleteProduct = (id) => {
    axios
      .post(
        'http://localhost:2000/delete-product',
        { id },
        {
          headers: {
            'Content-Type': 'application/json',
            token: this.state.token,
          },
        },
      )
      .then((res) => {
        Swal.fire({
          text: res.data.title,
          icon: 'success',
        });

        this.setState({ page: 1 }, () => this.pageChange(null, 1));
      })
      .catch((err) => {
        Swal.fire({
          text: err?.response?.data?.errorMessage || 'Error',
          icon: 'error',
        });
      });
  };

  pageChange = (_, page) => {
    this.setState({ page }, () => this.getProduct());
  };

  logOut = () => {
    localStorage.setItem('token', '');
    this.props.navigate('/');
  };

  onChange = (e) => {
    if (e.target.files?.[0]) {
      this.setState({ fileName: e.target.files[0].name });
    }

    this.setState({ [e.target.name]: e.target.value }, () => {
      if (e.target.name === 'search') {
        this.setState({ page: 1 }, this.getProduct);
      }
    });
  };

  addProduct = () => {
    const fileInput = document.querySelector('#fileInput');
    const formData = new FormData();

    formData.append('file', fileInput.files[0]);
    formData.append('name', this.state.name);
    formData.append('desc', this.state.desc);
    formData.append('discount', this.state.discount);
    formData.append('price', this.state.price);

    axios
      .post('http://localhost:2000/add-product', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          token: this.state.token,
        },
      })
      .then((res) => {
        Swal.fire({ text: res.data.title, icon: 'success' });

        this.handleProductClose();
        this.setState(
          {
            name: '',
            desc: '',
            discount: '',
            price: '',
            file: null,
            page: 1,
          },
          this.getProduct,
        );
      })
      .catch((err) => {
        Swal.fire({
          text: err?.response?.data?.errorMessage || 'Error',
          icon: 'error',
        });
        this.handleProductClose();
      });
  };

  updateProduct = () => {
    const fileInput = document.querySelector('#fileInput');
    const formData = new FormData();

    formData.append('id', this.state.id);
    if (fileInput.files[0]) {
      formData.append('file', fileInput.files[0]);
    }
    formData.append('name', this.state.name);
    formData.append('desc', this.state.desc);
    formData.append('discount', this.state.discount);
    formData.append('price', this.state.price);

    axios
      .post('http://localhost:2000/update-product', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          token: this.state.token,
        },
      })
      .then((res) => {
        Swal.fire({ text: res.data.title, icon: 'success' });

        this.handleProductEditClose();
        this.setState({ name: '', desc: '', discount: '', price: '', file: null }, this.getProduct);
      })
      .catch((err) => {
        Swal.fire({
          text: err?.response?.data?.errorMessage || 'Error',
          icon: 'error',
        });
        this.handleProductEditClose();
      });
  };

  handleProductOpen = () => {
    this.setState({
      openProductModal: true,
      id: '',
      name: '',
      desc: '',
      price: '',
      discount: '',
      fileName: '',
    });
  };

  handleProductClose = () => {
    this.setState({ openProductModal: false });
  };

  handleProductEditOpen = (data) => {
    this.setState({
      openProductEditModal: true,
      id: data._id,
      name: data.name,
      desc: data.desc,
      price: data.price,
      discount: data.discount,
      fileName: data.image,
    });
  };

  handleProductEditClose = () => {
    this.setState({ openProductEditModal: false });
  };

  render() {
    return (
      <div>
        {this.state.loading && <LinearProgress />}

        <div className="no-printme">
          <h2>Dashboard</h2>

          <Button variant="contained" color="primary" size="small" onClick={this.handleProductOpen}>
            Add Product
          </Button>

          <Button variant="contained" size="small" onClick={this.logOut}>
            Log Out
          </Button>
        </div>

        {/* EDIT PRODUCT */}
        <Dialog open={this.state.openProductEditModal} onClose={this.handleProductEditClose}>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogContent>
            <TextField
              type="text"
              name="name"
              value={this.state.name}
              onChange={this.onChange}
              placeholder="Product Name"
              fullWidth
              margin="dense"
            />
            <TextField
              type="text"
              name="desc"
              value={this.state.desc}
              onChange={this.onChange}
              placeholder="Description"
              fullWidth
              margin="dense"
            />
            <TextField
              type="number"
              name="price"
              value={this.state.price}
              onChange={this.onChange}
              placeholder="Price"
              fullWidth
              margin="dense"
            />
            <TextField
              type="number"
              name="discount"
              value={this.state.discount}
              onChange={this.onChange}
              placeholder="Discount"
              fullWidth
              margin="dense"
            />
            <br />
            <Button variant="contained" component="label">
              Upload
              <input type="file" accept="image/*" onChange={this.onChange} id="fileInput" hidden />
            </Button>
            &nbsp;{this.state.fileName}
          </DialogContent>

          <DialogActions>
            <Button onClick={this.handleProductEditClose}>Cancel</Button>
            <Button
              disabled={
                !this.state.name || !this.state.desc || !this.state.discount || !this.state.price
              }
              onClick={this.updateProduct}
            >
              Edit Product
            </Button>
          </DialogActions>
        </Dialog>

        {/* ADD PRODUCT */}
        <Dialog open={this.state.openProductModal} onClose={this.handleProductClose}>
          <DialogTitle>Add Product</DialogTitle>
          <DialogContent>
            <TextField
              type="text"
              name="name"
              value={this.state.name}
              onChange={this.onChange}
              placeholder="Product Name"
              fullWidth
              margin="dense"
            />
            <TextField
              type="text"
              name="desc"
              value={this.state.desc}
              onChange={this.onChange}
              placeholder="Description"
              fullWidth
              margin="dense"
            />
            <TextField
              type="number"
              name="price"
              value={this.state.price}
              onChange={this.onChange}
              placeholder="Price"
              fullWidth
              margin="dense"
            />
            <TextField
              type="number"
              name="discount"
              value={this.state.discount}
              onChange={this.onChange}
              placeholder="Discount"
              fullWidth
              margin="dense"
            />
            <br />
            <Button variant="contained" component="label">
              Upload
              <input
                type="file"
                accept="image/*"
                onChange={this.onChange}
                id="fileInput"
                hidden
                required
              />
            </Button>
            &nbsp;{this.state.fileName}
          </DialogContent>

          <DialogActions>
            <Button onClick={this.handleProductClose}>Cancel</Button>
            <Button
              disabled={
                !this.state.name ||
                !this.state.desc ||
                !this.state.discount ||
                !this.state.price ||
                !this.state.fileName
              }
              onClick={this.addProduct}
            >
              Add Product
            </Button>
          </DialogActions>
        </Dialog>

        <br />

        <TableContainer>
          <TextField
            type="search"
            name="search"
            value={this.state.search}
            onChange={this.onChange}
            placeholder="Search by product name"
            style={{ width: '190px' }}
            margin="dense"
          />

          <Button variant="outlined" size="small" onClick={() => window.print()}>
            Print product details
          </Button>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Image</TableCell>
                <TableCell align="center">Description</TableCell>
                <TableCell align="center">Price</TableCell>
                <TableCell align="center">Discount</TableCell>
                <TableCell align="center" className="no-printme">
                  Action
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {this.state.products.map((row) => (
                <TableRow key={row._id}>
                  <TableCell align="center">{row.name}</TableCell>
                  <TableCell align="center">
                    <img src={`http://localhost:2000/${row.image}`} width="70" height="70" />
                  </TableCell>
                  <TableCell align="center">{row.desc}</TableCell>
                  <TableCell align="center">{row.price}</TableCell>
                  <TableCell align="center">{row.discount}</TableCell>

                  <TableCell align="center" className="no-printme">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => this.handleProductEditOpen(row)}
                    >
                      Edit
                    </Button>

                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => this.deleteProduct(row._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <br />

          <Pagination
            className="no-printme"
            count={this.state.pages}
            page={this.state.page}
            onChange={this.pageChange}
            color="primary"
          />
        </TableContainer>
      </div>
    );
  }
}

export default withRouter(Dashboard);
