import * as lark from "@larksuiteoapi/allcore";

interface FolderMeta {
  id: string;
  name: string;
  token: string;
  parentId: string;
  createUid: string;
  editUid: string;
  ownUid: string;
}

interface FolderChildren {
  parentToken: string;
  children: {
    [key: string]: {
      token: string;
      name: string;
      type: string; // TODO: enum
    };
  }
}

interface DocMeta {
  create_date: string;
  create_time: number;
  creator: string;
  create_user_name: string;
  delete_flag: 0 | 1 | 2; // TODO: enum
  edit_time: number;
  edit_user_name: string;
  is_external: boolean;
  is_pinned: boolean;
  is_stared: boolean;
  obj_type: 'doc'; // TODO: enum
  owner: string;
  owner_user_name: string;
  server_time: number;
  tenant_id: string;
  title: string;
  type: 2; // TODO: enum
  url: string;
}

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
    const req = lark.api.newRequest(
      "/drive/explorer/v2/folder/:folderToken/meta",
      "GET",
      lark.api.AccessTokenType.Tenant,
      null
    );
    req.setPathParams({ folderToken });
    return req;
  }

  getFolderChildrenRequest(folderToken: string) {
    const req = lark.api.newRequest(
      "/drive/explorer/v2/folder/:folderToken/children",
      "GET",
      lark.api.AccessTokenType.Tenant,
      null
    );
    req.setPathParams({ folderToken });
    return req;
  }

  getDocMetaRequest(docToken: string) {
    const req = lark.api.newRequest(
      "/doc/v2/meta/:docToken",
      "GET",
      lark.api.AccessTokenType.Tenant,
      null
    );
    req.setPathParams({ docToken });
    return req;
  }

  getDocContentRequest(docToken: string) {
    const req = lark.api.newRequest(
      "/doc/v2/:docToken/content",
      "GET",
      lark.api.AccessTokenType.Tenant,
      null
    );
    req.setPathParams({ docToken });
    return req;
  }

  getDocRawContentRequest(docToken: string) {
    const req = lark.api.newRequest(
      "/doc/v2/:docToken/raw_content",
      "GET",
      lark.api.AccessTokenType.Tenant,
      null
    );
    req.setPathParams({ docToken });
    return req;
  }

  async getFolderMeta(folderToken: string): Promise<FolderMeta> {
    const response = await lark.api.sendRequest(
      this.appConfig,
      this.getFolderMetaRequest(folderToken)
    );
    return response.data;
  }

  async getFolderChildren(folderToken: string): Promise<FolderChildren> {
    const response = await lark.api.sendRequest(
      this.appConfig,
      this.getFolderChildrenRequest(folderToken)
    );
    return response.data;
  }

  async getDocMeta(docToken: string): Promise<DocMeta> {
    const response = await lark.api.sendRequest(
      this.appConfig,
      this.getDocMetaRequest(docToken)
    );
    return response.data;
  }

  async getDocContent(docToken: string) {
    const response = await lark.api.sendRequest(
      this.appConfig,
      this.getDocContentRequest(docToken)
    );
    return response.data;
  }

  async getDocRawContent(docToken: string) {
    const response = await lark.api.sendRequest(
      this.appConfig,
      this.getDocRawContentRequest(docToken)
    );
    return response.data;
  }
}

export const feishuDocumentFetcher = new FeishuDocumentFetcher();
