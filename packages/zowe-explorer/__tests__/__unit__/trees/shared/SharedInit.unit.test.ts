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
import * as core from "@zowe/core-for-zowe-sdk";
import * as profUtils from "../../../../src/utils/ProfilesUtils";
import * as SharedHistoryView from "../../../../src/trees/shared/SharedHistoryView";
import { FileManagement } from "@zowe/zowe-explorer-api";
import { IJestIt, ITestContext, processSubscriptions } from "../../../__common__/testUtils";
import { Constants } from "../../../../src/configuration/Constants";
import { Profiles } from "../../../../src/configuration/Profiles";
import { SharedActions } from "../../../../src/trees/shared/SharedActions";
import { TempFolder } from "../../../../src/configuration/TempFolder";
import { TsoCommandHandler } from "../../../../src/command/TsoCommandHandler";
import { MvsCommandHandler } from "../../../../src/command/MvsCommandHandler";
import { LocalFileManagement } from "../../../../src/management/LocalFileManagement";
import { UnixCommandHandler } from "../../../../src/command/UnixCommandHandler";
import { ZoweLogger } from "../../../../src/tools/ZoweLogger";
import { ZoweExplorerApiRegister } from "../../../../src/extending/ZoweExplorerApiRegister";
import { SharedInit } from "../../../../src/trees/shared/SharedInit";

jest.mock("../../../../src/utils/LoggerUtils");
jest.mock("../../../../src/tools/ZoweLogger");

