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
import { Constants } from "../../../src/configuration/Constants";
import { Workspace } from "../../../src/configuration/Workspace";

function createGlobalMocks(): { [key: string]: jest.Mock } {
    const activeTextEditor = jest.fn();
    const executeCommand = jest.fn();

    Object.defineProperty(vscode.window, "activeTextEditor", { get: activeTextEditor, configurable: true });
    Object.defineProperty(vscode.commands, "executeCommand", { value: executeCommand, configurable: true });

    return {
        activeTextEditor,
        executeCommand,
    };
}

/**
 * Function which imitates looping through an array
 */
const generateCycledMock = (mock: any[]): (() => number) => {
    let currentIndex = 0;

    return () => {
        if (currentIndex === mock.length) {
            currentIndex = 0;
        }

        const entry = mock[currentIndex];
        currentIndex++;

        return entry;
    };
};

describe("Workspace Utils Unit Test - Function checkTextFileIsOpened", () => {
    it("Checking logic when no tabs available", async () => {
        const globalMocks = createGlobalMocks();
        const targetTextFile = "/doc";
        globalMocks.activeTextEditor.mockReturnValue(null);

        const result = await Workspace.checkTextFileIsOpened(targetTextFile);
        expect(result).toBe(false);
        expect(globalMocks.executeCommand.mock.calls.map((call) => call[0])).toEqual(
            Array(Constants.WORKSPACE_UTIL_MAX_EMPTY_WINDOWS_IN_THE_ROW).fill("workbench.action.nextEditor")
        );
    });
    it("Checking logic when target tab is available", async () => {
        const globalMocks = createGlobalMocks();
        const targetTextFile = "/doc3";
        const mockDocuments = [
            {
                id: 1,
                document: {
                    fileName: "/doc1",
                },
            },
            {
                id: 2,
                document: {
                    fileName: "/doc2",
                },
            },
            {
                id: 3,
                document: {
                    fileName: "/doc3",
                },
            },
        ];
        globalMocks.activeTextEditor.mockImplementation(generateCycledMock(mockDocuments));

        const result = await Workspace.checkTextFileIsOpened(targetTextFile);
        expect(result).toBe(true);
        expect(globalMocks.executeCommand.mock.calls.map((call) => call[0])).toEqual([
            "workbench.action.nextEditor",
            "workbench.action.nextEditor",
            "workbench.action.nextEditor",
        ]);
    });
    it("Checking logic when target tab is not available", async () => {
        const globalMocks = createGlobalMocks();
        const targetTextFile = "/doc";
        const mockDocuments = [
            {
                id: 1,
                document: {
                    fileName: "/doc1",
                },
            },
            {
                id: 2,
                document: {
                    fileName: "/doc2",
                },
            },
            {
                id: 3,
                document: {
                    fileName: "/doc3",
                },
            },
        ];
        globalMocks.activeTextEditor.mockImplementation(generateCycledMock(mockDocuments));

        const result = await Workspace.checkTextFileIsOpened(targetTextFile);
        expect(result).toBe(false);
        expect(globalMocks.executeCommand.mock.calls.map((call) => call[0])).toEqual([
            "workbench.action.nextEditor",
            "workbench.action.nextEditor",
            "workbench.action.nextEditor",
        ]);
    });
});
describe("Workspace Utils Unit Test - Function closeOpenedTextFile", () => {
    it("Checking logic when no tabs available", async () => {
        const globalMocks = createGlobalMocks();
        const targetTextFile = "/doc";
        globalMocks.activeTextEditor.mockReturnValueOnce(null);

        const result = await Workspace.closeOpenedTextFile(targetTextFile);
        expect(result).toBe(false);
        expect(globalMocks.executeCommand.mock.calls.map((call) => call[0])).toEqual(
            Array(Constants.WORKSPACE_UTIL_MAX_EMPTY_WINDOWS_IN_THE_ROW).fill("workbench.action.nextEditor")
        );
    });
    it("Checking logic when target tab is available", async () => {
        const globalMocks = createGlobalMocks();
        const targetTextFile = "/doc3";
        const mockDocuments = [
            {
                id: 1,
                document: {
                    fileName: "/doc1",
                },
            },
            {
                id: 2,
                document: {
                    fileName: "/doc2",
                },
            },
            {
                id: 3,
                document: {
                    fileName: "/doc3",
                },
            },
        ];
        globalMocks.activeTextEditor.mockImplementation(generateCycledMock(mockDocuments));

        const result = await Workspace.closeOpenedTextFile(targetTextFile);
        expect(result).toBe(true);
        expect(globalMocks.executeCommand.mock.calls.map((call) => call[0])).toEqual([
            "workbench.action.nextEditor",
            "workbench.action.nextEditor",
            "workbench.action.closeActiveEditor",
        ]);
    });
    it("Checking logic when target tab is not available", async () => {
        const globalMocks = createGlobalMocks();
        const targetTextFile = "/doc";
        const mockDocuments = [
            {
                id: 1,
                document: {
                    fileName: "/doc1",
                },
            },
            {
                id: 2,
                document: {
                    fileName: "/doc2",
                },
            },
            {
                id: 3,
                document: {
                    fileName: "/doc3",
                },
            },
        ];
        globalMocks.activeTextEditor.mockImplementation(generateCycledMock(mockDocuments));

        const result = await Workspace.closeOpenedTextFile(targetTextFile);
        expect(result).toBe(false);
        expect(globalMocks.executeCommand.mock.calls.map((call) => call[0])).toEqual([
            "workbench.action.nextEditor",
            "workbench.action.nextEditor",
            "workbench.action.nextEditor",
        ]);
    });
});

describe("Workspace Utils Unit Tests - function awaitForDocumentBeingSaved", () => {
    it("should hold for a document to be saved", async () => {
        let testCount = 0;
        const testSaveTimer = setInterval(() => {
            if (testCount > 5) {
                Workspace.setFileSaved(true);
                clearInterval(testSaveTimer);
            }
            testCount++;
        });
        await expect(Workspace.awaitForDocumentBeingSaved()).resolves.not.toThrow();
    });
});
