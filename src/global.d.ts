import {
  Request as NodeFetchRequest,
  Response as NodeFetchResponse,
  RequestInit as NodeFetchRequestInit,
} from 'node-fetch';

declare global {
  export type Request = NodeFetchRequest;
  export type Response = NodeFetchResponse;
  export type RequestInit = NodeFetchRequestInit;
}
