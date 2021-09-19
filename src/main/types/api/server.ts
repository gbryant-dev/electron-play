interface Server {
  Name: string;
  Host: string;
  IPAddress: string;
  UsingSSL: boolean;
  HTTPPortNumber: number;
  AcceptingClients: boolean;

}

export default Server;