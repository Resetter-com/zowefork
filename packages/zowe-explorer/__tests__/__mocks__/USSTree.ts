/**
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright Contributors to the Zowe Project.
 *
 */

import * as vscode from "vscode";
import { IZoweUSSTreeNode, IZoweDatasetTreeNode, IZoweTreeNode, Validation } from "@zowe/zowe-explorer-api";
import { ZoweUSSNode } from "../../src/trees/uss/ZoweUSSNode";
import { MockMethod } from "../__decorators__/MockMethod";
import { createTreeView } from "./mockCreators/shared";
import { ZoweTreeProvider } from "../../src/trees/ZoweTreeProvider";

/**
 * A tree that contains nodes of files and folders
 *
 * @export
 * @class USSTree
 * @implements {vscode.TreeDataProvider}
 */
export class USSTree implements vscode.TreeDataProvider<ZoweUSSNode> {
    public mSessionNodes: ZoweUSSNode[] = [];

    // Event Emitters used to notify subscribers that the refresh event has fired
    public mOnDidChangeTreeData: vscode.EventEmitter<ZoweUSSNode | undefined> = new vscode.EventEmitter<ZoweUSSNode | undefined>();
    public readonly onDidChangeTreeData: vscode.Event<ZoweUSSNode | undefined> = this.mOnDidChangeTreeData.event;
    public mFavorites: ZoweUSSNode[];

    /**
     * @param {IZoweUSSTreeNode} node
     * @memberof USSTree
     */
    @MockMethod()
    public addFavorite(_node: IZoweUSSTreeNode): void | Promise<void> {}

    /**
     * @param {string} itemPath
     * @param {IZoweUSSTreeNode} sessionNode
     * @memberof USSTree
     */
    @MockMethod()
    public openItemFromPath(_itemPath: string, _sessionNode: IZoweUSSTreeNode): void | Promise<void> {}

    /**
     * @param {IZoweUSSTreeNode} node
     * @memberof USSTree
     */
    @MockMethod()
    public removeFavorite(_node: IZoweUSSTreeNode): void | Promise<void> {}

    /**
     * @returns {IZoweUSSTreeNode[]}
     * @memberof USSTree
     */
    @MockMethod()
    public getAllLoadedItems(): IZoweUSSTreeNode[] {
        return [];
    }

    /**
     * @returns {vscode.TreeView<ZoweTreeProvider>}
     * @memberof USSTree
     */
    @MockMethod()
    public getTreeView(): vscode.TreeView<ZoweTreeProvider<IZoweUSSTreeNode>> {
        return createTreeView();
    }

    /**
     * @param {vscode.TreeView<IZoweTreeNode>} treeView
     * @param {IZoweTreeNode} item
     * @memberof USSTree
     */
    @MockMethod()
    public setItem(_treeView: vscode.TreeView<IZoweTreeNode>, _item: IZoweTreeNode): void {}

    /**
     * @param {string} criteria
     * @memberof USSTree
     */
    @MockMethod()
    public addSearchHistory(_criteria: string): void {}

    /**
     * @param {IZoweDatasetTreeNode} element
     * @memberof USSTree
     */
    @MockMethod()
    public refreshElement(_element: IZoweDatasetTreeNode): void {}

    /**
     * @param {IZoweUSSTreeNode} node
     * @memberof USSTree
     */
    @MockMethod()
    public checkCurrentProfile(_node: IZoweUSSTreeNode): Validation.IValidationProfile | Promise<Validation.IValidationProfile> {
        return { status: "unverified", name: "mock" };
    }

    /**
     * @param {string} name - The name to remove from the file history array
     * @memberof USSTree
     */
    @MockMethod()
    public removeFileHistory(_name: string): void {}

    /**
     * @param {string} criteria - The name to add to the file history array
     * @memberof USSTree
     */
    @MockMethod()
    public addFileHistory(_criteria: string): void {}

    /**
     * @returns {string[]}
     * @memberof USSTree
     */
    @MockMethod()
    public getFileHistory(): string[] {
        return [];
    }

    /**
     * Takes argument of type ZoweUSSNode and returns it converted to a general [TreeItem]
     *
     * @param {ZoweUSSNode} element - The ZoweUSSNode that is to be converted
     * @returns {vscode.TreeItem}
     * @memberof USSTree
     */
    @MockMethod()
    public getTreeItem(_element: ZoweUSSNode): vscode.TreeItem {
        return null as any;
    }

    /**
     * Takes argument of type ZoweUSSNode and retrieves all of the first level children
     *
     * @param {ZoweUSSNode} [element] - The ZoweUSSNode that is to be converted
     * @returns {Thenable<ZoweUSSNode[]>}
     * @memberof USSTree
     */
    @MockMethod()
    public getChildren(_element?: ZoweUSSNode): Promise<ZoweUSSNode[]> {
        return Promise.resolve([]);
    }

    /**
     * Called whenever the tree needs to be refreshed, and fires the data change event
     *
     * @memberof USSTree
     */
    @MockMethod()
    public refresh(): void {
        return;
    }

    /**
     * Check if the parent exists, and return null if it has no parent
     *
     * @param {ZoweUSSNode} element - The ZoweUSSNode of which to retrieve the parent
     * @returns {vscode.ProviderResult<ZoweUSSNode>}
     * @memberof USSTree
     */
    @MockMethod()
    public getParent(_element: ZoweUSSNode): vscode.ProviderResult<ZoweUSSNode> {
        return null;
    }

    @MockMethod()
    public addSession(_sessionName?: string): void | Promise<void> {
        return Promise.resolve();
    }

    @MockMethod()
    public deleteSession(_node?: ZoweUSSNode): void {}
}
