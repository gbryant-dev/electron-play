import axios from 'axios';
import { Agent } from 'https';

const HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Accept': 'application/json; odata.metadata=none, text/plain',
}

// Enforce NodeJS adapter
axios.defaults.adapter = require('axios/lib/adapters/http');

const client = axios.create({
  headers: HEADERS,
  withCredentials: true,
  httpsAgent: new Agent({ rejectUnauthorized: false })
})

export default client;