describe("Test src/shared/extension", () => {
    describe("registerCommonCommands", () => {
        const executeCommand = { fun: jest.fn() };
        const testConstants = {
            LOG: { debug: jest.fn(), error: jest.fn() },
            DS_DIR: "DS_DIR",
            USS_DIR: "USS_DIR",
        };
        const test: ITestContext = {
            context: { subscriptions: [] },
            value: {
                test: "shared",
                providers: { ds: "ds", uss: "uss", job: "job" },
                affectsConfiguration: jest.fn(),
                document: jest.fn(),
                text: "\n",
            },
            _: { _: "_" },
        };
        const profileMocks = { deleteProfile: jest.fn(), refresh: jest.fn() };
        const commands: IJestIt[] = [
            {
                name: "zowe.updateSecureCredentials",
                parm: ["@zowe/cli"],
                mock: [
                    { spy: jest.spyOn(profUtils.ProfilesUtils, "updateCredentialManagerSetting"), arg: ["@zowe/cli"] },
                    { spy: jest.spyOn(profUtils.ProfilesUtils, "writeOverridesFile"), arg: [] },
                ],
            },
            {
                name: "zowe.manualPoll",
                mock: [],
            },
            {
                name: "zowe.editHistory",
                mock: [{ spy: jest.spyOn(SharedHistoryView, "SharedHistoryView"), arg: [test.context, test.value.providers] }],
            },
            {
                name: "zowe.promptCredentials",
                mock: [{ spy: jest.spyOn(profUtils.ProfilesUtils, "promptCredentials"), arg: [test.value] }],
            },
            {
                name: "onDidChangeConfiguration:1",
                mock: [
                    { spy: jest.spyOn(test.value, "affectsConfiguration"), arg: [Constants.SETTINGS_LOGS_FOLDER_PATH], ret: true },
                    { spy: jest.spyOn(test.value, "affectsConfiguration"), arg: [Constants.SETTINGS_TEMP_FOLDER_PATH], ret: false },
                    { spy: jest.spyOn(test.value, "affectsConfiguration"), arg: [Constants.SETTINGS_AUTOMATIC_PROFILE_VALIDATION], ret: false },
                    { spy: jest.spyOn(test.value, "affectsConfiguration"), arg: [Constants.SETTINGS_TEMP_FOLDER_HIDE], ret: false },
                    { spy: jest.spyOn(test.value, "affectsConfiguration"), arg: [Constants.SETTINGS_SECURE_CREDENTIALS_ENABLED], ret: false },
                ],
            },
            {
                name: "onDidChangeConfiguration:2",
                mock: [
                    { spy: jest.spyOn(test.value, "affectsConfiguration"), arg: [Constants.SETTINGS_LOGS_FOLDER_PATH], ret: false },
                    { spy: jest.spyOn(test.value, "affectsConfiguration"), arg: [Constants.SETTINGS_TEMP_FOLDER_PATH], ret: true },
                    { spy: jest.spyOn(TempFolder, "moveTempFolder"), arg: ["/some/old/temp/location", undefined] },
                    { spy: jest.spyOn(test.value, "affectsConfiguration"), arg: [Constants.SETTINGS_AUTOMATIC_PROFILE_VALIDATION], ret: false },
                    { spy: jest.spyOn(test.value, "affectsConfiguration"), arg: [Constants.SETTINGS_TEMP_FOLDER_HIDE], ret: false },
                    { spy: jest.spyOn(test.value, "affectsConfiguration"), arg: [Constants.SETTINGS_SECURE_CREDENTIALS_ENABLED], ret: false },
                ],
            },
            {
                name: "onDidChangeConfiguration:3",
                mock: [
                    { spy: jest.spyOn(test.value, "affectsConfiguration"), arg: [Constants.SETTINGS_LOGS_FOLDER_PATH], ret: false },
                    { spy: jest.spyOn(test.value, "affectsConfiguration"), arg: [Constants.SETTINGS_TEMP_FOLDER_PATH], ret: false },
                    { spy: jest.spyOn(test.value, "affectsConfiguration"), arg: [Constants.SETTINGS_AUTOMATIC_PROFILE_VALIDATION], ret: true },
                    { spy: jest.spyOn(Profiles, "getInstance"), arg: [], ret: profileMocks },
                    { spy: jest.spyOn(SharedActions, "refreshAll"), arg: ["ds"] },
                    { spy: jest.spyOn(SharedActions, "refreshAll"), arg: ["uss"] },
                    { spy: jest.spyOn(SharedActions, "refreshAll"), arg: ["job"] },
                    { spy: jest.spyOn(test.value, "affectsConfiguration"), arg: [Constants.SETTINGS_TEMP_FOLDER_HIDE], ret: false },
                    { spy: jest.spyOn(test.value, "affectsConfiguration"), arg: [Constants.SETTINGS_SECURE_CREDENTIALS_ENABLED], ret: false },
                ],
            },
            {
                name: "onDidChangeConfiguration:4",
                mock: [
                    { spy: jest.spyOn(test.value, "affectsConfiguration"), arg: [Constants.SETTINGS_LOGS_FOLDER_PATH], ret: false },
                    { spy: jest.spyOn(test.value, "affectsConfiguration"), arg: [Constants.SETTINGS_TEMP_FOLDER_PATH], ret: false },
                    { spy: jest.spyOn(test.value, "affectsConfiguration"), arg: [Constants.SETTINGS_AUTOMATIC_PROFILE_VALIDATION], ret: false },
                    { spy: jest.spyOn(test.value, "affectsConfiguration"), arg: [Constants.SETTINGS_TEMP_FOLDER_HIDE], ret: true },
                    { spy: jest.spyOn(FileManagement, "getZoweDir"), arg: [], ret: test.value },
                    { spy: jest.spyOn(TempFolder, "hideTempFolder"), arg: [test.value] },
                    { spy: jest.spyOn(test.value, "affectsConfiguration"), arg: [Constants.SETTINGS_SECURE_CREDENTIALS_ENABLED], ret: false },
                ],
            },
            {
                name: "onDidChangeConfiguration:5",
                mock: [
                    { spy: jest.spyOn(test.value, "affectsConfiguration"), arg: [Constants.SETTINGS_LOGS_FOLDER_PATH], ret: false },
                    { spy: jest.spyOn(test.value, "affectsConfiguration"), arg: [Constants.SETTINGS_TEMP_FOLDER_PATH], ret: false },
                    { spy: jest.spyOn(test.value, "affectsConfiguration"), arg: [Constants.SETTINGS_AUTOMATIC_PROFILE_VALIDATION], ret: false },
                    { spy: jest.spyOn(test.value, "affectsConfiguration"), arg: [Constants.SETTINGS_TEMP_FOLDER_HIDE], ret: false },
                    { spy: jest.spyOn(test.value, "affectsConfiguration"), arg: [Constants.SETTINGS_SECURE_CREDENTIALS_ENABLED], ret: true },
                    { spy: jest.spyOn(executeCommand, "fun"), arg: ["zowe.updateSecureCredentials"] },
                ],
            },
            {
                name: "zowe.openRecentMember",
                mock: [{ spy: jest.spyOn(SharedActions, "openRecentMemberPrompt"), arg: ["ds", "uss"] }],
            },
            {
                name: "zowe.searchInAllLoadedItems",
                mock: [{ spy: jest.spyOn(SharedActions, "searchInAllLoadedItems"), arg: ["ds", "uss"] }],
            },
            {
                name: "onDidSaveTextDocument:1",
                parm: [{ isDirty: false, fileName: "_", uri: vscode.Uri.parse("") }],
                mock: [],
            },
            {
                name: "onDidSaveTextDocument:2",
                parm: [{ isDirty: true, fileName: "NOT_DATASET" }],
                mock: [],
            },
            {
                name: "zowe.ds.deleteProfile",
                mock: [{ spy: jest.spyOn(Profiles, "getInstance"), arg: [], ret: profileMocks }],
            },
            {
                name: "zowe.cmd.deleteProfile",
                mock: [{ spy: jest.spyOn(Profiles, "getInstance"), arg: [], ret: profileMocks }],
            },
            {
                name: "zowe.uss.deleteProfile",
                mock: [{ spy: jest.spyOn(Profiles, "getInstance"), arg: [], ret: profileMocks }],
            },
            {
                name: "zowe.jobs.deleteProfile",
                mock: [{ spy: jest.spyOn(Profiles, "getInstance"), arg: [], ret: profileMocks }],
            },
            {
                name: "zowe.issueTsoCmd:1",
                mock: [{ spy: jest.spyOn(TsoCommandHandler, "getInstance"), arg: [], ret: { issueTsoCommand: jest.fn() } }],
            },
            {
                name: "zowe.issueTsoCmd:2",
                parm: [],
                mock: [{ spy: jest.spyOn(TsoCommandHandler, "getInstance"), arg: [], ret: { issueTsoCommand: jest.fn() } }],
            },
            {
                name: "zowe.issueMvsCmd:1",
                mock: [{ spy: jest.spyOn(MvsCommandHandler, "getInstance"), arg: [], ret: { issueMvsCommand: jest.fn() } }],
            },
            {
                name: "zowe.issueMvsCmd:2",
                parm: [],
                mock: [{ spy: jest.spyOn(MvsCommandHandler, "getInstance"), arg: [], ret: { issueMvsCommand: jest.fn() } }],
            },
            {
                name: "zowe.selectForCompare",
                mock: [{ spy: jest.spyOn(LocalFileManagement, "selectFileForCompare"), arg: [test.value] }],
            },
            {
                name: "zowe.compareWithSelected",
                mock: [{ spy: jest.spyOn(LocalFileManagement, "compareChosenFileContent"), arg: [test.value] }],
            },
            {
                name: "zowe.compareWithSelectedReadOnly",
                mock: [{ spy: jest.spyOn(LocalFileManagement, "compareChosenFileContent"), arg: [test.value, true] }],
            },
            {
                name: "zowe.compareFileStarted",
                mock: [],
            },
            {
                name: "zowe.issueUnixCmd:1",
                mock: [{ spy: jest.spyOn(UnixCommandHandler, "getInstance"), arg: [], ret: { issueUnixCommand: jest.fn() } }],
            },
            {
                name: "zowe.issueUnixCmd:2",
                parm: [],
                mock: [{ spy: jest.spyOn(UnixCommandHandler, "getInstance"), arg: [], ret: { issueUnixCommand: jest.fn() } }],
            },
        ];

        beforeAll(() => {
            const registerCommand = (cmd: string, fun: () => void) => {
                return { [cmd]: fun };
            };
            const onDidChangeConfiguration = (fun: () => void) => {
                return { onDidChangeConfiguration: fun };
            };
            const onDidSaveTextDocument = (fun: () => void) => {
                return { onDidSaveTextDocument: fun };
            };
            Object.defineProperty(vscode.commands, "registerCommand", { value: registerCommand });
            Object.defineProperty(vscode.workspace, "onDidChangeConfiguration", { value: onDidChangeConfiguration });
            Object.defineProperty(core, "getZoweDir", { value: () => test.value });
            Object.defineProperty(vscode.commands, "executeCommand", { value: executeCommand.fun });
            Object.defineProperty(Constants, "DS_DIR", { value: testConstants.DS_DIR });
            Object.defineProperty(Constants, "USS_DIR", { value: testConstants.USS_DIR });
            Object.defineProperty(Constants, "SETTINGS_TEMP_FOLDER_LOCATION", { value: "/some/old/temp/location" });
            Object.defineProperty(vscode.workspace, "onDidSaveTextDocument", { value: onDidSaveTextDocument });
            SharedInit.registerCommonCommands(test.context, test.value.providers);
        });
        afterAll(() => {
            jest.restoreAllMocks();
        });

        processSubscriptions(commands, test);
    });
    describe("registerRefreshCommand", () => {
        const context: any = { subscriptions: [] };
        const activate = jest.fn();
        const deactivate = jest.fn();
        const dispose = jest.fn();
        let extRefreshCallback;
        const spyExecuteCommand = jest.fn();

        beforeAll(() => {
            Object.defineProperty(vscode.commands, "registerCommand", {
                value: (_: string, fun: () => void) => {
                    extRefreshCallback = fun;
                    return { dispose };
                },
            });
            Object.defineProperty(vscode.commands, "executeCommand", { value: spyExecuteCommand });
            SharedInit.registerRefreshCommand(context, activate, deactivate);
        });

        beforeEach(() => {
            jest.clearAllMocks();
        });

        afterAll(() => {
            jest.restoreAllMocks();
        });

        it("Test assuming we are unable to dispose of the subscription", async () => {
            const testError = new Error("test");
            dispose.mockRejectedValue(testError);
            await extRefreshCallback();
            expect(spyExecuteCommand).not.toHaveBeenCalled();
            expect(deactivate).toHaveBeenCalled();
            expect(ZoweLogger.error).toHaveBeenCalledWith(testError);
            expect(dispose).toHaveBeenCalled();
            expect(activate).toHaveBeenCalled();
        });
    });

    describe("watchConfigProfile", () => {
        let context: any;
        const spyReadFile = jest.fn().mockReturnValue("test");
        const spyExecuteCommand = jest.fn();
        const watcher: any = {
            onDidCreate: jest.fn().mockImplementation((fun) => fun()),
            onDidDelete: jest.fn().mockImplementation((fun) => fun()),
            onDidChange: jest.fn().mockImplementation((fun) => fun("uri")),
        };
        beforeEach(() => {
            context = { subscriptions: [] };
            jest.clearAllMocks();
            Object.defineProperty(vscode.workspace, "createFileSystemWatcher", { value: () => watcher, configurable: true });
            Object.defineProperty(vscode.workspace, "workspaceFolders", { value: [{ uri: { fsPath: "fsPath" } }], configurable: true });
            Object.defineProperty(vscode.commands, "executeCommand", { value: spyExecuteCommand, configurable: true });
            Object.defineProperty(vscode.workspace, "fs", { value: { readFile: spyReadFile }, configurable: true });
            Object.defineProperty(Constants, "SAVED_PROFILE_CONTENTS", { value: "test", configurable: true });
        });

        afterAll(() => {
            jest.restoreAllMocks();
        });

        it("should be able to trigger all listeners", async () => {
            const spyRefreshAll = jest.spyOn(SharedActions, "refreshAll").mockImplementation(jest.fn());
            jest.spyOn(ZoweExplorerApiRegister.getInstance().onProfilesUpdateEmitter, "fire").mockImplementation();
            await SharedInit.watchConfigProfile(context, { ds: "ds", uss: "uss", job: "job" } as any);
            expect(spyExecuteCommand).toHaveBeenCalledWith("zowe.extRefresh");
            expect(context.subscriptions).toContain(watcher);
            expect(spyReadFile).toHaveBeenCalledWith("uri");
            expect(spyRefreshAll).not.toHaveBeenCalled();

            spyReadFile.mockReturnValue("other");
            await SharedInit.watchConfigProfile(context, { ds: "ds", uss: "uss", job: "job" } as any);
            expect(spyRefreshAll).toHaveBeenCalled();
        });
    });

    describe("initSubscribers", () => {
        const spyCollapse = jest.fn().mockImplementation((fun) => fun({ element: "collapse" }));
        const spyExpand = jest.fn().mockImplementation((fun) => fun({ element: "expand" }));
        const spyFlipState = jest.fn();
        let context: any;
        const provider: any = { getTreeView: () => treeView, flipState: spyFlipState };
        const treeView = { onDidCollapseElement: spyCollapse, onDidExpandElement: spyExpand };

        beforeEach(() => {
            context = { subscriptions: [] };
            jest.clearAllMocks();
        });
        afterAll(() => {
            jest.restoreAllMocks();
        });

        it("should setup listeners", () => {
            SharedInit.initSubscribers(context, provider);
            expect(context.subscriptions).toContain(treeView);
            expect(spyCollapse).toHaveBeenCalled();
            expect(spyExpand).toHaveBeenCalled();
            expect(spyFlipState).toHaveBeenCalledWith("collapse", false);
            expect(spyFlipState).toHaveBeenCalledWith("expand", true);
        });
    });
});
