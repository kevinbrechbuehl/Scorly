export class ClientBase {
  public getBaseUrl(baseUrl: string) {
    return baseUrl ? baseUrl : (process.env.REACT_APP_API_URL as string);
  }
}
