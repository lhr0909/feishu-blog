import * as lark from '@larksuiteoapi/allcore';

class FeishuDocumentFetcher {
  private appSettings: lark.core.AppSettings;
  private appConfig: lark.core.Config;

  constructor() {
    this.appSettings = lark.getInternalAppSettingsByEnv();
    this.appConfig = lark.newConfig(lark.Domain.FeiShu, this.appSettings, {
      loggerLevel: lark.LoggerLevel.ERROR,
      logger: new lark.ConsoleLogger(),
      store: new lark.DefaultStore(),
    });
  }

  getFolderMetaRequest(folderToken: string) {
    const req = lark.api.newRequest('/drive/explorer/v2/folder/:folderToken/meta', 'GET', lark.api.AccessTokenType.Tenant, null);
    req.setPathParams({ folderToken });
    return req;
  }

  getFolderChildrenRequest(folderToken: string) {
    const req = lark.api.newRequest('/drive/explorer/v2/folder/:folderToken/children', 'GET', lark.api.AccessTokenType.Tenant, null);
    req.setPathParams({ folderToken });
    return req;
  }

  getDocContentRequest(docToken: string) {
    const req = lark.api.newRequest('/doc/v2/:docToken/content', 'GET', lark.api.AccessTokenType.Tenant, null);
    req.setPathParams({ docToken });
    return req;
  }

  getDocRawContentRequest(docToken: string) {
    const req = lark.api.newRequest('/doc/v2/:docToken/raw_content', 'GET', lark.api.AccessTokenType.Tenant, null);
    req.setPathParams({ docToken });
    return req;
  }

  async getFolderMeta(folderToken: string) {
    const response = await lark.api.sendRequest(this.appConfig, this.getFolderMetaRequest(folderToken));
    return response.data;
  }

  async getFolderChildren(folderToken: string) {
    const response = await lark.api.sendRequest(this.appConfig, this.getFolderChildrenRequest(folderToken));
    return response.data;
  }

  async getDocContent(docToken: string) {
    const response = await lark.api.sendRequest(this.appConfig, this.getDocContentRequest(docToken));
    return response.data;
  }

  async getDocRawContent(docToken: string) {
    const response = await lark.api.sendRequest(this.appConfig, this.getDocRawContentRequest(docToken));
    return response.data;
  }
}

export const feishuDocumentFetcher = new FeishuDocumentFetcher();
